"use client";

import { Input } from "@/components/ui/input";
import { CornerDownRight, Shuffle } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import Image from "next/image";
import SkeletonCard from "@/components/SkeletonCard";
import { useEffect, useState } from "react";
import useFetch from "@/hooks/use-fetch";
import { getDetails } from "@/actions/dashboard";
import {
  placeholders,
  useDynamicPlaceholder,
} from "@/hooks/useDynamicPlaceholder";
import Link from "next/link";

export default function Home() {
  const [userInput, setUserInput] = useState("");
  const [cardData, setCardData] = useState<any[]>([]);
  const [imageUrl, setImageUrl] = useState("");
  const placeholder = useDynamicPlaceholder(placeholders, 6000);

  const {
    loading: geminiLoading,
    data: geminiData,
    fn: geminiFn,
  } = useFetch(getDetails);

  const handleSubmit = async () => {
    if (!userInput.trim()) return;
    await geminiFn(userInput);
  };

  useEffect(() => {
    const fetchYoutubeAndImages = async () => {
      if(geminiData && geminiData.length > 0){
        const withYouTube = await Promise.all(
          geminiData.map(async (item: any) => {
            try{
              const response = await fetch(`api/youtube?query=${item.title}`);
              const data = await response.json();
              return {
                ...item, 
                youtube: data.videoUrl, 
                imageUrl: null, 
                imagePrompt: item.image_prompt
              }
            }catch(error){
              return {
                ...item,
                youtube: null, 
                imageUrl: null, 
                imagePrompt: item.image_prompt
              };
            }
          })
        ); 
        setCardData(withYouTube);

        withYouTube.forEach(async (card: any) => {
          console.log(card.imagePrompt);
          try{
            const response = await fetch('/api/image', {
              method: 'POST', 
              headers: {
                'Content-Type': 'application/json', 
              },
              body: JSON.stringify({prompt: card.imagePrompt})
            }); 

            if(!response.ok){
              throw new Error('Image generation failed');
            }

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            setCardData(prev => prev.map(prevCard => 
               prevCard.title === card.title ? {...prevCard, imageUrl: url} : prevCard
            )); 
          }catch(error){
            console.error("Failed to generate image", error);
          }
        })
      }
    };
    fetchYoutubeAndImages();
  }, [geminiData]);

  return (
    <div className="container max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex justify-center flex-col items-center gap-2 mt-5">
        <h1 className="text-7xl outfit-extrabold tracking-wide bg-gradient-to-br from-green-300 via-green-600 to-green-500 text-transparent bg-clip-text animate-gradient-bg max-md:text-5xl">
          Healthy F
          <img
            className="inline-block object-contain size-12 animate-bounce-slow max-md:size-16"
            src="https://i.postimg.cc/SsbJKSKr/pngtree-healthy-food-png-png-image-10154104.png"
            alt="Food Icon"
          />
          od
        </h1>
        <p className="text-md text-green-700 outfit-regular-italic">
          Discover the best healthy dishes curated for you
        </p>
      </div>

      {/* Search  */}
      <div className="mt-10 flex-col flex items-center ">
        <div className="relative w-[600px] max-md:w-[400px] ">
          <Input
            placeholder={placeholder}
            className="rounded-full bg-green-800/15 w-full caret-green-800 shadow-green-800/20 shadow-lg"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />
          <Shuffle
            size={26}
            className="text-green-700 absolute right-12 top-1/2 transform -translate-y-1/2 bg-green-100 rounded-full p-1 cursor-pointer"
          />
          <CornerDownRight
            size={26}
            className="text-green-700 absolute right-3 top-1/2 transform -translate-y-1/2 bg-green-100 rounded-full p-1 cursor-pointer"
            onClick={handleSubmit}
          />
        </div>
        <div className="flex justify-end mr-2 w-[600px] max-md:w-[400px]">
          <h3 className="text-green-600 outfit-regular text-xs mt-2">
            Powered by{" "}
            <img
              className="inline-block object-contain size-6"
              src="https://i.postimg.cc/v8zR1Bfd/Gemini-Icon-300x300-png.webp"
            />
          </h3>
        </div>
      </div>

      {/* Cards  */}
      <div className="grid grid-cols-2 my-10 place-items-center gap-8 max-lg:grid-cols-1 max-lg:px-5">
        {geminiLoading ? (
          <SkeletonCard />
        ) : (
          cardData?.map((card, index) => (
            <Card
              key={index}
              className="bg-green-100/30 shadow-lg rounded-t-xl"
            >
              <CardContent className="space-y-5">
                {
                  !card.imageUrl ? (
                    <div className="w-full h-80 bg-green-800/20 rounded-tr-lg rounded-tl-lg animate-pulse" />
                  ) : (
                    <img src={card.imageUrl} className="w-full h-80 rounded-tr-lg rounded-tl-lg" alt={card.title} />
                  )
                }

                <div className="flex justify-between flex-col w-full gap-2 px-3">
                  <h2 className="text-2xl text-green-700 outfit-bold">
                    {card.title}
                  </h2>
                  <h5 className="text-green-800 text-sm tracking-tight outfit-regular w-[100%]">
                    {card.description}
                  </h5>
                </div>
              </CardContent>
              <CardFooter className="justify-end items-center px-5 mb-3">
              {card.youtube && (
                <Link href={card.youtube} target="_blank" rel="noopener noreferrer">
                  <Image
                    src="https://www.freeiconspng.com/thumbs/youtube-logo-png/hd-youtube-logo-png-transparent-background-20.png"
                    alt="YouTube"
                    className="inline-block object-contain cursor-pointer"
                    width={30}
                    height={30}
                  />
                </Link>
              )}
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

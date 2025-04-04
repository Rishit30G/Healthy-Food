"use client";

import { Input } from "@/components/ui/input";
import { CornerDownRight, Shuffle, Soup } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
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
import LoadingBar from "react-top-loading-bar";

type cardType = {
  title: string;
  description: string;
  videoUrl: string;
  image_prompt: string;
  imageUrl: string | null;
  youtube: string | null;
};

export default function Home() {
  const [userInput, setUserInput] = useState("");
  const [progress, setProgress] = useState(0);
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [cardData, setCardData] = useState<cardType[]>([]);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState(false);
  const placeholder = useDynamicPlaceholder(placeholders, 6000);

  const {
    loading: geminiLoading,
    data: geminiData,
    fn: geminiFn,
    error: geminiError,
  } = useFetch(getDetails);

  const handleSubmit = async () => {
    if (!userInput.trim()) return;
    setHasSearched(true);
    setCardData([]);
    setProgress(progress + 20);
    await geminiFn(userInput);
  };

  const handleShuffleClick = () => {
    //set random placeholders array in the setUserInput
    setUserInput(placeholders[Math.floor(Math.random() * placeholders.length)]);
  };

  const fetchImage = async (prompt: string) => {
    try {
      const response = await fetch("/api/image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const contentType = response.headers.get("content-type");
      if (!contentType?.startsWith("image/")) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Invalid image response");
      }

      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error("Failed to generate image", error);
      return "/image.jpeg"; // Fallback image path
    }
  };

  useEffect(() => {
    const fetchYoutubeAndImages = async () => {
      if (!geminiData || geminiData.length === 0) return;
      setIsFetching(true);
      try {
        const withYouTube = await Promise.all(
          geminiData.map(async (item: cardType) => {
            try {
              const response = await fetch(
                `/api/youtube?query=${encodeURIComponent(item.title)}`
              );
              const data = await response.json();
              setProgress(progress + 20);
              return {
                ...item,
                youtube: data.videoUrl || null,
                imageUrl: null,
                imagePrompt: item.image_prompt,
              };
            } catch (error) {
              console.error("YouTube API fetch failed:", error);
              return {
                ...item,
                youtube: null,
                imageUrl: null,
                imagePrompt: item.image_prompt,
              };
            }
          })
        );

        setCardData(withYouTube);

        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        const batches: any[][] = [];
        let processedImages = 0;
        const totalImages = withYouTube.length;

        for (let i = 0; i < withYouTube.length; i += 2) {
          batches.push(withYouTube.slice(i, i + 2));
        }

        for (let i = 0; i < batches.length; i++) {
          const batch = batches[i];

          // Fetch images in parallel for each batch
          const imageResults = await Promise.all(
            batch.map(async (card) => {
              try {
                const imageUrl = await fetchImage(card.imagePrompt);
                return { title: card.title, imageUrl };
              } catch (error) {
                console.error("Image fetch failed:", error);
                return { title: card.title, imageUrl: null };
              } finally {
                processedImages++;
                setProgress(
                  (prev) => prev + (processedImages / totalImages) * 60
                );
              }
            })
          );

          // 🔹 Efficient state update using function form
          setCardData((prev) =>
            prev.map((prevCard) => {
              const foundImage = imageResults.find(
                (img) => img.title === prevCard.title
              );
              return foundImage
                ? { ...prevCard, imageUrl: foundImage.imageUrl }
                : prevCard;
            })
          );

          // 🔹 Avoid excessive delays unless necessary
          if (i < batches.length - 1) {
            await new Promise((resolve) => setTimeout(resolve, 60 * 1000));
          }
        }
      } catch (error) {
        console.error("Error in fetchYoutubeAndImages:", error);
      } finally {
        setIsFetching(false);
        setProgress(100);
      }
    };

    fetchYoutubeAndImages();
  }, [geminiData]);

  return (
    <div className="container max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex justify-center flex-col items-center gap-4 mt-12">
        <LoadingBar
          color={"#019a31"}
          progress={progress}
          onLoaderFinished={() => setProgress(0)}
          height={4}
          loaderSpeed={60000}
        />
        <h1 className="text-7xl outfit-extrabold tracking-wide bg-gradient-to-br from-green-300 via-green-600 to-green-500 text-transparent bg-clip-text animate-gradient-bg max-md:text-5xl">
          Healthy F
          <Image
            className="inline-block object-contain size-12 animate-bounce-slow max-md:size-8"
            width={100}
            height={100}
            src="https://i.postimg.cc/SsbJKSKr/pngtree-healthy-food-png-png-image-10154104.png"
            alt="Healthy Food"
            loading="eager"
            fetchPriority="high"
          />
          od
        </h1>
        <p className="text-md text-green-700 text-center outfit-regular-italic max-lg:text-sm">
          Discover the best healthy dishes curated for you
        </p>
      </div>

      {/* Search  */}
      <div className="mt-8 flex-col flex items-center ">
        <div className="relative w-[600px] max-md:w-[360px] ">
          <Input
            placeholder={placeholder}
            className="rounded-full bg-green-800/15 w-full caret-green-800 shadow-green-800/20 shadow-lg pr-20"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />
          <Shuffle
            size={26}
            className={`text-green-700 absolute right-12 top-1/2 transform -translate-y-1/2 bg-green-100 rounded-full p-1 cursor-pointer ${
              isFetching
                ? "cursor-not-allowed opacity-80 text-green-100/40"
                : "cursor-pointer"
            }`}
            onClick={!isFetching ? handleShuffleClick : undefined}
          />
          <CornerDownRight
            size={26}
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 rounded-full p-1 
              ${
                isFetching
                  ? "cursor-not-allowed opacity-80 bg-green-700/40"
                  : "bg-green-700 cursor-pointer"
              } text-green-100`}
            onClick={!isFetching ? handleSubmit : undefined}
            onKeyDown={(e) => {
              if (!isFetching && e.key === "Enter") {
                handleSubmit();
              }
            }}
          />
        </div>
        <div className="flex justify-end mr-2 w-[600px] max-md:w-[360px]">
          <h3 className="text-green-600 outfit-regular text-xs mt-2">
            Powered by{" "}
            <img
              className="inline-block object-contain w-5 h-5"
              src="https://i.postimg.cc/v8zR1Bfd/Gemini-Icon-300x300-png.webp"
              alt="Gemini"
              loading="eager"
            />
          </h3>
        </div>
      </div>

      {/* Cards  */}
      {!hasSearched && (
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="flex items-center justify-center flex-col">
            <Image
              src="/1.png"
              width={300}
              height={300}
              alt="Healthy Food"
              loading="eager"
              priority
              quality={100}
            />
            <div className="flex items-center justify-center gap-2 mt-5">
              <p className="text-green-700/70 text-center font-bold outfit-regular-italic">
                Discover some great
                <span>
                  {" "}
                  <Soup className="inline-block size-6 text-green-700/70 mb-1 mx-1" />
                </span>
                with us!
              </p>
            </div>
          </div>
        </div>
      )}

      {geminiError && (
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="flex items-center justify-center flex-col gap-10">
            <h3 className="text-green-700 text-left text-xl outfit-regular">
              Something went wrong <br /> Please cook with us later! 🙏{" "}
            </h3>
            <Image
              src="/2.gif"
              width={200}
              height={200}
              alt="Error"
              className="rounded-xl shadow-xl"
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 my-10 place-items-center gap-8 max-sm:grid-cols-1 max-lg:px-5">
        {geminiLoading && !geminiError ? (
          <SkeletonCard />
        ) : (
          cardData?.map((card, index) => (
            <Card
              key={index}
              className="bg-green-100/30 shadow-lg rounded-t-xl min-h-[550px] max-lg:min-h-fit"
            >
              <CardContent className="space-y-5">
                {!card.imageUrl ? (
                  <div className="w-full h-[23rem] bg-green-800/20 rounded-tr-lg rounded-tl-lg animate-pulse" />
                ) : (
                  <img
                    src={card.imageUrl}
                    className="w-full h-full rounded-tr-lg rounded-tl-lg"
                    alt={card.title}
                  />
                )}

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
                  <Link
                    href={card.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
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

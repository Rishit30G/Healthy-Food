"use client";

import { Input } from "@/components/ui/input";
import { CornerDownRight, Shuffle, Youtube } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Image from "next/image";
import SkeletonCard from "@/components/SkeletonCard";
import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";



const placeholders = [
  "I purchased spinach today, what can I make out of it ?",
  "What's a good recipe for a healthy breakfast ?",
  "How can I make a healthy smoothie ?",
  "What are some healthy snacks I can make ?",
  "Any healthy recipes with broccoli?"
]; 
const useDynamicPlaceholder = (placeholders: string[], interval: number) => {
  const [placeholder, setPlaceholder] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const speed = 30; // Typing speed per character

  useEffect(() => {
    let charIndex = 0;
    let typingInterval: NodeJS.Timeout;

    const typeText = () => {
      if (charIndex <= placeholders[currentIndex].length) {
        setPlaceholder(placeholders[currentIndex].slice(0, charIndex));
        charIndex++;
      } else {
        clearInterval(typingInterval);
        setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % placeholders.length);
        }, interval - placeholders[currentIndex].length * speed); // Adjust delay before switching
      }
    };

    typingInterval = setInterval(typeText, speed);

    return () => clearInterval(typingInterval);
  }, [currentIndex, interval, placeholders]);

  return placeholder;
};

export default function Home() {

  const [searchQuery, setSearchQuery] = useState("How can I make Vegetable Stir-fry");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchYouTubeVideo = async() => {
      if(!searchQuery) return;
      try{
        const response = await fetch(`api/youtube?query=${searchQuery}`);
        const data = await response.json(); 
        if(data.videoUrl){
          console.log(data.videoUrl);
        }
      }catch(error){
        console.error("Failed to fetch video", error);
      }
    };
    fetchYouTubeVideo();
  }, [searchQuery]);


  const placeholder = useDynamicPlaceholder(placeholders, 6000);

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
        <p className="text-md text-green-700 outfit-regular-italic">Discover the best healthy dishes curated for you</p> 
      </div>

      {/* Search  */}
      <div className="mt-10 flex-col flex items-center ">
        <div className="relative w-[600px] max-md:w-[400px] ">
          <Input placeholder={placeholder} className="rounded-full bg-green-800/15 w-full caret-green-800 shadow-green-800/20 shadow-lg"/>
          <Shuffle size={26} className="text-green-700 absolute right-12 top-1/2 transform -translate-y-1/2 bg-green-100 rounded-full p-1 cursor-pointer"/>
          <CornerDownRight size={26} className="text-green-700 absolute right-3 top-1/2 transform -translate-y-1/2 bg-green-100 rounded-full p-1 cursor-pointer"/>
        </div>
        <div className="flex justify-end mr-2 w-[600px] max-md:w-[400px]">
          <h3 className="text-green-600 outfit-regular text-xs mt-2">Powered by <img className="inline-block object-contain size-6" src="https://i.postimg.cc/v8zR1Bfd/Gemini-Icon-300x300-png.webp"/></h3>
        </div>
      </div>


      {/* Cards  */}
      <div className="grid grid-cols-2 my-10 place-items-center gap-8 max-lg:grid-cols-1 max-lg:px-5">
        <SkeletonCard/>
        <Card className="bg-green-100/30 shadow-lg rounded-t-xl">
            <CardContent className="space-y-5">
              <Image src="/image.jpg" alt="Dish" width={500} height={100} className="rounded-tr-lg rounded-tl-lg"/> 
              <div className="flex justify-between flex-col w-full gap-2 px-3">
                <h2 className="text-2xl text-green-700 outfit-bold">Healthy Salad</h2>
                <h5 className="text-green-800 text-sm tracking-tight outfit-regular">This creamy broccoli soup is a comforting and nutritious meal. It's packed with vitamins, minerals, and fiber, making it a healthy choice for any diet. Enjoy this delicious and wholesome soup on a chilly evening.</h5>
              </div>
            </CardContent>
            <CardFooter className="justify-end items-center px-4 mb-3">
                <Image src="https://www.freeiconspng.com/thumbs/youtube-logo-png/hd-youtube-logo-png-transparent-background-20.png" alt="YouTube" className="inline-block object-contain cursor-pointer" width={30} height={30} />
            </CardFooter>
        </Card>

        <Card className="bg-green-100/30 shadow-lg rounded-t-xl">
            <CardContent className="space-y-5">
              <Image src="/image.jpg" alt="Dish" width={500} height={100} className="rounded-tr-lg rounded-tl-lg"/> 
              <div className="flex justify-between flex-col w-full gap-2 px-3">
                <h2 className="text-2xl text-green-700 outfit-bold">Watermelon Juice</h2>
                <h5 className="text-green-800 text-sm tracking-tight outfit-regular">A vibrant, crunchy salad packed with vitamins and fiber, perfect for a light lunch or side dish. 🍉</h5>
              </div>
            </CardContent>
            <CardFooter className="justify-end items-center px-4 mb-3">
                <Image src="https://www.freeiconspng.com/thumbs/youtube-logo-png/hd-youtube-logo-png-transparent-background-20.png" alt="YouTube" className="inline-block object-contain cursor-pointer" width={30} height={30} />
            </CardFooter>
        </Card>

        <Card className="bg-green-100/30 shadow-lg rounded-t-xl">
            <CardContent className="space-y-5">
              <Image src="/image.jpg" alt="Dish" width={500} height={100} className="rounded-tr-lg rounded-tl-lg"/> 
              <div className="flex justify-between flex-col w-full gap-2 px-3">
                <h2 className="text-2xl text-green-700 outfit-bold">Healthy Salad</h2>
                <h5 className="text-green-800 text-sm tracking-tight outfit-regular">Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi aliquid iure necessitatibus obcaecati, eum reiciendis. Id doloribus esse harum atque.</h5>
              </div>
            </CardContent>
            <CardFooter className="justify-end items-center px-4 mb-3">
                <Image src="https://www.freeiconspng.com/thumbs/youtube-logo-png/hd-youtube-logo-png-transparent-background-20.png" alt="YouTube" className="inline-block object-contain cursor-pointer" width={30} height={30} />
            </CardFooter>
        </Card>

        <Card className="bg-green-100/30 shadow-lg rounded-t-xl">
            <CardContent className="space-y-5">
              <Image src="/image.jpg" alt="Dish" width={500} height={100} className="rounded-tr-lg rounded-tl-lg"/> 
              <div className="flex justify-between flex-col w-full gap-2 px-3">
                <h2 className="text-2xl text-green-700 outfit-bold">Healthy Salad</h2>
                <h5 className="text-green-800 text-sm tracking-tight outfit-regular">Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi aliquid iure necessitatibus obcaecati, eum reiciendis. Id doloribus esse harum atque.</h5>
              </div>
            </CardContent>
            <CardFooter className="justify-end items-center px-4 mb-3">
                <Image src="https://www.freeiconspng.com/thumbs/youtube-logo-png/hd-youtube-logo-png-transparent-background-20.png" alt="YouTube" className="inline-block object-contain cursor-pointer" width={30} height={30} />
            </CardFooter>
        </Card>
      </div>
    </div>
  );
}

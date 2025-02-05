
import { useEffect, useState } from "react";

export const placeholders = [
    "I purchased spinach today, what can I make out of it ?",
    "What's a good recipe for a healthy breakfast ?",
    "List down some recepies for a healthy lunch",
    "What are some healthy snacks I can make ?",
    "Any healthy recipes with broccoli?"
]; 


export const useDynamicPlaceholder = (placeholders: string[], interval: number) => {
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
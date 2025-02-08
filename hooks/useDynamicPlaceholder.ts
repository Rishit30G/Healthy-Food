
import { useEffect, useState } from "react";

export const placeholders = [
    "I have spinach, what can I make ?",
    "Suggest recipes for breakfast",
    "I'm happy today, what should I cook ?",
    "Any healthy evening snacks ?",
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
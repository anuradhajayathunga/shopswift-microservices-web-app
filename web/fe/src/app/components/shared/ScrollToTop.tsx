"use client";

import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // 1. Show button after scrolling past the hero section (e.g., 500px or 100vh)
      const showThreshold = window.innerHeight * 0.8; // Appears after scrolling 80% of the screen height
      if (window.scrollY > showThreshold) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      // 2. Calculate scroll progress percentage (0 to 100)
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      
      if (docHeight > 0) {
        const scrollPercent = (scrollTop / docHeight) * 100;
        setProgress(scrollPercent);
      }
    };

    window.addEventListener("scroll", handleScroll);
    
    // Initial check in case the user reloads while already scrolled down
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className={`fixed bottom-8 right-8 z-50 flex items-center justify-center w-12 h-12 outline-none group transition-all duration-500 ease-out ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-8 pointer-events-none"
      }`}
    >
      {/* Background & Hover Effect */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-xl group-hover:bg-muted/50 transition-colors" />

      {/* Static Background Border (Light Gray) */}
      <svg
        className="absolute inset-0 w-full h-full text-border/50"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M 24 2 L 40 2 Q 46 2 46 8 L 46 40 Q 46 46 40 46 L 8 46 Q 2 46 2 40 L 2 8 Q 2 2 8 2 Z"
          stroke="currentColor"
          strokeWidth="3"
        />
      </svg>

      {/* Animated Foreground Border (Black/Foreground) */}
      <svg
        className="absolute inset-0 w-full h-full text-foreground -rotate-90 origin-center"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ transform: "rotateY(180deg) rotateZ(-90deg)" }} // Rotated to start at top-center and go clockwise
      >
        <path
          d="M 24 2 L 40 2 Q 46 2 46 8 L 46 40 Q 46 46 40 46 L 8 46 Q 2 46 2 40 L 2 8 Q 2 2 8 2 Z"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          pathLength="100"
          strokeDasharray="100"
          strokeDashoffset={100 - progress}
          className="transition-[stroke-dashoffset] duration-200 ease-out"
        />
      </svg>

      {/* Center Icon */}
      <ChevronUp className="w-5 h-5 text-foreground relative z-10 group-hover:-translate-y-1 transition-transform duration-300" />
    </button>
  );
}
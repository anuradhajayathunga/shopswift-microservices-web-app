"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling down a bit (e.g., 50% of screen height)
      const showThreshold = window.innerHeight * 0.5;
      setIsVisible(window.scrollY > showThreshold);

      // Calculate scroll progress percentage (0 to 100)
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;

      if (docHeight > 0) {
        const scrollPercent = (scrollTop / docHeight) * 100;
        setProgress(scrollPercent);
      }
    };

    // Use passive listener for better scroll performance
    window.addEventListener("scroll", handleScroll, { passive: true });
    
    // Initial check
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // SVG Circle Math for the clockwise fill
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className={`fixed bottom-8 right-8 z-50 flex items-center justify-center w-14 h-14 outline-none group transition-all duration-500 ease-out ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-8 pointer-events-none"
      }`}
    >
      {/* Background & Hover Effect */}
      <div className="absolute inset-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-full shadow-lg group-hover:shadow-xl transition-all duration-300" />

      {/* SVG Container rotated -90deg so the fill starts exactly at the top (12 o'clock) */}
      <svg
        className="absolute inset-0 w-full h-full -rotate-90"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Static Background Track (Light Gray) */}
        <circle
          cx="24"
          cy="24"
          r={radius}
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-gray-200 dark:text-gray-800 transition-colors"
        />

        {/* Animated Foreground Progress Fill (Solid Black/White) */}
        <circle
          cx="24"
          cy="24"
          r={radius}
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="text-gray-900 dark:text-white transition-[stroke-dashoffset] duration-150 ease-out"
        />
      </svg>

      {/* Center Icon: Replaced Chevron with a sharper, more editorial ArrowUp */}
      <div className="relative z-10 flex items-center justify-center overflow-hidden h-6 w-6">
        <ArrowUp 
          className="w-5 h-5 text-gray-900 dark:text-white transform group-hover:-translate-y-6 transition-transform duration-300 ease-out absolute" 
          strokeWidth={1.5}
        />
        {/* Secondary arrow that slides in from the bottom on hover */}
        <ArrowUp 
          className="w-5 h-5 text-gray-900 dark:text-white transform translate-y-6 group-hover:translate-y-0 transition-transform duration-300 ease-out absolute" 
          strokeWidth={1.5}
        />
      </div>
    </button>
  );
}
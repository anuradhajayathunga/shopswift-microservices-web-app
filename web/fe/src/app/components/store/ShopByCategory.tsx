"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

// Mock data for the categories
const categories = [
  {
    id: 1,
    title: "Top",
    href: "/category/tops",
    image: "/api/placeholder/800/1000", // Replace with your actual image path
  },
  {
    id: 2,
    title: "Bottoms",
    href: "/category/bottoms",
    image: "/api/placeholder/800/1000", // Replace with your actual image path
  },
];

export function ShopByCategory() {
  return (
    <section className="bg-muted/30 py-16 md:py-24 border-y border-border/40">
      <div className=" mx-auto px-4 md:px-12">
        
        {/* Header Area */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="space-y-2">
            <h3 className="text-xs sm:text-sm font-bold tracking-widest uppercase text-foreground">
              Products by it's main categories
            </h3>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light uppercase tracking-tight text-foreground">
              Shop by Category
            </h2>
          </div>
          
          {/* Custom Underlined Link */}
          <Link 
            href="/categories" 
            className="group flex items-center gap-1.5 text-sm font-semibold text-foreground border-b-2 border-foreground pb-1 hover:text-primary hover:border-primary transition-all shrink-0 w-fit"
          >
            View all categories 
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Inner White Wrapper & Grid */}
        <div className="bg-background rounded-[2rem] p-3 sm:p-4 grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 shadow-sm border border-border/60">
          
          {categories.map((category) => (
            <Link 
              key={category.id} 
              href={category.href}
              className="group relative overflow-hidden rounded-[1.5rem] aspect-[4/5] sm:aspect-square md:aspect-[4/5] lg:aspect-[16/10] bg-muted block"
            >
              {/* Category Image */}
              <img 
                src={category.image} 
                alt={category.title} 
                className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-105"
              />
              
              {/* Subtle Dark Overlay on Hover */}
              <div className="absolute inset-0 bg-black/5 transition-colors duration-500 group-hover:bg-black/20" />
              
              {/* Center Black Label Button (Based on your full site screenshot) */}
              <div className="absolute inset-0 flex items-center justify-center opacity-90 group-hover:opacity-100 transition-opacity">
                <span className="bg-black text-white text-[11px] font-bold tracking-[0.2em] uppercase px-8 py-3.5 rounded-sm shadow-xl transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  {category.title}
                </span>
              </div>
            </Link>
          ))}

        </div>
      </div>
    </section>
  );
}
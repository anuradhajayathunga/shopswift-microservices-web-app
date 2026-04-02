"use client";

import Link from "next/link";
import {  ArrowRight } from "lucide-react";
import {TbBrandFacebook, TbBrandInstagram} from "react-icons/tb";

// Mock data representing the grid items
const instagramPosts = [
  {
    id: 1,
    type: "big", // The large 2x2 promotional image
    src: "/api/placeholder/800/800",
    alt: "Avurudu Promo - Up to 40% Off",
  },
  { id: 2, src: "/api/placeholder/400/400", alt: "Black Polo Fit" },
  { id: 3, src: "/api/placeholder/400/400", alt: "F1 Refined Cropped Fit" },
  { id: 4, src: "/api/placeholder/400/400", alt: "F2 Signature Cropped Fit" },
  { id: 5, src: "/api/placeholder/400/400", alt: "F3 Relaxed Cropped Fit" },
  { id: 6, src: "/api/placeholder/400/400", alt: "Unmeasured Volume Over Form" },
  { id: 7, src: "/api/placeholder/400/400", alt: "Disagree body shape text" },
  { id: 8, src: "/api/placeholder/400/400", alt: "Does body shape matter text" },
  { id: 9, src: "/api/placeholder/400/400", alt: "Guy in hype tee on couch" },
  { id: 10, src: "/api/placeholder/400/400", alt: "Guy walking with back graphic" },
  { id: 11, src: "/api/placeholder/400/400", alt: "Guy in brown shirt portrait" },
  { id: 12, src: "/api/placeholder/400/400", alt: "Ride Safe back graphic" },
];

export function InstagramGrid() {
  return (
    <section className="w-full bg-white py-16 md:py-24 border-t border-gray-200 font-sans">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-12">
          <div className="space-y-2">
            <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-gray-500">
              On The Grid
            </h3>
            <h2 className="text-3xl md:text-4xl font-medium tracking-tight uppercase text-gray-900">
              Follow Us
            </h2>
          </div>
          
          <Link
            href="https://instagram.com/hype_sl_"
            target="_blank"
            rel="noreferrer"
            className="group flex items-center gap-2 text-sm font-bold tracking-widest text-gray-900 border-b border-gray-900 pb-1 hover:text-gray-500 hover:border-gray-500 transition-colors shrink-0 w-fit uppercase"
          >
            @hype_sl_
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* The Bento Grid
          - Mobile: 2 columns (11 items visible to keep it a perfect rectangle)
          - Tablet/Desktop: 5 columns (12 items visible, perfectly fills 3 rows)
        */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-1 sm:gap-2">
          {instagramPosts.map((post, index) => (
            <Link
              key={post.id}
              href="https://instagram.com/hype_sl_"
              target="_blank"
              rel="noreferrer"
              className={`group relative overflow-hidden bg-gray-100 block transition-all ${
                post.type === "big"
                  ? "col-span-2 row-span-2 aspect-square md:aspect-auto" 
                  : "col-span-1 row-span-1 aspect-square"
              } ${index === 11 ? "hidden md:block" : ""}`} // Hides the 12th item on mobile to prevent grid gaps
            >
              {/* Image */}
              <img
                src={post.src}
                alt={post.alt}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
              />

              {/* Minimalist Premium Hover Overlay */}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out z-10">
                <div className="flex flex-col items-center gap-3 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <TbBrandInstagram className="w-8 h-8" strokeWidth={1.5} />
                  <span className="text-[10px] font-bold tracking-[0.2em] uppercase">
                    View Post
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
      </div>
    </section>
  );
}
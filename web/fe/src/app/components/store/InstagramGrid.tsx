"use client";

import { Heart } from "lucide-react";
import Link from "next/link";

// Mock data representing the grid items
// In a real app, these could be fetched from the Instagram Basic Display API
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
  {
    id: 6,
    src: "/api/placeholder/400/400",
    alt: "Unmeasured Volume Over Form",
  },
  { id: 7, src: "/api/placeholder/400/400", alt: "Disagree body shape text" },
  {
    id: 8,
    src: "/api/placeholder/400/400",
    alt: "Does body shape matter text",
  },
  { id: 9, src: "/api/placeholder/400/400", alt: "Guy in hype tee on couch" },
  {
    id: 10,
    src: "/api/placeholder/400/400",
    alt: "Guy walking with back graphic",
  },
  {
    id: 11,
    src: "/api/placeholder/400/400",
    alt: "Guy in brown shirt portrait",
  },
  { id: 12, src: "/api/placeholder/400/400", alt: "Ride Safe back graphic" },
];

export function InstagramGrid() {
  return (
    <section className="container mx-auto px-4 py-16">
      {/* Section Header */}
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-xl md:text-2xl font-medium tracking-tight text-foreground flex items-center gap-2">
          Follow us on Instagram
          <a
            href="https://instagram.com/hype_sl_"
            target="_blank"
            rel="noreferrer"
            className="text-primary hover:underline underline-offset-4 font-semibold"
          >
            @hype_sl_
          </a>
        </h2>
      </div>

      {/* The Bento Grid
        - Mobile: 2 columns 
        - Tablet/Desktop: 5 columns
      */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
        {instagramPosts.map((post, index) => (
          <Link
            key={post.id}
            href="https://instagram.com/hype_sl_"
            target="_blank"
            rel="noreferrer"
            className={`group relative overflow-hidden rounded-xl bg-muted/30 border border-border/40 block transition-all ${
              post.type === "big"
                ? "col-span-2 row-span-2 aspect-square md:aspect-auto" // The big image spans 2 cols & 2 rows
                : "col-span-1 row-span-1 aspect-square" // The rest are perfect 1x1 squares
            }`}
          >
            {/* Image */}
            <img
              src={post.src}
              alt={post.alt}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />

            {/* Premium SaaS Hover Overlay */}
            <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/20 backdrop-blur-[0px] group-hover:backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 z-10">
              <div className="bg-white/90 text-black p-3 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-sm">
                <Heart className="w-5 h-5" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

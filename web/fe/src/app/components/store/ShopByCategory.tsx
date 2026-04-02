"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

// Mock data for the categories
const categories = [
  {
    id: 1,
    title: "Tops",
    href: "/category/tops",
    image: "/images/products/top/top-1.png", // Replace with your actual image path
  },
  {
    id: 2,
    title: "Bottoms",
    href: "/category/bottoms",
    image: "/images/products/bottom/bottom-1.png", // Replace with your actual image path
  },
];

export function ShopByCategory() {
  return (
    <section className="bg-white py-16 md:py-24 border-y border-gray-200 font-sans">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        
        {/* Header Area */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div className="space-y-3">
            <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-gray-500">
              Curated Collections
            </h3>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium uppercase tracking-tight text-gray-900">
              Shop by Category
            </h2>
          </div>

          {/* Minimalist Link */}
          <Link
            href="/store/categories"
            className="group flex items-center gap-2 text-sm font-medium text-gray-900 border-b border-gray-900 pb-1 hover:text-gray-500 hover:border-gray-500 transition-colors shrink-0 w-fit"
          >
            View all categories
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Minimalist Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={category.href}
              className="group relative overflow-hidden aspect-[4/5] sm:aspect-square md:aspect-[4/5] bg-gray-100 block"
            >
              {/* Category Image */}
              <img
                src={category.image}
                alt={category.title}
                className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Subtle Dark Overlay */}
              <div className="absolute inset-0 bg-black/5 transition-colors duration-500 group-hover:bg-black/10" />

              {/* Minimalist Sharp Label */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full px-6 flex justify-center">
                <span className="bg-white text-gray-900 text-xs font-bold tracking-[0.15em] uppercase px-10 py-4 min-w-[200px] text-center shadow-sm group-hover:bg-black group-hover:text-white transition-colors duration-300">
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
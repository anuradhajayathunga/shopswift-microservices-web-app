"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search, ChevronDown, ArrowRight, X } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { publicProductAPI, type PublicProduct } from "@/lib/public-products";

// Mock Data for the Inspiration Section
// const inspirationProducts = [
//   {
//     id: 1,
//     name: "CEDRO EDITION",
//     price: 3490.0,
//     oldPrice: 3990.0,
//     discount: "-13%",
//     image: "/api/placeholder/400/500",
//   },
//   {
//     id: 2,
//     name: "Chaos Super Oversize Cargo Pant",
//     price: 4095.0,
//     oldPrice: 5850.0,
//     discount: "-30%",
//     image: "/api/placeholder/400/500",
//   },
//   {
//     id: 3,
//     name: "CLASSIC CUT 0.2",
//     price: 3480.0,
//     oldPrice: 4350.0,
//     discount: "-20%",
//     image: "/api/placeholder/400/500",
//   },
//   {
//     id: 4,
//     name: "DAT COLLECTION",
//     price: 1325.0,
//     oldPrice: 2650.0,
//     discount: "-50%",
//     image: "/api/placeholder/400/500",
//   },
//   {
//     id: 5,
//     name: "ESSENTIAL RELAX T",
//     price: 2583.0,
//     oldPrice: 3690.0,
//     discount: "-30%",
//     image: "/api/placeholder/400/500",
//   },
// ];

export function SearchOverlay({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<PublicProduct[]>([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await publicProductAPI.list();
        setProducts(data);
      } finally {
        setIsLoading(false);
      }
    };

    void loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return products.slice(0, 5);
    }

    return products
      .filter((product) => {
        const searchableText = [product.name, product.description, product.sku]
          .join(" ")
          .toLowerCase();

        return searchableText.includes(normalizedQuery);
      })
      .slice(0, 5);
  }, [products, query]);

  const formatPrice = (value: number) =>
    value.toLocaleString(undefined, { minimumFractionDigits: 2 });

  return (
    <Dialog>
      {/* The Trigger (Will wrap your Search Icon/Button in the Header) */}
      <DialogTrigger asChild>{children}</DialogTrigger>
      {/* Full Screen Dialog Content */}
      <DialogContent className="max-w-none w-screen h-dvh p-0 m-0 border-none bg-white/90 font-sans sm:rounded-none !rounded-none overflow-y-auto flex flex-col [&>button]:hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>Search products</DialogTitle>
        </DialogHeader>

        {/* Top Section: Oversized Editorial Search Input */}
        <div className="w-full border-b border-gray-200 sticky top-0 z-20 bg-white/0">
          <div className="container mx-auto px-4 md:px-8 relative flex items-center">
            <div className="hidden lg:flex w-1/4"></div>
            <Search
              className="w-6 h-6 md:w-8 md:h-8 text-gray-400 shrink-0"
              strokeWidth={1.5}
            />
            <input
              autoFocus
              placeholder="WHAT ARE YOU LOOKING FOR?"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="w-full h-24 md:h-32 pl-4 md:pl-8 bg-transparent text-xl md:text-3xl font-light tracking-tight text-gray-900 placeholder:text-gray-400 outline-none uppercase"
            />
            <DialogClose className="p-4 -mr-4 text-gray-400 hover:text-gray-900 transition-colors shrink-0">
              <X className="w-8 h-8" strokeWidth={1.5} />
              <span className="sr-only">Close</span>
            </DialogClose>
          </div>
        </div>
        {/* Bottom Section: Links & Inspiration */}
        <div className="container mx-auto px-4 md:px-8 py-12 md:py-16 flex flex-col lg:flex-row gap-16 lg:gap-20 flex-1">
          {/* Left Column: Quick Links */}
          <div className="w-full lg:w-[240px] shrink-0 space-y-6">
            <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-gray-500">
              Quick Links
            </h3>

            {/* Minimalist Typography Links */}
            <div className="flex flex-col space-y-4">
              <Link
                href="/store"
                className="group flex items-center justify-between text-sm font-medium text-gray-900 hover:text-gray-500 transition-colors"
              >
                HOME
                <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
              </Link>
              <button className="group flex items-center justify-between text-sm font-medium text-gray-900 hover:text-gray-500 transition-colors w-full text-left">
                CATALOGS
                <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-900 transition-colors" />
              </button>
              <button className="group flex items-center justify-between text-sm font-medium text-gray-900 hover:text-gray-500 transition-colors w-full text-left">
                SALE
                <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-900 transition-colors" />
              </button>
              <Link
                href="/blog"
                className="group flex items-center justify-between text-sm font-medium text-gray-900 hover:text-gray-500 transition-colors"
              >
                JOURNAL
                <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
              </Link>
              <Link
                href="/about"
                className="group flex items-center justify-between text-sm font-medium text-gray-900 hover:text-gray-500 transition-colors"
              >
                ABOUT US
                <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
              </Link>
            </div>
          </div>

          {/* Right Column: Inspiration Products */}
          <div className="flex-1 space-y-6">
            <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-gray-500">
              {query ? "Search Results" : "Suggested For You"}
            </h3>

            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex flex-col gap-3 animate-pulse"
                  >
                    <div className="aspect-[3/4] bg-gray-100" />
                    <div className="space-y-2">
                      <div className="h-3 w-3/4 bg-gray-200" />
                      <div className="h-3 w-1/2 bg-gray-200" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="w-full border border-gray-200 bg-gray-50 p-12 text-center flex flex-col items-center justify-center h-64">
                <p className="text-gray-500 font-medium tracking-wide uppercase text-sm">
                  No products found for "{query}".
                </p>
                <button
                  onClick={() => setQuery("")}
                  className="mt-4 text-xs font-bold tracking-widest uppercase text-gray-900 border-b border-gray-900 pb-1"
                >
                  Clear Search
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6 lg:gap-8">
                {filteredProducts.map((product) => (
                  <Link
                    href={`/store/product/${product.id}`}
                    key={product.id}
                    className="group flex flex-col h-full"
                  >
                    {/* Image & Status Container */}
                    <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-3">
                      <span
                        className={`absolute top-3 right-3 z-10 text-[9px] font-bold tracking-[0.15em] uppercase px-2 py-1 shadow-sm ${product.is_active ? "bg-white text-gray-900" : "bg-black text-white"}`}
                      >
                        {product.is_active
                          ? `QTY ${product.stock}`
                          : "Sold Out"}
                      </span>

                      <img
                        src="/api/placeholder/400/500" // Replace with product.image
                        alt={product.name}
                        className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-105 mix-blend-multiply"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex flex-col flex-1 space-y-1">
                      <h4 className="text-xs font-medium text-gray-900 tracking-wide uppercase truncate">
                        {product.name}
                      </h4>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-sm font-medium text-gray-900">
                          Rs {formatPrice(product.price)}
                        </span>
                        <span className="text-[10px] text-gray-400 uppercase tracking-widest">
                          {product.sku}
                        </span>
                      </div>

                      {/* Payment Promo */}
                      <p className="text-[10px] text-gray-500 mt-auto pt-2 leading-tight">
                        3 X{" "}
                        <span className="font-semibold text-gray-900">
                          Rs {formatPrice(product.price / 3)}
                        </span>{" "}
                        with{" "}
                        <span className="inline-flex items-center font-bold text-slate-800 italic tracking-tighter">
                          mintpay
                        </span>
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import Link from "next/link";
import { Search, ChevronDown } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// Mock Data for the Inspiration Section
const inspirationProducts = [
  {
    id: 1,
    name: "CEDRO EDITION",
    price: 3490.0,
    oldPrice: 3990.0,
    discount: "-13%",
    image: "/api/placeholder/400/500",
  },
  {
    id: 2,
    name: "Chaos Super Oversize Cargo Pant",
    price: 4095.0,
    oldPrice: 5850.0,
    discount: "-30%",
    image: "/api/placeholder/400/500",
  },
  {
    id: 3,
    name: "CLASSIC CUT 0.2",
    price: 3480.0,
    oldPrice: 4350.0,
    discount: "-20%",
    image: "/api/placeholder/400/500",
  },
  {
    id: 4,
    name: "DAT COLLECTION",
    price: 1325.0,
    oldPrice: 2650.0,
    discount: "-50%",
    image: "/api/placeholder/400/500",
  },
  {
    id: 5,
    name: "ESSENTIAL RELAX T",
    price: 2583.0,
    oldPrice: 3690.0,
    discount: "-30%",
    image: "/api/placeholder/400/500",
  },
];

export function SearchOverlay({ children }: { children: React.ReactNode }) {
  return (
    <Dialog>
      {/* The Trigger (Will wrap your Search Icon/Button in the Header) */}
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>

      {/* Full Screen Dialog Content */}
      <DialogContent 
        className="max-w-none w-screen h-screen h-dvh p-0 m-0 border-none bg-[#F5F5F5] dark:bg-background sm:rounded-none !rounded-none overflow-y-auto duration-300 [&>button]:right-6 [&>button]:top-6 [&>button_svg]:size-6 [&>button]:opacity-70 hover:[&>button]:opacity-100"
      >
        <div className="w-full flex flex-col min-h-full">
          
          {/* Top Section: Search Input */}
          <div className="pt-16 pb-12 px-4 flex flex-col items-center justify-center border-b border-transparent">
            <DialogHeader>
              <DialogTitle className="text-3xl font-medium tracking-tight text-foreground text-center mb-6">
                Search our site
              </DialogTitle>
            </DialogHeader>
            <div className="relative w-full max-w-2xl group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground size-5 transition-colors group-focus-within:text-primary" />
              <Input
                placeholder="Search"
                className="h-14 pl-12 bg-white dark:bg-muted/50 text-base md:text-lg border-0 shadow-sm rounded-md focus-visible:ring-1 focus-visible:ring-primary/30 transition-shadow"
              />
            </div>
          </div>

          {/* Bottom Section: Links & Inspiration */}
          <div className="container mx-auto px-4 md:px-8 pb-20 flex flex-col lg:flex-row gap-12 lg:gap-16">
            
            {/* Left Column: Quick Links */}
            <div className="w-full lg:w-[240px] shrink-0">
              <h3 className="text-[17px] font-medium text-foreground mb-4">Quick link</h3>
              
              {/* Black Box Links Container */}
              <div className="bg-black text-white p-2 rounded-md shadow-sm grid grid-cols-2 lg:grid-cols-1 gap-1">
                <Link href="/" className="px-4 py-3 hover:bg-white/10 rounded transition-colors text-sm font-medium">
                  Home
                </Link>
                <button className="px-4 py-3 hover:bg-white/10 rounded transition-colors text-sm font-medium flex items-center justify-between w-full text-left">
                  Catalogs
                  <ChevronDown className="size-4 opacity-50" />
                </button>
                <button className="px-4 py-3 hover:bg-white/10 rounded transition-colors text-sm font-medium flex items-center justify-between w-full text-left">
                  Sale
                  <ChevronDown className="size-4 opacity-50" />
                </button>
                <Link href="/blog" className="px-4 py-3 hover:bg-white/10 rounded transition-colors text-sm font-medium">
                  Blog
                </Link>
                <Link href="/about" className="px-4 py-3 hover:bg-white/10 rounded transition-colors text-sm font-medium">
                  About
                </Link>
              </div>
            </div>

            {/* Right Column: Inspiration Products */}
            <div className="flex-1">
              <h3 className="text-[17px] font-medium text-foreground mb-4">Need some inspiration?</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
                {inspirationProducts.map((product) => (
                  <Link href={`/product/${product.id}`} key={product.id} className="group flex flex-col gap-3">
                    
                    {/* Image & Badge Container */}
                    <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-muted border border-border/40">
                      <Badge className="absolute top-2 right-2 z-10 bg-[#E11D48] hover:bg-[#E11D48] text-white shadow-none rounded-sm px-2 font-semibold">
                        {product.discount}
                      </Badge>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold text-foreground tracking-tight leading-snug group-hover:text-primary transition-colors">
                        {product.name}
                      </h4>
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <span className="text-muted-foreground line-through decoration-muted-foreground/50">
                          Rs {product.oldPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                        <span className="text-[#E11D48]">
                          Rs {product.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      
                      {/* Fake Mintpay / Installment text */}
                      <p className="text-[10px] sm:text-[11px] text-muted-foreground mt-1.5 leading-tight">
                        3 X <span className="font-semibold text-foreground">Rs {(product.price / 3).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span> or 6% Cashback with <span className="inline-flex items-center font-bold text-[#0F172A] italic tracking-tighter">///mintpay</span> <span className="inline-flex items-center justify-center size-3 rounded-full bg-muted-foreground text-background text-[8px] not-italic font-bold ml-0.5">i</span>
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
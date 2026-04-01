"use client";

import { useState } from "react";
import Link from "next/link";
import { Star, Truck, RefreshCw, ShieldCheck, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

// Mock Product Data
const product = {
  id: "1",
  name: "Backline Authority Heavyweight T-Shirt",
  price: 4950,
  originalPrice: 5500,
  description: "Experience premium comfort with our heavyweight cotton blend. Designed for the modern streetwear aesthetic, featuring a relaxed drop-shoulder fit and high-density puff print graphics.",
  colors: ["#111827", "#F3F4F6", "#78716C"], // Slate, Gray, Stone
  sizes: ["S", "M", "L", "XL", "XXL"],
  images: [
    "/api/placeholder/600/800",
    "/api/placeholder/600/800",
    "/api/placeholder/600/800",
    "/api/placeholder/600/800",
  ],
};

export default function ProductDetailsPage() {
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[2]);
  const [activeImage, setActiveImage] = useState(product.images[0]);

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 py-8">
        
        {/* Breadcrumb Navigation */}
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild className="text-muted-foreground hover:text-foreground">
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild className="text-muted-foreground hover:text-foreground">
                <Link href="/collections/mens">Men's Tops</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-medium text-foreground">
                Backline Authority
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-16">
          
          {/* Left Column: Image Gallery */}
          <div className="space-y-4">
            {/* Main Image Container */}
            <div className="relative aspect-[4/5] md:aspect-[3/4] w-full overflow-hidden rounded-2xl border border-border/50 bg-muted/30 flex items-center justify-center">
              <Badge variant="secondary" className="absolute top-4 left-4 z-10 bg-background/80 backdrop-blur-md shadow-sm border-border/50 font-medium">
                Best Seller
              </Badge>
              <img
                src={activeImage}
                alt={product.name}
                className="object-cover w-full h-full transition-opacity duration-300"
              />
            </div>

            {/* Thumbnail Grid */}
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`relative aspect-[4/5] overflow-hidden rounded-xl border-2 transition-all ${
                    activeImage === img ? "border-primary ring-1 ring-primary/20" : "border-border/50 hover:border-border"
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} className="object-cover w-full h-full opacity-90 hover:opacity-100" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Product Info */}
          <div className="flex flex-col pt-2 lg:pt-8">
            
            {/* Title & Price */}
            <div className="mb-6 space-y-2">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                {product.name}
              </h1>
              <div className="flex items-center gap-4">
                <span className="text-2xl font-semibold text-foreground">
                  Rs {product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-lg text-muted-foreground line-through">
                      Rs {product.originalPrice.toLocaleString()}
                    </span>
                    <Badge variant="destructive" className="font-semibold shadow-none rounded-sm">
                      Save {Math.round((1 - product.price / product.originalPrice) * 100)}%
                    </Badge>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                <div className="flex items-center text-amber-500">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                </div>
                <span>(128 Reviews)</span>
              </div>
            </div>

            <p className="text-muted-foreground text-sm leading-relaxed mb-8">
              {product.description}
            </p>

            <Separator className="mb-8 border-border/60" />

            {/* Options Form */}
            <div className="space-y-8 mb-8">
              
              {/* Color Selection */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">Color</span>
                </div>
                <div className="flex items-center gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center ${
                        selectedColor === color ? "border-primary ring-2 ring-primary/20 ring-offset-2 ring-offset-background" : "border-border/50 hover:border-border"
                      }`}
                      style={{ backgroundColor: color }}
                      aria-label={`Select color ${color}`}
                    />
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">Size</span>
                  <button className="text-xs font-medium text-muted-foreground hover:text-foreground underline underline-offset-4">
                    Size Guide
                  </button>
                </div>
                <div className="grid grid-cols-5 gap-2 sm:gap-3">
                  {product.sizes.map((size) => (
                    <Button
                      key={size}
                      type="button"
                      variant={selectedSize === size ? "default" : "outline"}
                      onClick={() => setSelectedSize(size)}
                      className={`h-12 w-full shadow-none ${
                        selectedSize === size 
                          ? "bg-foreground text-background font-semibold" 
                          : "bg-background border-border/60 text-foreground hover:border-foreground/50 hover:bg-muted/50"
                      }`}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>

            </div>

            {/* Actions */}
            <div className="flex gap-4 mb-10">
              <Button size="lg" className="flex-1 h-14 text-base font-semibold shadow-sm">
                Add to Cart
              </Button>
              <Button size="icon" variant="outline" className="h-14 w-14 border-border/60 shadow-none text-muted-foreground hover:text-red-500 hover:border-red-500/50 hover:bg-red-50 transition-colors">
                <Heart className="w-5 h-5" />
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="flex flex-col items-center justify-center p-4 rounded-xl border border-border/50 bg-muted/20 text-center space-y-2">
                <Truck className="w-5 h-5 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">Island-wide<br/>Delivery</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 rounded-xl border border-border/50 bg-muted/20 text-center space-y-2">
                <RefreshCw className="w-5 h-5 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">7 Days<br/>Easy Return</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 rounded-xl border border-border/50 bg-muted/20 text-center space-y-2">
                <ShieldCheck className="w-5 h-5 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">Secure<br/>Checkout</span>
              </div>
            </div>

            {/* Product Details Accordion */}
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="details" className="border-border/60">
                <AccordionTrigger className="text-sm font-medium hover:no-underline hover:text-primary transition-colors">
                  Product Details
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm space-y-2 leading-relaxed">
                  <ul className="list-disc pl-4 space-y-1">
                    <li>100% Premium Heavyweight Cotton</li>
                    <li>Oversized drop-shoulder fit</li>
                    <li>High-density puff print graphic on front/back</li>
                    <li>Ribbed crewneck collar</li>
                    <li>Pre-shrunk to minimize shrinkage</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="shipping" className="border-border/60">
                <AccordionTrigger className="text-sm font-medium hover:no-underline hover:text-primary transition-colors">
                  Shipping & Returns
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm space-y-2 leading-relaxed">
                  Standard delivery takes 2-4 business days. Express next-day delivery is available at checkout for selected areas. Returns are accepted within 7 days of receiving your order, provided the items are unworn and in original condition.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="care" className="border-border/60">
                <AccordionTrigger className="text-sm font-medium hover:no-underline hover:text-primary transition-colors">
                  Care Instructions
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm space-y-2 leading-relaxed">
                  Machine wash cold with like colors. Tumble dry low or hang dry to preserve the print quality. Do not iron directly over the graphics.
                </AccordionContent>
              </AccordionItem>
            </Accordion>

          </div>
        </div>
      </div>
    </div>
  );
}
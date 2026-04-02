"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Heart,
  Eye,
  SlidersHorizontal,
  ChevronDown,
  LayoutGrid,
  Grid3X3,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { publicProductAPI, type PublicProduct } from "@/lib/public-products";
import Header from "@/app/components/store/Header";
import Footer from "@/app/components/store/Footer";

type CollectionGridProps = {
  products: PublicProduct[];
  isLoading?: boolean;
};

export function CollectionGrid({
  products,
  isLoading = false,
}: CollectionGridProps) {
  return (
    <section className="w-full bg-[#FAFAFA] pb-24 font-sans">
      {/* Utility Toolbar */}
      <div className="w-full bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="container mx-auto px-4 md:px-8 max-w-[1600px]">
          <div className="flex items-center justify-between h-14 text-xs font-bold tracking-[0.1em] uppercase text-gray-900">
            {/* Left: Filter */}
            <button className="flex items-center gap-2 hover:text-gray-500 transition-colors">
              <SlidersHorizontal className="w-4 h-4" strokeWidth={2} />
              Filter
            </button>

            {/* Center: Grid Views (Hidden on mobile) */}
            <div className="hidden md:flex items-center gap-3 text-gray-300">
              <button className="hover:text-gray-900 transition-colors">
                <div className="flex gap-0.5">
                  <div className="w-1.5 h-3 bg-current rounded-sm"></div>
                  <div className="w-1.5 h-3 bg-current rounded-sm"></div>
                </div>
              </button>
              <button className="text-gray-900">
                <LayoutGrid className="w-4 h-4" strokeWidth={2.5} />
              </button>
              <button className="hover:text-gray-900 transition-colors">
                <Grid3X3 className="w-4 h-4" strokeWidth={2.5} />
              </button>
            </div>

            {/* Right: Sort */}
            <button className="flex items-center gap-2 hover:text-gray-500 transition-colors">
              Date, new to old
              <ChevronDown className="w-4 h-4" strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid Area */}
      <div className="container mx-auto px-4 md:px-8 max-w-[1600px] pt-8">
        {/* Loading State */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 lg:gap-x-6 lg:gap-y-12">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="flex flex-col gap-4 animate-pulse">
                <div className="aspect-[3/4] bg-gray-200" />
                <div className="space-y-3">
                  <div className="h-4 w-3/4 bg-gray-200" />
                  <div className="h-4 w-1/3 bg-gray-200" />
                  <div className="h-3 w-2/3 bg-gray-200 mt-2" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          /* Empty State */
          <div className="w-full border border-gray-200 bg-white p-16 text-center flex flex-col items-center justify-center min-h-[400px]">
            <p className="text-gray-500 font-medium tracking-wide uppercase text-sm">
              No products found in this collection.
            </p>
          </div>
        ) : (
          /* Product Grid */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 lg:gap-x-6 lg:gap-y-12">
            {products.map((product) => {
              // Mock discount logic for UI demonstration
              const isDiscounted = product.id % 2 !== 0;
              const originalPrice = isDiscounted
                ? product.price * 1.2
                : product.price;
              const discountPercentage = isDiscounted
                ? Math.round((1 - product.price / originalPrice) * 100)
                : 0;

              return (
                <div
                  key={product.id}
                  className="group flex flex-col h-full bg-transparent"
                >
                  {/* Image Container */}
                  <Link
                    href={`/store/product/${product.id}`}
                    className="relative aspect-[3/4] overflow-hidden bg-[#EFEFEF] mb-4 block"
                  >
                    {/* Badges */}
                    <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 items-end">
                      {isDiscounted && (
                        <span className="bg-[#E11D48] text-white text-[10px] font-bold tracking-[0.1em] px-2 py-1 shadow-sm">
                          -{discountPercentage}%
                        </span>
                      )}
                      {product.is_active && !isDiscounted && (
                        <span className="bg-[#4A8E9A] text-white text-[10px] font-bold tracking-[0.1em] px-2 py-1 shadow-sm uppercase">
                          New
                        </span>
                      )}
                    </div>

                    <img
                      src="/api/placeholder/500/667" // Replace with actual product image
                      alt={product.name}
                      className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-105 mix-blend-multiply"
                    />

                    {/* Hover Action Buttons */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out translate-y-4 group-hover:translate-y-0">
                      <button className="w-10 h-10 bg-black text-white flex items-center justify-center hover:bg-gray-800 transition-colors shadow-lg">
                        <Heart className="w-4 h-4" strokeWidth={2} />
                      </button>
                      <button className="w-10 h-10 bg-black text-white flex items-center justify-center hover:bg-gray-800 transition-colors shadow-lg">
                        <Eye className="w-4 h-4" strokeWidth={2} />
                      </button>
                    </div>
                  </Link>

                  {/* Product Info */}
                  <div className="flex flex-col flex-1 space-y-1">
                    <Link href={`/store/product/${product.id}`}>
                      <h3 className="text-xs sm:text-sm font-bold text-gray-900 uppercase tracking-wide truncate hover:text-gray-600 transition-colors">
                        {product.name}
                      </h3>
                    </Link>

                    {/* Pricing */}
                    <div className="flex items-center gap-2 pt-0.5">
                      <span className="text-sm font-bold text-gray-900">
                        Rs{" "}
                        {product.price.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                      {isDiscounted && (
                        <span className="text-xs font-medium text-[#E11D48] line-through">
                          Rs{" "}
                          {originalPrice.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                      )}
                    </div>

                    {/* Mintpay Installment Info */}
                    <p className="text-[10px] sm:text-[11px] text-gray-500 mt-1 leading-relaxed">
                      3 X{" "}
                      <span className="font-semibold text-gray-900">
                        Rs{" "}
                        {(product.price / 3).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                      </span>{" "}
                      or 6% Cashback with{" "}
                      <span className="inline-flex items-center font-bold text-slate-800 italic tracking-tighter">
                        mintpay
                      </span>
                      <span className="inline-flex items-center justify-center w-3 h-3 rounded-full bg-gray-300 text-white text-[8px] not-italic font-bold ml-1">
                        i
                      </span>
                    </p>

                    {/* Color Swatches */}
                    <div className="flex items-center gap-1.5 pt-3 mt-auto">
                      <div className="w-3.5 h-3.5 bg-gray-900 border border-gray-200 cursor-pointer"></div>
                      <div className="w-3.5 h-3.5 bg-gray-200 border border-gray-300 cursor-pointer"></div>
                      <div className="w-3.5 h-3.5 bg-white border border-gray-300 cursor-pointer"></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && products.length > 0 && (
          <div className="flex items-center justify-start gap-2 mt-16 border-t border-gray-200 pt-8">
            <button className="w-10 h-10 flex items-center justify-center border border-gray-200 bg-white text-gray-900 font-medium text-sm hover:border-gray-900 transition-colors">
              1
            </button>
            <button className="w-10 h-10 flex items-center justify-center border border-transparent bg-black text-white font-medium text-sm hover:bg-gray-800 transition-colors">
              2
            </button>
            <button className="w-10 h-10 flex items-center justify-center border border-transparent bg-black text-white hover:bg-gray-800 transition-colors">
              <ChevronRight className="w-4 h-4" strokeWidth={2} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default function CategoriesPage() {
  const [products, setProducts] = useState<PublicProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await publicProductAPI.list();
        setProducts(data);
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Unable to load categories right now",
        );
      } finally {
        setIsLoading(false);
      }
    };

    void loadProducts();
  }, []);

  return (
    <div className="w-full min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        <CollectionGrid products={products} isLoading={isLoading} />
      </main>
      <Footer />
    </div>
  );
}

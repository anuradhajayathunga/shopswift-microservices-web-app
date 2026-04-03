"use client";

import Link from "next/link";
import { ArrowRight, Eye, Heart } from "lucide-react";
import type { PublicProduct } from "@/lib/public-products";

type ProductGridProps = {
  products: PublicProduct[];
  isLoading?: boolean;
};

export function ProductGrid({ products, isLoading = false }: ProductGridProps) {
  // Take only the first 4 products for the newest arrivals row
  const newestArrivals = products.slice(0, 4);

  return (
    <section className="w-full bg-white py-16 md:py-24 font-sans border-t border-gray-200">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        {/* Header Area */}
        <div className="flex items-end justify-between mb-10 md:mb-12">
          <div className="space-y-2">
            <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-gray-500">
              Fresh Drops
            </h3>
            <h2 className="text-3xl md:text-4xl font-medium tracking-tight uppercase text-gray-900">
              Newest Arrivals
            </h2>
          </div>

          <Link
            href="/store/categories"
            className="group hidden sm:flex items-center gap-2 text-sm font-medium text-gray-900 border-b border-gray-900 pb-1 hover:text-gray-500 hover:border-gray-500 transition-colors shrink-0"
          >
            View all
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex flex-col gap-4 animate-pulse">
                <div className="aspect-[3/4] bg-gray-100" />
                <div className="space-y-3">
                  <div className="h-4 w-3/4 bg-gray-200" />
                  <div className="h-4 w-1/3 bg-gray-200" />
                  <div className="h-3 w-2/3 bg-gray-100 mt-2" />
                </div>
              </div>
            ))}
          </div>
        ) : newestArrivals.length === 0 ? (
          /* Empty State */
          <div className="w-full border border-gray-200 bg-gray-50 p-12 text-center flex flex-col items-center justify-center">
            <p className="text-gray-500 font-medium tracking-wide uppercase text-sm">
              No new arrivals at the moment.
            </p>
            <Link
              href="/store"
              className="mt-4 text-sm font-bold text-gray-900 underline underline-offset-4"
            >
              Explore Store
            </Link>
          </div>
        ) : (
          /* Product Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {newestArrivals.map((product) => {
              const offerPercentage = product.offer_percentage ?? 0;
              const hasOffer = offerPercentage > 0;
              const originalPrice = hasOffer
                ? product.price / (1 - offerPercentage / 100)
                : null;

              return (
                <Link
                  key={product.id}
                  href={`/store/product/${product.id}`}
                  className="group flex flex-col h-full"
                >
                  {/* Image Container */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-4">
                    {/* Status Badge */}
                    {!product.is_active && (
                      <span className="absolute top-3 left-3 z-10 bg-black text-white text-[10px] font-bold tracking-[0.15em] uppercase px-3 py-1.5 shadow-sm">
                        Sold Out
                      </span>
                    )}
                    {/* Tag badge from backend (optional) */}
                    {product.tag && (
                      <span className="absolute top-3 left-3 z-10 bg-[#4A8E9A] text-white text-[10px] font-bold tracking-[0.15em] uppercase px-3 py-1.5 shadow-sm">
                        {product.tag}
                      </span>
                    )}
                    {/* Offer / fallback badge */}
                    {hasOffer ? (
                      <span className="absolute top-3 right-3 z-10 bg-[#E11D48] text-white text-[10px] font-bold tracking-[0.15em] uppercase px-3 py-1.5 shadow-sm">
                        -{Math.round(offerPercentage)}%
                      </span>
                    ) : product.is_active ? (
                      <span className="absolute top-3 right-3 z-10 bg-white text-gray-900 text-[10px] font-bold tracking-[0.15em] uppercase px-3 py-1.5 shadow-sm">
                        New
                      </span>
                    ) : null}

                    <img
                      src={
                        product.image_url ||
                        "/images/products/product-placeholder.jpg"
                      }
                      alt={product.name}
                      className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-105 mix-blend-multiply"
                    />

                    {/* Quick Add Hover Overlay (Optional touch of premium UX) */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out translate-y-4 group-hover:translate-y-0">
                      <button className="w-10 h-10 bg-black text-white flex items-center justify-center hover:bg-gray-800 transition-colors shadow-lg">
                        <Heart className="w-4 h-4" strokeWidth={2} />
                      </button>
                      <button className="w-10 h-10 bg-black text-white flex items-center justify-center hover:bg-gray-800 transition-colors shadow-lg delay-75">
                        <Eye className="w-4 h-4" strokeWidth={2} />
                      </button>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="flex flex-col flex-1 space-y-1.5">
                    <h3 className="text-sm font-medium text-gray-900 hover:text-primary uppercase tracking-wide truncate">
                      {product.name}
                    </h3>

                    {/* Price */}
                    <div className="flex items-center gap-2 pt-0.5">
                      {hasOffer && originalPrice && (
                        <span className="text-xs text-[#E11D48] line-through">
                          Rs{" "}
                          {originalPrice.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                      )}
                      <span className="text-sm font-medium text-gray-900">
                        Rs{" "}
                        {product.price.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>

                    {/* Installment Info */}
                    <p className="text-[11px] text-gray-500 mt-auto pt-2 leading-relaxed">
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
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Mobile View All Button */}
        <div className="mt-10 sm:hidden flex justify-center">
          <Link
            href="/new"
            className="w-full text-center border border-gray-900 py-3 text-sm font-bold uppercase tracking-widest text-gray-900 hover:bg-gray-900 hover:text-white transition-colors"
          >
            View All Arrivals
          </Link>
        </div>
      </div>
    </section>
  );
}

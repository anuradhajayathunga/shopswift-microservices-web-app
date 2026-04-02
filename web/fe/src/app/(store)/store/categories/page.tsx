"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Heart,
  Eye,
  SlidersHorizontal,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { HiSquares2X2, HiMiniSquares2X2 } from "react-icons/hi2";
import { toast } from "sonner";
import { publicProductAPI, type PublicProduct } from "@/lib/public-products";
import Header from "@/app/components/store/Header";
import Footer from "@/app/components/store/Footer";

function PromoBanner() {
  const promoItems = Array.from({ length: 12 });

  return (
    <div className="w-full bg-black text-white py-3.5 overflow-hidden flex whitespace-nowrap border-b border-gray-900">
      <div className="promo-marquee-track">
        {[0, 1].map((copyIndex) => (
          <div
            key={copyIndex}
            className="promo-marquee-content flex items-center gap-12 text-sm sm:text-base font-bold tracking-[0.15em] uppercase"
          >
            {promoItems.map((_, itemIndex) => (
              <span key={`${copyIndex}-${itemIndex}`} className="shrink-0">
                UPTO 40% OFF
              </span>
            ))}
          </div>
        ))}
      </div>

      <style jsx>{`
        .promo-marquee-track {
          display: flex;
          width: max-content;
          animation: promo-marquee-right 18s linear infinite;
          will-change: transform;
        }

        @keyframes promo-marquee-right {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}

type CollectionGridProps = {
  products: PublicProduct[];
  isLoading?: boolean;
};

export function CollectionGrid({
  products,
  isLoading = false,
}: CollectionGridProps) {
  const PRODUCTS_PER_PAGE = 8;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(
    1,
    Math.ceil(products.length / PRODUCTS_PER_PAGE),
  );
  const activePage = Math.min(currentPage, totalPages);
  const paginatedProducts = products.slice(
    (activePage - 1) * PRODUCTS_PER_PAGE,
    activePage * PRODUCTS_PER_PAGE,
  );

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) {
      return;
    }
    setCurrentPage(page);
  };

  return (
    <section className="w-full bg-white pb-24 font-sans">
      {/* Utility Toolbar */}
      <div className="w-full bg-gray-50 border-b border-gray-200 sticky top-0 z-20">
        <div className="container mx-auto px-4 md:px-8 max-w-[1600px]">
          <div className="flex items-center justify-between h-16 text-xs font-bold tracking-[0.1em] uppercase text-gray-900">
            {/* Left: Filter Button */}
            <button className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 hover:border-gray-400 transition-colors shadow-sm">
              <SlidersHorizontal className="w-4 h-4" strokeWidth={2} />
              Filter
            </button>

            {/* Center: Grid Views (Hidden on mobile) */}
            <div className="hidden md:flex items-center gap-4 text-gray-300">
              <button className="hover:text-gray-900 transition-colors">
                <div className="flex gap-0.5">
                  <div className="w-1.5 h-3.5 bg-current rounded-[1px]"></div>
                  <div className="w-1.5 h-3.5 bg-current rounded-[1px]"></div>
                </div>
              </button>
              <button className="text-gray-900">
                <HiSquares2X2 className="w-4 h-4" />
              </button>
              <button className="hover:text-gray-900 transition-colors">
                <HiMiniSquares2X2 className="w-4 h-4" />
              </button>
            </div>

            {/* Right: Sort Dropdown */}
            <button className="flex items-center justify-between gap-4 bg-white border border-gray-200 px-4 py-2 hover:border-gray-400 transition-colors shadow-sm min-w-[160px]">
              Best selling
              <ChevronDown className="w-4 h-4 text-gray-500" strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid Area */}
      <div className="container mx-auto px-4 md:px-8 max-w-[1600px] pt-10">
        {/* Loading State */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 lg:gap-x-6 lg:gap-y-14">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="flex flex-col gap-4 animate-pulse">
                <div className="aspect-[3/4] bg-gray-100 rounded-sm" />
                <div className="space-y-3">
                  <div className="h-4 w-3/4 bg-gray-200" />
                  <div className="h-4 w-1/3 bg-gray-200" />
                  <div className="h-3 w-2/3 bg-gray-100 mt-2" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          /* Empty State */
          <div className="w-full border border-gray-200 bg-gray-50 p-16 text-center flex flex-col items-center justify-center min-h-[500px]">
            <p className="text-gray-500 font-medium tracking-wide uppercase text-sm">
              No products found in this collection.
            </p>
          </div>
        ) : (
          /* Product Grid */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 lg:gap-x-6 lg:gap-y-14">
            {paginatedProducts.map((product) => {
              const offerPercentage = product.offer_percentage ?? 0;
              const isDiscounted = offerPercentage > 0;
              const originalPrice = isDiscounted
                ? product.price / (1 - offerPercentage / 100)
                : product.price;
              const discountPercentage = isDiscounted
                ? Math.round(offerPercentage)
                : 0;

              return (
                <div
                  key={product.id}
                  className="group flex flex-col h-full bg-transparent"
                >
                  {/* Image Container */}
                  <Link
                    href={`/store/product/${product.id}`}
                    className="relative aspect-[3/4] overflow-hidden bg-[#F4F4F4] mb-4 block rounded-sm"
                  >
                    {/* Badges */}
                    <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 items-end">
                      {isDiscounted && (
                        <span className="bg-[#E11D48] text-white text-[10px] sm:text-xs font-bold tracking-[0.1em] px-2.5 py-1 shadow-sm">
                          -{discountPercentage}%
                        </span>
                      )}
                      {product.tag && (
                        <span className="bg-black text-white text-[10px] sm:text-xs font-bold tracking-[0.1em] px-2.5 py-1 shadow-sm uppercase">
                          {product.tag}
                        </span>
                      )}
                      {product.is_active && !isDiscounted && !product.tag && (
                        <span className="bg-[#4ED1C1] text-white text-[10px] sm:text-xs font-bold tracking-[0.1em] px-2.5 py-1 shadow-sm uppercase">
                          New
                        </span>
                      )}
                    </div>

                    <img
                      src={
                        product.image_url ||
                        "/images/products/product-placeholder.jpg"
                      }
                      alt={product.name}
                      className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-105 mix-blend-multiply"
                    />

                    {/* Hover Action Buttons */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out translate-y-4 group-hover:translate-y-0">
                      <button className="w-10 h-10 bg-white text-gray-900 flex items-center justify-center hover:bg-gray-900 hover:text-white transition-colors shadow-lg rounded-sm">
                        <Heart className="w-4 h-4" strokeWidth={2} />
                      </button>
                      <button className="w-10 h-10 bg-white text-gray-900 flex items-center justify-center hover:bg-gray-900 hover:text-white transition-colors shadow-lg rounded-sm">
                        <Eye className="w-4 h-4" strokeWidth={2} />
                      </button>
                    </div>
                  </Link>

                  {/* Product Info */}
                  <div className="flex flex-col flex-1 space-y-1">
                    <Link href={`/store/product/${product.id}`}>
                      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider truncate hover:text-gray-500 transition-colors">
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
                        <span className="text-xs font-bold text-[#E11D48] line-through opacity-80">
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
                    <div className="flex items-center gap-2 pt-3 mt-auto">
                      <div className="w-4 h-4 bg-[#4A4A4A] border border-gray-200 cursor-pointer hover:border-gray-900 transition-colors"></div>
                      <div className="w-4 h-4 bg-[#E8E8DE] border border-gray-300 cursor-pointer hover:border-gray-900 transition-colors"></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && products.length > 0 && (
          <div className="flex items-center justify-start gap-2 mt-20 border-t border-gray-200 pt-8">
            {Array.from({ length: totalPages }).map((_, index) => {
              const pageNumber = index + 1;
              const isActive = pageNumber === activePage;

              return (
                <button
                  key={pageNumber}
                  onClick={() => goToPage(pageNumber)}
                  className={`w-10 h-10 flex items-center justify-center border font-medium text-sm transition-colors ${
                    isActive
                      ? "border-transparent bg-black text-white hover:bg-gray-800"
                      : "border border-gray-200 bg-gray-50 text-gray-900 hover:border-gray-900"
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}
            <button
              onClick={() => goToPage(activePage + 1)}
              disabled={activePage >= totalPages}
              className="w-10 h-10 flex items-center justify-center border border-transparent bg-black text-white hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
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
    <div className="w-full min-h-screen bg-white flex flex-col font-sans">
      <Header />
      <main className="flex-1">
        <PromoBanner />
        <CollectionGrid products={products} isLoading={isLoading} />
      </main>
      <Footer />
    </div>
  );
}

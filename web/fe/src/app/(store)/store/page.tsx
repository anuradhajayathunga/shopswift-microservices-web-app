"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Loader2, Search, ShoppingBag, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { publicProductAPI, type PublicProduct } from "@/lib/public-products";

// Layout Components
import Header from "@/app/components/store/Header";
import Footer from "@/app/components/store/Footer";
import { ScrollToTop } from "@/app/components/shared/ScrollToTop";

// Page Sections
import { HeroBanner, PromoSplit } from "@/app/components/store/HeroSections";
import { ProductGrid } from "@/app/components/store/ProductGrid";
import { ShopByCategory } from "@/app/components/store/ShopByCategory";
import { InstagramGrid } from "@/app/components/store/InstagramGrid";
import { FaqAndNewsletter } from "@/app/components/store/FaqSection";

export default function StorePage() {
  const [products, setProducts] = useState<PublicProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await publicProductAPI.list();
        setProducts(data);
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Unable to load products right now",
        );
      } finally {
        setIsLoading(false);
      }
    };

    void loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) {
      return products;
    }

    return products.filter((product) => {
      return (
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.sku.toLowerCase().includes(query)
      );
    });
  }, [products, searchTerm]);

  return (
    <div className="w-full min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        <HeroBanner />

        <PromoSplit />

        <ShopByCategory />

        <ProductGrid products={products} isLoading={isLoading} />

        <InstagramGrid />

        <FaqAndNewsletter />
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  );
}

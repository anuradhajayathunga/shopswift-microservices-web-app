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

        <ProductGrid />

        {/* 5. The Full Searchable Catalog */}
        <section className="py-20 bg-muted/10 border-t border-border/40">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Catalog Header & Search */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
              <div className="space-y-3 max-w-2xl">
                <Badge className="bg-primary/10 text-primary hover:bg-primary/10 border-0 shadow-none font-semibold uppercase tracking-wider text-xs">
                  Full Collection
                </Badge>
                <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
                  Explore All Products
                </h2>
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                  Browse our complete catalog. Find specific items using the
                  search bar below or explore our entire inventory.
                </p>
              </div>

              <div className="w-full md:max-w-md relative">
                <Search className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search by name, SKU, or keyword..."
                  className="pl-10 h-12 bg-background shadow-sm border-border/60 rounded-xl focus-visible:ring-1"
                />
              </div>
            </div>

            {/* Catalog Grid */}
            <div className="max-w-7xl mx-auto">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-32 text-muted-foreground bg-background rounded-2xl border border-border/40">
                  <Loader2 className="size-8 animate-spin mb-4 text-primary/60" />
                  <p className="text-sm font-medium">Loading collection...</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 text-center bg-background rounded-2xl border border-border/40 px-4">
                  <div className="size-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <ShoppingBag className="size-8 text-muted-foreground/50" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    No products found
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    We couldn't find anything matching "{searchTerm}". Try
                    adjusting your search terms or browse our categories.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-6"
                    onClick={() => setSearchTerm("")}
                  >
                    Clear Search
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map((product) => (
                    <Card
                      key={product.id}
                      className="group overflow-hidden border-border/60 shadow-sm hover:shadow-md transition-all duration-300 bg-card flex flex-col rounded-2xl"
                    >
                      {/* Image Placeholder - Crucial for E-commerce Look */}
                      <div className="aspect-[4/5] bg-muted relative overflow-hidden">
                        <Badge
                          variant="secondary"
                          className="absolute top-3 right-3 z-10 bg-background/80 backdrop-blur-md shadow-sm border-0 font-medium text-[10px] uppercase"
                        >
                          {product.sku}
                        </Badge>
                        <img
                          src={`/api/placeholder/400/500`}
                          alt={product.name}
                          className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                      </div>

                      <CardHeader className="p-5 pb-2 space-y-1">
                        <CardTitle className="text-base font-semibold leading-snug line-clamp-1 group-hover:text-primary transition-colors">
                          {product.name}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                          {product.description}
                        </p>
                      </CardHeader>

                      <CardContent className="p-5 pt-2 flex flex-col flex-1 justify-end">
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-lg font-semibold text-foreground">
                            {new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: "USD",
                            }).format(product.price)}
                          </p>
                          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                            {product.stock > 0
                              ? `${product.stock} in stock`
                              : "Out of stock"}
                          </span>
                        </div>
                      </CardContent>

                      <CardFooter className="p-5 pt-0">
                        <Button
                          asChild
                          className="w-full bg-foreground text-background hover:bg-foreground/90 transition-colors group/btn"
                        >
                          <Link href={`/store/products/${product.id}`}>
                            View Details
                            <ArrowRight className="w-4 h-4 ml-2 opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all duration-300" />
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        <InstagramGrid />

        <FaqAndNewsletter />
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Loader2, Search, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { publicProductAPI, type PublicProduct } from "@/lib/public-products";
import  Header  from "@/app/components/store/Header";
import { HeroBanner, PromoSplit } from "@/app/components/store/HeroSections";
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
    <div className="min-h-screen bg-background">
                  <Header />
<HeroBanner />
        <PromoSplit />
      <section className="border-b border-border/70 bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="space-y-3">
            <Badge className="bg-primary/10 text-primary hover:bg-primary/10 border-0">
              ShopSwift Store
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
              Explore Products
            </h1>
            <p className="text-muted-foreground max-w-2xl text-sm sm:text-base">
              Browse active products from our catalog and place your order in a
              few clicks.
            </p>
          </div>

          <div className="mt-8 max-w-md relative">
            <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search products by name, SKU, or description"
              className="pl-9"
            />
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="size-5 animate-spin mr-2" />
            Loading products...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="rounded-xl border border-border/60 p-10 text-center bg-card">
            <ShoppingBag className="size-10 text-muted-foreground mx-auto mb-3" />
            <h2 className="text-lg font-semibold text-foreground mb-1">
              No products found
            </h2>
            <p className="text-sm text-muted-foreground">
              Try changing your search or come back later.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="border-border/60 shadow-sm">
                <CardHeader className="space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <CardTitle className="text-lg leading-snug">
                      {product.name}
                    </CardTitle>
                    <Badge
                      variant="secondary"
                      className="bg-muted text-muted-foreground"
                    >
                      {product.sku}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {product.description}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xl font-semibold text-foreground">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(product.price)}
                    </p>
                    <Badge
                      variant="outline"
                      className="border-border/70 text-muted-foreground"
                    >
                      Stock: {product.stock}
                    </Badge>
                  </div>
                  <Button asChild className="w-full">
                    <Link href={`/store/products/${product.id}`}>
                      View Details
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

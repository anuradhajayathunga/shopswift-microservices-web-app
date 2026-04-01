import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { PublicProduct } from "@/lib/public-products";

type ProductGridProps = {
  products: PublicProduct[];
  isLoading?: boolean;
};

export function ProductGrid({ products, isLoading = false }: ProductGridProps) {
  const newestArrivals = products.slice(0, 4);

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold tracking-tight">NEWEST ARRIVALS</h2>
        <Button variant="link" className="text-muted-foreground">
          View all <span className="ml-1">→</span>
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex flex-col gap-3 animate-pulse">
              <div className="aspect-[4/5] rounded-xl border border-border/50 bg-muted" />
              <div className="space-y-2">
                <div className="h-4 w-3/4 rounded bg-muted" />
                <div className="h-4 w-1/2 rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      ) : newestArrivals.length === 0 ? (
        <div className="rounded-xl border border-border/50 bg-muted/30 p-8 text-center text-muted-foreground">
          No products available yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newestArrivals.map((product) => (
            <Link
              key={product.id}
              href={`/store/product/${product.id}`}
              className="group flex flex-col gap-3"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-border/50 bg-muted">
                {!product.is_active && (
                  <Badge
                    variant="secondary"
                    className="absolute top-3 right-3 z-10 rounded-sm font-semibold"
                  >
                    Inactive
                  </Badge>
                )}
                <img
                  src="/api/placeholder/400/500"
                  alt={product.name}
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="space-y-1">
                <h3 className="text-sm font-medium leading-none line-clamp-1">
                  {product.name}
                </h3>
                {/* <p className="text-xs text-muted-foreground line-clamp-2">
                  {product.description}
                </p> */}
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground line-through decoration-muted-foreground/50">
                   {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "LKR",
                    }).format(product.price)}
                  </span>
                  <span className="font-semibold text-[#E11D48]">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "LKR",
                    }).format(product.price)}
                  </span>
                  
                </div>
                {/* <span className="text-muted-foreground line-through decoration-muted-foreground/50">
                          Rs {product.oldPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                        <span className="text-[#E11D48]">
                          Rs {product.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                      </div> */}
                {/* Fake Mintpay / Installment text */}
                <p className="text-[10px] sm:text-[11px] text-muted-foreground mt-1.5 leading-tight">
                  3 X{" "}
                  <span className="font-semibold text-foreground">
                    Rs{" "}
                    {(product.price / 3).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </span>{" "}
                  or 6% Cashback with{" "}
                  <span className="inline-flex items-center font-bold text-[#0F172A] italic tracking-tighter">
                    ///mintpay
                  </span>{" "}
                  <span className="inline-flex items-center justify-center size-3 rounded-full bg-muted-foreground text-background text-[8px] not-italic font-bold ml-0.5">
                    i
                  </span>
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

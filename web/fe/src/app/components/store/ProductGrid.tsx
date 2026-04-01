import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const NEW_ARRIVALS = [
  { id: 1, title: "Backline Authority T", price: 4950, oldPrice: null, image: "/api/placeholder/400/500", badge: null },
  { id: 2, title: "Free Form Long Sleeve", price: 4420, oldPrice: 5200, image: "/api/placeholder/400/500", badge: "-15%" },
  { id: 3, title: "Graphic Tank Fit", price: 3655, oldPrice: 4300, image: "/api/placeholder/400/500", badge: "-15%" },
  { id: 4, title: "Oversize Graphic Crop", price: 4635, oldPrice: 5150, image: "/api/placeholder/400/500", badge: "-10%" },
];

export function ProductGrid() {
  return (
    <section className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold tracking-tight">NEWEST ARRIVALS</h2>
        <Button variant="link" className="text-muted-foreground">View all <span className="ml-1">→</span></Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {NEW_ARRIVALS.map((product) => (
          <div key={product.id} className="group flex flex-col gap-3 cursor-pointer">
            {/* Image Container */}
            <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-border/50 bg-muted">
              {product.badge && (
                <Badge variant="destructive" className="absolute top-3 right-3 z-10 rounded-sm font-semibold">
                  {product.badge}
                </Badge>
              )}
              <img 
                src={product.image} 
                alt={product.title} 
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105" 
              />
            </div>

            {/* Product Info */}
            <div className="space-y-1">
              <h3 className="text-sm font-medium leading-none">{product.title}</h3>
              <div className="flex items-center gap-2 text-sm">
                {product.oldPrice && (
                  <span className="text-muted-foreground line-through">Rs {product.oldPrice.toLocaleString()}</span>
                )}
                <span className="font-semibold text-foreground">Rs {product.price.toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
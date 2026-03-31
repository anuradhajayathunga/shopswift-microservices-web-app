import { Button } from "@/components/ui/button";

export function HeroBanner() {
  return (
    <section className="container mx-auto px-4 py-6">
      <div className="relative w-full h-[60vh] min-h-[500px] rounded-2xl overflow-hidden border border-border/50 bg-muted flex items-center justify-center">
        {/* Replace with next/image */}
        <img src="/api/placeholder/1200/600" alt="Backyard Club" className="absolute inset-0 w-full h-full object-cover opacity-90" />
        
        {/* Overlay Content */}
        <div className="relative z-10 text-center space-y-4 bg-background/30 backdrop-blur-sm p-8 rounded-xl border border-white/10">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight drop-shadow-md">
            BACKYARD CLUB
          </h1>
          <p className="text-lg text-white/90 font-medium tracking-wide uppercase">Launching Soon</p>
        </div>
      </div>
    </section>
  );
}

export function PromoSplit() {
  return (
    <section className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-2xl overflow-hidden border border-border/50 bg-muted/20">
        <div className="relative h-[400px] bg-muted">
           <img src="/api/placeholder/600/400" alt="Promo" className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col items-center justify-center p-12 text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Celebrate Big. Save Bigger this Avurudu!</h2>
          <Button size="lg" className="rounded-full px-8">Shop Now</Button>
        </div>
      </div>
    </section>
  );
}
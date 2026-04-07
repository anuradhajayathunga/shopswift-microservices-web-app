"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function HeroBanner() {
  return (
    <section className="relative w-full h-[85vh] min-h-[600px] bg-slate-900 overflow-hidden font-sans">
      <div className="absolute inset-0 w-full h-full">
        <img
          src="https://scontent.fcmb12-1.fna.fbcdn.net/v/t39.30808-6/514976936_694275263589649_2848995649089914963_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=2a1932&_nc_ohc=eSQBeBEBMXgQ7kNvwHDuvk2&_nc_oc=AdoXrsvbv_ZDJpDO5AoR9Vva9SonbClGiCdSQ8xtFOw3LxO2xlhCx1blvZBNeW894zUlwUa7DEns_viiPPrCBhpn&_nc_zt=23&_nc_ht=scontent.fcmb12-1.fna&_nc_gid=-0ecaeO7XakhidMUPhX1LQ&_nc_ss=7a389&oh=00_Af2ayiAV-GJkKoPdreb6X91kvYwfq5qVxovpoiQLK0xTxg&oe=69DABC71"
          alt="New Collection"
          className="w-full h-full object-cover object-center opacity-90"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10">
        <span className="text-xs font-bold tracking-[0.2em] text-white uppercase mb-4 drop-shadow-md">
          New Arrival
        </span>
        <h1 className="text-5xl md:text-7xl font-medium tracking-tight text-white mb-6 uppercase drop-shadow-lg">
          The Backyard <br className="hidden sm:block" /> Club
        </h1>
        <p className="text-base md:text-lg text-white/90 mb-10 max-w-md font-light drop-shadow-md">
          Redefining streetwear with premium cuts and bold graphics. Designed
          for the everyday rotation.
        </p>

        <Button
          asChild
          className="h-14 px-10 rounded-none bg-white text-slate-900 hover:bg-gray-100 font-bold tracking-widest uppercase transition-colors shadow-xl"
        >
          <Link href="/store">Shop Now</Link>
        </Button>
      </div>
    </section>
  );
}

export function PromoSplit() {
  return (
    <section className="w-full border-y border-gray-200 bg-white font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Image Side */}
        <div className="relative aspect-square lg:aspect-auto lg:h-[800px] bg-gray-100 overflow-hidden">
          <div className="w-1/4"/>
          <img
            src="/images/products/promotion/offers.png"
            alt="Avurudu Promotion"
            className="w-full h-full object-contain object-center transition-transform duration-1000 hover:scale-105"
          />
        </div>

        {/* Content Side */}
        <div className="flex flex-col items-center justify-center p-12 md:p-24 text-center bg-[#fafafa]">
          <div className="max-w-md space-y-6">
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-gray-500 block">
              Festive Campaign
            </span>

            <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-gray-900 uppercase leading-[1.1]">
              Tradition <br /> Meets Street
            </h2>

            <p className="text-gray-600 leading-relaxed text-sm md:text-base font-light">
              Celebrate big and save bigger this Avurudu season. Refresh your
              wardrobe with our exclusive holiday drops and limited-time
              discounts.
            </p>

            <div className="pt-4">
              <Button
                asChild
                className="h-12 px-8 rounded-none bg-slate-900 text-white hover:bg-slate-800 font-medium tracking-widest uppercase transition-colors group"
              >
                <Link href="/sale" className="flex items-center gap-2">
                  Unlock Offers{" "}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight, Mail } from "lucide-react";

export function FaqAndNewsletter() {
  return (
    <section className="w-full bg-white border-t border-gray-200 font-sans">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        {/* Split Layout with Divider on Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left: Benefits / FAQ */}
          <div className="py-16 lg:pr-16 lg:py-24 space-y-10">
            <div className="space-y-3">
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-gray-500">
                The Club
              </span>
              <h2 className="text-3xl md:text-4xl font-medium uppercase tracking-tight text-gray-900">
                Why join hype Società?
              </h2>
            </div>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem
                value="item-1"
                className="border-b border-gray-200"
              >
                <AccordionTrigger className="text-sm font-medium uppercase tracking-wider text-gray-900 hover:text-gray-500 transition-colors py-5 hover:no-underline">
                  Early Access to Drops
                </AccordionTrigger>
                <AccordionContent className="text-gray-500 text-sm leading-relaxed pb-5">
                  Get notified before anyone else when new collections go live.
                  Secure limited-edition pieces before they reach the general
                  public.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-2"
                className="border-b border-gray-200"
              >
                <AccordionTrigger className="text-sm font-medium uppercase tracking-wider text-gray-900 hover:text-gray-500 transition-colors py-5 hover:no-underline">
                  Exclusive Discounts & Offers
                </AccordionTrigger>
                <AccordionContent className="text-gray-500 text-sm leading-relaxed pb-5">
                  Members receive special pricing during holiday events,
                  birthday rewards, and unannounced VIP flash sales.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-3"
                className="border-b border-gray-200"
              >
                <AccordionTrigger className="text-sm font-medium uppercase tracking-wider text-gray-900 hover:text-gray-500 transition-colors py-5 hover:no-underline">
                  Priority Notifications
                </AccordionTrigger>
                <AccordionContent className="text-gray-500 text-sm leading-relaxed pb-5">
                  Skip the queue with our premium notification system via SMS
                  and dedicated insider email channels.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Right: Newsletter Editorial Block */}
          <div className="py-16 lg:pl-16 lg:py-24 flex flex-col justify-center">
            {/* Solid Dark Block replacing the generic Card */}
            <div className="bg-white text-slate-900 p-8 sm:p-12 md:p-14 relative overflow-hidden shadow-md">
              {/* Subtle background decoration */}
              <div className="absolute -top-0 -right-20 opacity-5 transform rotate-12 pointer-events-none">
                <Mail className="w-64 h-64" />
              </div>

              <div className="relative z-10 space-y-6">
                <h3 className="text-2xl md:text-3xl font-medium tracking-tight text-slate-900 uppercase">
                  Join The Inner Circle
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed max-w-md font-light">
                  Sign up to get first dibs on new arrivals, sales, and
                  exclusive insider-only offers delivered straight to your
                  inbox.
                </p>

                <form
                  className="pt-6 space-y-4"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <div className="relative">
                    <Input
                      type="email"
                      placeholder="ENTER EMAIL ADDRESS"
                      className="w-full !bg-transparent border-0 border-b border-gray-600 rounded-none px-0 py-4 text-sm tracking-widest text-gray-900 placeholder:text-gray-900 dark:placeholder:text-gray-900 focus-visible:ring-0 focus-visible:border-white transition-colors h-12 shadow-none autofill:!bg-transparent"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-14 rounded-none bg-slate-800 text-white  hover:bg-slate-900 font-bold tracking-widest uppercase mt-4 transition-colors group"
                  >
                    Subscribe
                    <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </form>

                <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-8 pt-6 border-t border-gray-800/50 text-center lg:text-left">
                  By subscribing, you agree to our Terms & Privacy Policy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

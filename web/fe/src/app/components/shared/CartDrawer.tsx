"use client";

import Link from "next/link";
import { ShoppingBag, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function CartDrawer() {
  return (
    <Sheet>
      {/* The Trigger - This is the cart icon that sits in your Header */}
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground transition-colors">
          <ShoppingBag className="w-5 h-5" />
          {/* Optional: Add a notification dot if items are in cart */}
          {/* <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-foreground rounded-full border-2 border-background"></span> */}
        </Button>
      </SheetTrigger>

      {/* The Drawer Content */}
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0 border-l border-border/50">
        
        {/* Header Section */}
        <SheetHeader className="px-6 py-5 border-b border-border/40 flex flex-row items-center justify-between space-y-0 text-left">
          <SheetTitle className="text-lg font-medium tracking-tight text-foreground">
            Shopping cart
          </SheetTitle>
          {/* Note: Shadcn automatically handles the "X" close button internally, 
              but you can customize it if you want to override their default. */}
        </SheetHeader>

        {/* Body Section - Empty State */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
          <h2 className="text-2xl font-medium tracking-tight text-foreground mb-3">
            Your cart is empty
          </h2>
          <p className="text-sm text-muted-foreground mb-8 max-w-[280px] leading-relaxed">
            You may check out all the available products and buy some in the shop
          </p>
          
          {/* The Outlined SaaS Button */}
          <SheetTrigger asChild>
            <Button 
              asChild 
              variant="outline" 
              className="h-11 px-8 rounded-md font-medium border-border/60 hover:bg-muted/50 transition-colors group"
            >
              <Link href="/">
                Return to shop
                <ArrowUpRight className="w-4 h-4 ml-2 text-muted-foreground group-hover:text-foreground transition-colors" />
              </Link>
            </Button>
          </SheetTrigger>
        </div>

      </SheetContent>
    </Sheet>
  );
}
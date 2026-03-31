"use client";

import Link from "next/link";
import { Search, User, Heart, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Left / Logo */}
        <Link href="/" className="text-xl font-bold tracking-tighter flex items-center gap-2">
          {/* Replace with actual SVG Logo */}
          <div className="w-8 h-8 bg-foreground rounded-md flex items-center justify-center text-background text-xs font-bold">CX</div>
          CALISTA
        </Link>

        {/* Center Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link href="/new" className="text-muted-foreground hover:text-foreground transition-colors">NEW DROPS</Link>
          <Link href="/category" className="text-muted-foreground hover:text-foreground transition-colors">CATEGORY</Link>
          <Link href="/sale" className="text-muted-foreground hover:text-foreground transition-colors">SAVE BIG</Link>
          <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">ABOUT</Link>
        </nav>

        {/* Right Icons */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground"><Search className="w-5 h-5" /></Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground"><User className="w-5 h-5" /></Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground"><Heart className="w-5 h-5" /></Button>
          <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-foreground rounded-full border-2 border-background"></span>
          </Button>
        </div>
      </div>
    </header>
  );
}
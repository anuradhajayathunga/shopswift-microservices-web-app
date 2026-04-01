"use client";

import Link from "next/link";
import { ArrowUpRight, ChevronUp, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-muted/0 pt-16 pb-8 border-t border-border/40">
      <div className="container mx-auto px-4 md:px-6">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8 mb-16">
          {/* Column 1: Brand & Contact (Takes up 4 columns on large screens) */}
          <div className="md:col-span-12 lg:col-span-4 flex flex-col space-y-6">
            {/* Logo */}
            <Link href="/" className="inline-block">
              {/* Replace with your actual SVG logo. Using a placeholder text logo for now to match the vibe */}
              <div className="flex flex-col">
                <div className="w-16 h-8 bg-foreground flex items-center justify-center mb-1">
                  <span className="text-background text-xs font-bold tracking-widest">
                    XX
                  </span>
                </div>
                <span className="font-extrabold text-xl tracking-tight text-foreground">
                  hype
                </span>
              </div>
            </Link>

            {/* Contact Info */}
            <div className="text-sm text-muted-foreground space-y-2.5 leading-relaxed">
              <p>
                Email:{" "}
                <a
                  href="mailto:info@hypeclothing.com"
                  className="text-foreground font-medium hover:underline"
                >
                  info@hypeclothing.com
                </a>
              </p>
              <p>Store : 282 Park Road, Colombo 05</p>
              <p>10.00am – 8.00pm Monday – Sunday</p>
              <p>
                Phone:{" "}
                <span className="text-foreground font-medium">
                  077 840 9997
                </span>
              </p>
            </div>

            {/* Flagship Link */}
            <Link
              href="/store"
              className="inline-flex items-center text-sm font-semibold text-foreground hover:underline underline-offset-4"
            >
              Flagship Store
              <ArrowUpRight className="ml-1 w-4 h-4" />
            </Link>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full w-10 h-10 border-border/60 hover:bg-muted/50 text-foreground"
                asChild
              >
                <Link href="#" aria-label="Facebook">
                  <MessageCircle className="w-4 h-4" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full w-10 h-10 border-border/60 hover:bg-muted/50 text-foreground"
                asChild
              >
                <Link href="#" aria-label="Instagram">
                  <MessageCircle className="w-4 h-4" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full w-10 h-10 border-border/60 hover:bg-muted/50 text-foreground"
                asChild
              >
                <Link href="#" aria-label="TikTok">
                  {/* Custom TikTok SVG since Lucide doesn't have it natively */}
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4"
                  >
                    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                  </svg>
                </Link>
              </Button>
            </div>
          </div>

          {/* Column 2: Support Links (Takes up 3 columns) */}
          <div className="md:col-span-5 lg:col-span-3">
            <h3 className="text-base font-semibold text-foreground mb-6">
              Support
            </h3>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Terms and Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/exchange-policy"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Exchange Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Newsletter (Takes up 5 columns) */}
          <div className="md:col-span-7 lg:col-span-5 flex flex-col">
            <h3 className="text-base font-semibold text-foreground mb-6">
              Sign Up for Email
            </h3>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed max-w-md">
              Sign up to get first dibs on new arrivals, sales, exclusive offers
              and many more!
            </p>

            {/* SaaS Style Newsletter Input */}
            <form className="flex w-full max-w-md bg-background border border-border/60 p-1.5 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 rounded-md shadow-sm transition-all">
              <Input
                type="email"
                placeholder="Enter email address"
                className="border-0 shadow-none focus-visible:ring-0 bg-transparent px-3 text-sm flex-1"
                required
              />
              <Button
                type="submit"
                className="shrink-0 h-10 px-6 rounded font-medium"
              >
                Subscribe
                <ArrowUpRight className="ml-1.5 w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>

        {/* Separator */}
        <Separator className="bg-border/40 mb-8" />

        {/* Bottom Bar: Copyright, Payments, Scroll to Top */}
        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-6 relative">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            © {new Date().getFullYear()} hype Clothing. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            {/* Custom Payment Icons to match the screenshot perfectly without needing image files */}
            <div className="flex gap-2">
              <div className="h-8 w-12 bg-background border border-border/60 rounded flex items-center justify-center">
                {/* Visa Approximation */}
                <span className="text-[#1A1F71] font-bold italic text-[11px] tracking-wider">
                  VISA
                </span>
              </div>
              <div className="h-8 w-12 bg-background border border-border/60 rounded flex items-center justify-center relative overflow-hidden">
                {/* Mastercard Approximation */}
                <div className="w-5 h-5 bg-[#EB001B] rounded-full absolute left-1.5 opacity-90 mix-blend-multiply"></div>
                <div className="w-5 h-5 bg-[#F79E1B] rounded-full absolute right-1.5 opacity-90 mix-blend-multiply"></div>
              </div>
            </div>

            {/* Scroll to top button */}
            {/* <Button
              variant="outline"
              size="icon"
              onClick={scrollToTop}
              className="absolute right-0 bottom-full mb-12 md:static md:mb-0 w-10 h-10 border-border/60 bg-background hover:bg-muted shadow-sm transition-all"
              aria-label="Scroll to top"
            >
              <ChevronUp className="w-5 h-5 text-foreground" />
            </Button> */}
          </div>
        </div>
      </div>
    </footer>
  );
}

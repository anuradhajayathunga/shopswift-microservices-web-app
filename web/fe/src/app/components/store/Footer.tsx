"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa6";
import { useTheme } from "next-themes";

export default function Footer() {
  const { theme } = useTheme();

  return (
    <footer className="w-full bg-white border-t border-gray-200 font-sans pt-20 pb-10">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8 mb-20">
          {/* Column 1: Brand & Contact (4 cols) */}
          <div className="md:col-span-12 lg:col-span-4 flex flex-col space-y-8">
            {/* Minimalist Logo */}
            <Link href="/store" className="inline-block">
              {/* Fallback text logo if SVG fails, styled to match the screenshot */}
              {/* <span className="text-3xl font-black tracking-widest uppercase text-slate-900">
                CALISTA
              </span> */}
              <img
                src={
                  theme === "dark"
                    ? "/images/logos/dark-logo.svg"
                    : "/images/logos/light-logo.svg"
                }
                alt="Hype Logo"
                width={120}
                height={40}
                className="h-10 w-auto"
              />
            </Link>

            {/* Contact Info */}
            <div className="text-sm text-gray-500 space-y-3 font-light leading-relaxed">
              <p>
                Email:{" "}
                <a
                  href="mailto:info@hypeclothing.com"
                  className="text-gray-900 font-medium hover:underline underline-offset-4 transition-all"
                >
                  info@hypeclothing.com
                </a>
              </p>
              <p>Store: 282 Park Road, Colombo 05</p>
              <p>10.00am – 8.00pm Monday – Sunday</p>
              <p>
                Phone:{" "}
                <span className="text-gray-900 font-medium">077 840 9997</span>
              </p>
            </div>

            {/* Flagship Link */}
            <Link
              href="/store"
              className="group inline-flex items-center text-xs font-bold tracking-[0.15em] uppercase text-gray-900 hover:text-gray-500 transition-colors"
            >
              Flagship Store
              <ArrowUpRight className="ml-1 w-4 h-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <Link
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="group inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition-all duration-200 hover:border-gray-900 hover:text-gray-900 hover:shadow-sm"
              >
                <FaFacebookF className="h-4.5 w-4.5 transition-transform duration-200 group-hover:scale-105" />
              </Link>
              <Link
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="group inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition-all duration-200 hover:border-gray-900 hover:text-gray-900 hover:shadow-sm"
              >
                <FaInstagram className="h-5 w-5 transition-transform duration-200 group-hover:scale-105" />
              </Link>
              <Link
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="group inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition-all duration-200 hover:border-gray-900 hover:text-gray-900 hover:shadow-sm"
              >
                <FaTiktok className="h-4.5 w-4.5 transition-transform duration-200 group-hover:scale-105" />
              </Link>
            </div>
          </div>

          {/* Column 2: Support Links (3 cols) */}
          <div className="md:col-span-5 lg:col-span-3 lg:pl-8">
            <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-gray-900 mb-8">
              Support
            </h3>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                >
                  Terms and Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/exchange-policy"
                  className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                >
                  Exchange Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Newsletter (5 cols) */}
          <div className="md:col-span-7 lg:col-span-5 flex flex-col lg:pl-8">
            <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-gray-900 mb-8">
              The Insider
            </h3>
            <p className="text-sm text-gray-500 mb-8 leading-relaxed max-w-md font-light">
              Sign up to get first dibs on new arrivals, sales, exclusive offers
              and editorial content straight to your inbox.
            </p>

            {/* SaaS Editorial Style Newsletter Input */}
            <form
              className="flex w-full max-w-md relative"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="ENTER EMAIL ADDRESS"
                className="w-full bg-transparent border-0 border-b border-gray-300 px-0 py-3 text-sm tracking-widest text-gray-900 placeholder:text-gray-900 focus:ring-0 focus:border-gray-900 transition-colors outline-none"
                required
              />
              <button
                type="submit"
                className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-900 hover:text-gray-500 transition-colors p-2"
                aria-label="Subscribe"
              >
                <ArrowRight className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Payments */}
        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-6 pt-8 border-t border-gray-200">
          <p className="text-xs text-gray-500 tracking-wide text-center md:text-left">
            © {new Date().getFullYear()} HYPE CLOTHING. ALL RIGHTS RESERVED.
          </p>

          <div className="flex items-center gap-3">
            {/* Minimalist Payment Icons */}
            <div className="h-7 w-11 border border-gray-200 rounded-sm flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity">
              <span className="text-[#1A1F71] font-bold italic text-[9px] tracking-wider">
                VISA
              </span>
            </div>
            <div className="h-7 w-11 border border-gray-200 rounded-sm flex items-center justify-center relative overflow-hidden opacity-70 hover:opacity-100 transition-opacity">
              <div className="w-3.5 h-3.5 bg-[#EB001B] rounded-full absolute left-2 mix-blend-multiply"></div>
              <div className="w-3.5 h-3.5 bg-[#F79E1B] rounded-full absolute right-2 mix-blend-multiply"></div>
            </div>
            <div className="h-7 px-2 border border-gray-200 rounded-sm flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity text-[9px] font-bold tracking-tighter italic text-slate-800">
              mintpay
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

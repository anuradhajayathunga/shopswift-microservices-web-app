"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  PackageSearch,
  Package,
  LineChart,
  Settings,
  User,
  X,
  Home,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import FullLogo from "./shared/logo/FullLogo";
import { orderAPI } from "@/lib/orders";

export default function Sidebar({ isMobileMenuOpen, toggleMobileMenu }) {
  const pathname = usePathname();
  const [pendingOrderCount, setPendingOrderCount] = useState(0);

  useEffect(() => {
    const fetchPendingOrders = async () => {
      try {
        const orders = await orderAPI.list();
        const pendingCount = orders.filter(
          (order) => order.status === "pending",
        ).length;
        setPendingOrderCount(pendingCount);
      } catch (error) {
        console.error("Failed to fetch pending orders:", error);
      }
    };

    fetchPendingOrders();
    // Refresh pending orders count every 30 seconds for live updates
    const interval = setInterval(fetchPendingOrders, 30000);

    return () => clearInterval(interval);
  }, []);

  const mainNavItems = [
    { name: "Dashboard", path: "/", icon: <LayoutDashboard size={21} /> },
    {
      name: "Live Orders",
      path: "/orders",
      icon: <ShoppingCart size={21} />,
      badge: pendingOrderCount > 0 ? String(pendingOrderCount) : null,
      badgeVariant: "destructive",
    },
    {
      name: "Inventory",
      path: "/inventory",
      icon: <PackageSearch size={21} />,
    },
    // {
    //   name: "Notifications",
    //   path: "/notifications",
    //   icon: <Bell size={21} />,
    // },
    {
      name: "Products",
      path: "/products",
      icon: <Package size={21} />,
    },
    // {
    //   name: "AI Forecasts",
    //   path: "/forecasts",
    //   icon: <BrainCircuit size={21} />,
    //   badge: "Pro",
    //   badgeVariant: "secondary",
    // },
    // {
    //   name: "Waste Tracking",
    //   path: "/waste-reports",
    //   icon: <Leaf size={21} />,
    // },
    { name: "Analytics", path: "/analytics", icon: <LineChart size={21} /> },
  ];

  const bottomNavItems = [
    { name: "Profile", path: "/profile", icon: <User size={21} /> },
    { name: "Store", path: "/store", icon: <Home size={21} /> },
    { name: "Settings", path: "/settings", icon: <Settings size={21} /> },
  ];

  const NavLink = ({ item }) => {
    const isActive = pathname === item.path;

    return (
      <Link
        href={item.path}
        onClick={() => toggleMobileMenu(false)}
        className={cn(
          "flex items-center justify-between px-4 py-2.5 mt-1 rounded-md transition-all duration-200 group text-sm",
          isActive
            ? "bg-lightprimary text-primary"
            : "text-link dark:text-darklink hover:bg-lightprimary hover:text-primary",
        )}
      >
        <div className="flex items-center gap-3">
          <span className="shrink-0">{item.icon}</span>
          <span className="truncate flex-1">{item.name}</span>
        </div>

        {item.badge && (
          <span
            className={cn(
              "text-[10px] px-2 py-0.5 rounded-full font-medium animate-pulse",
              item.badgeVariant === "secondary"
                ? "bg-lightsecondary text-secondary"
                : " bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-900/50",
            )}
          >
            {item.badge}
          </span>
        )}
      </Link>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 xl:hidden transition-opacity duration-300"
          onClick={() => toggleMobileMenu(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed xl:static inset-y-0 left-0 z-50 flex flex-col transition-transform duration-300 ease-in-out bg-background w-[270px] shadow-boxShadow xl:shadow-none xl:border-r border-border",
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full xl:translate-x-0",
        )}
      >
        {/* Logo Section */}
        <div className="h-[70px] flex items-center justify-between px-6 shrink-0 overflow-hidden brand-logo">
          <div className="flex items-center">
            <FullLogo />
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => toggleMobileMenu(false)}
            className="xl:hidden text-muted-foreground hover:text-foreground hover:bg-accent h-8 w-8"
          >
            <X size={18} />
          </Button>
        </div>

        {/* Scrollable Navigation Area */}
        {/* Note: Using shadcn ScrollArea here instead of SimpleBar to keep your dependencies clean, but it visually acts the same */}
        <ScrollArea className="flex-1 min-h-0">
          <div className="px-6 py-4">
            {/* Main Menu */}
            <div className="mb-6">
              <p className="mb-1 leading-21 text-charcoal font-bold uppercase text-xs dark:text-darkcharcoal px-2">
                Main Menu
              </p>
              <nav className="flex flex-col">
                {mainNavItems.map((item) => (
                  <NavLink key={item.name} item={item} />
                ))}
              </nav>
            </div>

            {/* System Menu */}
            <div className="mb-6">
              <p className="mb-1 leading-21 text-charcoal font-bold uppercase text-xs dark:text-darkcharcoal px-2">
                System
              </p>
              <nav className="flex flex-col">
                {bottomNavItems.map((item) => (
                  <NavLink key={item.name} item={item} />
                ))}
              </nav>
            </div>
          </div>
        </ScrollArea>

        {/* Promo Box (Always bottom) */}
        <div className="px-6 pb-6 shrink-0">
          <div className="overflow-hidden">
            <div className="flex w-full bg-lightprimary rounded-lg p-6 relative">
              <div className="w-1/2 relative z-10">
                <h5 className="text-base font-bold text-charcoal dark:text-white">
                  Get 20% off with hype Pro!
                  {/* Upgrade for advanced
                  analytics, AI forecasts, and priority support. */}
                </h5>
                <Button className="whitespace-nowrap mt-3 text-[13px] bg-primary hover:bg-primary/90 text-white h-8 px-4">
                  Get Pro
                </Button>
              </div>
              <div className="w-1/2 absolute right-1 bottom-3 translate-x-4 scale-[1.5] shrink-0">
                <Image
                  src="/images/dashboard/offers.svg"
                  alt="rocket"
                  loading="eager"
                  width={50}
                  height={50}
                  className="w-auto h-auto object-contain drop-shadow-lg opacity-90"
                  style={{ width: "auto", height: "auto" }}
                />
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

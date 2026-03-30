"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  PackageSearch,
  LineChart,
  Settings,
  X,
  LogOut,
  BrainCircuit,
  Leaf,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Sidebar({
  isMobileMenuOpen,
  toggleMobileMenu,
  handleLogout,
  isCollapsed = false,
  onToggleCollapse,
}) {
  // 2. Changed useLocation to usePathname
  const pathname = usePathname();

  const mainNavItems = [
    { name: "Dashboard", path: "/", icon: <LayoutDashboard size={18} /> },
    {
      name: "Live Orders",
      path: "/orders",
      icon: <ShoppingCart size={18} />,
      badge: "12",
      badgeVariant: "destructive",
    },
    {
      name: "Inventory",
      path: "/inventory",
      icon: <PackageSearch size={18} />,
    },
    {
      name: "AI Forecasts",
      path: "/forecasts",
      icon: <BrainCircuit size={18} />,
      badge: "New",
      badgeVariant: "primary",
    },
    {
      name: "Waste Tracking",
      path: "/waste-reports",
      icon: <Leaf size={18} />,
    },
    { name: "Analytics", path: "/analytics", icon: <LineChart size={18} /> },
  ];

  const bottomNavItems = [
    { name: "Settings", path: "/settings", icon: <Settings size={18} /> },
  ];

  const NavLink = ({ item }) => {
    // 3. Update active check
    const isActive = pathname === item.path;

    const linkContent = (
      <Link
        href={item.path} // 4. Changed 'to' to 'href'
        onClick={() => toggleMobileMenu(false)}
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 group relative",
          isCollapsed ? "justify-center" : "",
          isActive
            ? "bg-[var(--sidebar-primary)] text-[var(--sidebar-primary-foreground)] shadow-md"
            : "text-[var(--sidebar-foreground-70)] hover:bg-[var(--sidebar-accent)] hover:text-[var(--sidebar-foreground)]",
        )}
      >
        {isActive && isCollapsed && (
          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[var(--sidebar-primary-foreground)] rounded-r-full" />
        )}
        <span
          className={cn(
            "shrink-0 transition-colors duration-200",
            isActive
              ? "text-[var(--sidebar-primary-foreground)]"
              : "text-[var(--sidebar-foreground-50)] group-hover:text-[var(--sidebar-foreground)]",
          )}
        >
          {item.icon}
        </span>
        {!isCollapsed && (
          <div className="flex flex-1 items-center justify-between">
            <span className="font-medium text-sm">{item.name}</span>
            {item.badge && (
              <Badge
                variant="outline"
                className={cn(
                  "text-[10px] px-1.5 py-0 h-5 font-semibold border-0",
                  item.badgeVariant === "destructive"
                    ? "bg-destructive text-destructive-foreground"
                    : "bg-[var(--sidebar-primary-foreground)] text-[var(--sidebar-primary)]",
                )}
              >
                {item.badge}
              </Badge>
            )}
          </div>
        )}
      </Link>
    );

    if (isCollapsed) {
      return (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
          <TooltipContent
            side="right"
            className="flex items-center gap-2 border-border shadow-premium"
          >
            {item.name}
            {item.badge && (
              <Badge
                variant="secondary"
                className="text-[10px] px-1.5 py-0 h-4"
              >
                {item.badge}
              </Badge>
            )}
          </TooltipContent>
        </Tooltip>
      );
    }
    return linkContent;
  };

  return (
    <TooltipProvider>
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => toggleMobileMenu(false)}
          aria-hidden="true"
        />
      )}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 flex flex-col transition-all duration-300 ease-in-out border-r border-[var(--sidebar-border)] bg-[var(--sidebar)]",
          isCollapsed ? "w-[80px]" : "w-[280px]",
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div
          className={cn(
            "h-16 flex items-center justify-between px-6  shrink-0",
            isCollapsed && "px-0 justify-center",
          )}
        >
          <Link
            href="/"
            className={cn(
              "flex items-center gap-3 font-bold tracking-tight text-[var(--sidebar-foreground)] transition-all duration-200",
              isCollapsed ? "text-lg" : "text-xl",
            )}
          >
            <div className="h-8 w-8 rounded-lg bg-[var(--sidebar-primary)] flex items-center justify-center text-[var(--sidebar-primary-foreground)] shadow-sm shrink-0">
              <Sparkles size={16} />
            </div>
            {!isCollapsed && (
              <span className="flex items-baseline whitespace-nowrap">
                AuraLink<span className="text-[var(--sidebar-primary)]">.</span>
              </span>
            )}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => toggleMobileMenu(false)}
            className="lg:hidden text-[var(--sidebar-foreground-70)] hover:text-[var(--sidebar-foreground)] hover:bg-[var(--sidebar-accent)] h-8 w-8"
          >
            <X size={18} />
          </Button>
        </div>

        <ScrollArea className="flex-1 py-6">
          <nav className={cn("px-4 space-y-1", isCollapsed && "px-2")}>
            {!isCollapsed && (
              <p className="text-xs font-semibold text-[var(--sidebar-foreground-40)] uppercase tracking-wider mb-4 px-2">
                Main Menu
              </p>
            )}
            {mainNavItems.map((item) => (
              <NavLink key={item.name} item={item} />
            ))}
          </nav>
          <Separator className="my-6 mx-4 w-auto bg-[var(--sidebar-border)]" />
          <nav className={cn("px-4 space-y-1", isCollapsed && "px-2")}>
            {!isCollapsed && (
              <p className="text-xs font-semibold text-[var(--sidebar-foreground-40)] uppercase tracking-wider mb-4 px-2">
                System
              </p>
            )}
            {bottomNavItems.map((item) => (
              <NavLink key={item.name} item={item} />
            ))}
          </nav>
        </ScrollArea>

        <div className="p-4 border-t border-[var(--sidebar-border)] shrink-0 flex flex-col gap-2 bg-[var(--sidebar)]">
          {onToggleCollapse && (
            <div className="hidden lg:flex justify-end pb-2 mb-2 border-b border-[var(--sidebar-border)]">
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggleCollapse}
                className="text-[var(--sidebar-foreground-50)] hover:text-[var(--sidebar-foreground)] hover:bg-[var(--sidebar-accent)] h-6 w-6 rounded-md"
              >
                {isCollapsed ? (
                  <ChevronRight size={14} />
                ) : (
                  <ChevronLeft size={14} />
                )}
              </Button>
            </div>
          )}
          <div
            className={cn(
              "flex items-center gap-3 rounded-md transition-colors",
              !isCollapsed && "p-2 hover:bg-[var(--sidebar-accent)]",
            )}
          >
            <Avatar className="h-9 w-9 border border-[var(--sidebar-border)] shadow-sm">
              <AvatarImage src="/avatars/user.jpg" alt="User" />
              <AvatarFallback className="bg-[var(--sidebar-primary)] text-[var(--sidebar-primary-foreground)] text-xs font-medium">
                JD
              </AvatarFallback>
            </Avatar>
            {!isCollapsed && (
              <>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--sidebar-foreground)] truncate">
                    John Doe
                  </p>
                  <p className="text-xs text-[var(--sidebar-foreground-50)] truncate">
                    admin@auralink.io
                  </p>
                </div>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={handleLogout}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-[var(--sidebar-foreground-50)] hover:text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <LogOut size={16} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Sign Out</TooltipContent>
                </Tooltip>
              </>
            )}
            {isCollapsed && (
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handleLogout}
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 h-8 w-8 text-[var(--sidebar-foreground-50)] hover:text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <LogOut size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">Sign Out</TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
      </aside>
    </TooltipProvider>
  );
}

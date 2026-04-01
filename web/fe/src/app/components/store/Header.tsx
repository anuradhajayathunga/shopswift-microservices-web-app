"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Search, User, Heart, ShoppingBag, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import FullLogo from "@/components/shared/logo/FullLogo";
import { CartDrawer } from "../shared/CartDrawer";
import { SearchOverlay } from "../shared/SearchOverlay";
import { useTheme } from "next-themes";
import { authAPI } from "@/lib/auth";
import {
  cartAPI,
  CART_UPDATED_EVENT,
  type CartUpdatedDetail,
} from "@/lib/cart";
import { LoginModal } from "@/app/(store)/store/auth/LoginModal";

export default function Header() {
  const { theme } = useTheme();
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isAuthPromptOpen, setIsAuthPromptOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [authUser, setAuthUser] = useState<{
    id?: number;
    name?: string;
    email?: string;
  } | null>(null);
  const categoryCloseTimer = useRef<NodeJS.Timeout | null>(null);

  const categoryItems = [
    { label: "BOLD GRAPHIC", href: "/category/bold-graphic" },
    { label: "TANKS", href: "/category/tanks" },
    {
      label: "MINIMAL PRINT T-SHIRTS",
      href: "/category/minimal-print-t-shirts",
    },
    { label: "MENS POLO PREMIUM", href: "/category/mens-polo-premium" },
    { label: "JOGGERS AND PANTS", href: "/category/joggers-and-pants" },
    { label: "NONAME SERIES", href: "/category/noname-series" },
  ];

  const openCategoryMenu = () => {
    if (categoryCloseTimer.current) {
      clearTimeout(categoryCloseTimer.current);
      categoryCloseTimer.current = null;
    }

    setIsCategoryOpen(true);
  };

  const closeCategoryMenu = () => {
    categoryCloseTimer.current = setTimeout(() => {
      setIsCategoryOpen(false);
      categoryCloseTimer.current = null;
    }, 120);
  };

  const handleLogout = () => {
    authAPI.clearToken();
    setAuthUser(null);
    setCartCount(0);
  };

  useEffect(() => {
    const loadAuthUser = async () => {
      if (!authAPI.isAuthenticated()) {
        setAuthUser(null);
        return;
      }

      const user = authAPI.getUser();
      if (!user) {
        setAuthUser(null);
        return;
      }

      if (user.email && (!user.id || !user.name)) {
        try {
          const fullUser = await authAPI.getUserByEmail(user.email);
          const mergedUser = { ...user, ...fullUser };
          authAPI.saveUser(mergedUser);
          setAuthUser(mergedUser);
          return;
        } catch {
          setAuthUser(user);
          return;
        }
      }

      setAuthUser(user);
    };

    const loadCartCount = async () => {
      if (!authAPI.isAuthenticated()) {
        setCartCount(0);
        return;
      }

      const user = authAPI.getUser();
      let userId = user?.id;

      if (!userId && user?.email) {
        try {
          const fullUser = await authAPI.getUserByEmail(user.email);
          authAPI.saveUser(fullUser);
          userId = fullUser.id;
        } catch {
          setCartCount(0);
          return;
        }
      }

      if (!userId) {
        setCartCount(0);
        return;
      }

      try {
        const items = await cartAPI.list(userId);
        setCartCount(items.reduce((total, item) => total + item.quantity, 0));
      } catch {
        setCartCount(0);
      }
    };

    const handleStorage = () => {
      void loadAuthUser();
      void loadCartCount();
    };

    const handleCartUpdated = (event: Event) => {
      void loadAuthUser();
      const detail = (event as CustomEvent<CartUpdatedDetail>).detail;
      const delta = detail?.delta;

      if (typeof delta === "number") {
        setCartCount((currentCount) => Math.max(0, currentCount + delta));
      }

      void loadCartCount();
    };

    void loadAuthUser();
    void loadCartCount();
    window.addEventListener(CART_UPDATED_EVENT, handleCartUpdated);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, handleCartUpdated);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto relative px-4 h-20 flex items-center justify-between ">
        {/* Left / Logo */}

        <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
          {/* <Link
            href="/"
            className="text-xl font-bold tracking-tighter flex items-center gap-2"
          >
            <div className="w-8 h-8 bg-foreground rounded-md flex items-center justify-center text-background text-xs font-bold">
              CX
            </div>
            hype
          </Link> */}
          <Link href="/store" className="inline-block">
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

          {/* Center Navigation */}
          <nav className="hidden md:flex items-center gap-8 mt-2 text-sm font-medium">
            <Link
              href="/new"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              NEW DROPS
            </Link>
            <DropdownMenu
              open={isCategoryOpen}
              onOpenChange={setIsCategoryOpen}
            >
              <DropdownMenuTrigger asChild>
                <button
                  className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                  onMouseEnter={openCategoryMenu}
                  onMouseLeave={closeCategoryMenu}
                >
                  CATEGORY
                  <ChevronDown className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="center"
                className="w-72 mt-2"
                onMouseEnter={openCategoryMenu}
                onMouseLeave={closeCategoryMenu}
              >
                {categoryItems.map((item) => (
                  <DropdownMenuItem key={item.href} asChild>
                    <Link
                      href={item.href}
                      className="w-full cursor-pointer text-sm font-medium"
                    >
                      {item.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Link
              href="/sale"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              SAVE BIG
            </Link>
            <Link
              href="/about"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              ABOUT
            </Link>
          </nav>
        </div>

        {/* Right Icons */}
        <div className="ml-auto flex items-center gap-4 ">
          <SearchOverlay>
            <span className="text-foreground hover:text-primary transition-colors cursor-pointer">
              <Search className="w-6 h-6" strokeWidth={2} />
            </span>
          </SearchOverlay>
          {authUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <span className="text-foreground hover:text-primary transition-colors cursor-pointer">
                  <User className="w-6 h-6" strokeWidth={2} />
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-64 mt-4 p-2 bg-background/80 max-w-[200px]"
              >
                <div className="px-2 py-2">
                  <p className="text-sm font-semibold text-foreground">
                    {authUser.name || "User"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {authUser.email || "No email"}
                  </p>
                </div>
                <DropdownMenuItem asChild>
                  {/* <Link href="/dashboard/profile" className="cursor-pointer">
                    My Profile
                  </Link> */}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer"
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <LoginModal>
                <span className="text-foreground hover:text-primary transition-colors cursor-pointer">
                  <User className="w-6 h-6" strokeWidth={1} />
                </span>
              </LoginModal>
            </>
          )}
          <span className="text-foreground hover:text-primary transition-colors cursor-pointer">
            <Heart className="w-6 h-6" strokeWidth={2} />
          </span>
          {/* <Button
            variant="ghost"
            size="icon"
            className="relative text-muted-foreground hover:text-foreground"
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-foreground rounded-full border-2 border-background"></span>
          </Button> */}
          <CartDrawer cartCount={cartCount} />
        </div>
      </div>
    </header>
  );
}

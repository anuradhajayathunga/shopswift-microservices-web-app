"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Search, User, Heart, ChevronDown } from "lucide-react";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CartDrawer } from "../shared/CartDrawer";
import { SearchOverlay } from "../shared/SearchOverlay";
import { LoginModal } from "@/app/(store)/store/auth/LoginModal";
import { authAPI } from "@/lib/auth";
import {
  cartAPI,
  CART_UPDATED_EVENT,
  type CartUpdatedDetail,
} from "@/lib/cart";

export default function Header() {
  const { theme } = useTheme();
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [authUser, setAuthUser] = useState<{
    id?: number;
    name?: string;
    email?: string;
  } | null>(null);
  const categoryCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    if (categoryCloseTimer.current) clearTimeout(categoryCloseTimer.current);
    setIsCategoryOpen(true);
  };

  const closeCategoryMenu = () => {
    categoryCloseTimer.current = setTimeout(
      () => setIsCategoryOpen(false),
      220,
    );
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
      if (categoryCloseTimer.current) clearTimeout(categoryCloseTimer.current);
      window.removeEventListener(CART_UPDATED_EVENT, handleCartUpdated);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  return (
    <>
      {/* Top Promotion Bar */}
      <div className="w-full bg-black text-white text-[11px] sm:text-xs font-medium tracking-[0.15em] uppercase py-2.5 px-4 text-center">
        Free island-wide delivery on orders over Rs 15,000
      </div>

      <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/90 backdrop-blur-md transition-all">
        <div className="container mx-auto px-4 lg:px-8 h-[90px] flex items-center justify-between">
          {/* Left Spacer (Balances the flex layout) */}
          <div className="hidden lg:flex w-1/3"></div>

          {/* Center / Logo & Navigation */}
          <div className="flex flex-col items-center justify-center w-full lg:w-1/3 gap-3">
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

            <nav className="hidden md:flex items-center gap-6 text-[11px] font-bold tracking-[0.1em] text-slate-600">
              <Link
                href="/new"
                className="hover:text-slate-900 transition-colors"
              >
                NEW DROPS
              </Link>
              <DropdownMenu open={isCategoryOpen}>
                <DropdownMenuTrigger asChild>
                  <button
                    className="flex items-center gap-1 hover:text-slate-900 transition-colors outline-none"
                    onMouseEnter={openCategoryMenu}
                    onMouseLeave={closeCategoryMenu}
                  >
                    CATEGORY <ChevronDown className="h-3 w-3" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="center"
                  sideOffset={4}
                  className="w-64 rounded-none border-gray-200 dark:bg-white shadow-xl"
                  onMouseEnter={openCategoryMenu}
                  onMouseLeave={closeCategoryMenu}
                >
                  {categoryItems.map((item) => (
                    <DropdownMenuItem
                      key={item.href}
                      asChild
                      className="rounded-none focus:bg-gray-50"
                    >
                      <Link
                        href={item.href}
                        className="w-full cursor-pointer text-xs font-medium uppercase tracking-wider py-3"
                      >
                        {item.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Link
                href="/sale"
                className="hover:text-slate-900 transition-colors"
              >
                SAVE BIG
              </Link>
              <Link
                href="/about"
                className="hover:text-slate-900 transition-colors"
              >
                ABOUT
              </Link>
            </nav>
          </div>

          {/* Right Icons */}
          <div className="flex items-center justify-end gap-5 w-1/3 text-slate-900">
            <SearchOverlay>
              <button className="hover:text-slate-500 transition-colors">
                <Search className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </SearchOverlay>

            {authUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="hover:text-slate-500 transition-colors">
                    <User className="w-5 h-5" strokeWidth={1.5} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 mt-4 border-gray-200 dark:bg-white rounded-none"
                >
                  <div className="px-3 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold">
                      {authUser.name || "User"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {authUser.email || "No email"}
                    </p>
                  </div>
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer text-sm py-3 rounded-none bg-transparent"
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <LoginModal>
                <button className="hover:text-slate-500 transition-colors">
                  <User className="w-5 h-5" strokeWidth={1.5} />
                </button>
              </LoginModal>
            )}

            <button className="hover:text-destructive transition-colors hidden sm:block">
              <Heart className="w-5 h-5" strokeWidth={1.5} />
            </button>

            <div className="relative">
              <CartDrawer cartCount={cartCount} />
              {/* {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-slate-900 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )} */}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

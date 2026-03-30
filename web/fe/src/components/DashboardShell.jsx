"use client";

import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useRouter } from "next/navigation";
import { authAPI } from "@/lib/auth";

export default function DashboardShell({ children }) {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    const savedState = localStorage.getItem("sidebar-collapsed");
    return savedState !== null ? JSON.parse(savedState) : false;
  });

  const toggleMobileMenu = (state) => {
    setIsMobileMenuOpen(typeof state === "boolean" ? state : !isMobileMenuOpen);
  };

  const handleToggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem("sidebar-collapsed", JSON.stringify(newState));
  };

  const handleLogout = () => {
    authAPI.clearToken();
    setIsMobileMenuOpen(false);
    router.replace("/signin");
    router.refresh();
  };

  return (
    <div className="flex h-screen w-full bg-lightgray dark:bg-dark overflow-hidden text-foreground">
      {/* 1. Sidebar is injected here */}
      <Sidebar
        isMobileMenuOpen={isMobileMenuOpen}
        toggleMobileMenu={toggleMobileMenu}
        handleLogout={handleLogout}
        isCollapsed={isCollapsed}
        onToggleCollapse={handleToggleCollapse}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* 2. Header is injected here */}
        <Header toggleMobileMenu={toggleMobileMenu} onLogout={handleLogout} />

        {/* 3. Your Page Content (children) goes here */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 relative scroll-smooth">
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[var(--primary)]/[0.03] to-transparent pointer-events-none" />
          <div className="container mx-auto px-6 py-30 relative animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

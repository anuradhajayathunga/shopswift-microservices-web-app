import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function DashboardLayout({ children, handleLogout }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Persist sidebar state across reloads for a seamless user experience
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const savedState = localStorage.getItem("sidebar-collapsed");
    return savedState !== null ? JSON.parse(savedState) : false;
  });

  const toggleMobileMenu = (state) => {
    if (typeof state === "boolean") {
      setIsMobileMenuOpen(state);
    } else {
      setIsMobileMenuOpen((prev) => !prev);
    }
  };

  const handleToggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem("sidebar-collapsed", JSON.stringify(newState));
  };

  // Close mobile menu on route change or escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  // Prevent body scroll when mobile menu is open to lock the UI
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    // The main wrapper is fixed to the screen height.
    // The background mesh from index.css will naturally sit behind this.
    <div className="flex h-screen w-full bg-transparent overflow-hidden text-foreground">
      {/* Sidebar Component */}
      <Sidebar
        isMobileMenuOpen={isMobileMenuOpen}
        toggleMobileMenu={toggleMobileMenu}
        handleLogout={handleLogout}
        isCollapsed={isCollapsed}
        onToggleCollapse={handleToggleCollapse}
      />

      {/* Main Content Area Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Header Component (Sticky inside this column) */}
        <Header toggleMobileMenu={toggleMobileMenu} onLogout={handleLogout} />

        {/* Scrollable Page Content */}
        {/* We use smooth scrolling and nice padding to let the content breathe */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 relative scroll-smooth">
          {/* Subtle SaaS Top Glow */}
          {/* This anchors the header to the page by creating a micro-gradient that fades into the background */}
          <div
            className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[var(--primary)]/[0.03] to-transparent pointer-events-none"
            aria-hidden="true"
          />

          {/* Page Content Container with Entry Animation */}
          {/* The animate-in classes give that buttery smooth "slide up and fade" effect when navigating between pages */}
          <div className="max-w-[1600px] mx-auto w-full relative animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

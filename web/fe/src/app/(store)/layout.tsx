"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { authAPI } from "@/lib/auth";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isRoleChecking, setIsRoleChecking] = useState(true);

  useEffect(() => {
    const initializeStore = async () => {
      // In a real application, you would await your auth token validation here.
      // e.g., await authAPI.validateCurrentSession();
      
      // Store is available for guests, customers, and admins.
      setIsRoleChecking(false);
    };

    void initializeStore();
  }, []);

  if (isRoleChecking) {
    return (
      <div className="min-h-screen w-full bg-white flex flex-col items-center justify-center font-sans z-50 fixed inset-0">
        
        {/* Premium Brand Mark (Pulsing) */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-black tracking-[0.25em] uppercase text-gray-900 animate-pulse">
            CALISTA
          </h1>
        </div>
        
        {/* Sleek Loader & Editorial Text */}
        <div className="flex items-center gap-3 text-gray-400">
          <Loader2 className="w-4 h-4 animate-spin" strokeWidth={1.5} />
          <span className="text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase">
            Authenticating
          </span>
        </div>

      </div>
    );
  }

  // Wrapping children in a flex column ensures sticky footers and headers behave properly
  return (
    <div className="flex flex-col min-h-screen w-full bg-white font-sans selection:bg-gray-900 selection:text-white">
      {children}
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { authAPI } from "@/lib/auth";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isRoleChecking, setIsRoleChecking] = useState(true);

  useEffect(() => {
    // Store is available for guests, customers, and admins.
    setIsRoleChecking(false);
  }, []);

  if (isRoleChecking) {
    return (
      <div className="min-h-screen w-full bg-background flex items-center justify-center text-muted-foreground">
        Checking access...
      </div>
    );
  }

  return <>{children}</>;
}

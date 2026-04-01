"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authAPI } from "@/lib/auth";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isRoleChecking, setIsRoleChecking] = useState(true);

  useEffect(() => {
    if (!authAPI.isAuthenticated()) {
      setIsRoleChecking(false);
      return;
    }

    const role = authAPI.getRole();
    if (role === "admin") {
      router.replace("/");
      return;
    }

    setIsRoleChecking(false);
  }, [router]);

  if (isRoleChecking) {
    return (
      <div className="min-h-screen w-full bg-background flex items-center justify-center text-muted-foreground">
        Checking access...
      </div>
    );
  }

  return <>{children}</>;
}

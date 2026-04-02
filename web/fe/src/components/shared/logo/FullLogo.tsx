"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";

const FullLogo = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const logoSrc =
    mounted && resolvedTheme === "dark"
      ? "/images/logos/hype-dark-logo.svg"
      : "/images/logos/hype-light-logo.svg";

  return (
    <Link href={"/"}>
      <img
        src={logoSrc}
        alt="Hype Logo"
        // width={120}
        // height={40}
        width={152}
        height={36}
        className="h-10 w-auto"
      />
    </Link>
  );
};

export default FullLogo;

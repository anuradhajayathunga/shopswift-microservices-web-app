"use client";

import { useTheme } from "next-themes";
import Link from "next/link";

const FullLogo = () => {
  const { theme } = useTheme();

  return (
    <Link href={"/"}>
      <img
        src={
          theme === "dark"
            ? "/images/logos/hype-dark-logo.svg"
            : "/images/logos/hype-light-logo.svg"
        }
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

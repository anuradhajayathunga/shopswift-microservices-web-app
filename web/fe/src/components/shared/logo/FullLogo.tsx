"use client";

import Image from "next/image";
import Link from "next/link";

const FullLogo = () => {
  return (
    <Link href={"/"}>
      {/* Dark Logo */}
      <Image
        src="/images/logos/materialm-dark-logo.svg"
        alt="logo"
        width={152}
        height={36}
        className="block w-auto h-auto dark:hidden rtl:scale-x-[-1]"
        style={{ width: "auto", height: "auto" }}
      />
      {/* Light Logo */}
      <Image
        src="/images/logos/materialm-light-logo.svg"
        alt="logo"
        width={152}
        height={36}
        className="hidden w-auto h-auto dark:block rtl:scale-x-[-1]"
        style={{ width: "auto", height: "auto" }}
      />
    </Link>
  );
};

export default FullLogo;

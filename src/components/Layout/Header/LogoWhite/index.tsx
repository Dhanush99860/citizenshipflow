// src/components/Layout/Header/Logo/index.tsx
import Image from "next/image";
import Link from "next/link";

export default function LogoWhite() {
  return (
    <Link href="/" aria-label="XIPHIAS Immigration home" className="inline-block">
      <Image
        src="/images/logo/xiphias-immigration-white.png"
        alt="XIPHIAS Immigration Logo"
        width={170}
        height={36}
        priority
        className="h-9 w-auto sm:h-10"
      />
    </Link>
  );
}
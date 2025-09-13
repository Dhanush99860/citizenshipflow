import Image from "next/image";
import Link from "next/link";

const LogoWhite: React.FC = () => {
  return (
    <Link href="/" aria-label="Go to XIPHIAS Immigration homepage">
      <Image
        src="/images/logo/xiphias-immigration-white.png"
        alt="XIPHIAS Immigration White Logo"
        width={70}   // ✅ Set real display width to avoid CLS
        height={60}
        priority      // ✅ Ensures fast above-the-fold load
        quality={85}  // ✅ Optimized file size without visible loss
        className="h-auto w-auto"
      />
    </Link>
  );
};

export default LogoWhite;

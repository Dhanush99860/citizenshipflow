import Image from "next/image";
import Link from "next/link";

const Logo: React.FC = () => {
  return (
    <Link href="/" aria-label="Go to XIPHIAS Immigration homepage">
      <Image
        src="/images/logo/xiphias-immigration.png"
        alt="XIPHIAS Immigration Logo"
        width={50} // ✅ Explicit size for CLS prevention
        height={60}
        priority // ✅ Loads immediately (logo is always above the fold)
        quality={85} // ✅ Lighter image without quality loss
        className="h-auto w-auto"
      />
    </Link>
  );
};

export default Logo;

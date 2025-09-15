import Image from "next/image";

const LogoWhite: React.FC = () => {
  return (
    <Image
      src="/images/logo/xiphias-immigration-white.png"
      alt="XIPHIAS Immigration White Logo"
      width={170}
      height={36}
      priority
      className="h-12 w-auto sm:h-12 lg:h-16"
    />
  );
};

export default LogoWhite;

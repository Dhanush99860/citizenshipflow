import Image from "next/image";

const Logo: React.FC = () => {
  return (
    <Image
      src="/images/logo/xiphias-immigration.png"
      alt="XIPHIAS Immigration Logo"
      width={170}
      height={36}
      priority
      className="h-9 w-auto sm:h-10"
    />
  );
};

export default Logo;

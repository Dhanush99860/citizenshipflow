// --------------------------------------
// 📁 File: src/components/Layout/Header/Logo/index.tsx
// --------------------------------------
import Image from 'next/image';
export default function Logo() {
  return (
    <Image src="/images/logo/xiphias-immigration.png" alt="XIPHIAS Immigration Logo" width={170} height={36} priority className="h-9 w-auto sm:h-10" />
  );
}
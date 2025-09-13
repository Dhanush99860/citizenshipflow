import Image from "next/image";
import Link from "next/link";

const Platform = () => {
  return (
    <section className="relative z-1 min-h-[60vh] flex items-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <Image
          src="/images/hero/silhouettes.webp"
          alt="Global Immigration Solutions Background"
          fill
          className="object-cover object-center"
          priority
        />
      </div>

      {/* Neutral/blue overlay */}
      <div
        className="absolute inset-0 bg-primary/70 dark:bg-neutral-900/80 -z-10"
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative container mx-auto lg:max-w-screen-xl px-4 py-10 sm:py-14">
        <div
          className="relative 
            bg-white/15 dark:bg-dark_bg/30 
            backdrop-blur-xl 
            px-6 sm:px-10 lg:px-16 py-8 sm:py-12 lg:py-14 
            rounded-3xl 
            border-4 border-white/20 dark:border-dark_border/40 
            shadow-lg shadow-black/30 
            grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
        >
          {/* Text */}
          <div className="lg:col-span-8 text-center lg:text-left">
            <h2 className="md:text-40 text-30 mb-6 font-bold text-white leading-tight">
              Empowering Global{" "}
              <span className="text-secondary">Immigration</span> Solutions
            </h2>
            <p className="text-white/90 dark:text-dark_text text-18 leading-relaxed max-w-3xl mx-auto lg:mx-0">
              We provide end-to-end immigration services, helping individuals,
              families, and businesses navigate complex visa processes with ease.
              <br /> From residency and citizenship by investment to work permits
              and study visas — we simplify your journey across borders.
            </p>
          </div>

          {/* Button */}
          <div className="lg:col-span-4 flex justify-center lg:justify-end">
            <Link
              href="#"
              className="text-white bg-primary border border-primary 
                py-3 px-6 rounded-lg sm:text-21 text-18 font-semibold 
                transition duration-300 
                hover:bg-transparent hover:text-primary hover:border-primary"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Platform;

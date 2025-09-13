import { perksData } from "@/app/api/data";
import Image from "next/image";

const Perks = () => {
  return (
    <section className="pb-28 relative">
      <div className="container mx-auto lg:max-w-screen-xl px-4">
        <div className="text-center">
          {/* Section Title */}
          <p
            className="text-muted sm:text-28 text-18 mb-4 pb-6 relative 
              after:content-[''] after:w-8 after:h-0.5 after:bg-primary 
              after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2"
          >
            Always By <span className="text-primary">your side</span>
          </p>
          <h2 className="text-white sm:text-40 text-30 font-medium">
            Be the first to use our Cryo<span className="text-primary">go</span>!
          </h2>

          {/* Perks Grid */}
          <ul
            className="mt-16 border border-border border-opacity-20 
              grid lg:grid-cols-3 sm:grid-cols-2 gap-10 
              sm:py-16 py-10 sm:px-20 px-6 rounded-3xl 
              sm:bg-perk bg-dark_grey bg-opacity-35 
              lg:bg-bottom bg-center bg-no-repeat"
          >
            {perksData.map((item, index) => (
              <li
                key={index}
                className="text-center flex flex-col items-center justify-end"
              >
                {/* Icon Wrapper */}
                <div className="bg-primary/25 backdrop-blur-sm p-4 rounded-full w-fit mb-6">
                  <Image
                    src={item.icon}
                    alt={item.title}
                    width={44}
                    height={44}
                    loading="lazy"
                    decoding="async"
                  />
                </div>

                {/* Title */}
                <h3
                  className={`text-white text-28 font-medium mb-4 ${item.space}`}
                >
                  {item.title}
                </h3>

                {/* Description */}
                {item.text ? (
                  <p
                    className="text-muted text-opacity-60 text-17 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: item.text }}
                  />
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Decorative Gradient Blob */}
      <div
        className="bg-gradient-to-br from-tealGreen to-charcoalGray 
          sm:w-50 w-96 sm:h-50 h-96 rounded-full 
          sm:-bottom-80 bottom-0 blur-400 z-0 absolute sm:-left-48 opacity-60"
        aria-hidden="true"
      />
    </section>
  );
};

export default Perks;

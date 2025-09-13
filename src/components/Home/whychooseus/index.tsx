"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { FaGlobe, FaBalanceScale, FaUsers, FaBuilding } from "react-icons/fa";
import { ArrowRight } from "lucide-react";

// Feature Data
const features = [
  { icon: <FaGlobe />, title: "15+ Years Global Experience" },
  { icon: <FaBalanceScale />, title: "In-House Legal Experts" },
  { icon: <FaUsers />, title: "360° Relocation Support" },
  { icon: <FaBuilding />, title: "Trusted by Fortune 500s" },
];

// Motion Variants
const fadeInLeft = {
  hidden: { opacity: 0, x: -200 },
  visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 70, damping: 20 } },
};

const fadeInRight = {
  hidden: { opacity: 0, x: 200 },
  visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 70, damping: 20 } },
};

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 80, damping: 18, delay },
  },
});

const WhyChooseUs = () => {
  return (
    <section
      id="why-choose-us"
      aria-labelledby="why-choose-heading"
      className="relative py-20 bg-light_bg dark:bg-dark_bg"
    >
      <div className="container mx-auto px-6 md:px-12 max-w-screen-xl grid md:grid-cols-2 gap-16 items-center">
        {/* Left Content */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={fadeInLeft}
          viewport={{ once: true }}
          className="order-2 md:order-1"
        >
          <span className="inline-block bg-secondary/10 text-secondary px-4 py-1 rounded-full text-sm font-medium tracking-wide mb-4">
            We Connect You to the World
          </span>

          <h2
            id="why-choose-heading"
            className="text-30 md:text-44 font-bold text-light_text dark:text-dark_text leading-snug mb-6"
          >
            Powering <span className="text-secondary">Global Growth</span> with
            Expertise & Trust
          </h2>

          <p className="text-16 md:text-18/7 text-justify text-light_grey dark:text-dark_text/70 mb-12 max-w-xl">
            <strong>XIPHIAS Immigration</strong> partners with businesses and
            individuals to unlock global opportunities.
          </p>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-12">
            {features.map((item, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                variants={fadeUp(i * 0.2)}
                viewport={{ once: true }}
                className="flex items-center gap-4 p-5 rounded-xl bg-gray-50 dark:bg-gray-800 backdrop-blur-md shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-500"
              >
                {/* Icon with pulse animation */}
                <motion.div
                  animate={{
                    boxShadow: [
                      "0 0 0px rgba(0,0,0,0)",
                      "0 0 12px rgba(128,128,128,0.3)",
                      "0 0 0px rgba(0,0,0,0)",
                    ],
                    scale: [1, 1.03, 1],
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 text-xl flex-shrink-0"
                >
                  {item.icon}
                </motion.div>

                <h3 className="text-16 font-medium text-gray-800 dark:text-gray-100 leading-snug">
                  {item.title}
                </h3>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.button
            initial="hidden"
            whileInView="visible"
            variants={fadeUp()}
            viewport={{ once: true }}
            className="group inline-flex items-center gap-2 bg-secondary text-white font-medium px-7 py-3 rounded-lg shadow-md hover:bg-transparent hover:text-secondary border border-secondary transition-all"
          >
            KNOW MORE
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>

        {/* Right Image */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={fadeInRight}
          viewport={{ once: true }}
          className="relative order-1 md:order-2"
        >
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src="/images/home/whytochoose.png"
              alt="XIPHIAS Immigration Expert Team"
              width={600}
              height={500}
              className="object-cover w-full h-auto"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-secondary/10" />
          </div>

          
          {/* <motion.div
            initial={{ opacity: 0, scale: 2.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 70, damping: 15, duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
            className="absolute -bottom-10 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:-right-10 md:bottom-12"
          >
            <Image
              src="/images/home/badge.png"
              alt="15+ Years of Trusted Immigration Expertise Badge"
              width={160}
              height={160}
              className="drop-shadow-lg w-32 md:w-40"
              loading="lazy"
            />
          </motion.div> */}
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUs;

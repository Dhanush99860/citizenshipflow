"use client";

import { HiMiniPhone, HiOutlineEnvelope } from "react-icons/hi2";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import { FiLogIn } from "react-icons/fi";
import Link from "next/link";
import Search from "@/components/GlobalSearch"; // ⬅️ your global search component

const TopBar = () => {
  const textColor = "text-white";
  const iconBg = "bg-white/20 text-white";
  const hoverText = "hover:bg-secondary hover:text-white";

  return (
    <div className="hidden lg:block mb-[12px]">
      <div className="pb-5 text-sm border-b border-white/20 container mx-auto lg:max-w-screen-xl md:max-w-screen-md flex items-center justify-between px-4 gap-6">

        {/* Left - Contact Info */}
        <div className={`flex items-center gap-6 text-16 font-medium ${textColor}`}>
          <a
            href="tel:+919876543210"
            className="flex items-center gap-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary rounded-lg px-1"
            aria-label="Call us at +91 98765 43210"
          >
            <span className="p-1.5 rounded-full bg-white text-secondary group-hover:bg-secondary group-hover:text-white transition-all duration-300">
              <HiMiniPhone className="text-lg" aria-hidden="true" />
            </span>
            <span className="group-hover:text-secondary transition-colors">
              +91 98765 43210
            </span>
          </a>

          <a
            href="mailto:info@example.com"
            className="flex items-center gap-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary rounded-lg px-1"
            aria-label="Email us at info@example.com"
          >
            <span className="p-1.5 rounded-full bg-white text-secondary group-hover:bg-secondary group-hover:text-white transition-all duration-300">
              <HiOutlineEnvelope className="text-lg" aria-hidden="true" />
            </span>
            <span className="group-hover:text-secondary transition-colors">
              info@example.com
            </span>
          </a>
        </div>

        {/* Middle - Global Search Component */}
        <div className="flex justify-end flex-1">
          <Search />
        </div>

        {/* Right - Social Icons + Login */}
        <div className="flex items-center gap-3">
          {[
            { Icon: FaFacebookF, label: "Facebook", href: "https://facebook.com" },
            { Icon: FaTwitter, label: "Twitter", href: "https://twitter.com" },
            { Icon: FaInstagram, label: "Instagram", href: "https://instagram.com" },
          ].map(({ Icon, label, href }, idx) => (
            <a
              key={idx}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit our ${label} page`}
              className={`p-2 rounded-full ${iconBg} ${hoverText} 
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary 
                         transition-all duration-300 hover:scale-110 shadow-sm`}
            >
              <Icon size={14} aria-hidden="true" />
            </a>
          ))}

          <Link
            href="/login"
            aria-label="Login to your account"
            className="flex items-center gap-3 bg-transparent border border-white rounded-lg 
                       text-16 font-medium text-white hover:bg-secondary hover:text-white 
                       py-1 px-4 transition-all duration-300 ml-[10px] hover:shadow-lg
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
          >
            <FiLogIn className="text-lg" aria-hidden="true" />
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TopBar;

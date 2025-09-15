"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { headerData } from "../Header/Navigation/menuData";
import Logo from "./Logo";
import LogoWhite from "./LogoWhite";
import HeaderLink from "../Header/Navigation/HeaderLink";
import MobileHeaderLink from "../Header/Navigation/MobileHeaderLink";
import { useTheme } from "next-themes";
import { Icon } from "@iconify/react/dist/iconify.js";
import TopBar from "@/components/Layout/Header/Navigation/TopBar";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import { FiLogIn } from "react-icons/fi";
import { HiMiniPhone, HiOutlineEnvelope } from "react-icons/hi2";
import Search from "@/components/GlobalSearch";

const Header: React.FC = () => {
  const pathUrl = usePathname();
  const { theme, setTheme } = useTheme();
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [sticky, setSticky] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => setSticky(window.scrollY >= 80);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      mobileMenuRef.current &&
      !mobileMenuRef.current.contains(event.target as Node) &&
      navbarOpen
    ) {
      setNavbarOpen(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [navbarOpen]);

  // Lock scroll only when navbar is open
  useEffect(() => {
    document.body.style.overflow = navbarOpen ? "hidden" : "";
    document.documentElement.style.overflow = navbarOpen ? "hidden" : "";
  }, [navbarOpen]);

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 supports-[env(safe-area-inset-top)]:pt-[env(safe-area-inset-top)] ${
        sticky
          ? "shadow-lg bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-500 dark:from-blue-900 dark:via-indigo-800 dark:to-black backdrop-blur-md"
          : "shadow-none bg-blue-500/70 dark:bg-blue-700/60 backdrop-blur-md"
      }`}
    >
      {/* Desktop top bar only (hide on small to save height) */}
      <div className="hidden lg:block">
        <TopBar />
      </div>

      {/* Main row: compact on mobile */}
      <div className="py-0">
        <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md flex items-center justify-between px-3 lg:px-4 h-14 lg:h-20">
          {/* Scaled logo on mobile to avoid oversized header */}
          <div className="shrink-0 origin-left scale-90 sm:scale-100 lg:scale-100">
            <LogoWhite />
          </div>

          {/* Desktop Navigation */}
          <nav
            className="hidden lg:flex flex-grow items-center gap-8 justify-center"
            aria-label="Main navigation"
          >
            {headerData.map((item, index) => (
              <HeaderLink key={index} item={item} />
            ))}
          </nav>

          <div className="flex items-center gap-2 lg:gap-4">
            {/* Theme Toggle */}
            <button
              aria-label="Toggle theme"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors duration-300 ${
                !sticky && pathUrl === "/"
                  ? "text-white dark:text-secondary"
                  : "text-white dark:text-white"
              }`}
            >
              {theme === "dark" ? (
                <Icon
                  icon="mdi:white-balance-sunny"
                  className="h-5 w-5 text-yellow-400"
                />
              ) : (
                <Icon icon="mdi:moon-waning-crescent" className="h-5 w-5" />
              )}
            </button>

            {/* Mobile Search (kept compact) */}
            <div className="block lg:hidden w-[48vw] max-w-[260px]">
              <Search />
            </div>

            {/* Desktop Book Button */}
            <Link
              href="/PersonalBooking"
              aria-label="Book a personal consultation"
              className="hidden lg:block bg-secondary text-white hover:bg-transparent hover:text-secondary dark:hover:text-white border border-secondary px-4 py-2 rounded-lg transition"
            >
              Book a Personal Consultation
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setNavbarOpen(!navbarOpen)}
              className="block lg:hidden p-2 rounded-lg aria-expanded"
              aria-label="Toggle mobile menu"
              aria-expanded={navbarOpen}
            >
              <span className="block w-6 h-0.5 bg-white dark:bg-white"></span>
              <span className="block w-6 h-0.5 bg-white dark:bg-white mt-1.5"></span>
              <span className="block w-6 h-0.5 bg-white dark:bg-white mt-1.5"></span>
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {navbarOpen && (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300"
            onClick={() => setNavbarOpen(false)}
            role="button"
            aria-label="Close mobile menu"
            tabIndex={0}
          />
        )}

        {/* Mobile Menu Drawer */}
        <div
          ref={mobileMenuRef}
          className={`lg:hidden fixed top-0 right-0 h-[100dvh] w-[80%] max-w-xs bg-white dark:bg-darklight shadow-xl rounded-l-2xl transform transition-transform duration-300 ${
            navbarOpen ? "translate-x-0" : "translate-x-full"
          } z-50`}
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 pt-[max(1rem,env(safe-area-inset-top))]">
            {/* Slightly smaller logo in the drawer header */}
            <div className="shrink-0 scale-90">
              <Logo />
            </div>

            <button
              onClick={() => setNavbarOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              aria-label="Close menu"
            >
              <Icon
                icon="tabler:x"
                className="w-6 h-6 text-primary dark:text-white"
              />
            </button>
          </div>

          {/* Scrollable mobile nav (height accounts for header) */}
          <nav
            className="flex flex-col items-start p-4 text-black dark:text-white bg-white dark:bg-darklight overflow-y-auto h-[calc(100dvh-64px)] space-y-3"
            aria-label="Mobile navigation"
          >
            {headerData.map((item, index) => (
              <MobileHeaderLink key={index} item={item} />
            ))}

            <div className="pt-2 flex flex-col space-y-3 w-full">
              <Link
                href="/PersonalBooking"
                aria-label="Book a personal consultation"
                className="bg-primary text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition-all duration-300"
                onClick={() => setNavbarOpen(false)}
              >
                Book a Personal Consultation
              </Link>
            </div>

            {/* Contact info */}
            <div className="flex flex-col items-start gap-3 mt-4">
              <div className="flex items-center gap-2 group">
                <span className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-secondary group-hover:bg-secondary group-hover:text-white transition-all duration-300 shadow-sm">
                  <HiMiniPhone className="text-lg" />
                </span>
                <a
                  href="tel:+919876543210"
                  className="group-hover:text-secondary transition-colors font-medium"
                >
                  +91 98765 43210
                </a>
              </div>
              <div className="flex items-center gap-2 group">
                <span className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-secondary group-hover:bg-secondary group-hover:text-white transition-all duration-300 shadow-sm">
                  <HiOutlineEnvelope className="text-lg" />
                </span>
                <a
                  href="mailto:info@example.com"
                  className="group-hover:text-secondary transition-colors font-medium"
                >
                  info@example.com
                </a>
              </div>
            </div>

            {/* Social + Login */}
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-3 mt-4">
                <Link
                  href="https://facebook.com/xiphiasimmigration"
                  aria-label="Visit our Facebook page"
                  className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 hover:scale-110 shadow-sm"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaFacebookF size={14} />
                </Link>
                <Link
                  href="https://twitter.com/xiphiasimmigra"
                  aria-label="Visit our Twitter page"
                  className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 hover:scale-110 shadow-sm"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaTwitter size={14} />
                </Link>
                <Link
                  href="https://instagram.com/xiphiasimmigration"
                  aria-label="Visit our Instagram page"
                  className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 hover:scale-110 shadow-sm"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaInstagram size={14} />
                </Link>
              </div>

              <button
                aria-label="Login to your account"
                className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-[15px] font-medium text-gray-800 dark:text-white hover:bg-gray-800 dark:hover:bg-primary hover:text-white py-1.5 px-3 mt-4 transition-all duration-300 shadow-sm hover:shadow-lg"
              >
                <FiLogIn className="text-lg" />
                Login
              </button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;

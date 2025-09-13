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

  // ✅ Lock scroll only when navbar is open
  useEffect(() => {
    document.body.style.overflow = navbarOpen ? "hidden" : "";
    document.documentElement.style.overflow = navbarOpen ? "hidden" : "";
  }, [navbarOpen]);

  return (
    <header
      className={`fixed top-0 z-50 w-full pb-5 transition-all duration-300 ${
        sticky
          ? "shadow-lg bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-500 dark:from-blue-900 dark:via-indigo-800 dark:to-black backdrop-blur-md pt-5"
          : "shadow-none bg-blue-500/70 dark:bg-blue-700/60 backdrop-blur-md pt-6"
      }`}
    >
      <TopBar />

      <div className="lg:py-0 py-2">
        <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md flex items-center justify-between px-4">
          <LogoWhite />

          {/* ✅ Desktop Navigation with landmark label */}
          <nav
            className="hidden lg:flex flex-grow items-center gap-8 justify-center"
            aria-label="Main navigation"
          >
            {headerData.map((item, index) => (
              <HeaderLink key={index} item={item} />
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              aria-label="Toggle theme"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors duration-300 ${
                !sticky && pathUrl === "/"
                  ? "text-white dark:text-secondary"
                  : "text-white dark:text-white"
              }`}
            >
              {theme === "dark" ? (
                <Icon
                  icon="mdi:white-balance-sunny"
                  className="h-6 w-6 text-yellow-400"
                />
              ) : (
                <Icon
                  icon="mdi:moon-waning-crescent"
                  className="h-6 w-6 text-white-800"
                />
              )}
            </button>

            {/* Mobile Search */}
            <div className="block lg:hidden w-full px-2">
              <div className="flex-1">
                <Search />
              </div>
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
              className="block lg:hidden p-2 rounded-lg"
              aria-label="Toggle mobile menu"
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
          className={`lg:hidden fixed top-0 right-0 h-full w-[80%] max-w-xs bg-white dark:bg-darklight shadow-xl rounded-l-2xl transform transition-transform duration-300 ${
            navbarOpen ? "translate-x-0" : "translate-x-full"
          } z-50`}
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <Logo />

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

          {/* Scrollable mobile nav */}
          <nav
            className="flex flex-col items-start p-4 text-black dark:text-white bg-white dark:bg-darklight overflow-y-auto h-[calc(100vh-64px)] space-y-4"
            aria-label="Mobile navigation"
          >
            {headerData.map((item, index) => (
              <MobileHeaderLink key={index} item={item} />
            ))}

            <div className="mt-4 flex flex-col space-y-4 w-full">
              <Link
                href="/PersonalBooking"
                aria-label="Book a personal consultation"
                className="bg-primary text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition-all duration-300"
                onClick={() => setNavbarOpen(false)}
              >
                Book a Personal Consultation
              </Link>
            </div>

            {/* ✅ Contact info as real links */}
            <div className="flex flex-col items-start gap-3 mt-[25px]">
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

            {/* ✅ Social Icons with real links */}
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-3 mt-[25px]">
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

              {/* ✅ Login Button with aria-label */}
              <button
                aria-label="Login to your account"
                className="flex items-center gap-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-16 font-medium text-gray-800 dark:text-white hover:bg-gray-800 dark:hover:bg-primary hover:text-white py-1 px-4 mt-[20px] transition-all duration-300 shadow-sm hover:shadow-lg"
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

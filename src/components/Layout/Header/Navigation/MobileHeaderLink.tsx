"use client";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { HeaderItem, SubmenuItem } from "../../../../types/menu";

interface MobileHeaderLinkProps {
  item: HeaderItem;
  closeMenu?: () => void;
  level?: number;
}

interface MobileSubMenuItemProps {
  item: SubmenuItem;
  closeMenu?: () => void;
  level: number;
}

const MobileSubMenuItem: React.FC<MobileSubMenuItemProps> = ({ item, closeMenu, level }) => {
  const [open, setOpen] = useState(false);

  const handleSubClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (item.submenu) {
      e.preventDefault();
      setOpen((prev) => !prev);
    } else {
      closeMenu?.();
    }
  };

  const colors = [
    "text-gray-800 dark:text-white",     // level 1
    "text-gray-700 dark:text-gray-200",  // level 2
    "text-gray-600 dark:text-gray-400",  // level 3+
  ];

  const padding = 8 + level * 4;

  return (
    <div className="relative" role="none">
      <Link
        href={item.href}
        onClick={handleSubClick}
        aria-haspopup={!!item.submenu}
        aria-expanded={open}
        role="menuitem"
        style={{ paddingLeft: padding, paddingRight: padding }}
        className={`flex items-center justify-between w-full py-2 
          hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg 
          transition-colors duration-200 focus-visible:outline-none 
          focus-visible:ring-2 focus-visible:ring-secondary ${
          colors[level - 1] || colors[2]
        }`}
      >
        {item.label}
        {item.submenu && (
          <svg
            className={`w-5 h-5 ml-2 transition-transform duration-300 ${
              open ? "rotate-180 text-blue-500" : "rotate-0 text-gray-400"
            }`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
          </svg>
        )}
      </Link>

      {item.submenu && (
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="pl-2 overflow-hidden"
              role="menu"
              aria-label={`${item.label} submenu`}
            >
              {item.submenu.map((subItem) => (
                <div
                  key={subItem.label}
                  className="border-b border-gray-200 dark:border-gray-700 last:border-0"
                >
                  <MobileSubMenuItem
                    item={subItem}
                    closeMenu={closeMenu}
                    level={level + 1}
                  />
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

const MobileHeaderLink: React.FC<MobileHeaderLinkProps> = ({ item, closeMenu, level = 1 }) => {
  const [submenuOpen, setSubmenuOpen] = useState(false);

  const handleToggle = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (item.submenu) {
      e.preventDefault();
      setSubmenuOpen((prev) => !prev);
    } else {
      closeMenu?.();
    }
  };

  return (
    <div className="w-full" role="none">
      <div className="border-b border-gray-300 dark:border-gray-600">
        <Link
          href={item.href}
          onClick={handleToggle}
          aria-haspopup={!!item.submenu}
          aria-expanded={submenuOpen}
          role="menuitem"
          className={`flex items-center justify-between w-full py-3 px-4 rounded-lg 
            transition-colors duration-200 focus-visible:outline-none 
            focus-visible:ring-2 focus-visible:ring-secondary ${
            level === 1
              ? "text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              : ""
          }`}
        >
          {item.label}
          {item.submenu && (
            <svg
              className={`w-5 h-5 ml-2 transition-transform duration-300 ${
                submenuOpen ? "rotate-180 text-blue-500" : "rotate-0 text-gray-400"
              }`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
            </svg>
          )}
        </Link>
      </div>

      {item.submenu && (
        <AnimatePresence initial={false}>
          {submenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="pl-2 overflow-hidden"
              role="menu"
              aria-label={`${item.label} submenu`}
            >
              {item.submenu.map((subItem) => (
                <div
                  key={subItem.label}
                  className="border-b border-gray-200 dark:border-gray-700 last:border-0"
                >
                  <MobileSubMenuItem
                    item={subItem}
                    closeMenu={closeMenu}
                    level={level + 1}
                  />
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

export default MobileHeaderLink;

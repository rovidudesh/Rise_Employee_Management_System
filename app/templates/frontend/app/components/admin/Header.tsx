import React from "react";
import Image from "next/image";
import { FaBars } from "react-icons/fa";

interface HeaderProps {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  onMenuClick,
  showMenuButton = false,
}) => {
  return (
    <header className="w-full bg-white dark:bg-gray-900 shadow-lg dark:shadow-2xl dark:shadow-black/30 border-b border-gray-200 dark:border-gray-800 py-4 sm:py-5 px-6 sm:px-8 flex items-center justify-between font-inter transition-all duration-300 relative z-10">
      {/* Enhanced shadow overlay for better depth */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-b from-transparent to-black/10 dark:to-black/50 pointer-events-none"></div>

      {/* Left Section: Menu Button (Mobile) + Logo */}
      <div className="flex items-center space-x-3 relative z-10">
        {/* Mobile Menu Button - Dark Mode Configured */}
        {showMenuButton && (
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2.5 rounded-lg bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-600 border border-gray-300 dark:border-gray-600 transition-all duration-200 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:outline-none shadow-sm dark:shadow-md"
            aria-label="Open menu"
          >
            <FaBars size={20} />
          </button>
        )}

        {/* Logo */}
        <div className="w-12 h-12 sm:w-14 sm:h-10 flex items-center justify-center text-white text-xs font-bold">
          <Image
            src="/NavImg.svg"
            alt="Rise Tech Village Logo"
            width={60}
            height={40}
            className="object-contain filter dark:brightness-110 transition-all duration-300"
          />
        </div>
      </div>

      {/* Right Section: Title */}
      <div className="relative z-10">
        <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-gray-100 transition-colors duration-300 drop-shadow-sm">
          Rise Tech Village
        </h1>
      </div>
    </header>
  );
};

export default Header;

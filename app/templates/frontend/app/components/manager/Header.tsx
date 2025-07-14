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
    <header className="w-full bg-white dark:bg-gray-900 shadow-lg border-b border-gray-200 dark:border-gray-800 py-4 sm:py-5 px-4 sm:px-6 lg:px-8 flex items-center justify-between font-inter transition-colors duration-300 relative z-10">
      {/* Left Section: Menu Button (Mobile) + Logo */}
      <div className="flex items-center space-x-3">
        {/* Mobile Menu Button - Dark Mode Configured */}
        {showMenuButton && (
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-md bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-600 border border-gray-300 dark:border-gray-600 transition-colors duration-200 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:outline-none"
            aria-label="Open menu"
          >
            <FaBars size={20} />
          </button>
        )}

        {/* Logo */}
        <div className="w-12 h-12 sm:w-14 sm:h-10 flex items-center justify-center">
          <Image
            src="/NavImg.svg"
            alt="Rise Tech Village Logo"
            width={60}
            height={40}
            className="object-contain"
          />
        </div>
      </div>

      {/* Right Section: Title */}
      <div>
        <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-gray-100 transition-colors duration-300">
          Rise Tech Village
        </h1>
      </div>
    </header>
  );
};

export default Header;

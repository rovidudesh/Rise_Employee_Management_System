import React from "react";
import Image from "next/image";

const Header = () => {
  return (
    <header className="w-full bg-white dark:bg-gray-900 shadow-lg dark:shadow-2xl dark:shadow-black/30 border-b border-gray-200 dark:border-gray-800 py-4 sm:py-5 px-6 sm:px-8 flex items-center justify-between font-inter transition-all duration-300 relative z-10">
      {/* Enhanced shadow overlay for better depth */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-b from-transparent to-black/10 dark:to-black/50 pointer-events-none"></div>

      {/* Left Section: Logo */}
      <div className="flex items-center relative z-10">
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

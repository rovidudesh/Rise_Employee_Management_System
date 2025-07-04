import React from 'react';
import Image from 'next/image'; 

const Header = () => {
  return (
    <header className="w-full bg-white shadow-sm border-b border-gray-200 py-4 sm:py-5 px-6 sm:px-8 flex items-center justify-between font-inter"> 
      {/* Left Section: Logo */}
      <div className="flex items-center">
        <div className="w-12 h-12 sm:w-14 sm:h-10 flex items-center justify-center text-white text-xs font-bold">
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
        <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-800">
          Rise Tech Village
        </h1>
      </div>
    </header>
  );
};

export default Header;

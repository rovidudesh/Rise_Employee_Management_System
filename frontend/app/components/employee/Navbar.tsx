import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href) => pathname === href;

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <Image src="/NavImg.svg" alt="navigation logo" width={30} height={40} />
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-8 items-center font-inter text-gray-800 text-base">
          <Link
            href="/employee"
            className={`pb-1 ${
              isActive('/employee')
                ? 'font-semibold border-b-2 border-black text-black'
                : 'hover:text-black hover:border-gray-500 border-b-2 border-transparent'
            }`}
          >
            Profile
          </Link>
          <Link
            href="/employee/history"
            className={`pb-1 ${
              isActive('/employee/history')
                ? 'font-semibold border-b-2 border-black text-black'
                : 'hover:text-black hover:underline'
            }`}
          >
            History
          </Link>
          <Link
            href="/employee/tasks"
            className={`pb-1 ${
              isActive('/employee/tasks')
                ? 'font-semibold border-b-2 border-black text-black'
                : 'hover:text-black hover:underline'
            }`}
          >
            Tasks
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-800 focus:outline-none"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Links with smooth animation */}
      <div
        className={`md:hidden bg-white overflow-hidden transition-all duration-500 ease-in-out
          ${isOpen ? 'max-h-96 opacity-100 py-4' : 'max-h-0 opacity-0 py-0'}
        `}
      >
        <div className="flex flex-col items-center space-y-4 font-inter text-gray-800">
          <Link
            href="/employee"
            className={`w-full text-center py-2 border-b-2 ${
              isActive('/employee')
                ? 'font-semibold border-black text-white bg-brandPurple'
                : 'border-transparent hover:text-white hover:bg-hoverPurple'
            }`}
          >
            Profile
          </Link>
          <Link
            href="/employee/history"
            className={`w-full text-center py-2 border-b-2 ${
              isActive('/employee/history')
                ? 'font-semibold border-black bg-brandPurple text-white'
                : 'border-transparent hover:text-white hover:bg-hoverPurple'
            }`}
          >
            History
          </Link>
          <Link
            href="/employee/tasks"
            className={`w-full text-center py-2 border-b-2 ${
              isActive('/employee/tasks')
                ? 'font-semibold border-black bg-brandPurple text-white'
                : 'border-transparent hover:text-white hover:bg-hoverPurple'
            }`}
          >
            Tasks
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

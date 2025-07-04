import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Fix TypeScript error by adding proper type annotation
  const isActive = (href: string): boolean => pathname === href;

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Image src="/NavImg.svg" alt="navigation logo" width={36} height={48} />
          <span className="ml-3 text-xl font-semibold text-gray-800">Rise Tech Village</span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-10 items-center font-inter text-gray-800 text-lg">
          <Link
            href="/employee"
            className={`pb-2 transition-all duration-200 ${
              isActive('/employee')
                ? 'font-semibold border-b-2 border-indigo-600 text-indigo-600'
                : 'hover:text-indigo-600 hover:border-indigo-300 border-b-2 border-transparent'
            }`}
          >
            Profile
          </Link>
          <Link
            href="/employee/history"
            className={`pb-2 transition-all duration-200 ${
              isActive('/employee/history')
                ? 'font-semibold border-b-2 border-indigo-600 text-indigo-600'
                : 'hover:text-indigo-600 hover:border-indigo-300 border-b-2 border-transparent'
            }`}
          >
            History
          </Link>
          <Link
            href="/employee/tasks"
            className={`pb-2 transition-all duration-200 ${
              isActive('/employee/tasks')
                ? 'font-semibold border-b-2 border-indigo-600 text-indigo-600'
                : 'hover:text-indigo-600 hover:border-indigo-300 border-b-2 border-transparent'
            }`}
          >
            Tasks
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-800 focus:outline-none p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Links with smooth animation */}
      <div
        className={`md:hidden bg-white overflow-hidden transition-all duration-500 ease-in-out border-t border-gray-200
          ${isOpen ? 'max-h-96 opacity-100 py-6' : 'max-h-0 opacity-0 py-0'}
        `}
      >
        <div className="flex flex-col items-center space-y-6 font-inter text-gray-800 px-6">
          <Link
            href="/employee"
            className={`w-full text-center py-4 px-6 rounded-lg text-lg transition-all duration-200 ${
              isActive('/employee')
                ? 'font-semibold text-white bg-indigo-600 shadow-md'
                : 'hover:text-indigo-600 hover:bg-indigo-50'
            }`}
            onClick={() => setIsOpen(false)}
          >
            Profile
          </Link>
          <Link
            href="/employee/history"
            className={`w-full text-center py-4 px-6 rounded-lg text-lg transition-all duration-200 ${
              isActive('/employee/history')
                ? 'font-semibold text-white bg-indigo-600 shadow-md'
                : 'hover:text-indigo-600 hover:bg-indigo-50'
            }`}
            onClick={() => setIsOpen(false)}
          >
            History
          </Link>
          <Link
            href="/employee/tasks"
            className={`w-full text-center py-4 px-6 rounded-lg text-lg transition-all duration-200 ${
              isActive('/employee/tasks')
                ? 'font-semibold text-white bg-indigo-600 shadow-md'
                : 'hover:text-indigo-600 hover:bg-indigo-50'
            }`}
            onClick={() => setIsOpen(false)}
          >
            Tasks
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

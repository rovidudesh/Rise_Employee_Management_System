import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, LogOut } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { logout } from "../../../lib/api";
import ThemeToggle from "../ThemeToggle";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string): boolean => pathname === href;

  const handleLogout = async () => {
    try {
      const response = await logout();

      if (response.success) {
        localStorage.removeItem("user");
        router.push("/");
      } else {
        console.error("Logout failed:", response.message);
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsOpen(false);
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Image
            src="/NavImg.svg"
            alt="navigation logo"
            width={36}
            height={48}
          />
          <span className="ml-3 text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200 transition-colors duration-300">
            Rise Tech Village
          </span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-6 lg:space-x-10 items-center font-inter text-gray-800 dark:text-gray-200 text-base lg:text-lg">
          {/* Theme Toggle */}
          <ThemeToggle />
          <Link
            href="/employee"
            className={`pb-2 transition-all duration-200 ${
              isActive("/employee")
                ? "font-semibold border-b-2 border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400"
                : "hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-300 dark:hover:border-indigo-500 border-b-2 border-transparent"
            }`}
          >
            ChatBot
          </Link>
          <Link
            href="/employee/history"
            className={`pb-2 transition-all duration-200 ${
              isActive("/employee/history")
                ? "font-semibold border-b-2 border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400"
                : "hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-300 dark:hover:border-indigo-500 border-b-2 border-transparent"
            }`}
          >
            History
          </Link>
          <Link
            href="/employee/tasks"
            className={`pb-2 transition-all duration-200 ${
              isActive("/employee/tasks")
                ? "font-semibold border-b-2 border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400"
                : "hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-300 dark:hover:border-indigo-500 border-b-2 border-transparent"
            }`}
          >
            Tasks
          </Link>

          

          {/* Desktop Logout Button */}
          <button
            onClick={handleLogout}
            className="ml-4 p-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
            aria-label="Logout"
          >
            <LogOut size={24} />
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-2">
          <ThemeToggle />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-800 dark:text-gray-200 focus:outline-none p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Links */}
      <div
        className={`md:hidden bg-white dark:bg-gray-900 overflow-hidden transition-all duration-500 ease-in-out border-t border-gray-200 dark:border-gray-800
          ${isOpen ? "max-h-96 opacity-100 py-6" : "max-h-0 opacity-0 py-0"}
        `}
      >
        <div className="flex flex-col items-center space-y-4 sm:space-y-6 font-inter text-gray-800 dark:text-gray-200 px-4 sm:px-6">
          <Link
            href="/employee"
            className={`w-full text-center py-3 sm:py-4 px-4 sm:px-6 rounded-lg text-base sm:text-lg transition-all duration-200 ${
              isActive("/employee")
                ? "font-semibold text-white bg-indigo-600 dark:bg-indigo-500 shadow-md"
                : "hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
            }`}
            onClick={() => setIsOpen(false)}
          >
            ChatBot
          </Link>
          <Link
            href="/employee/history"
            className={`w-full text-center py-3 sm:py-4 px-4 sm:px-6 rounded-lg text-base sm:text-lg transition-all duration-200 ${
              isActive("/employee/history")
                ? "font-semibold text-white bg-indigo-600 dark:bg-indigo-500 shadow-md"
                : "hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
            }`}
            onClick={() => setIsOpen(false)}
          >
            History
          </Link>
          <Link
            href="/employee/tasks"
            className={`w-full text-center py-3 sm:py-4 px-4 sm:px-6 rounded-lg text-base sm:text-lg transition-all duration-200 ${
              isActive("/employee/tasks")
                ? "font-semibold text-white bg-indigo-600 dark:bg-indigo-500 shadow-md"
                : "hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
            }`}
            onClick={() => setIsOpen(false)}
          >
            Tasks
          </Link>

          {/* Mobile Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center py-3 sm:py-4 px-4 sm:px-6 rounded-lg text-base sm:text-lg transition-all duration-200 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <LogOut size={24} className="mr-2" />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

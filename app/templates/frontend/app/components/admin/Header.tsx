import React, { useState } from "react";
import Image from "next/image";
import { Menu, X, LogOut } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import ThemeToggle from "../ThemeToggle";
import { logout } from "../../../lib/api";
import Link from "next/link";

const navLinks = [
  {
    id: "chatbot",
    label: "Admin Assistant",
    href: "/admin",
  },
  {
    id: "register-user",
    label: "Register Users",
    href: "/admin/register-user",
  },
  {
    id: "manage-users",
    label: "Manage Users",
    href: "/admin/manage-users",
  },
  {
    id: "profile",
    label: "Admin Profile",
    href: "/admin/profile",
  },
];

const Header: React.FC<{
  onMenuClick?: () => void;
  showMenuButton?: boolean;
  activeComponent?: string;
  setActiveComponent?: (component: string) => void;
}> = ({
  onMenuClick,
  showMenuButton = false,
  activeComponent,
  setActiveComponent,
}) => {
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
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsOpen(false);
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-lg dark:shadow-2xl dark:shadow-black/30 border-b border-gray-200 dark:border-gray-800 transition-all duration-300 relative z-10">
      {/* Enhanced shadow overlay for better depth */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-b from-transparent to-black/10 dark:to-black/50 pointer-events-none"></div>

      <div className="container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center relative z-10">
        <div className="flex items-center">
          <Image
            src="/NavImg.svg"
            alt="navigation logo"
            width={36}
            height={48}
          />
          <span className="ml-3 text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200 transition-colors duration-300 drop-shadow-sm">
            Rise Tech Village
          </span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-6 lg:space-x-10 items-center font-inter text-gray-800 dark:text-gray-200 text-base lg:text-lg">
          <ThemeToggle />
          {navLinks.map((link) => (
            <Link
              key={link.id}
              href={link.href}
              className={`pb-2 transition-all duration-200 ${
                isActive(link.href)
                  ? "font-semibold border-b-2 border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400 drop-shadow-sm"
                  : "hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-300 dark:hover:border-indigo-500 border-b-2 border-transparent hover:drop-shadow-sm"
              }`}
              onClick={() => setActiveComponent && setActiveComponent(link.id)}
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="ml-4 p-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 hover:shadow-md hover:drop-shadow-sm"
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
            className="text-gray-800 dark:text-gray-200 focus:outline-none p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 hover:shadow-md hover:drop-shadow-sm"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Links */}
      <div
        className={`md:hidden bg-white dark:bg-gray-900 overflow-hidden transition-all duration-500 ease-in-out border-t border-gray-200 dark:border-gray-800 shadow-inner
          ${
            isOpen
              ? "max-h-96 opacity-100 py-6 shadow-lg dark:shadow-2xl dark:shadow-black/30"
              : "max-h-0 opacity-0 py-0"
          }
        `}
      >
        {isOpen && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-b from-transparent to-black/10 dark:to-black/50 pointer-events-none"></div>
        )}

        <div className="flex flex-col items-center space-y-4 sm:space-y-6 font-inter text-gray-800 dark:text-gray-200 px-4 sm:px-6 relative z-10">
          {navLinks.map((link) => (
            <Link
              key={link.id}
              href={link.href}
              className={`w-full text-center py-3 sm:py-4 px-4 sm:px-6 rounded-lg text-base sm:text-lg transition-all duration-200 ${
                isActive(link.href)
                  ? "font-semibold text-white bg-indigo-600 dark:bg-indigo-500 shadow-md drop-shadow-md"
                  : "hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:shadow-sm hover:drop-shadow-sm"
              }`}
              onClick={() => {
                setIsOpen(false);
                setActiveComponent && setActiveComponent(link.id);
              }}
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center py-3 sm:py-4 px-4 sm:px-6 rounded-lg text-base sm:text-lg transition-all duration-200 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:shadow-sm hover:drop-shadow-sm"
          >
            <LogOut size={24} className="mr-2" />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Header;

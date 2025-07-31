import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ThemeToggle from "../ThemeToggle";
import { FaBars, FaSignOutAlt } from "react-icons/fa";
import { logout } from "../../../lib/api";

interface HeaderProps {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
  activeComponent: string;
  setActiveComponent: (component: string) => void;
}

const navigationItems = [
  {
    id: "chatbot",
    label: "Manager Assistant",
    description: "AI Assistant for team management",
    href: "/manager",
  },
  {
    id: "users",
    label: "My Team",
    description: "View team members",
    href: "/manager/all-tasks",
  },
];

const Header: React.FC<HeaderProps> = ({
  onMenuClick,
  showMenuButton = false,
  activeComponent,
  setActiveComponent,
}) => {
  const router = useRouter();

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
    }
  };

  return (
    <header className="w-full bg-white dark:bg-gray-900 shadow-lg border-b border-gray-200 dark:border-gray-800 py-4 px-4 sm:px-6 lg:px-8 flex items-center justify-between font-inter transition-colors duration-300 z-10">
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

      {/* Right Section: Theme Toggle, Navigation & Logout */}
      <div className="flex items-center space-x-2">
        <ThemeToggle />
        <nav className="flex space-x-2 sm:space-x-4">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveComponent(item.id)}
              className={`flex items-center px-3 py-2 rounded transition-all duration-200
                ${
                  activeComponent === item.id
                    ? "bg-indigo-50 dark:bg-indigo-900/50 border-b-2 border-indigo-500 text-indigo-700 dark:text-indigo-300"
                    : "hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300"
                }
              `}
            >
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
        <button
          onClick={handleLogout}
          className="flex items-center px-3 py-2 rounded-lg transition-colors duration-200 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <FaSignOutAlt className="mr-2" />
          <span className="hidden sm:inline"></span>
        </button>
      </div>
    </header>
  );
};

export default Header;

"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FaTasks,
  FaRobot,
  FaUser,
  FaUserPlus,
  FaUsers,
  FaTimes,
  FaSignOutAlt,
} from "react-icons/fa";
import { logout } from "../../../lib/api";
import ThemeToggle from "../ThemeToggle";

interface SideNavigationProps {
  activeComponent: string;
  setActiveComponent: (component: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const SideNavigation: React.FC<SideNavigationProps> = ({
  activeComponent,
  setActiveComponent,
  isOpen,
  onToggle,
}) => {
  const pathname = usePathname();
  const router = useRouter();

  const navigationItems = [
    {
      id: "chatbot",
      label: "Manager Assistant",
      icon: "🤖",
      description: "AI Assistant for team management",
      href: "/manager",
    },
    {
      id: "users",
      label: "My Team",
      icon: "👥",
      description: "View team members",
      href: "/manager/all-tasks",
    },
  ];

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
      onToggle(); // Close sidebar
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={onToggle}
          className="fixed inset-0 bg-black bg-opacity-30 z-40 lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          bg-white dark:bg-slate-800 shadow-md rounded-none lg:rounded-lg border-r border-gray-200 dark:border-gray-700 lg:border
          transition-all duration-300 ease-in-out
          flex flex-col p-4 sm:p-6
          
          fixed top-0 left-0 w-72 sm:w-80 z-50 h-full
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          
          lg:static lg:translate-x-0 lg:shadow-lg lg:h-full lg:max-h-full
        `}
      >
        {/* Header with Close Button (Mobile) and Theme Toggle */}
        <div className="flex items-center justify-between mb-4 sm:mb-6 flex-shrink-0 pt-2 lg:pt-0">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-200">
            Manager Dashboard
          </h2>
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            {/* Close button for mobile */}
            <button
              onClick={onToggle}
              className="lg:hidden p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors duration-200"
              aria-label="Close menu"
            >
              <FaTimes size={18} />
            </button>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto">
          <nav className="space-y-2 sm:space-y-3">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveComponent(item.id);
                  onToggle(); // Close mobile menu
                }}
                className={`w-full text-left p-3 sm:p-4 rounded-lg transition-all duration-200 ${
                  activeComponent === item.id
                    ? "bg-indigo-50 dark:bg-indigo-900/50 border-l-4 border-indigo-500 text-indigo-700 dark:text-indigo-300"
                    : "hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-xl sm:text-2xl flex-shrink-0">
                    {item.icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-sm sm:text-base truncate">
                      {item.label}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                      {item.description}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </nav>
        </div>

        {/* Logout Button */}
        <div className="border-t dark:border-gray-600 pt-3 sm:pt-4 flex-shrink-0 mt-4">
          <button
            onClick={handleLogout}
            className="flex items-center px-3 py-3 sm:px-5 sm:py-4 rounded-lg transition-colors duration-200 w-full text-left text-base sm:text-lg text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <FaSignOutAlt className="mr-3 sm:mr-4 text-base sm:text-xl flex-shrink-0" />
            <span className="truncate">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default SideNavigation;

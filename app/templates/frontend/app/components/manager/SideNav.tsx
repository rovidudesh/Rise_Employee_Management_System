"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FaTasks,
  FaRobot,
  FaUser,
  FaUserPlus,
  FaUsers,
  FaBars,
  FaTimes,
  FaSignOutAlt,
} from "react-icons/fa";
import { logout } from "../../../lib/api";
import ThemeToggle from "../ThemeToggle";

interface SideNavigationProps {
  activeComponent: string;
  setActiveComponent: (component: string) => void;
}

const SideNavigation: React.FC<SideNavigationProps> = ({
  activeComponent,
  setActiveComponent,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

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

  const toggleSidebar = () => setIsOpen((prev) => !prev);

  const handleLogout = async () => {
    try {
      const response = await logout();

      if (response.success) {
        // Clear any stored user data
        localStorage.removeItem("user");

        // Redirect to login page
        router.push("/");
      } else {
        console.error("Logout failed:", response.message);
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsOpen(false); // Close sidebar on mobile
    }
  };

  return (
    <>
      {/* Hamburger button: fixed top-left, only on mobile */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-3 rounded-md bg-white dark:bg-slate-800 shadow-md text-gray-700 dark:text-gray-200 transition-colors duration-300 lg:hidden"
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? <FaTimes size={28} /> : <FaBars size={28} />}
      </button>

      {/* Overlay backdrop, close sidebar if click outside */}
      {isOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black bg-opacity-30 z-40 lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-white dark:bg-slate-800 p-6 shadow-md w-80
          transform transition-all duration-300 ease-in-out
          z-50
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:static lg:translate-x-0 lg:shadow-none
          rounded-r-lg
          flex flex-col
          border-r border-gray-200 dark:border-gray-700
        `}
      >
        {/* Header with Theme Toggle */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
            Manager Dashboard
          </h2>
          <ThemeToggle />
        </div>

        {/* Navigation Links */}
        <div className="flex-1">
          <nav className="space-y-3">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveComponent(item.id);
                  toggleSidebar();
                }}
                className={`w-full text-left p-4 rounded-lg transition-all duration-200 ${
                  activeComponent === item.id
                    ? "bg-indigo-50 dark:bg-indigo-900/50 border-l-4 border-indigo-500 text-indigo-700 dark:text-indigo-300"
                    : "hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <div className="font-semibold">{item.label}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {item.description}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </nav>
        </div>

        {/* Logout Button */}
        <div className="border-t dark:border-gray-600 pt-4">
          <button
            onClick={handleLogout}
            className="flex items-center px-5 py-4 rounded-lg transition-colors duration-200 w-full text-left text-lg text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <FaSignOutAlt className="mr-4 text-xl" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default SideNavigation;

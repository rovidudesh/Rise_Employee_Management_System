"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FaUser,
  FaUserPlus,
  FaUsers,
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaRobot,
} from "react-icons/fa";
import { logout } from "../../../lib/api";

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
      label: "Admin Assistant",
      icon: "🤖",
      description: "AI Assistant for system administration",
      href: "/admin",
    },
    {
      id: "register-user",
      label: "Register Users",
      icon: "👤➕",
      description: "Add new users to the system",
      href: "/admin/register-user",
    },
    {
      id: "manage-users",
      label: "Manage Users",
      icon: "👥",
      description: "View and manage all system users",
      href: "/admin/manage-users",
    },
    {
      id: "profile",
      label: "Admin Profile",
      icon: "👨‍💼",
      description: "View and edit admin profile",
      href: "/admin/profile",
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
      {/* Mobile hamburger button - improved positioning and styling */}
      <button
        onClick={toggleSidebar}
        className="fixed top-3 left-3 z-50 p-2.5 rounded-lg bg-white shadow-lg text-gray-700 border border-gray-200 lg:hidden hover:bg-gray-50 transition-all duration-200"
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      {/* Overlay backdrop with improved opacity */}
      {isOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-200"
          aria-hidden="true"
        />
      )}

      {/* Sidebar - optimized for mobile */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-white shadow-xl
          transform transition-transform duration-300 ease-in-out
          z-50
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:static lg:translate-x-0 lg:shadow-md
          flex flex-col
          w-72 sm:w-80
          overflow-y-auto
        `}
      >
        {/* Header - improved mobile layout */}
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">
              Admin Dashboard
            </h2>
            {/* Close button on mobile */}
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-1.5 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors duration-200"
              aria-label="Close menu"
            >
              <FaTimes size={18} />
            </button>
          </div>
        </div>

        {/* Navigation Links - improved mobile spacing */}
        <div className="flex-1 p-3 sm:p-4">
          <nav className="space-y-2">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveComponent(item.id);
                  if (window.innerWidth < 1024) {
                    setTimeout(() => toggleSidebar(), 100); // Small delay for better UX
                  }
                }}
                className={`w-full text-left p-3 sm:p-4 rounded-lg transition-all duration-200 touch-manipulation ${
                  activeComponent === item.id
                    ? "bg-red-50 border-l-4 border-red-500 text-red-700 shadow-sm"
                    : "hover:bg-gray-50 text-gray-700 active:bg-gray-100"
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
                    <div className="text-xs sm:text-sm text-gray-500 hidden sm:block">
                      {item.description}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </nav>
        </div>

        {/* Logout Button - improved mobile layout */}
        <div className="border-t border-gray-200 p-3 sm:p-4">
          <button
            onClick={handleLogout}
            className="flex items-center w-full p-3 sm:p-4 rounded-lg transition-colors duration-200 text-red-600 hover:text-red-700 hover:bg-red-50 active:bg-red-100 touch-manipulation"
          >
            <FaSignOutAlt className="mr-3 text-lg sm:text-xl flex-shrink-0" />
            <span className="font-medium text-sm sm:text-base">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default SideNavigation;

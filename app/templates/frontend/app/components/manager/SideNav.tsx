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

const SideNavigation = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    {
      section: "TASKS",
      items: [
        {
          href: "/manager",
          label: "Chatbot",
          icon: <FaRobot className="mr-4 text-xl" />,
        },
        {
          href: "/manager/all-tasks",
          label: "Team Members",
          icon: <FaTasks className="mr-4 text-xl" />,
        },
      ],
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
        className="fixed top-4 left-4 z-50 p-3 rounded-md bg-white shadow-md text-gray-700 lg:hidden"
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
          fixed top-0 left-0 h-full bg-white p-6 shadow-md w-80
          transform transition-transform duration-300 ease-in-out
          z-50
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:static lg:translate-x-0 lg:shadow-none
          rounded-r-lg
          flex flex-col
        `}
      >
        {/* Navigation Links */}
        <div className="flex-1">
          {links.map((section, idx) => (
            <div key={idx} className="mb-10">
              <h3 className="text-xl font-semibold text-gray-800 mb-8">
                {section.section}
              </h3>
              <nav>
                <ul>
                  {section.items.map((item, i) => {
                    const isActive = pathname === item.href;
                    return (
                      <li key={i} className="mb-5 last:mb-0">
                        <Link
                          href={item.href}
                          className={`flex items-center px-5 py-4 rounded-lg transition-colors duration-200 text-lg ${
                            isActive
                              ? "text-indigo-600 font-semibold border-l-4 border-indigo-600 bg-indigo-50"
                              : "text-gray-600 hover:text-indigo-600 hover:bg-gray-50"
                          }`}
                          onClick={() => setIsOpen(false)} // close sidebar on mobile when link clicked
                        >
                          {item.icon}
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>
          ))}
        </div>

        {/* Logout Button */}
        <div className="border-t pt-4">
          <button
            onClick={handleLogout}
            className="flex items-center px-5 py-4 rounded-lg transition-colors duration-200 w-full text-left text-lg text-red-600 hover:text-red-700 hover:bg-red-50"
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

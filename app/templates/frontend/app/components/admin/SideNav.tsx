'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaUser, FaUserPlus, FaUsers, FaBars, FaTimes } from 'react-icons/fa';

const SideNavigation = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    {
      section: 'ADMINISTRATION',
      items: [
        { href: '/admin', label: 'Register Users', icon: <FaUserPlus className="mr-3 text-xl" /> },
        { href: '/admin/manage-users', label: 'Manage Users', icon: <FaUsers className="mr-3 text-xl" /> },
        { href: '/admin/profile', label: 'Profile', icon: <FaUser className="mr-3 text-xl" /> },
      ],
    },
  ];

  const toggleSidebar = () => setIsOpen((prev) => !prev);

  return (
    <>
      {/* Hamburger button: fixed top-left, only on mobile */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-3 rounded-md bg-white shadow-md text-gray-700 lg:hidden"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
      >
        {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
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
          fixed top-0 left-0 h-full bg-white p-6 shadow-md w-72
          transform transition-transform duration-300 ease-in-out
          z-50
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:static lg:translate-x-0 lg:shadow-none
          rounded-r-lg
        `}
      >
        {links.map((section, idx) => (
          <div key={idx} className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">{section.section}</h3>
            <nav>
              <ul>
                {section.items.map((item, i) => {
                  const isActive = pathname === item.href;
                  return (
                    <li key={i} className="mb-4 last:mb-0">
                      <Link
                        href={item.href}
                        className={`flex items-center px-4 py-3 rounded transition-colors duration-200 ${
                          isActive
                            ? 'text-indigo-600 font-semibold border-l-4 border-indigo-600 bg-indigo-50'
                            : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
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
      </aside>
    </>
  );
};

export default SideNavigation;

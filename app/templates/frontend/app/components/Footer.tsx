import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-brandPurple dark:bg-gray-900 text-white py-4 font-inter border-t border-purple-700 dark:border-gray-800 transition-colors duration-300">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center text-xs sm:text-sm px-4">
        <p className="mb-2 sm:mb-0 text-white dark:text-gray-100 transition-colors duration-300">
          &copy;2025 Rise Tech Village. All rights reserved
        </p>
        <nav className="flex flex-wrap justify-center sm:justify-start space-x-4 sm:space-x-6">
          <Link
            href="/security"
            className="hover:underline text-white dark:text-gray-200 hover:text-gray-200 dark:hover:text-white transition-colors duration-200"
          >
            Security
          </Link>
          <Link
            href="/privacy"
            className="hover:underline text-white dark:text-gray-200 hover:text-gray-200 dark:hover:text-white transition-colors duration-200"
          >
            Privacy
          </Link>
          <Link
            href="/cookie-preferences"
            className="hover:underline text-white dark:text-gray-200 hover:text-gray-200 dark:hover:text-white transition-colors duration-200"
          >
            Cookie Preferences
          </Link>
          <Link
            href="/terms"
            className="hover:underline text-white dark:text-gray-200 hover:text-gray-200 dark:hover:text-white transition-colors duration-200"
          >
            Terms
          </Link>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;

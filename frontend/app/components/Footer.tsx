import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-brandPurple text-white py-4 font-inter">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center text-xs sm:text-sm px-4">
        <p className="mb-2 sm:mb-0">
          &copy;2025 Rise Tech Village. All rights reserved
        </p>
        <nav className="flex flex-wrap justify-center sm:justify-start space-x-4 sm:space-x-6">
          <Link href="/security" className="hover:underline">
            Security
          </Link>
          <Link href="/privacy" className="hover:underline">
            Privacy
          </Link>
          <Link href="/cookie-preferences" className="hover:underline">
            Cookie Preferences
          </Link>
          <Link href="/terms" className="hover:underline">
            Terms
          </Link>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;

'use client';
import React from 'react';
import Navbar from '../components/employee/Navbar';
import Footer from '../components/Footer';
import ProfileDashboard from '../components/employee/ProfileDashboard';

const Page = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow">
        <ProfileDashboard />
      </main>

      <Footer />
    </div>
  );
};

export default Page;

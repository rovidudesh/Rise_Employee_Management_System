'use client';
import React from 'react';
import Navbar from '../components/employee/Navbar';
import Footer from '../components/Footer';
import Chatbot from '../components/employee/Chatbot';

const Page = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow">
        <Chatbot />
      </main>

      <Footer />
    </div>
  );
};

export default Page;

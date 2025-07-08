'use client';
import React from 'react';
import Navbar from '../components/employee/Navbar';
import Footer from '../components/Footer';
import Chatbot from '../components/employee/Chatbot';
import AssignedTasksQuickView from '../components/employee/AssignedTasksQuickView';

const Page = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Chatbot - Main Content */}
            <div className="flex-1">
              <Chatbot />
            </div>
            
            {/* Assigned Tasks Quick View - Wider Sidebar */}
            <div className="lg:w-96">
              <AssignedTasksQuickView />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Page;

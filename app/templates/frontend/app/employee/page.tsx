"use client";
import React from "react";
import Navbar from "../components/employee/Navbar";
import Footer from "../components/Footer";
import Chatbot from "../components/employee/Chatbot";
import AssignedTasksQuickView from "../components/employee/AssignedTasksQuickView";

const Page = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-slate-900 transition-colors duration-300">
      <Navbar />

      <main className="flex-grow bg-gray-50 dark:bg-slate-800 transition-colors duration-300">
        <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
            {/* Chatbot - Main Content */}
            <div className="flex-1 min-w-0">
              <Chatbot />
            </div>

            {/* Assigned Tasks Quick View - Sidebar */}
            <div className="w-full lg:w-96 xl:w-[400px] flex-shrink-0">
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

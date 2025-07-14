"use client";
import React from "react";
import Navbar from "../../components/employee/Navbar";
import Footer from "../../components/Footer";
import HistoryTable from "../../components/employee/HistoryTable";

const HistoryPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-slate-900 transition-colors duration-300">
      <Navbar />

      <main className="flex-grow bg-gray-50 dark:bg-slate-800 transition-colors duration-300">
        <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
          <HistoryTable />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HistoryPage;

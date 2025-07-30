"use client";
import React from "react";
import Navbar from "../components/employee/Navbar";
import Footer from "../components/Footer";
import Chatbot from "../components/employee/Chatbot";

const Page = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-slate-900 transition-colors duration-300">
      <Navbar />
      <main className="flex-grow flex flex-col">
        <Chatbot />
      </main>
      <Footer />
    </div>
  );
};

export default Page;

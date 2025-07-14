"use client";
import React, { useState } from "react";
import Header from "../components/admin/Header";
import Chatbot from "../components/manager/Chatbot";
import AllUsers from "../components/manager/AllUsers";
import TeamQuickView from "../components/manager/TeamQuickView";
import Footer from "../components/Footer";
import SideNavigation from "../components/manager/SideNav";

const Page = () => {
  const [activeComponent, setActiveComponent] = useState("chatbot");

  const renderActiveComponent = () => {
    switch (activeComponent) {
      case "chatbot":
        return (
          <div className="flex flex-col lg:flex-row gap-6 w-full">
            <div className="flex-1">
              <Chatbot />
            </div>
            <div className="w-full lg:w-auto">
              <TeamQuickView />
            </div>
          </div>
        );
      case "users":
        return <AllUsers />;
      default:
        return (
          <div className="flex flex-col lg:flex-row gap-6 w-full">
            <div className="flex-1">
              <Chatbot />
            </div>
            <div className="w-full lg:w-auto">
              <TeamQuickView />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-slate-900 transition-colors duration-300">
      <Header />

      {/* Main Content Area - Updated Layout */}
      <main className="flex-grow p-4 bg-gray-50 dark:bg-slate-800 transition-colors duration-300">
        <div className="flex gap-6 h-full">
          {/* Sidebar - Height matches content */}
          <div className="w-80 hidden lg:block">
            <SideNavigation
              activeComponent={activeComponent}
              setActiveComponent={setActiveComponent}
            />
          </div>

          {/* Dynamic Content - Full height */}
          <div className="flex-1 bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-300">
            <div className="h-full p-6">{renderActiveComponent()}</div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Page;

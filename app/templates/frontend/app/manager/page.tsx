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

      {/* Main Content Area */}
      <main className="flex-grow flex p-4 gap-6 bg-gray-50 dark:bg-slate-800 transition-colors duration-300">
        {/* Sidebar rendered directly */}
        <SideNavigation
          activeComponent={activeComponent}
          setActiveComponent={setActiveComponent}
        />

        {/* Dynamic Content */}
        <div className="flex-1 flex justify-center bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <div className="w-full p-6">{renderActiveComponent()}</div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Page;

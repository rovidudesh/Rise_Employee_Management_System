"use client";
import React, { useState } from "react";
import Header from "../components/manager/Header";
import Chatbot from "../components/manager/Chatbot";
import AllUsers from "../components/manager/AllUsers";
import TeamQuickView from "../components/manager/TeamQuickView";
import Footer from "../components/Footer";
import SideNavigation from "../components/manager/SideNav";

const Page = () => {
  const [activeComponent, setActiveComponent] = useState("chatbot");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const renderActiveComponent = () => {
    switch (activeComponent) {
      case "chatbot":
        return (
          <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 lg:gap-6 w-full h-full">
            <div className="flex-1 min-h-0">
              <Chatbot />
            </div>
          </div>
        );
      case "users":
        return (
          <div className="w-full h-full">
            <AllUsers />
          </div>
        );
      default:
        return (
          <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 lg:gap-6 w-full h-full">
            <div className="flex-1 min-h-0">
              <Chatbot />
            </div>
            <div className="w-full lg:w-auto lg:max-w-md xl:max-w-lg flex-shrink-0">
              <TeamQuickView />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-slate-900 transition-colors duration-300">
      <Header
        onMenuClick={toggleSidebar}
        showMenuButton={true}
        activeComponent={activeComponent}
        setActiveComponent={setActiveComponent}
      />

      {/* Main Content Area */}
      <main className="flex-1 p-2 sm:p-4 bg-gray-50 dark:bg-slate-800 transition-colors duration-300 overflow-hidden">
        <div className="flex gap-0 lg:gap-6 h-full">
          

          {/* Mobile Sidebar */}
          <div className="lg:hidden">
            <SideNavigation
              activeComponent={activeComponent}
              setActiveComponent={setActiveComponent}
              isOpen={sidebarOpen}
              onToggle={toggleSidebar}
            />
          </div>

          {/* Dynamic Content */}
          <div className="flex-1 bg-white dark:bg-slate-900  shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-300 overflow-hidden min-h-0">
            <div className="h-full p-2 sm:p-4 lg:p-6 overflow-hidden">
              {renderActiveComponent()}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Page;

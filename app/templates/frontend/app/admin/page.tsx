"use client";
import React, { useState } from "react";
import Header from "../components/admin/Header";
import Footer from "../components/Footer";
import SideNavigation from "../components/admin/SideNav";
import RegisterUserForm from "../components/admin/RegisterForm";
import Chatbot from "../components/admin/Chatbot";
import ManageUsersTable from "../components/admin/ManageUsersTable";
import ProfileDashboard from "../components/admin/ProfileDashboard";

const Page = () => {
  const [activeComponent, setActiveComponent] = useState("chatbot");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const renderContent = () => {
    switch (activeComponent) {
      case "chatbot":
        return <Chatbot />;
      case "register-user":
        return <RegisterUserForm />;
      case "manage-users":
        return <ManageUsersTable />;
      case "profile":
        return <ProfileDashboard />;
      default:
        return <Chatbot />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-slate-900 transition-colors duration-300">
      <Header onMenuClick={toggleSidebar} showMenuButton={true} />

      {/* Main Content Area */}
      <main className="flex-grow flex p-4 gap-6 bg-gray-50 dark:bg-slate-800 transition-colors duration-300">
        {/* Sidebar with required props */}
        <SideNavigation
          activeComponent={activeComponent}
          setActiveComponent={setActiveComponent}
          isOpen={isSidebarOpen}
          onToggle={toggleSidebar}
        />

        {/* Dynamic Content */}
        <div className="flex-1 flex justify-center">
          <div className="w-full">{renderContent()}</div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Page;

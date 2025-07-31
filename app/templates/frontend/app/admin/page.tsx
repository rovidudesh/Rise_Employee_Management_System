"use client";
import React, { useState } from "react";
import Header from "../components/admin/Header";
import Footer from "../components/Footer";
import RegisterUserForm from "../components/admin/RegisterForm";
import Chatbot from "../components/admin/Chatbot";
import ManageUsersTable from "../components/admin/ManageUsersTable";
import ProfileDashboard from "../components/admin/ProfileDashboard";

const Page = () => {
  const [activeComponent, setActiveComponent] = useState("chatbot");

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
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-slate-800 transition-colors duration-300">
      <Header
        activeComponent={activeComponent}
        setActiveComponent={setActiveComponent}
      />

      {/* Main Content Area */}
      <main className="flex-grow flex bg-gray-50 dark:bg-slate-800 transition-colors duration-300">
        {/* Dynamic Content */}
        <div className="flex-1 flex flex-col">{renderContent()}</div>
      </main>

      <Footer />
    </div>
  );
};

export default Page;

"use client";
import React, { useState } from "react";
import Header from "../../components/admin/Header";
import Footer from "../../components/Footer";
import SideNavigation from "../../components/admin/SideNav";
import RegisterUserForm from "../../components/admin/RegisterForm";

const Page = () => {
  const [activeComponent, setActiveComponent] = useState("register-user");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-slate-900 transition-colors duration-300">
      <Header onMenuClick={toggleSidebar} showMenuButton={true} />

      <main className="flex-grow flex gap-8 px-8 py-6 bg-gray-50 dark:bg-slate-800 transition-colors duration-300">
        {/* Sidebar with required props */}
        <SideNavigation
          activeComponent={activeComponent}
          setActiveComponent={setActiveComponent}
          isOpen={isSidebarOpen}
          onToggle={toggleSidebar}
        />

        {/* Main content area that fills the remaining space */}
        <div className="flex-grow min-w-0 flex justify-center items-start">
          <div className="w-full max-w-4xl py-4">
            <RegisterUserForm />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Page;

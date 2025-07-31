"use client";
import React, { useState } from "react";
import Header from "../../components/admin/Header";
import Footer from "../../components/Footer";
import ProfileDashboard from "../../components/admin/ProfileDashboard";
import SideNavigation from "../../components/admin/SideNav";

const Page = () => {
  const [activeComponent, setActiveComponent] = useState("profile");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-slate-900 transition-colors duration-300">
      <Header onMenuClick={toggleSidebar} showMenuButton={true} />

      <main className="flex-grow flex gap-8 px-8 py-6 bg-gray-50 dark:bg-slate-800 transition-colors duration-300">
        {/* Sidebar with required props */}
        

        {/* Dashboard content flex-grow fills the rest */}
        <div className="flex-grow min-w-0">
          <ProfileDashboard />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Page;

"use client";
import React, { useState } from "react";
import Header from "../../components/admin/Header";
import ManageUsersTable from "../../components/admin/ManageUsersTable";
import Footer from "../../components/Footer";
import SideNavigation from "../../components/admin/SideNav";

const Page = () => {
  const [activeComponent, setActiveComponent] = useState("manage-users");

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-slate-900 transition-colors duration-300">
      <Header />

      <main className="flex-grow flex gap-8 px-8 py-6 bg-gray-50 dark:bg-slate-800 transition-colors duration-300">
        {/* Sidebar with required props */}
        <SideNavigation
          activeComponent={activeComponent}
          setActiveComponent={setActiveComponent}
        />

        {/* Main content area that fills the remaining space */}
        <div className="flex-grow min-w-0">
          <ManageUsersTable />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Page;

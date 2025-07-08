"use client";
import React from "react";
import Header from "../../components/admin/Header";
import Footer from "../../components/Footer";
import AllTasksTable from "../../components/manager/AllUsers";
import SideNavigation from "../../components/manager/SideNav";

const Page = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 overflow-x-hidden">
      <Header />

      <main className="flex-grow flex p-4 gap-6 max-w-screen overflow-x-hidden">
        {/* Sidebar rendered directly, no fixed width wrapper */}
        <SideNavigation />

        {/* Table takes remaining space */}
        <div className="flex-1 overflow-x-auto">
          <AllTasksTable />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Page;

"use client";
import React, { useState } from "react";
import Header from "../../components/admin/Header";
import Footer from "../../components/Footer";
import SideNavigation from "../../components/admin/SideNav";
import RegisterUserForm from "../../components/admin/RegisterForm";

const Page = () => {
  const [activeComponent, setActiveComponent] = useState("register-user");

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />

      <main className="flex-grow flex gap-8 px-8 py-6">
        {/* Sidebar with required props */}
        <SideNavigation
          activeComponent={activeComponent}
          setActiveComponent={setActiveComponent}
        />

        {/* Main content area that fills the remaining space */}
        <div className="flex-grow min-w-0">
          <RegisterUserForm />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Page;

'use client'
import React from 'react'
import Header from '../../components/admin/Header';
import ManageUsersTable from '../../components/admin/ManageUsersTable';
import Footer from '../../components/Footer';
import SideNavigation from '../../components/admin/SideNav';

const Page = () => {
  return (
    <div className='flex flex-col min-h-screen bg-gray-100'>
      <Header />
      
      <main className="flex-grow flex gap-8 px-8 py-6">
        {/* Sidebar rendered directly, no wrapper div */}
        <SideNavigation />

        {/* Main content area that fills the remaining space */}
        <div className="flex-grow min-w-0">
          <ManageUsersTable />
        </div>
      </main>
      
      <Footer />
    </div>
  )
}

export default Page;

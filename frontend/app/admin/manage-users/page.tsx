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
      <main className="flex-grow flex items-center justify-center p-4"> 
        <div>
          <SideNavigation />
        </div>
        <ManageUsersTable />
      </main>
      <Footer />
    </div>
  )
}

export default Page;

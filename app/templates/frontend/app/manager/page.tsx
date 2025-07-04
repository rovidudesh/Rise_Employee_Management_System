'use client'
import React from 'react'
import Header from '../components/admin/Header'
import Chatbot from '../components/manager/Chatbot'
import Footer from '../components/Footer'
import SideNavigation from '../components/manager/SideNav'

const Page = () => {
  return (
    <div className='flex flex-col min-h-screen bg-gray-100'>
      <Header />

      {/* Main Content Area */}
      <main className="flex-grow flex p-4 gap-6">
        {/* Sidebar rendered directly */}
        <SideNavigation />

        {/* Chatbot */}
        <div className="flex-1 flex justify-center">
          <Chatbot />
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Page;

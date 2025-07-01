'use client'
import React from 'react'
import Header from '../../components/admin/Header'
import Footer from '../../components/Footer'
import ProfileDashboard from '../../components/admin/ProfileDashboard'
import SideNavigation from '../../components/admin/SideNav'

const Page = () => {
  return (
    <div className='flex flex-col min-h-screen bg-gray-100'>
      <Header />

      <main className="flex-grow flex gap-8 px-8 py-6">
        {/* Sidebar rendered directly, no fixed width wrapper */}
        <SideNavigation />

        {/* Dashboard content flex-grow fills the rest */}
        <div className="flex-grow min-w-0">
          <ProfileDashboard />
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Page;

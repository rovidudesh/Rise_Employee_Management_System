'use client'
import React from 'react'
import Header from '../../components/admin/Header';
import Footer from '../../components/Footer';
import RegisterUserForm from '../../components/admin/RegisterForm';
import SideNavigation from '../../components/admin/SideNav';



const Page = () => {
  return (
    <div className='flex flex-col min-h-screen bg-gray-100'>
      <Header />
      <main className="flex-grow flex items-center justify-center p-4"> 
        <SideNavigation />
        <RegisterUserForm />
      </main>
      <Footer />
    </div>
  )
}

export default Page;

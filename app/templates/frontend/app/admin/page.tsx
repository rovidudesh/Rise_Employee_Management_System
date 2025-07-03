'use client'
import React from 'react'
import Header from '../components/admin/Header'
import Footer from '../components/Footer'
import SideNavigation from '../components/admin/SideNav'
import RegisterUserForm from '../components/admin/RegisterForm'
import { ProtectedRoute } from '../../lib/auth'

const Page = () => {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
        <div className='flex flex-col min-h-screen bg-gray-100'>
          <Header />
          <main className="flex-grow flex p-4 gap-6">
            <SideNavigation />
          <div className="flex-1 flex justify-center">
            <RegisterUserForm />
          </div>
        </main>

        <Footer />
      </div>

    </ProtectedRoute>
    
  )
}

export default Page;

'use client'
import React from 'react'
import Navbar from '../../components/employee/Navbar'
import Footer from '../../components/Footer'
import TaskForm from '../../components/employee/Taskform'

const page = () => {
  return (
    <div className='flex flex-col min-h-screen'>
      <Navbar />
      <main className="flex-grow">
        <TaskForm />
      </main>
      <Footer />
    </div>
  )
}

export default page

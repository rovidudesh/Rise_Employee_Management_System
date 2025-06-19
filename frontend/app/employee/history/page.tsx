'use client'
import React from 'react'
import Navbar from '../../components/employee/Navbar'
import Footer from '../../components/Footer'
import HistoryTable from '../../components/employee/HistoryTable'

const page = () => {
  return (
    <div className='flex flex-col min-h-screen'>
      <Navbar />
      <main className="flex-grow">
        <HistoryTable />
      </main>

      <Footer />
    </div>
  )
}

export default page

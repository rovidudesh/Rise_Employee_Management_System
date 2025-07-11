'use client';
import Footer from "./components/Footer";
import LoginCard from "./components/LoginCard";
import Image from 'next/image';
import React, { useEffect, useState } from 'react';


export default function Home() {


  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Main content */}
      <div className="flex-grow pb-10 md:pb-0">
        <div className="text-black font-bold font-mono
                      text-3xl mt-12 ml-4
                      md:text-4xl md:mt-12 md:ml-16
                      lg:text-6xl">
          Rise Tech Village
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2'>
          <div className="ml-4 md:ml-16">
            <div className='text-black font-bold font-mono
                        text-2xl mt-[20px] 
                        md:text-3xl md:mt-[30px] 
                        lg:text-4xl lg:mt-[60px]'>
              Welcome Back 👋
            </div>
            <div className="mt-89">
              <LoginCard />
            </div>
          </div>

          <div className="hidden md:flex items-center justify-center mr-20">
            <Image
              src='/hero.svg'
              alt='Welcome Image'
              width={350}
              height={350}
              className="w-[350px] md:w-[500px] lg:w-[600px]"
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

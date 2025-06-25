'use client';
import Footer from "./components/Footer";
import LoginCard from "./components/LoginCard";
import Image from 'next/image';
import React, { useEffect, useState } from 'react';


export default function Home() {

  const [message, setMessage] = useState("Loading")

  /*useEffect(() => {
    fetch('http://localhost:8081/api/home')
    .then((response) => response.json())
    .then((data) => {
      setMessage(data.message);
    })
  }, []);
  
  */
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Main content */}
      <div className="flex-grow pb-10 md:pb-0">
        {message}
        <div className="text-black font-bold font-mono
                      text-2xl mt-12 ml-4
                      md:text-3xl md:mt-12 md:ml-8
                      lg:text-4xl">
          Rise Tech Village
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2'>
          <div className="ml-4 md:ml-8">
            <div className='text-black font-bold font-mono
                        text-xl mt-[30px] 
                        md:text-2xl md:mt-[30px] '>
              Welcome Back 👋
            </div>
            <div>
              <LoginCard />
            </div>
          </div>

          <div className="hidden md:flex items-center justify-center mr-20">
            <Image
              src='/hero.svg'
              alt='Welcome Image'
              width={350}
              height={350}
              className="w-[250px] md:w-[400px]"
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

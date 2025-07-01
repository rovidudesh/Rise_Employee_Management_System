// components/LoginForm.jsx
import React from 'react';

const LoginForm = () => {
  return (
    <div className="flex flex-col"> 
      <form className="w-full max-w-sm md:max-w-md lg:max-w-lg">
        <div className="mb-6 mr-4">
          <label htmlFor="username" className="block text-gray-700 text-lg font-medium mt-4 font-mono md:text-xl">
            username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            className="shadow appearance-none border rounded-lg w-full 
                       py-3 px-4 text-base md:text-lg md:py-4 md:px-5
                       text-gray-700 leading-tight 
                       focus:outline-none focus:shadow-outline font-mono border-black " 
            style={{ borderRadius: '8px' }}
          />
        </div>
        <div className="mb-6 mr-4">
          <label htmlFor="password" className="block text-gray-700 text-lg font-medium font-mono md:text-xl">
            password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="shadow appearance-none border rounded-lg w-full text-gray-700  leading-tight
                       py-3 px-4 text-base
                       md:py-4 md:px-5 md:text-lg
                       focus:outline-none focus:shadow-outline font-mono border-black" 
            style={{ borderRadius: '8px' }}
          />
        </div>
        <div className="flex items-center justify-center">
          <button
            type="submit"
            className="bg-white text-black font-bold rounded-lg w-full
                       py-3 px-4 mr-4 text-base
                       md:py-4 md:px-6 md:text-lg
                       lg:py-5 lg:px-8 lg:text-xl
                       focus:outline-none focus:shadow-outline border border-black font-mono
                       hover:bg-brandPurple hover:text-white transition-colors duration-300"
            style={{ borderRadius: '8px' }}
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
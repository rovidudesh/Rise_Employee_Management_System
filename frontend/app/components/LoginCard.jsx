// components/LoginForm.jsx
import React from 'react';

const LoginForm = () => {
  return (
    <div className="flex flex-col"> 
      <form className="w-full max-w-xs">
        <div className="mb-4 mr-4">
          <label htmlFor="username" className="block text-gray-700 text-base font-medium mt-3 font-mono">
            username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline font-mono border-black" 
            style={{ borderRadius: '8px' }}
          />
        </div>
        <div className="mb-6 mr-4">
          <label htmlFor="password" className="block text-gray-700 text-base font-medium  font-mono">
            password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="shadow appearance-none border rounded-lg w-full text-gray-700  leading-tight
                       py-2 px-3 
                       
                       focus:outline-none focus:shadow-outline font-mono border-black" 
            style={{ borderRadius: '8px' }}
          />
        </div>
        <div className="flex items-center justify-center">
          <button
            type="submit"
            className="bg-white text-black font-bold rounded-lg w-full
                       py-1 px-3 mr-4
                       md:py-2 md:px-4
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
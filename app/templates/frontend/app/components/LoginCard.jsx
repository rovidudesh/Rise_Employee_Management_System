'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '../../lib/api';


const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await login(email, password);
      
      if (response.success) {
        // Store user data in localStorage for persistent session
        localStorage.setItem('user', JSON.stringify(response.user));
        
        // Redirect based on user role
        if (response.user.role === 'admin') {
          router.push('/admin');
        } else if (response.user.role === 'manager') {
          router.push('/manager');
        } else {
          router.push('/employee');
        }
      } else {
        setError(response.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col"> 
      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded mb-4 transition-colors duration-300">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="w-full max-w-sm md:max-w-md lg:max-w-lg">
        <div className="mb-6 mr-4">
          <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 text-lg font-medium mt-4 font-mono md:text-xl transition-colors duration-300">
            email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="shadow appearance-none border rounded-lg w-full 
                       py-3 px-4 text-base md:text-lg md:py-4 md:px-5
                       text-gray-700 dark:text-gray-200 bg-white dark:bg-slate-700 leading-tight 
                       focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 font-mono border-black dark:border-gray-600 transition-colors duration-300" 
            style={{ borderRadius: '8px' }}
          />
        </div>
        <div className="mb-6 mr-4">
          <label htmlFor="password" className="block text-gray-700 dark:text-gray-300 text-lg font-medium font-mono md:text-xl transition-colors duration-300">
            password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="shadow appearance-none border rounded-lg w-full text-gray-700 dark:text-gray-200 bg-white dark:bg-slate-700 leading-tight
                       py-3 px-4 text-base
                       md:py-4 md:px-5 md:text-lg
                       focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 font-mono border-black dark:border-gray-600 transition-colors duration-300" 
            style={{ borderRadius: '8px' }}
          />
        </div>
        <div className="flex items-center justify-center">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-white dark:bg-slate-700 text-black dark:text-white font-bold rounded-lg w-full
                       py-3 px-4 mr-4 text-base
                       md:py-4 md:px-6 md:text-lg
                       lg:py-5 lg:px-8 lg:text-xl
                       focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 border border-black dark:border-gray-600 font-mono
                       hover:bg-brandPurple dark:hover:bg-blue-600 hover:text-white dark:hover:border-blue-600 transition-colors duration-300
                       disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ borderRadius: '8px' }}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '../../lib/api';
import { isAuthenticated, getUserRole } from '../../lib/auth';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // check if user is already logged in
  useEffect(() => {
    if (isAuthenticated()) {
      // Redirect based on user role
      const role = getUserRole();
      if (role === 'admin') {
        router.push('/admin');
      } else if (role === 'manager'){
        router.push('/manager');
      } else if (role === 'employee') {
        router.push('/employee');
      }
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await login(email, password);
      
      if (response.success) {
        // Token and user data are already stored in localStorage by the login function

        
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
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="w-full max-w-sm md:max-w-md lg:max-w-lg">
        <div className="mb-6 mr-4">
          <label htmlFor="email" className="block text-gray-700 text-lg font-medium mt-4 font-mono md:text-xl">
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
                       text-gray-700 leading-tight 
                       focus:outline-none focus:shadow-outline font-mono border-black" 
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="shadow appearance-none border rounded-lg w-full text-gray-700 leading-tight
                       py-3 px-4 text-base
                       md:py-4 md:px-5 md:text-lg
                       focus:outline-none focus:shadow-outline font-mono border-black" 
            style={{ borderRadius: '8px' }}
          />
        </div>
        <div className="flex items-center justify-center">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-white text-black font-bold rounded-lg w-full
                       py-3 px-4 mr-4 text-base
                       md:py-4 md:px-6 md:text-lg
                       lg:py-5 lg:px-8 lg:text-xl
                       focus:outline-none focus:shadow-outline border border-black font-mono
                       hover:bg-brandPurple hover:text-white transition-colors duration-300
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
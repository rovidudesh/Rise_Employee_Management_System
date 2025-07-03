'use client';
import React, { useState } from 'react';
import { createUser } from '../../../lib/api';
import { useRouter } from 'next/navigation';

const RegisterUserForm = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [team, setTeam] = useState('');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const token = localStorage.getItem('token');
    if (!token) {
      showCustomMessage("You need to be logged in to register users.");
      router.push('/'); // Redirect to login
      return;
    }

    try {
      const userData = {
        fullName,
        email,
        password,
        role,
        team,
        status
      };
      const response = await createUser(userData);

      if (response.success) {
        showCustomMessage(`User ${fullName} registered successfully!`);
        // Reset form
        setFullName('');
        setEmail('');
        setPassword('');
        setRole('');
        setTeam('');
        setStatus('');
      } else {
        showCustomMessage(`Error: ${response.message || 'Failed to register user'}`);
      }
    } catch (error) {
      console.error('Error registering user:', error);
      showCustomMessage('An error occurred while registering the user. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const showCustomMessage = (message) => {
    const messageBox = document.createElement('div');
    messageBox.className = 'fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50';
    messageBox.innerHTML = `
      <div class="bg-white p-6 rounded-lg shadow-lg text-center max-w-md mx-auto">
        <p class="text-base font-medium text-gray-800 mb-4">${message}</p>
        <button id="closeMessageBox" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-base">
          OK
        </button>
      </div>
    `;
    document.body.appendChild(messageBox);
    document.getElementById('closeMessageBox').onclick = () => {
      document.body.removeChild(messageBox);
    };
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 font-inter">
      <div className="bg-white p-8 sm:p-10 rounded-lg shadow-sm">
        <h2 className="text-3xl font-semibold text-gray-800 mb-8">Register User</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Two column layout for better space utilization */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="fullName" className="block text-lg text-gray-700 mb-3">Full Name</label>
              <input
                type="text"
                id="fullName"
                className="w-full px-5 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-lg"
                value={fullName}
                placeholder="Enter full name"
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-lg text-gray-700 mb-3">Email</label>
              <input
                type="email"
                id="email"
                className="w-full px-5 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-lg"
                value={email}
                placeholder="Enter email"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="password" className="block text-lg text-gray-700 mb-3">Password</label>
              <input
                type="password"
                id="password"
                className="w-full px-5 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-lg"
                value={password}
                placeholder="Enter password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-lg text-gray-700 mb-3">Role</label>
              <select
                id="role"
                className="w-full px-5 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-lg"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <option value="">Select Role</option>
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="employee">Employee</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="team" className="block text-lg text-gray-700 mb-3">Team</label>
              <input
                type="text"
                id="team"
                className="w-full px-5 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-lg"
                value={team}
                onChange={(e) => setTeam(e.target.value)}
                placeholder="Enter team name"
                required
              />
            </div>

            <div>
              <label htmlFor="status" className="block text-lg text-gray-700 mb-3">Status</label>
              <select
                id="status"
                className="w-full px-5 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-lg"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
              >
                <option value="">Select Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Submit button with loading state */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-4 rounded-lg hover:bg-indigo-700 transition text-lg font-medium mt-8"
          >
            {isLoading ? 'Registering...' : 'Register User'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterUserForm;

import React, { useState } from 'react';

const RegisterUserForm = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      fullName,
      email,
      username,
      password,
      role,
      phoneNumber,
    });
    showCustomMessage('User registered successfully! (Check console for data)');
    setFullName('');
    setEmail('');
    setUsername('');
    setPassword('');
    setRole('');
    setPhoneNumber('');
  };

  const showCustomMessage = (message) => {
    const messageBox = document.createElement('div');
    messageBox.className = 'fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50';
    messageBox.innerHTML = `
      <div class="bg-white p-4 rounded-md shadow-md text-center max-w-sm mx-auto">
        <p class="text-sm font-medium text-gray-800 mb-3">${message}</p>
        <button id="closeMessageBox" class="px-4 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
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
    <div className="w-full max-w-md mx-auto px-3 font-inter">
      <div className="bg-white p-4 sm:p-5 rounded-md shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Register User</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label htmlFor="fullName" className="block text-sm text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              id="fullName"
              className="w-full px-3 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 text-sm"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm text-gray-700 mb-1">Email</label>
            <input
              type="email"
              id="email"
              className="w-full px-3 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="username" className="block text-sm text-gray-700 mb-1">Username</label>
            <input
              type="text"
              id="username"
              className="w-full px-3 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 text-sm"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm text-gray-700 mb-1">Password</label>
            <input
              type="password"
              id="password"
              className="w-full px-3 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="role" className="block text-sm text-gray-700 mb-1">Role</label>
            <select
              id="role"
              className="w-full px-3 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 text-sm"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="">Select Role</option>
              <option value="Admin">Admin</option>
              <option value="Manager">Manager</option>
              <option value="Employee">Employee</option>
            </select>
          </div>

          <div>
            <label htmlFor="phoneNumber" className="block text-sm text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel"
              id="phoneNumber"
              className="w-full px-3 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 text-sm"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition text-sm font-medium"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterUserForm;

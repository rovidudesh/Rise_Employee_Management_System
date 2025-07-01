import React from 'react';

// Sample data for demonstration purposes
const sampleUsers = [
  {
    id: 'u1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Admin',
    status: 'Active',
  },
  {
    id: 'u2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'Employee',
    status: 'Inactive',
  },
  {
    id: 'u3',
    name: 'Alice Johnson',
    email: 'alice.j@example.com',
    role: 'Employee',
    status: 'Suspended',
  },
  {
    id: 'u4',
    name: 'Bob Williams',
    email: 'bob.w@example.com',
    role: 'Manager',
    status: 'Active',
  },
  {
    id: 'u5',
    name: 'Charlie Brown',
    email: 'charlie.b@example.com',
    role: 'Employee',
    status: 'Active',
  },
];

const ManageUsersTable = () => {
  // Function to determine status badge styling
  const getStatusClasses = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Inactive':
        return 'bg-gray-100 text-gray-800';
      case 'Suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Function to display a custom message (replaces alert())
  const showCustomMessage = (message) => {
    const messageBox = document.createElement('div');
    messageBox.className = 'fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50';
    messageBox.innerHTML = `
      <div class="bg-white p-8 rounded-lg shadow-xl text-center max-w-md mx-auto">
        <p class="text-lg font-semibold text-gray-800 mb-6">${message}</p>
        <button id="closeMessageBox" class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 text-base">
          OK
        </button>
      </div>
    `;
    document.body.appendChild(messageBox);

    document.getElementById('closeMessageBox').onclick = () => {
      document.body.removeChild(messageBox);
    };
  };

  // Handler for row/card clicks (optional, if you want to make rows clickable)
  const handleRowClick = (user) => {
    console.log('User clicked:', user);
    // You can add navigation to a user detail page, or open a modal here
    showCustomMessage(`You clicked on user: ${user.name} (${user.email})`);
  };

  return (
    <div className="w-full max-w-6xl mx-auto font-inter">

      {/* Desktop and Tablet Table View */}
      <div className="hidden sm:block overflow-x-auto rounded-lg shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-4 sm:px-8 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-6 py-4 sm:px-8 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider"
              >
                Email
              </th>
              <th
                scope="col"
                className="px-6 py-4 sm:px-8 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider"
              >
                Role
              </th>
              <th
                scope="col"
                className="px-6 py-4 sm:px-8 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider"
              >
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sampleUsers.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                onClick={() => handleRowClick(user)}
              >
                <td className="px-6 py-5 sm:px-8 whitespace-nowrap text-base font-medium text-gray-900">
                  {user.name}
                </td>
                <td className="px-6 py-5 sm:px-8 whitespace-nowrap text-base text-gray-600">
                  {user.email}
                </td>
                <td className="px-6 py-5 sm:px-8 whitespace-nowrap text-base text-gray-600">
                  {user.role}
                </td>
                <td className="px-6 py-5 sm:px-8 whitespace-nowrap text-base">
                  <span
                    className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusClasses(user.status)}`}
                  >
                    {user.status}
                  </span>
                </td>
              </tr>
            ))}
            {/* Adding empty rows for visual consistency if fewer than 5 items */}
            {Array.from({ length: Math.max(0, 5 - sampleUsers.length) }).map((_, index) => (
              <tr key={`empty-${index}`} className="h-16">
                <td className="px-6 py-5 sm:px-8"></td>
                <td className="px-6 py-5 sm:px-8"></td>
                <td className="px-6 py-5 sm:px-8"></td>
                <td className="px-6 py-5 sm:px-8"></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile "Card" View */}
      <div className="sm:hidden space-y-6">
        {sampleUsers.map((user) => (
          <div
            key={user.id}
            className="bg-white rounded-lg shadow-md p-6 border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors duration-150"
            onClick={() => handleRowClick(user)}
          >
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-gray-500 uppercase">Name:</span>
              <span className="text-lg font-semibold text-gray-900 text-right">{user.name}</span>
            </div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-gray-500 uppercase">Email:</span>
              <span className="text-base text-gray-800 text-right">{user.email}</span>
            </div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-gray-500 uppercase">Role:</span>
              <span className="text-base text-gray-800 text-right">{user.role}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-500 uppercase">Status:</span>
              <span
                className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusClasses(user.status)}`}
              >
                {user.status}
              </span>
            </div>
          </div>
        ))}
        {/* Adding empty cards for visual consistency if fewer than 5 items */}
        {Array.from({ length: Math.max(0, 5 - sampleUsers.length) }).map((_, index) => (
          <div key={`empty-card-${index}`} className="bg-white rounded-lg shadow-md p-6 border border-gray-200 h-40 opacity-50">
            {/* Empty content to maintain card height */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageUsersTable;

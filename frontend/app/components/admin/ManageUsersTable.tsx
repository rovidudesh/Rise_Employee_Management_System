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

  // Handler for row/card clicks (optional, if you want to make rows clickable)
  const handleRowClick = (user) => {
    console.log('User clicked:', user);
    // You can add navigation to a user detail page, or open a modal here
    alert(`You clicked on user: ${user.name} (${user.email})`);
  };

  return (
    <div className="w-full max-w-4xl mx-auto font-inter">
      <div className="p-4 sm:p-6 md:p-8">

        {/* Desktop and Tablet Table View */}
        <div className="hidden sm:block overflow-x-auto rounded-lg shadow-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-4 py-3 sm:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 sm:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Email
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 sm:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Role
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 sm:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sampleUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleRowClick(user)}
                >
                  <td className="px-4 py-4 sm:px-6 whitespace-nowrap text-sm font-medium text-gray-900">
                    {user.name}
                  </td>
                  <td className="px-4 py-4 sm:px-6 whitespace-nowrap text-sm text-gray-600">
                    {user.email}
                  </td>
                  <td className="px-4 py-4 sm:px-6 whitespace-nowrap text-sm text-gray-600">
                    {user.role}
                  </td>
                  <td className="px-4 py-4 sm:px-6 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(user.status)}`}
                    >
                      {user.status}
                    </span>
                  </td>
                </tr>
              ))}
              {/* Adding empty rows for visual consistency if fewer than 5 items */}
              {Array.from({ length: Math.max(0, 5 - sampleUsers.length) }).map((_, index) => (
                <tr key={`empty-${index}`} className="h-14"> {/* Approx height of a row */}
                  <td className="px-4 py-4 sm:px-6"></td>
                  <td className="px-4 py-4 sm:px-6"></td>
                  <td className="px-4 py-4 sm:px-6"></td>
                  <td className="px-4 py-4 sm:px-6"></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile "Card" View */}
        <div className="sm:hidden space-y-4">
          {sampleUsers.map((user) => (
            <div
              key={user.id}
              className="bg-white rounded-lg shadow-md p-4 border border-gray-200 cursor-pointer hover:bg-gray-50"
              onClick={() => handleRowClick(user)}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-medium text-gray-500 uppercase">Name:</span>
                <span className="text-sm font-semibold text-gray-900 text-right">{user.name}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-medium text-gray-500 uppercase">Email:</span>
                <span className="text-sm text-gray-800 text-right">{user.email}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-medium text-gray-500 uppercase">Role:</span>
                <span className="text-sm text-gray-800 text-right">{user.role}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-gray-500 uppercase">Status:</span>
                <span
                  className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(user.status)}`}
                >
                  {user.status}
                </span>
              </div>
            </div>
          ))}
          {/* Adding empty cards for visual consistency if fewer than 5 items */}
          {Array.from({ length: Math.max(0, 5 - sampleUsers.length) }).map((_, index) => (
             <div key={`empty-card-${index}`} className="bg-white rounded-lg shadow-md p-4 border border-gray-200 h-32 opacity-50">
                {/* Empty content to maintain card height */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageUsersTable;

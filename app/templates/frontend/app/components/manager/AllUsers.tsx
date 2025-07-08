import React, { useState, useEffect } from 'react';
import { getManagerTeamMembers } from '../../../lib/api';

interface Employee {
  id: number;
  full_name: string;
  email: string;
  role: string;
  team?: string;
  status: string;
}

const AllUsers = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getManagerTeamMembers();
      
      if (response.success) {
        setEmployees(response.employees);
      } else {
        setError(response.message || 'Failed to fetch team members');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusClasses = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleClasses = (role: string) => {
    switch (role) {
      case 'manager':
        return 'bg-blue-100 text-blue-800';
      case 'employee':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Function to display a custom message
  const showCustomMessage = (message: string) => {
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

    document.getElementById('closeMessageBox')!.onclick = () => {
      document.body.removeChild(messageBox);
    };
  };

  const handleRowClick = (employee: Employee) => {
    console.log('Employee clicked:', employee);
    showCustomMessage(`Employee: ${employee.full_name}\nEmail: ${employee.email}\nRole: ${employee.role}\nTeam: ${employee.team || 'Not assigned'}\nStatus: ${employee.status}`);
  };

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto font-inter">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading team members...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-6xl mx-auto font-inter">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-800 font-medium">{error}</p>
          <button 
            onClick={fetchTeamMembers}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto font-inter">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">My Team Members</h2>
        <p className="text-gray-600">
          View employees in your team 
          {employees.length > 0 && (
            <span className="ml-2 text-sm text-gray-500">
              ({employees.length} member{employees.length !== 1 ? 's' : ''})
            </span>
          )}
        </p>
      </div>

      {/* Desktop & Tablet View */}
      <div className="hidden sm:block overflow-x-auto rounded-lg shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 sm:px-8 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Name</th>
              <th className="px-6 py-4 sm:px-8 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Email</th>
              <th className="px-6 py-4 sm:px-8 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Role</th>
              <th className="px-6 py-4 sm:px-8 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Team</th>
              <th className="px-6 py-4 sm:px-8 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {employees.map((employee) => (
              <tr
                key={employee.id}
                className="hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                onClick={() => handleRowClick(employee)}
              >
                <td className="px-6 py-5 sm:px-8 whitespace-nowrap text-base font-medium text-gray-900">{employee.full_name}</td>
                <td className="px-6 py-5 sm:px-8 whitespace-nowrap text-base text-gray-600">{employee.email}</td>
                <td className="px-6 py-5 sm:px-8 whitespace-nowrap text-base">
                  <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getRoleClasses(employee.role)}`}>
                    {employee.role}
                  </span>
                </td>
                <td className="px-6 py-5 sm:px-8 whitespace-nowrap text-base text-gray-600">{employee.team || 'Not assigned'}</td>
                <td className="px-6 py-5 sm:px-8 whitespace-nowrap text-base">
                  <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusClasses(employee.status)}`}>
                    {employee.status}
                  </span>
                </td>
              </tr>
            ))}
            {/* Empty rows to maintain table height */}
            {Array.from({ length: Math.max(0, 8 - employees.length) }).map((_, index) => (
              <tr key={`empty-${index}`} className="h-16">
                <td className="px-6 py-5 sm:px-8"></td>
                <td className="px-6 py-5 sm:px-8"></td>
                <td className="px-6 py-5 sm:px-8"></td>
                <td className="px-6 py-5 sm:px-8"></td>
                <td className="px-6 py-5 sm:px-8"></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="sm:hidden space-y-6">
        {employees.map((employee) => (
          <div
            key={employee.id}
            className="bg-white rounded-lg shadow-md p-6 border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors duration-150"
            onClick={() => handleRowClick(employee)}
          >
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-gray-500 uppercase">Name:</span>
              <span className="text-lg font-semibold text-gray-900 text-right">{employee.full_name}</span>
            </div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-gray-500 uppercase">Email:</span>
              <span className="text-base text-gray-800 text-right">{employee.email}</span>
            </div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-gray-500 uppercase">Role:</span>
              <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getRoleClasses(employee.role)}`}>
                {employee.role}
              </span>
            </div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-gray-500 uppercase">Team:</span>
              <span className="text-base text-gray-800 text-right">{employee.team || 'Not assigned'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-500 uppercase">Status:</span>
              <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusClasses(employee.status)}`}>
                {employee.status}
              </span>
            </div>
          </div>
        ))}
        {Array.from({ length: Math.max(0, 5 - employees.length) }).map((_, index) => (
          <div key={`empty-card-${index}`} className="bg-white rounded-lg shadow-md p-6 border border-gray-200 h-40 opacity-50">
            {/* Empty content to maintain card height */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllUsers;

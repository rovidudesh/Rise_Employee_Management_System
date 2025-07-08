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

const TeamQuickView = () => {
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
      <div class="bg-white p-6 rounded-lg shadow-xl text-center max-w-sm mx-auto">
        <p class="text-sm font-semibold text-gray-800 mb-4">${message}</p>
        <button id="closeMessageBox" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 text-sm">
          OK
        </button>
      </div>
    `;
    document.body.appendChild(messageBox);

    document.getElementById('closeMessageBox')!.onclick = () => {
      document.body.removeChild(messageBox);
    };
  };

  const handleEmployeeClick = (employee: Employee) => {
    console.log('Employee clicked:', employee);
    showCustomMessage(`${employee.full_name}\n${employee.email}\n${employee.role} - ${employee.status}`);
  };

  if (loading) {
    return (
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-5 h-fit">
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-sm text-gray-600">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-5 h-fit">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-800 font-medium text-sm">{error}</p>
          <button 
            onClick={fetchTeamMembers}
            className="mt-2 px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200 text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow-md p-5 h-fit">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">My Team</h3>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {employees.length} member{employees.length !== 1 ? 's' : ''}
          </span>
        </div>
        <p className="text-sm text-gray-600 mt-1">Quick team overview</p>
      </div>

      {/* Team Members Cards */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {employees.map((employee) => (
          <div
            key={employee.id}
            className="bg-gray-50 rounded-lg p-4 border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors duration-150"
            onClick={() => handleEmployeeClick(employee)}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-900 truncate pr-2">
                {employee.full_name}
              </span>
              <span className={`px-2 py-1 inline-flex text-xs leading-4 font-medium rounded-full ${getStatusClasses(employee.status)}`}>
                {employee.status}
              </span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-600 truncate pr-2">
                {employee.email}
              </span>
              <span className={`px-2 py-1 inline-flex text-xs leading-4 font-medium rounded-full ${getRoleClasses(employee.role)}`}>
                {employee.role}
              </span>
            </div>
            <div className="text-xs text-gray-500">
              Team: {employee.team || 'Not assigned'}
            </div>
          </div>
        ))}

        {/* Empty state */}
        {employees.length === 0 && (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">
              <svg className="mx-auto h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <p className="text-sm text-gray-600">No team members found</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Active: {employees.filter(emp => emp.status === 'active').length}</span>
          <span>Inactive: {employees.filter(emp => emp.status === 'inactive').length}</span>
        </div>
      </div>
    </div>
  );
};

export default TeamQuickView;

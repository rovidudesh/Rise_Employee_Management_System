import React, { useState, useEffect } from "react";
import { getManagerTeamMembers } from "../../../lib/api";

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
        setError(response.message || "Failed to fetch team members");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusClasses = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400";
      case "inactive":
        return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300";
    }
  };

  const getRoleClasses = (role: string) => {
    switch (role) {
      case "manager":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400";
      case "employee":
        return "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300";
    }
  };

  const showCustomMessage = (message: string) => {
    const messageBox = document.createElement("div");
    messageBox.className =
      "fixed inset-0 bg-gray-600 bg-opacity-50 dark:bg-gray-900 dark:bg-opacity-70 flex items-center justify-center z-50 p-4";
    messageBox.innerHTML = `
      <div class="bg-white dark:bg-slate-800 p-4 sm:p-6 md:p-8 rounded-lg shadow-xl text-center max-w-sm sm:max-w-md mx-auto border border-gray-200 dark:border-gray-700 w-full">
        <p class="text-sm sm:text-base md:text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 sm:mb-6 whitespace-pre-line">${message}</p>
        <button id="closeMessageBox" class="px-4 py-2 sm:px-6 sm:py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition duration-200 text-sm sm:text-base w-full sm:w-auto">
          OK
        </button>
      </div>
    `;
    document.body.appendChild(messageBox);

    document.getElementById("closeMessageBox")!.onclick = () => {
      document.body.removeChild(messageBox);
    };
  };

  const handleRowClick = (employee: Employee) => {
    console.log("Employee clicked:", employee);
    showCustomMessage(
      `Employee: ${employee.full_name}\nEmail: ${employee.email}\nRole: ${
        employee.role
      }\nTeam: ${employee.team || "Not assigned"}\nStatus: ${employee.status}`
    );
  };

  if (loading) {
    return (
      <div className="w-full h-full flex justify-center items-center p-4">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
          <span className="mt-3 text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Loading team members...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex justify-center items-center p-4">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 sm:p-6 text-center max-w-md w-full">
          <p className="text-red-800 dark:text-red-400 font-medium mb-4 text-sm sm:text-base">
            {error}
          </p>
          <button
            onClick={fetchTeamMembers}
            className="px-4 py-2 bg-red-600 dark:bg-red-500 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition duration-200 text-sm sm:text-base w-full sm:w-auto"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-hidden flex flex-col p-2 sm:p-0">
      {/* Header */}
      <div className="mb-4 sm:mb-6 flex-shrink-0">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1 sm:mb-2">
          My Team Members
        </h2>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          View employees in your team
          {employees.length > 0 && (
            <span className="ml-2 text-xs sm:text-sm text-gray-500 dark:text-gray-500">
              ({employees.length} member{employees.length !== 1 ? "s" : ""})
            </span>
          )}
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {employees.length === 0 ? (
          <div className="w-full h-full flex flex-col items-center justify-center text-center py-8 sm:py-12 px-4">
            <div className="text-gray-400 dark:text-gray-500 mb-4">
              <svg
                className="mx-auto h-12 w-12 sm:h-16 sm:w-16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No team members found
            </h3>
            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-sm">
              It looks like you don't have any team members assigned yet.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block">
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-slate-700">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Team
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {employees.map((employee) => (
                      <tr
                        key={employee.id}
                        className="hover:bg-gray-50 dark:hover:bg-slate-700 cursor-pointer transition-colors duration-150"
                        onClick={() => handleRowClick(employee)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {employee.full_name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {employee.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleClasses(
                              employee.role
                            )}`}
                          >
                            {employee.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {employee.team || "Not assigned"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusClasses(
                              employee.status
                            )}`}
                          >
                            {employee.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile/Tablet Card View */}
            <div className="lg:hidden space-y-3 sm:space-y-4">
              {employees.map((employee) => (
                <div
                  key={employee.id}
                  className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-3 sm:p-4 border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors duration-150"
                  onClick={() => handleRowClick(employee)}
                >
                  <div className="flex justify-between items-start mb-2 sm:mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
                        {employee.full_name}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                        {employee.email}
                      </p>
                    </div>
                    <div className="flex flex-col space-y-1 ml-2 sm:ml-4 flex-shrink-0">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleClasses(
                          employee.role
                        )}`}
                      >
                        {employee.role}
                      </span>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusClasses(
                          employee.status
                        )}`}
                      >
                        {employee.status}
                      </span>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                    <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      Team:{" "}
                      <span className="text-gray-700 dark:text-gray-300">
                        {employee.team || "Not assigned"}
                      </span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AllUsers;

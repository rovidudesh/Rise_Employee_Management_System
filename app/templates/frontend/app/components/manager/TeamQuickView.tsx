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
      <div class="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-lg shadow-xl text-center max-w-sm mx-auto border border-gray-200 dark:border-gray-700 w-full">
        <p class="text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-200 mb-4 whitespace-pre-line">${message}</p>
        <button id="closeMessageBox" class="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition duration-200 text-sm w-full sm:w-auto">
          OK
        </button>
      </div>
    `;
    document.body.appendChild(messageBox);

    document.getElementById("closeMessageBox")!.onclick = () => {
      document.body.removeChild(messageBox);
    };
  };

  const handleEmployeeClick = (employee: Employee) => {
    console.log("Employee clicked:", employee);
    showCustomMessage(
      `${employee.full_name}\n${employee.email}\n${employee.role} - ${employee.status}`
    );
  };

  if (loading) {
    return (
      <div className="w-full max-w-md lg:max-w-sm xl:max-w-md bg-white dark:bg-slate-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-4 sm:p-5 h-fit transition-colors duration-300">
        <div className="flex justify-center items-center h-24 sm:h-32">
          <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
          <span className="ml-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            Loading...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-md lg:max-w-sm xl:max-w-md bg-white dark:bg-slate-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-4 sm:p-5 h-fit transition-colors duration-300">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 sm:p-4 text-center">
          <p className="text-red-800 dark:text-red-400 font-medium text-xs sm:text-sm">
            {error}
          </p>
          <button
            onClick={fetchTeamMembers}
            className="mt-2 px-3 py-1 bg-red-600 dark:bg-red-500 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition duration-200 text-xs sm:text-sm w-full sm:w-auto"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md lg:max-w-sm xl:max-w-md bg-white dark:bg-slate-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-4 sm:p-5 h-fit transition-colors duration-300">
      {/* Header */}
      <div className="mb-3 sm:mb-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">
            My Team
          </h3>
          <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
            {employees.length} member{employees.length !== 1 ? "s" : ""}
          </span>
        </div>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
          Quick team overview
        </p>
      </div>

      {/* Team Members Cards */}
      <div className="space-y-2 sm:space-y-3 max-h-64 sm:max-h-96 overflow-y-auto">
        {employees.map((employee) => (
          <div
            key={employee.id}
            className="bg-gray-50 dark:bg-slate-700 rounded-lg p-3 sm:p-4 border border-gray-200 dark:border-gray-600 cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors duration-150"
            onClick={() => handleEmployeeClick(employee)}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100 truncate pr-2">
                {employee.full_name}
              </span>
              <span
                className={`px-1.5 py-0.5 sm:px-2 sm:py-1 inline-flex text-xs leading-4 font-medium rounded-full ${getStatusClasses(
                  employee.status
                )}`}
              >
                {employee.status}
              </span>
            </div>
            <div className="flex items-center justify-between mb-1 sm:mb-2">
              <span className="text-xs text-gray-600 dark:text-gray-400 truncate pr-2">
                {employee.email}
              </span>
              <span
                className={`px-1.5 py-0.5 sm:px-2 sm:py-1 inline-flex text-xs leading-4 font-medium rounded-full ${getRoleClasses(
                  employee.role
                )}`}
              >
                {employee.role}
              </span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Team: {employee.team || "Not assigned"}
            </div>
          </div>
        ))}

        {/* Empty state */}
        {employees.length === 0 && (
          <div className="text-center py-6 sm:py-8">
            <div className="text-gray-400 dark:text-gray-500 mb-2">
              <svg
                className="mx-auto h-6 w-6 sm:h-8 sm:w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              No team members found
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-gray-200 dark:border-gray-600">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>
            Active: {employees.filter((emp) => emp.status === "active").length}
          </span>
          <span>
            Inactive:{" "}
            {employees.filter((emp) => emp.status === "inactive").length}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TeamQuickView;

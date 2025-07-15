import React, { useState, useEffect } from "react";
import { getAllUsers, updateUserStatus } from "../../../lib/api";

interface User {
  id: number;
  full_name: string;
  email: string;
  role: string;
  team: string;
  status: string;
}

const ManageUsersTable = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingUserId, setUpdatingUserId] = useState<number | null>(null);

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getAllUsers();

      if (response.success) {
        setUsers(response.users);
      } else {
        setError(response.message || "Failed to fetch users");
      }
    } catch (err) {
      setError("An error occurred while fetching users");
      console.error("Fetch users error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Function to determine status badge styling
  const getStatusClasses = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300";
      case "inactive":
        return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300";
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300";
    }
  };

  // Function to display a custom message
  const showCustomMessage = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    const messageBox = document.createElement("div");
    messageBox.className =
      "fixed inset-0 bg-gray-600 bg-opacity-50 dark:bg-gray-900 dark:bg-opacity-70 flex items-center justify-center z-50 p-4";

    const bgColor =
      type === "success"
        ? "bg-green-600 dark:bg-green-500"
        : "bg-red-600 dark:bg-red-500";
    const hoverColor =
      type === "success"
        ? "hover:bg-green-700 dark:hover:bg-green-600"
        : "hover:bg-red-700 dark:hover:bg-red-600";

    messageBox.innerHTML = `
      <div class="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-lg shadow-2xl dark:shadow-2xl dark:shadow-black/50 text-center max-w-md mx-auto border border-gray-200 dark:border-gray-700 w-full">
        <p class="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 sm:mb-6">${message}</p>
        <button id="closeMessageBox" class="px-6 py-2 sm:py-3 ${bgColor} text-white rounded-lg ${hoverColor} transition duration-200 text-base w-full sm:w-auto">
          OK
        </button>
      </div>
    `;
    document.body.appendChild(messageBox);

    document.getElementById("closeMessageBox")!.onclick = () => {
      document.body.removeChild(messageBox);
    };
  };

  // Handle status toggle
  const handleStatusToggle = async (user: User) => {
    const newStatus = user.status === "active" ? "inactive" : "active";

    try {
      setUpdatingUserId(user.id);
      const response = await updateUserStatus(user.id, newStatus);

      if (response.success) {
        // Update the user in the local state
        setUsers(
          users.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u))
        );
        showCustomMessage(
          response.message || `Status updated to ${newStatus}`,
          "success"
        );
      } else {
        showCustomMessage(
          response.message || "Failed to update status",
          "error"
        );
      }
    } catch (err) {
      showCustomMessage("An error occurred while updating status", "error");
      console.error("Update status error:", err);
    } finally {
      setUpdatingUserId(null);
    }
  };

  // Handler for row/card clicks
  const handleRowClick = (user: User) => {
    console.log("User clicked:", user);
    showCustomMessage(`User: ${user.full_name} (${user.email})`);
  };

  // Loading state
  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto font-inter">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-lg dark:shadow-2xl dark:shadow-black/50 border border-gray-200 dark:border-gray-700 transition-all duration-300">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
            <span className="ml-4 text-lg text-gray-600 dark:text-gray-400 transition-colors duration-300">
              Loading users...
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full max-w-6xl mx-auto font-inter">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-lg dark:shadow-2xl dark:shadow-black/50 border border-gray-200 dark:border-gray-700 transition-all duration-300">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <div className="flex items-center">
              <div className="text-red-600 dark:text-red-400 mr-4">⚠️</div>
              <div>
                <h3 className="text-lg font-semibold text-red-800 dark:text-red-400">
                  Error Loading Users
                </h3>
                <p className="text-red-600 dark:text-red-400 mt-1">{error}</p>
                <button
                  onClick={fetchUsers}
                  className="mt-4 px-4 py-2 bg-red-600 dark:bg-red-500 text-white rounded hover:bg-red-700 dark:hover:bg-red-600 transition"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto font-inter">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 transition-colors duration-300">
          Manage Users
        </h2>
        <button
          onClick={fetchUsers}
          className="px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          Refresh
        </button>
      </div>

      {/* Desktop and Tablet Table View */}
      <div className="hidden sm:block overflow-x-auto rounded-lg shadow-lg dark:shadow-2xl dark:shadow-black/50 border border-gray-200 dark:border-gray-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-slate-700">
            <tr>
              <th className="px-6 py-4 sm:px-8 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider transition-colors duration-300">
                Name
              </th>
              <th className="px-6 py-4 sm:px-8 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider transition-colors duration-300">
                Email
              </th>
              <th className="px-6 py-4 sm:px-8 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider transition-colors duration-300">
                Role
              </th>
              <th className="px-6 py-4 sm:px-8 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider transition-colors duration-300">
                Team
              </th>
              <th className="px-6 py-4 sm:px-8 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider transition-colors duration-300">
                Status
              </th>
              <th className="px-6 py-4 sm:px-8 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider transition-colors duration-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-300">
            {users.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors duration-150"
              >
                <td className="px-6 py-5 sm:px-8 whitespace-nowrap text-base font-medium text-gray-900 dark:text-gray-200 transition-colors duration-300">
                  {user.full_name}
                </td>
                <td className="px-6 py-5 sm:px-8 whitespace-nowrap text-base text-gray-600 dark:text-gray-300 transition-colors duration-300">
                  {user.email}
                </td>
                <td className="px-6 py-5 sm:px-8 whitespace-nowrap text-base text-gray-600 dark:text-gray-300 capitalize transition-colors duration-300">
                  {user.role}
                </td>
                <td className="px-6 py-5 sm:px-8 whitespace-nowrap text-base text-gray-600 dark:text-gray-300 transition-colors duration-300">
                  {user.team || "Not assigned"}
                </td>
                <td className="px-6 py-5 sm:px-8 whitespace-nowrap text-base">
                  <span
                    className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full capitalize transition-colors duration-300 ${getStatusClasses(
                      user.status
                    )}`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-5 sm:px-8 whitespace-nowrap text-base">
                  <button
                    onClick={() => handleStatusToggle(user)}
                    disabled={updatingUserId === user.id}
                    className={`px-3 py-1 text-sm font-medium rounded transition-colors duration-200 ${
                      updatingUserId === user.id
                        ? "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                        : user.status === "active"
                        ? "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50"
                        : "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50"
                    }`}
                  >
                    {updatingUserId === user.id
                      ? "Updating..."
                      : user.status === "active"
                      ? "Deactivate"
                      : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile "Card" View */}
      <div className="sm:hidden space-y-6">
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-white dark:bg-slate-800 rounded-lg shadow-lg dark:shadow-2xl dark:shadow-black/50 p-6 border border-gray-200 dark:border-gray-700 transition-all duration-300 relative"
          >
            {/* Enhanced shadow overlay for better depth */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/5 dark:to-white/5 rounded-lg pointer-events-none"></div>

            <div className="relative z-10">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase transition-colors duration-300">
                  Name:
                </span>
                <span className="text-lg font-semibold text-gray-900 dark:text-gray-200 text-right transition-colors duration-300">
                  {user.full_name}
                </span>
              </div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase transition-colors duration-300">
                  Email:
                </span>
                <span className="text-base text-gray-800 dark:text-gray-200 text-right transition-colors duration-300">
                  {user.email}
                </span>
              </div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase transition-colors duration-300">
                  Role:
                </span>
                <span className="text-base text-gray-800 dark:text-gray-200 text-right capitalize transition-colors duration-300">
                  {user.role}
                </span>
              </div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase transition-colors duration-300">
                  Team:
                </span>
                <span className="text-base text-gray-800 dark:text-gray-200 text-right transition-colors duration-300">
                  {user.team || "Not assigned"}
                </span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase transition-colors duration-300">
                  Status:
                </span>
                <span
                  className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full capitalize transition-colors duration-300 ${getStatusClasses(
                    user.status
                  )}`}
                >
                  {user.status}
                </span>
              </div>
              <button
                onClick={() => handleStatusToggle(user)}
                disabled={updatingUserId === user.id}
                className={`w-full px-4 py-2 text-sm font-medium rounded transition-colors duration-200 ${
                  updatingUserId === user.id
                    ? "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                    : user.status === "active"
                    ? "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50"
                    : "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50"
                }`}
              >
                {updatingUserId === user.id
                  ? "Updating..."
                  : user.status === "active"
                  ? "Deactivate"
                  : "Activate"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageUsersTable;

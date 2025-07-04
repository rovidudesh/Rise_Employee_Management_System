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
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Function to display a custom message
  const showCustomMessage = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    const messageBox = document.createElement("div");
    messageBox.className =
      "fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50";

    const bgColor = type === "success" ? "bg-green-600" : "bg-red-600";
    const hoverColor =
      type === "success" ? "hover:bg-green-700" : "hover:bg-red-700";

    messageBox.innerHTML = `
      <div class="bg-white p-8 rounded-lg shadow-xl text-center max-w-md mx-auto">
        <p class="text-lg font-semibold text-gray-800 mb-6">${message}</p>
        <button id="closeMessageBox" class="px-6 py-3 ${bgColor} text-white rounded-lg ${hoverColor} transition duration-200 text-base">
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
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <span className="ml-4 text-lg text-gray-600">Loading users...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full max-w-6xl mx-auto font-inter">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="text-red-600 mr-4">⚠️</div>
            <div>
              <h3 className="text-lg font-semibold text-red-800">
                Error Loading Users
              </h3>
              <p className="text-red-600 mt-1">{error}</p>
              <button
                onClick={fetchUsers}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Try Again
              </button>
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
        <h2 className="text-2xl font-semibold text-gray-800">Manage Users</h2>
        <button
          onClick={fetchUsers}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          Refresh
        </button>
      </div>

      {/* Desktop and Tablet Table View */}
      <div className="hidden sm:block overflow-x-auto rounded-lg shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 sm:px-8 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-4 sm:px-8 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-4 sm:px-8 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-4 sm:px-8 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Team
              </th>
              <th className="px-6 py-4 sm:px-8 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 sm:px-8 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-gray-50 transition-colors duration-150"
              >
                <td className="px-6 py-5 sm:px-8 whitespace-nowrap text-base font-medium text-gray-900">
                  {user.full_name}
                </td>
                <td className="px-6 py-5 sm:px-8 whitespace-nowrap text-base text-gray-600">
                  {user.email}
                </td>
                <td className="px-6 py-5 sm:px-8 whitespace-nowrap text-base text-gray-600 capitalize">
                  {user.role}
                </td>
                <td className="px-6 py-5 sm:px-8 whitespace-nowrap text-base text-gray-600">
                  {user.team || "Not assigned"}
                </td>
                <td className="px-6 py-5 sm:px-8 whitespace-nowrap text-base">
                  <span
                    className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full capitalize ${getStatusClasses(
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
                    className={`px-3 py-1 text-sm font-medium rounded transition ${
                      updatingUserId === user.id
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : user.status === "active"
                        ? "bg-red-100 text-red-800 hover:bg-red-200"
                        : "bg-green-100 text-green-800 hover:bg-green-200"
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
            className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
          >
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-gray-500 uppercase">
                Name:
              </span>
              <span className="text-lg font-semibold text-gray-900 text-right">
                {user.full_name}
              </span>
            </div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-gray-500 uppercase">
                Email:
              </span>
              <span className="text-base text-gray-800 text-right">
                {user.email}
              </span>
            </div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-gray-500 uppercase">
                Role:
              </span>
              <span className="text-base text-gray-800 text-right capitalize">
                {user.role}
              </span>
            </div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-gray-500 uppercase">
                Team:
              </span>
              <span className="text-base text-gray-800 text-right">
                {user.team || "Not assigned"}
              </span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-gray-500 uppercase">
                Status:
              </span>
              <span
                className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full capitalize ${getStatusClasses(
                  user.status
                )}`}
              >
                {user.status}
              </span>
            </div>
            <button
              onClick={() => handleStatusToggle(user)}
              disabled={updatingUserId === user.id}
              className={`w-full px-4 py-2 text-sm font-medium rounded transition ${
                updatingUserId === user.id
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : user.status === "active"
                  ? "bg-red-100 text-red-800 hover:bg-red-200"
                  : "bg-green-100 text-green-800 hover:bg-green-200"
              }`}
            >
              {updatingUserId === user.id
                ? "Updating..."
                : user.status === "active"
                ? "Deactivate"
                : "Activate"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageUsersTable;

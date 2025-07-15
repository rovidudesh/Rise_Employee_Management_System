import React, { useState } from "react";
import { addUser } from "../../../lib/api";

const RegisterUserForm = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [team, setTeam] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const userData = {
        full_name: fullName,
        email,
        password,
        role,
        status,
        team: team || undefined, // Send undefined if team is empty
      };

      const response = await addUser(userData);

      if (response.success) {
        showCustomMessage("User registered successfully!", "success");
        // Reset form
        setFullName("");
        setEmail("");
        setPassword("");
        setRole("");
        setTeam("");
        setStatus("");
      } else {
        setError(response.message || "Failed to register user");
        showCustomMessage(
          response.message || "Failed to register user",
          "error"
        );
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("An error occurred during registration. Please try again.");
      showCustomMessage(
        "An error occurred during registration. Please try again.",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const showCustomMessage = (message, type = "success") => {
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
        <p class="text-base sm:text-lg font-medium text-gray-800 dark:text-gray-200 mb-4 sm:mb-6">${message}</p>
        <button id="closeMessageBox" class="px-6 py-2 sm:py-3 ${bgColor} text-white rounded-lg ${hoverColor} transition duration-200 text-base w-full sm:w-auto">
          OK
        </button>
      </div>
    `;
    document.body.appendChild(messageBox);
    document.getElementById("closeMessageBox").onclick = () => {
      document.body.removeChild(messageBox);
    };
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 font-inter">
      <div className="bg-white dark:bg-slate-800 p-8 sm:p-10 rounded-lg shadow-2xl dark:shadow-2xl dark:shadow-black/50 border border-gray-200 dark:border-gray-700 transition-all duration-300 relative">
        {/* Enhanced shadow overlay for better depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/5 dark:to-white/5 rounded-lg pointer-events-none"></div>

        <div className="relative z-10">
          <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-200 mb-8 transition-colors duration-300">
            Register User
          </h2>

          {/* Error message display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg transition-colors duration-300">
              <p className="text-red-700 dark:text-red-400 transition-colors duration-300">
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Two column layout for better space utilization */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-lg text-gray-700 dark:text-gray-300 mb-3 transition-colors duration-300"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  className="w-full px-5 py-4 border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200 text-lg shadow-sm focus:shadow-md"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-lg text-gray-700 dark:text-gray-300 mb-3 transition-colors duration-300"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-5 py-4 border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200 text-lg shadow-sm focus:shadow-md"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="password"
                  className="block text-lg text-gray-700 dark:text-gray-300 mb-3 transition-colors duration-300"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="w-full px-5 py-4 border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200 text-lg shadow-sm focus:shadow-md"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="role"
                  className="block text-lg text-gray-700 dark:text-gray-300 mb-3 transition-colors duration-300"
                >
                  Role
                </label>
                <select
                  id="role"
                  className="w-full px-5 py-4 border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200 text-lg shadow-sm focus:shadow-md"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  disabled={isLoading}
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
                <label
                  htmlFor="team"
                  className="block text-lg text-gray-700 dark:text-gray-300 mb-3 transition-colors duration-300"
                >
                  Team
                </label>
                <input
                  type="text"
                  id="team"
                  className="w-full px-5 py-4 border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200 text-lg shadow-sm focus:shadow-md"
                  value={team}
                  onChange={(e) => setTeam(e.target.value)}
                  placeholder="Enter team name"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label
                  htmlFor="status"
                  className="block text-lg text-gray-700 dark:text-gray-300 mb-3 transition-colors duration-300"
                >
                  Status
                </label>
                <select
                  id="status"
                  className="w-full px-5 py-4 border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200 text-lg shadow-sm focus:shadow-md"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  disabled={isLoading}
                  required
                >
                  <option value="">Select Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 rounded-lg text-lg font-medium mt-8 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${
                isLoading
                  ? "bg-gray-400 dark:bg-gray-600 text-gray-700 dark:text-gray-300 cursor-not-allowed transform-none"
                  : "bg-indigo-600 dark:bg-indigo-500 text-white hover:bg-indigo-700 dark:hover:bg-indigo-600"
              }`}
            >
              {isLoading ? "Registering..." : "Register User"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterUserForm;

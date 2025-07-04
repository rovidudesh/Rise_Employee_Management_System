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
      "fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50";

    const bgColor = type === "success" ? "bg-green-600" : "bg-red-600";
    const hoverColor =
      type === "success" ? "hover:bg-green-700" : "hover:bg-red-700";

    messageBox.innerHTML = `
      <div class="bg-white p-6 rounded-lg shadow-lg text-center max-w-md mx-auto">
        <p class="text-base font-medium text-gray-800 mb-4">${message}</p>
        <button id="closeMessageBox" class="px-6 py-2 ${bgColor} text-white rounded-lg ${hoverColor} transition text-base">
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
      <div className="bg-white p-8 sm:p-10 rounded-lg shadow-sm">
        <h2 className="text-3xl font-semibold text-gray-800 mb-8">
          Register User
        </h2>

        {/* Error message display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Two column layout for better space utilization */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="fullName"
                className="block text-lg text-gray-700 mb-3"
              >
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                className="w-full px-5 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-lg"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-lg text-gray-700 mb-3"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-5 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-lg"
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
                className="block text-lg text-gray-700 mb-3"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full px-5 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-lg"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <div>
              <label
                htmlFor="role"
                className="block text-lg text-gray-700 mb-3"
              >
                Role
              </label>
              <select
                id="role"
                className="w-full px-5 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-lg"
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
                className="block text-lg text-gray-700 mb-3"
              >
                Team
              </label>
              <input
                type="text"
                id="team"
                className="w-full px-5 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-lg"
                value={team}
                onChange={(e) => setTeam(e.target.value)}
                placeholder="Enter team name"
                disabled={isLoading}
              />
            </div>

            <div>
              <label
                htmlFor="status"
                className="block text-lg text-gray-700 mb-3"
              >
                Status
              </label>
              <select
                id="status"
                className="w-full px-5 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-lg"
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
            className={`w-full py-4 rounded-lg text-lg font-medium mt-8 transition ${
              isLoading
                ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            {isLoading ? "Registering..." : "Register User"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterUserForm;

import React from "react";

const ProfileDashboard = () => {
  // Static data for demonstration. In a real app, this would come from props or an API.
  const adminData = {
    name: "Admin Name",
    position: "Admin Position",
    joinedDate: "Joined Date", // You might want to format this as a real date
    daysInCompany: 697,
    tasksReviewed: 88, // Changed from tasksSubmitted to tasksReviewed for Admin context
    averageReviewTime: "3 Hours", // New stat for admin
    usersManaged: 250, // New stat for admin
    // imageUrl: 'path/to/admin-image.jpg', // Placeholder for actual image URL
  };

  const handleLogout = () => {
    // Implement your logout logic here
    console.log("Admin Logging out...");
    // For a real application, you would typically:
    // 1. Clear authentication tokens (e.g., from local storage, cookies)
    // 2. Redirect the user to the login page
    showCustomMessage("You have been logged out!");
  };

  // Function to display a custom message (replaces alert())
  const showCustomMessage = (message) => {
    const messageBox = document.createElement("div");
    messageBox.className =
      "fixed inset-0 bg-gray-600 bg-opacity-50 dark:bg-gray-900 dark:bg-opacity-70 flex items-center justify-center z-50 p-4";
    messageBox.innerHTML = `
      <div class="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-lg shadow-2xl dark:shadow-2xl dark:shadow-black/50 text-center max-w-md mx-auto border border-gray-200 dark:border-gray-700 w-full">
        <p class="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 sm:mb-6 transition-colors duration-300">${message}</p>
        <button id="closeMessageBox" class="px-6 py-2 sm:py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition duration-200 text-base sm:text-lg w-full sm:w-auto">
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
    // This outer div is designed to be placed within a flex-grow main content area
    // to allow it to be centered and have controlled max-width.
    <div className="w-full max-w-6xl mx-auto font-inter">
      {/* Main content grid/flex container, responsible for layout of profile details and stats */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Left Section: Admin Info Card */}
        {/* On mobile, it's full width. On large screens and up, it has a fixed narrower width. */}
        <div className="flex-shrink-0 w-full lg:w-80 flex flex-col items-center lg:items-start p-6 sm:p-8 rounded-2xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-2xl dark:shadow-black/50 transition-all duration-300 relative">
          {/* Enhanced shadow overlay for better depth */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/5 dark:to-white/5 rounded-2xl pointer-events-none"></div>

          <div className="relative z-10 w-full flex flex-col items-center lg:items-start">
            {/* Admin Image Placeholder (gray rectangle) */}
            <div className="w-40 h-40 sm:w-48 sm:h-48 bg-gray-300 dark:bg-gray-600 rounded-lg flex items-center justify-center mb-6 sm:mb-8 overflow-hidden transition-colors duration-300 shadow-md dark:shadow-lg">
              {/* You can replace this with an actual <img> tag if you have an image URL */}
              <span className="text-gray-500 dark:text-gray-400 text-base transition-colors duration-300">
                Admin Image
              </span>
            </div>

            {/* Admin Details */}
            <div className="text-center lg:text-left w-full">
              <p className="text-sm text-gray-500 dark:text-gray-400 uppercase font-medium mb-2 transition-colors duration-300">
                Name
              </p>
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4 transition-colors duration-300">
                {adminData.name}
              </h3>

              <p className="text-sm text-gray-500 dark:text-gray-400 uppercase font-medium mb-2 transition-colors duration-300">
                Position
              </p>
              <p className="text-xl sm:text-2xl text-gray-700 dark:text-gray-300 mb-4 transition-colors duration-300">
                {adminData.position}
              </p>

              <p className="text-sm text-gray-500 dark:text-gray-400 uppercase font-medium mb-2 transition-colors duration-300">
                Joined On
              </p>
              <p className="text-xl sm:text-2xl text-gray-700 dark:text-gray-300 transition-colors duration-300">
                {adminData.joinedDate}
              </p>
            </div>
          </div>
        </div>

        {/* Right Section: Stats Tiles and Logout Button */}
        {/* This section takes up the remaining space on large screens and up */}
        <div className="flex-grow flex flex-col justify-between items-center lg:items-stretch gap-8">
          {/* Statistics Tiles Grid */}
          {/* Maintains a 2-column grid within its flexible parent */}
          <div className="grid grid-cols-2 gap-6 w-full">
            {/* Tile 1: Days in Company */}
            <div className="bg-indigo-700 dark:bg-indigo-600 text-white p-6 sm:p-8 rounded-2xl flex flex-col items-center justify-center text-center shadow-md dark:shadow-2xl dark:shadow-black/50 min-h-[140px] sm:min-h-[160px] transition-all duration-300 hover:bg-indigo-800 dark:hover:bg-indigo-700 transform hover:-translate-y-1">
              <p className="text-3xl sm:text-4xl font-bold mb-2">
                {adminData.daysInCompany}
              </p>
              <p className="text-base sm:text-lg">days in company</p>
            </div>
            {/* Tile 2: Tasks Reviewed */}
            <div className="bg-indigo-700 dark:bg-indigo-600 text-white p-6 sm:p-8 rounded-2xl flex flex-col items-center justify-center text-center shadow-md dark:shadow-2xl dark:shadow-black/50 min-h-[140px] sm:min-h-[160px] transition-all duration-300 hover:bg-indigo-800 dark:hover:bg-indigo-700 transform hover:-translate-y-1">
              <p className="text-3xl sm:text-4xl font-bold mb-2">
                {adminData.tasksReviewed}
              </p>
              <p className="text-base sm:text-lg">tasks Reviewed</p>
            </div>
            {/* Tile 3: Average Review Time */}
            <div className="bg-indigo-700 dark:bg-indigo-600 text-white p-6 sm:p-8 rounded-2xl flex flex-col items-center justify-center text-center shadow-md dark:shadow-2xl dark:shadow-black/50 min-h-[140px] sm:min-h-[160px] transition-all duration-300 hover:bg-indigo-800 dark:hover:bg-indigo-700 transform hover:-translate-y-1">
              <p className="text-2xl sm:text-3xl font-bold mb-2">
                {adminData.averageReviewTime}
              </p>
              <p className="text-base sm:text-lg">Avg. Review Time</p>
            </div>
            {/* Tile 4: Users Managed */}
            <div className="bg-indigo-700 dark:bg-indigo-600 text-white p-6 sm:p-8 rounded-2xl flex flex-col items-center justify-center text-center shadow-md dark:shadow-2xl dark:shadow-black/50 min-h-[140px] sm:min-h-[160px] transition-all duration-300 hover:bg-indigo-800 dark:hover:bg-indigo-700 transform hover:-translate-y-1">
              <p className="text-3xl sm:text-4xl font-bold mb-2">
                {adminData.usersManaged}
              </p>
              <p className="text-base sm:text-lg">Users Managed</p>
            </div>
          </div>

          {/* Log Out Button */}
          <button
            onClick={handleLogout}
            className="w-full bg-gray-700 dark:bg-gray-600 text-white py-4 sm:py-5 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-700 transition-all duration-300 text-xl sm:text-2xl font-semibold shadow-lg dark:shadow-2xl dark:shadow-black/50 mt-auto transform hover:-translate-y-1"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileDashboard;

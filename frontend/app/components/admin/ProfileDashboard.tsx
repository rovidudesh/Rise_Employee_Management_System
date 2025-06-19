import React from 'react';

const ProfileDashboard = () => {
  // Static data for demonstration. In a real app, this would come from props or an API.
  const adminData = {
    name: 'Admin Name',
    position: 'Admin Position',
    joinedDate: 'Joined Date', // You might want to format this as a real date
    daysInCompany: 697,
    tasksReviewed: 88, // Changed from tasksSubmitted to tasksReviewed for Admin context
    averageReviewTime: '3 Hours', // New stat for admin
    usersManaged: 250,           // New stat for admin
    // imageUrl: 'path/to/admin-image.jpg', // Placeholder for actual image URL
  };

  const handleLogout = () => {
    // Implement your logout logic here
    console.log('Admin Logging out...');
    // For a real application, you would typically:
    // 1. Clear authentication tokens (e.g., from local storage, cookies)
    // 2. Redirect the user to the login page
    showCustomMessage('You have been logged out!');
  };

  // Function to display a custom message (replaces alert())
  const showCustomMessage = (message) => {
    const messageBox = document.createElement('div');
    messageBox.className = 'fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50';
    messageBox.innerHTML = `
      <div class="bg-white p-6 rounded-lg shadow-xl text-center max-w-sm mx-auto">
        <p class="text-lg font-semibold text-gray-800 mb-4">${message}</p>
        <button id="closeMessageBox" class="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200">
          OK
        </button>
      </div>
    `;
    document.body.appendChild(messageBox);

    document.getElementById('closeMessageBox').onclick = () => {
      document.body.removeChild(messageBox);
    };
  };

  return (
    // This outer div is designed to be placed within a flex-grow main content area
    // to allow it to be centered and have controlled max-width.
    <div className="w-full max-w-5xl mx-auto font-inter">
      {/* Main content grid/flex container, responsible for layout of profile details and stats */}
      <div className="flex flex-col md:flex-row gap-6 md:gap-10">
        {/* Left Section: Admin Info Card */}
        {/* On mobile, it's full width. On medium screens and up, it has a fixed narrower width. */}
        <div className="flex-shrink-0 w-full md:w-64 flex flex-col items-center md:items-start p-4 sm:p-6 rounded-2xl bg-gray-50 border border-gray-200 shadow-sm">
          {/* Admin Image Placeholder (gray rectangle) */}
          <div className="w-32 h-32 sm:w-40 sm:h-40 bg-gray-300 rounded-lg flex items-center justify-center mb-4 sm:mb-6 overflow-hidden">
            {/* You can replace this with an actual <img> tag if you have an image URL */}
            <span className="text-gray-500 text-sm">Admin Image</span>
          </div>

          {/* Admin Details */}
          <div className="text-center md:text-left w-full">
            <p className="text-xs text-gray-500 uppercase font-medium">Name</p>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{adminData.name}</h3>

            <p className="text-xs text-gray-500 uppercase font-medium">Position</p>
            <p className="text-lg sm:text-xl text-gray-700 mb-2">{adminData.position}</p>

            <p className="text-xs text-gray-500 uppercase font-medium">Joined On</p>
            <p className="text-lg sm:text-xl text-gray-700">{adminData.joinedDate}</p>
          </div>
        </div>

        {/* Right Section: Stats Tiles and Logout Button */}
        {/* This section takes up the remaining space on medium screens and up */}
        <div className="flex-grow flex flex-col justify-between items-center md:items-stretch gap-6">
          {/* Statistics Tiles Grid */}
          {/* Maintains a 2-column grid within its flexible parent */}
          <div className="grid grid-cols-2 gap-4 w-full">
            {/* Tile 1: Days in Company */}
            <div className="bg-indigo-700 text-white p-3 sm:p-4 rounded-2xl flex flex-col items-center justify-center text-center shadow-md min-h-[100px] sm:min-h-[120px]">
              <p className="text-xl sm:text-2xl font-bold mb-1">{adminData.daysInCompany}</p>
              <p className="text-sm">days in company</p>
            </div>
            {/* Tile 2: Tasks Reviewed */}
            <div className="bg-indigo-700 text-white p-3 sm:p-4 rounded-2xl flex flex-col items-center justify-center text-center shadow-md min-h-[100px] sm:min-h-[120px]">
              <p className="text-xl sm:text-2xl font-bold mb-1">{adminData.tasksReviewed}</p>
              <p className="text-sm">tasks Reviewed</p>
            </div>
            {/* Tile 3: Average Review Time */}
            <div className="bg-indigo-700 text-white p-3 sm:p-4 rounded-2xl flex flex-col items-center justify-center text-center shadow-md min-h-[100px] sm:min-h-[120px]">
              <p className="text-xl sm:text-2xl font-bold mb-1">{adminData.averageReviewTime}</p>
              <p className="text-sm">Avg. Review Time</p>
            </div>
            {/* Tile 4: Users Managed */}
            <div className="bg-indigo-700 text-white p-3 sm:p-4 rounded-2xl flex flex-col items-center justify-center text-center shadow-md min-h-[100px] sm:min-h-[120px]">
              <p className="text-xl sm:text-2xl font-bold mb-1">{adminData.usersManaged}</p>
              <p className="text-sm">Users Managed</p>
            </div>
          </div>

          {/* Log Out Button */}
          <button
            onClick={handleLogout}
            className="w-full bg-gray-700 text-white py-3 sm:py-4 rounded-xl hover:bg-gray-800 transition duration-200 text-lg sm:text-xl font-semibold shadow-lg mt-auto"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileDashboard;

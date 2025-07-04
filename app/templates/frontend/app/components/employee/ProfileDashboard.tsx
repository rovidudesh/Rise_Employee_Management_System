import React from 'react';

const ProfileCard = () => {
  // Static data for demonstration. In a real app, this would come from props or an API.
  const employeeData = {
    name: 'Employee Name',
    position: 'Employee Position',
    joinedDate: 'Joined Date', // You might want to format this as a real date
    daysInCompany: 697,
    tasksSubmitted: 88,
    averageTaskCompletionTime: '2 Days', // New stat
    projectsCompleted: 12,           // New stat
    // imageUrl: 'path/to/employee-image.jpg', // Placeholder for actual image URL
  };

  const handleLogout = () => {
    // Implement your logout logic here
    console.log('Logging out...');
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
      <div class="bg-white p-8 rounded-lg shadow-xl text-center max-w-md mx-auto">
        <p class="text-xl font-semibold text-gray-800 mb-6">${message}</p>
        <button id="closeMessageBox" class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 text-lg">
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
    <div className="w-full max-w-6xl mx-auto font-inter mt-8 px-4 sm:px-6">
      {/* Main content grid/flex container, responsible for layout of profile details and stats */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Left Section: Employee Info Card */}
        {/* On mobile, it's full width. On large screens and up, it has a fixed narrower width. */}
        <div className="flex-shrink-0 w-full lg:w-80 flex flex-col items-center lg:items-start p-6 sm:p-8 rounded-2xl bg-gray-50 border border-gray-200 shadow-sm">
          {/* Employee Image Placeholder (gray rectangle) */}
          <div className="w-40 h-40 sm:w-48 sm:h-48 bg-gray-300 rounded-lg flex items-center justify-center mb-6 sm:mb-8 overflow-hidden">
            {/* You can replace this with an actual <img> tag if you have an image URL */}
            <span className="text-gray-500 text-base">Employee Image</span>
          </div>

          {/* Employee Details */}
          <div className="text-center lg:text-left w-full">
            <p className="text-sm text-gray-500 uppercase font-medium mb-2">Name</p>
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">{employeeData.name}</h3>

            <p className="text-sm text-gray-500 uppercase font-medium mb-2">Position</p>
            <p className="text-xl sm:text-2xl text-gray-700 mb-4">{employeeData.position}</p>

            <p className="text-sm text-gray-500 uppercase font-medium mb-2">Joined On</p>
            <p className="text-xl sm:text-2xl text-gray-700">{employeeData.joinedDate}</p>
          </div>
        </div>

        {/* Right Section: Stats Tiles and Logout Button */}
        {/* This section takes up the remaining space on large screens and up */}
        <div className="flex-grow flex flex-col justify-between items-center lg:items-stretch gap-8">
          {/* Statistics Tiles Grid */}
          {/* Maintains a 2-column grid within its flexible parent */}
          <div className="grid grid-cols-2 gap-6 w-full">
            {/* Tile 1: Days in Company */}
            <div className="bg-indigo-700 text-white p-6 sm:p-8 rounded-2xl flex flex-col items-center justify-center text-center shadow-md min-h-[140px] sm:min-h-[160px]">
              <p className="text-3xl sm:text-4xl font-bold mb-2">{employeeData.daysInCompany}</p>
              <p className="text-base sm:text-lg">days in company</p>
            </div>
            {/* Tile 2: Tasks Submitted */}
            <div className="bg-indigo-700 text-white p-6 sm:p-8 rounded-2xl flex flex-col items-center justify-center text-center shadow-md min-h-[140px] sm:min-h-[160px]">
              <p className="text-3xl sm:text-4xl font-bold mb-2">{employeeData.tasksSubmitted}</p>
              <p className="text-base sm:text-lg">tasks Submitted</p>
            </div>
            {/* Tile 3: Average Task Completion Time */}
            <div className="bg-indigo-700 text-white p-6 sm:p-8 rounded-2xl flex flex-col items-center justify-center text-center shadow-md min-h-[140px] sm:min-h-[160px]">
              <p className="text-2xl sm:text-3xl font-bold mb-2">{employeeData.averageTaskCompletionTime}</p>
              <p className="text-base sm:text-lg">Avg. Completion Time</p>
            </div>
            {/* Tile 4: Projects Completed */}
            <div className="bg-indigo-700 text-white p-6 sm:p-8 rounded-2xl flex flex-col items-center justify-center text-center shadow-md min-h-[140px] sm:min-h-[160px]">
              <p className="text-3xl sm:text-4xl font-bold mb-2">{employeeData.projectsCompleted}</p>
              <p className="text-base sm:text-lg">Projects Completed</p>
            </div>
          </div>

          {/* Log Out Button */}
          <button
            onClick={handleLogout}
            className="w-full bg-gray-700 text-white py-4 sm:py-5 rounded-xl hover:bg-gray-800 transition duration-200 text-xl sm:text-2xl font-semibold shadow-lg mt-auto"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;

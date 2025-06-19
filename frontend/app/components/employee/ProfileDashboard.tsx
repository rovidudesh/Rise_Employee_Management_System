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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-inter">
      <div className="w-full max-w-5xl bg-white p-6 sm:p-8 md:p-10 rounded-3xl shadow-xl grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10"> {/* Changed md:grid-cols-2 to md:grid-cols-3 */}
        {/* Left Section: Employee Info */}
        <div className="md:col-span-1 flex flex-col items-center md:items-start p-4 sm:p-6 rounded-2xl bg-gray-50 border border-gray-200 shadow-sm"> {/* Added md:col-span-1 */}
          {/* Employee Image Placeholder */}
          <div className="w-32 h-32 sm:w-40 sm:h-40 bg-gray-300 rounded-lg flex items-center justify-center mb-4 sm:mb-6 overflow-hidden">
            {/* If you have an actual image URL */}
            {/* {employeeData.imageUrl ? (
              <img src={employeeData.imageUrl} alt="Employee" className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-500 text-sm">Upload Image</span>
            )} */}
            <span className="text-gray-500 text-sm">Employee Image</span>
          </div>

          <div className="text-center md:text-left w-full">
            <p className="text-xs text-gray-500 uppercase font-medium">Name</p>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{employeeData.name}</h3>

            <p className="text-xs text-gray-500 uppercase font-medium">Position</p>
            <p className="text-lg sm:text-xl text-gray-700 mb-2">{employeeData.position}</p>

            <p className="text-xs text-gray-500 uppercase font-medium">Joined On</p>
            <p className="text-lg sm:text-xl text-gray-700">{employeeData.joinedDate}</p>
          </div>
        </div>

        {/* Right Section: Stats and Logout */}
        <div className="md:col-span-2 flex flex-col justify-between items-center md:items-stretch gap-6"> {/* Added md:col-span-2 */}
          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4 w-full">
            {/* Tile 1: Days in Company */}
            <div className="bg-brandPurple text-white p-4 sm:p-6 rounded-2xl flex flex-col items-center justify-center text-center shadow-md min-h-[120px] sm:min-h-[150px]">
              <p className="text-2xl sm:text-3xl font-bold mb-1">{employeeData.daysInCompany}</p>
              <p className="text-sm sm:text-base">days in company</p>
            </div>
            {/* Tile 2: Tasks Submitted */}
            <div className="bg-brandPurple text-white p-4 sm:p-6 rounded-2xl flex flex-col items-center justify-center text-center shadow-md min-h-[120px] sm:min-h-[150px]">
              <p className="text-2xl sm:text-3xl font-bold mb-1">{employeeData.tasksSubmitted}</p>
              <p className="text-sm sm:text-base">tasks Submitted</p>
            </div>
            {/* Tile 3: Average Task Completion Time (New) */}
            <div className="bg-brandPurple text-white p-4 sm:p-6 rounded-2xl flex flex-col items-center justify-center text-center shadow-md min-h-[120px] sm:min-h-[150px]">
              <p className="text-2xl sm:text-3xl font-bold mb-1">{employeeData.averageTaskCompletionTime}</p>
              <p className="text-sm sm:text-base">Avg. Completion Time</p>
            </div>
            {/* Tile 4: Projects Completed (New) */}
            <div className="bg-brandPurple text-white p-4 sm:p-6 rounded-2xl flex flex-col items-center justify-center text-center shadow-md min-h-[120px] sm:min-h-[150px]">
              <p className="text-2xl sm:text-3xl font-bold mb-1">{employeeData.projectsCompleted}</p>
              <p className="text-sm sm:text-base">Projects Completed</p>
            </div>
          </div>

          {/* Log Out Button */}
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 text-white py-3 sm:py-4 rounded-xl hover:bg-gray-800 transition duration-200 text-lg sm:text-xl font-semibold shadow-lg mt-auto"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;

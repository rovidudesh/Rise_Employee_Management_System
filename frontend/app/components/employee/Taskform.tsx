import React, { useState } from 'react';

const TaskForm = () => {
  const [taskTitle, setTaskTitle] = useState('');
  const [description, setDescription] = useState('');
  const [department, setDepartment] = useState('');
  const [date, setDate] = useState('');
  const [priority, setPriority] = useState('');
  const [timeSpent, setTimeSpent] = useState('');
  const [files, setFiles] = useState([]);
  const [comments, setComments] = useState('');

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setFiles([...e.dataTransfer.files]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log({
      taskTitle,
      description,
      department,
      date,
      priority,
      timeSpent,
      files,
      comments,
    });
    // You can send this data to an API or perform other actions
    // Using a custom modal/message box instead of alert() as per instructions
    showCustomMessage('Form submitted successfully! (Check console for data)');
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
      <div className="bg-white p-6 sm:p-8 md:p-10 rounded-3xl shadow-xl w-full max-w-2xl">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 text-gray-800">
          Submit your daily tasks from here !
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Task Title */}
          <div>
            <label htmlFor="taskTitle" className="block text-sm font-medium text-gray-700 mb-1">
              Task Title
            </label>
            <input
              type="text"
              id="taskTitle"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              rows={4} // Corrected: Removed comment from within JSX curly braces
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 resize-y"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>

          {/* Department */}
          <div>
            <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
              Department
            </label>
            <input
              type="text"
              id="department"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              required
            />
          </div>

          {/* Date */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              id="date"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          {/* Priority */}
          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              id="priority"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              required
            >
              <option value="">Select Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          {/* Time Spent */}
          <div>
            <label htmlFor="timeSpent" className="block text-sm font-medium text-gray-700 mb-1">
              Time Spent
            </label>
            <input
              type="text"
              id="timeSpent"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              value={timeSpent}
              onChange={(e) => setTimeSpent(e.target.value)}
              placeholder="e.g., 2 hours, 30 minutes"
            />
          </div>

          {/* Files and Attachments */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Files and Attachments
            </label>
            <p className="text-xs text-gray-500 mb-2">Maximum 10MB file size per upload</p>
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition duration-200"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center justify-center space-y-2">
                {/* SVG for upload icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <p className="text-gray-600 text-sm">Choose a file or drag & drop it here</p>
                <p className="text-gray-500 text-xs">JPEG, PNG, PDF, or DOCX up to 10MB</p>
                <input
                  type="file"
                  multiple
                  className="hidden"
                  id="fileUpload"
                  onChange={handleFileChange}
                />
                <label
                  htmlFor="fileUpload"
                  className="mt-3 px-4 py-2 bg-brandPurple text-white rounded-lg cursor-pointer hover:bg-blue-600 transition duration-200 text-sm font-medium"
                >
                  Browse File
                </label>
              </div>
              {files.length > 0 && (
                <div className="mt-4 text-left">
                  <p className="text-sm font-medium text-gray-700">Selected Files:</p>
                  <ul className="list-disc list-inside text-gray-600 text-sm">
                    {files.map((file, index) => (
                      <li key={index}>{file.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Comments */}
          <div>
            <label htmlFor="comments" className="block text-sm font-medium text-gray-700 mb-1">
              Comments
            </label>
            <textarea
              id="comments"
              rows={3} // Corrected: Removed comment from within JSX curly braces
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 resize-y"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-brandPurple text-white py-3 rounded-lg hover:bg-indigo-800 transition duration-200 text-lg font-semibold shadow-md"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;

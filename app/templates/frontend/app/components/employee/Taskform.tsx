import React, { useState } from 'react';

const TaskForm = () => {
  const [taskTitle, setTaskTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [priority, setPriority] = useState('');
  const [timeSpent, setTimeSpent] = useState('');
  const [referenceLink, setReferenceLink] = useState('');
  const [comments, setComments] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log({
      taskTitle,
      description,
      date,
      priority,
      timeSpent,
      referenceLink,
      comments,
    });
    // You can send this data to an API or perform other actions
    showCustomMessage('Form submitted successfully! (Check console for data)');
    
    // Reset form after successful submission
    setTaskTitle('');
    setDescription('');
    setDate('');
    setPriority('');
    setTimeSpent('');
    setReferenceLink('');
    setComments('');
  };

  // Function to display a custom message (replaces alert())
  const showCustomMessage = (message) => {
    const messageBox = document.createElement('div');
    messageBox.className = 'fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50';
    messageBox.innerHTML = `
      <div class="bg-white p-8 rounded-lg shadow-xl text-center max-w-md mx-auto">
        <p class="text-lg font-semibold text-gray-800 mb-6">${message}</p>
        <button id="closeMessageBox" class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 text-base">
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
      <div className="bg-white p-8 sm:p-10 md:p-12 rounded-2xl shadow-lg border border-gray-200 max-w-3xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-10 text-gray-800">
          Submit Your Daily Tasks
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
          {/* Two-column layout for smaller fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Task Title */}
            <div>
              <label htmlFor="taskTitle" className="block text-base font-medium text-gray-700 mb-3">
                Task Title
              </label>
              <input
                type="text"
                id="taskTitle"
                className="w-full px-5 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 text-base"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                required
                placeholder="Enter task title"
              />
            </div>

            {/* Reference Link */}
            <div>
              <label htmlFor="referenceLink" className="block text-base font-medium text-gray-700 mb-3">
                Reference Link
              </label>
              <input
                type="url"
                id="referenceLink"
                className="w-full px-5 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 text-base"
                value={referenceLink}
                onChange={(e) => setReferenceLink(e.target.value)}
                placeholder="https://example.com"
              />
            </div>
          </div>

          {/* Description - Full width */}
          <div>
            <label htmlFor="description" className="block text-base font-medium text-gray-700 mb-3">
              Description - Work Done
            </label>
            <textarea
              id="description"
              rows={5}
              className="w-full px-5 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 resize-y text-base"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              placeholder="Describe your task in detail"
            ></textarea>
          </div>

          {/* Date, Priority, Time Spent - Three columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Date */}
            <div>
              <label htmlFor="date" className="block text-base font-medium text-gray-700 mb-3">
                Date
              </label>
              <input
                type="date"
                id="date"
                className="w-full px-5 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 text-base"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            {/* Time Spent */}
            <div>
              <label htmlFor="timeSpent" className="block text-base font-medium text-gray-700 mb-3">
                Time Spent
              </label>
              <input
                type="text"
                id="timeSpent"
                className="w-full px-5 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 text-base"
                value={timeSpent}
                onChange={(e) => setTimeSpent(e.target.value)}
                placeholder="e.g., 2 hours"
              />
            </div>
          </div>

          {/* Comments */}
          <div>
            <label htmlFor="comments" className="block text-base font-medium text-gray-700 mb-3">
              Additional Comments
            </label>
            <textarea
              id="comments"
              rows={4}
              className="w-full px-5 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 resize-y text-base"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Any additional comments or notes..."
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-4 sm:py-5 rounded-lg hover:bg-indigo-700 transition duration-200 text-xl sm:text-2xl font-semibold shadow-lg mt-8"
          >
            Submit Task
          </button>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;

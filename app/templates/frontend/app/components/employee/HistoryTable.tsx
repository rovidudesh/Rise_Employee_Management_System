import React from 'react';

// Sample data for demonstration purposes
// In a real application, this data would come from an API call
const sampleTasks = [
  {
    id: '1',
    date: '2023-10-26',
    title: 'Update Project Documentation',
    submittedAt: '10:00 AM',
    status: 'Completed',
  },
  {
    id: '2',
    date: '2023-10-25',
    title: 'Review Code for Feature X',
    submittedAt: '03:30 PM',
    status: 'In Progress',
  },
  {
    id: '3',
    date: '2023-10-24',
    title: 'Prepare Presentation for Stakeholders',
    submittedAt: '11:15 AM',
    status: 'Pending Review',
  },
  {
    id: '4',
    date: '2023-10-23',
    title: 'Fix Bug in User Authentication',
    submittedAt: '09:00 AM',
    status: 'Completed',
  },
  {
    id: '5',
    date: '2023-10-22',
    title: 'Research new UI/UX trends',
    submittedAt: '02:00 PM',
    status: 'Deferred',
  },
  {
    id: '6',
    date: '2023-10-21',
    title: 'Plan Sprint Backlog',
    submittedAt: '04:00 PM',
    status: 'In Progress',
  },
  {
    id: '7',
    date: '2023-10-20',
    title: 'Client Meeting Preparation',
    submittedAt: '09:30 AM',
    status: 'Completed',
  },
];

const TaskHistoryTable = () => {
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

  const handleRowClick = (task) => {
    console.log('Task clicked:', task);
    showCustomMessage(`You clicked on task: "${task.title}" (Date: ${task.date})`);
  };

  return (
    <div className="w-full max-w-6xl mx-auto font-inter mt-8 px-4 sm:px-6">
      <div className="bg-white p-8 sm:p-10 md:p-12 rounded-2xl shadow-lg border border-gray-200">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">Task History</h2>
        <p className="text-gray-700 text-lg sm:text-xl mb-8 font-medium">
          All tasks that are submitted by you are here.
        </p>

        {/* Desktop and Tablet Table View */}
        <div className="hidden sm:block overflow-x-auto rounded-lg shadow-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-4 sm:px-8 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 sm:px-8 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider"
                >
                  Title
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 sm:px-8 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider"
                >
                  Submitted At
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 sm:px-8 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider"
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sampleTasks.map((task) => (
                <tr 
                  key={task.id} 
                  className="hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                  onClick={() => handleRowClick(task)}
                >
                  <td className="px-6 py-5 sm:px-8 whitespace-nowrap text-base font-medium text-gray-900">
                    {task.date}
                  </td>
                  <td className="px-6 py-5 sm:px-8 whitespace-nowrap text-base text-gray-600">
                    {task.title}
                  </td>
                  <td className="px-6 py-5 sm:px-8 whitespace-nowrap text-base text-gray-600">
                    {task.submittedAt}
                  </td>
                  <td className="px-6 py-5 sm:px-8 whitespace-nowrap text-base">
                    <span
                      className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full
                        ${
                          task.status === 'Completed'
                            ? 'bg-green-100 text-green-800'
                            : task.status === 'In Progress'
                            ? 'bg-yellow-100 text-yellow-800'
                            : task.status === 'Pending Review'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                    >
                      {task.status}
                    </span>
                  </td>
                </tr>
              ))}
              {/* Adding empty rows for visual consistency if fewer than 7 items */}
              {Array.from({ length: Math.max(0, 7 - sampleTasks.length) }).map((_, index) => (
                <tr key={`empty-${index}`} className="h-16">
                  <td className="px-6 py-5 sm:px-8"></td>
                  <td className="px-6 py-5 sm:px-8"></td>
                  <td className="px-6 py-5 sm:px-8"></td>
                  <td className="px-6 py-5 sm:px-8"></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile "Card" View */}
        <div className="sm:hidden space-y-6">
          {sampleTasks.map((task) => (
            <div 
              key={task.id} 
              className="bg-white rounded-lg shadow-md p-6 border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors duration-150"
              onClick={() => handleRowClick(task)}
            >
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium text-gray-500 uppercase">Date:</span>
                <span className="text-lg font-semibold text-gray-900">{task.date}</span>
              </div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium text-gray-500 uppercase">Title:</span>
                <span className="text-base text-gray-800 text-right">{task.title}</span>
              </div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium text-gray-500 uppercase">Submitted At:</span>
                <span className="text-base text-gray-800">{task.submittedAt}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500 uppercase">Status:</span>
                <span
                  className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full
                    ${
                      task.status === 'Completed'
                        ? 'bg-green-100 text-green-800'
                        : task.status === 'In Progress'
                        ? 'bg-yellow-100 text-yellow-800'
                        : task.status === 'Pending Review'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                >
                  {task.status}
                </span>
              </div>
            </div>
          ))}
          {/* Adding empty cards for visual consistency if fewer than 7 items */}
          {Array.from({ length: Math.max(0, 7 - sampleTasks.length) }).map((_, index) => (
             <div key={`empty-card-${index}`} className="bg-white rounded-lg shadow-md p-6 border border-gray-200 h-40 opacity-50">
                {/* Empty content to maintain card height */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskHistoryTable;

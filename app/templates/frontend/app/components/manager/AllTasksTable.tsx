import React from 'react';

const sampleTasks = [
  {
    id: 't1',
    task: 'Review Q4 Financial Report',
    submittedBy: 'John Doe',
    submittedOn: '2023-11-15 10:30 AM',
    status: 'Approved',
  },
  {
    id: 't2',
    task: 'Update Marketing Campaign Assets',
    submittedBy: 'Jane Smith',
    submittedOn: '2023-11-14 02:45 PM',
    status: 'Cancelled',
  },
  {
    id: 't3',
    task: 'Prepare Board Meeting Agenda',
    submittedBy: 'Alice Johnson',
    submittedOn: '2023-11-13 09:00 AM',
    status: 'Rejected',
  },
  {
    id: 't4',
    task: 'Develop new API endpoint',
    submittedBy: 'Bob Williams',
    submittedOn: '2023-11-12 04:00 PM',
    status: 'Approved',
  },
  {
    id: 't5',
    task: 'Customer Feedback Analysis',
    submittedBy: 'Charlie Brown',
    submittedOn: '2023-11-11 11:30 AM',
    status: 'Pending',
  },
];

const TasksTable = () => {
  const getStatusClasses = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Function to display a custom message (replaces alert())
  const showCustomMessage = (message: string) => {
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

    document.getElementById('closeMessageBox')!.onclick = () => {
      document.body.removeChild(messageBox);
    };
  };

  const handleRowClick = (task: typeof sampleTasks[0]) => {
    console.log('Task clicked:', task);
    showCustomMessage(`You clicked on task: "${task.task}" (ID: ${task.id})`);
  };

  return (
    <div className="w-full max-w-6xl mx-auto font-inter">

      {/* Desktop & Tablet View */}
      <div className="hidden sm:block overflow-x-auto rounded-lg shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 sm:px-8 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Task</th>
              <th className="px-6 py-4 sm:px-8 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Submitted By</th>
              <th className="px-6 py-4 sm:px-8 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Submitted On</th>
              <th className="px-6 py-4 sm:px-8 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sampleTasks.map((task) => (
              <tr
                key={task.id}
                className="hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                onClick={() => handleRowClick(task)}
              >
                <td className="px-6 py-5 sm:px-8 whitespace-nowrap text-base font-medium text-gray-900">{task.task}</td>
                <td className="px-6 py-5 sm:px-8 whitespace-nowrap text-base text-gray-600">{task.submittedBy}</td>
                <td className="px-6 py-5 sm:px-8 whitespace-nowrap text-base text-gray-600">{task.submittedOn}</td>
                <td className="px-6 py-5 sm:px-8 whitespace-nowrap text-base">
                  <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusClasses(task.status)}`}>
                    {task.status}
                  </span>
                </td>
              </tr>
            ))}
            {Array.from({ length: Math.max(0, 5 - sampleTasks.length) }).map((_, index) => (
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

      {/* Mobile Card View */}
      <div className="sm:hidden space-y-6">
        {sampleTasks.map((task) => (
          <div
            key={task.id}
            className="bg-white rounded-lg shadow-md p-6 border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors duration-150"
            onClick={() => handleRowClick(task)}
          >
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-gray-500 uppercase">Task:</span>
              <span className="text-lg font-semibold text-gray-900 text-right">{task.task}</span>
            </div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-gray-500 uppercase">Submitted By:</span>
              <span className="text-base text-gray-800 text-right">{task.submittedBy}</span>
            </div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-gray-500 uppercase">Submitted On:</span>
              <span className="text-base text-gray-800 text-right">{task.submittedOn}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-500 uppercase">Status:</span>
              <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusClasses(task.status)}`}>
                {task.status}
              </span>
            </div>
          </div>
        ))}
        {Array.from({ length: Math.max(0, 5 - sampleTasks.length) }).map((_, index) => (
          <div key={`empty-card-${index}`} className="bg-white rounded-lg shadow-md p-6 border border-gray-200 h-40 opacity-50">
            {/* Empty content to maintain card height */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TasksTable;

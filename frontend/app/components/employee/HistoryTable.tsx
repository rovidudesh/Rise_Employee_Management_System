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
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4 sm:p-6 lg:p-8 font-inter">
      <div className="w-full max-w-4xl bg-white p-6 sm:p-8 md:p-10 rounded-3xl shadow-xl">
        <p className="text-gray-700 text-lg sm:text-xl mb-6 font-semibold">
          All tasks that are submitted by you are here.
        </p>

        {/* Desktop and Tablet Table View */}
        <div className="hidden sm:block overflow-x-auto rounded-lg shadow-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-4 py-3 sm:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 sm:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Title
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 sm:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Submitted At
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 sm:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sampleTasks.map((task) => (
                <tr key={task.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 sm:px-6 whitespace-nowrap text-sm font-medium text-gray-900">
                    {task.date}
                  </td>
                  <td className="px-4 py-4 sm:px-6 whitespace-nowrap text-sm text-gray-600">
                    {task.title}
                  </td>
                  <td className="px-4 py-4 sm:px-6 whitespace-nowrap text-sm text-gray-600">
                    {task.submittedAt}
                  </td>
                  <td className="px-4 py-4 sm:px-6 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
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
              {/* Adding empty rows for visual consistency if fewer than 5 items */}
              {Array.from({ length: Math.max(0, 5 - sampleTasks.length) }).map((_, index) => (
                <tr key={`empty-${index}`} className="h-14"> {/* Approx height of a row */}
                  <td className="px-4 py-4 sm:px-6"></td>
                  <td className="px-4 py-4 sm:px-6"></td>
                  <td className="px-4 py-4 sm:px-6"></td>
                  <td className="px-4 py-4 sm:px-6"></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile "Card" View */}
        <div className="sm:hidden space-y-4">
          {sampleTasks.map((task) => (
            <div key={task.id} className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-medium text-gray-500 uppercase">Date:</span>
                <span className="text-sm font-semibold text-gray-900">{task.date}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-medium text-gray-500 uppercase">Title:</span>
                <span className="text-sm text-gray-800 text-right">{task.title}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-medium text-gray-500 uppercase">Submitted At:</span>
                <span className="text-sm text-gray-800">{task.submittedAt}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-gray-500 uppercase">Status:</span>
                <span
                  className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full
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
          {/* Adding empty cards for visual consistency if fewer than 5 items */}
          {Array.from({ length: Math.max(0, 5 - sampleTasks.length) }).map((_, index) => (
             <div key={`empty-card-${index}`} className="bg-white rounded-lg shadow-md p-4 border border-gray-200 h-28 opacity-50">
                {/* Empty content to maintain card height */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskHistoryTable;

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

  const handleRowClick = (task: typeof sampleTasks[0]) => {
    console.log('Task clicked:', task);
    alert(`You clicked on task: "${task.task}" (ID: ${task.id})`);
  };

  return (
    <div className="w-full font-inter">
      <div className="rounded-2xl shadow overflow-x-auto bg-white">
        {/* Desktop & Tablet View */}
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Task</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Submitted By</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Submitted On</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sampleTasks.map((task) => (
              <tr
                key={task.id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => handleRowClick(task)}
              >
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{task.task}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{task.submittedBy}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{task.submittedOn}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(task.status)}`}>
                    {task.status}
                  </span>
                </td>
              </tr>
            ))}
            {Array.from({ length: Math.max(0, 5 - sampleTasks.length) }).map((_, index) => (
              <tr key={`empty-${index}`} className="h-14">
                <td className="px-4 py-4"></td>
                <td className="px-4 py-4"></td>
                <td className="px-4 py-4"></td>
                <td className="px-4 py-4"></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="sm:hidden space-y-4 mt-4">
        {sampleTasks.map((task) => (
          <div
            key={task.id}
            className="bg-white rounded-lg shadow p-4 border border-gray-200 cursor-pointer hover:bg-gray-50"
            onClick={() => handleRowClick(task)}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-medium text-gray-500 uppercase">Task:</span>
              <span className="text-sm font-semibold text-gray-900 text-right">{task.task}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-medium text-gray-500 uppercase">Submitted By:</span>
              <span className="text-sm text-gray-800 text-right">{task.submittedBy}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-medium text-gray-500 uppercase">Submitted On:</span>
              <span className="text-sm text-gray-800 text-right">{task.submittedOn}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-gray-500 uppercase">Status:</span>
              <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(task.status)}`}>
                {task.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TasksTable;

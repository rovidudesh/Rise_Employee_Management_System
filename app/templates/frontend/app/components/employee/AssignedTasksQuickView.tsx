import React, { useState, useEffect } from "react";
import { getEmployeeTasks, Task } from "../../../lib/api";

interface AssignedTask extends Task {
  priority: "low" | "medium" | "high" | "urgent";
}

const AssignedTasksQuickView = () => {
  const [tasks, setTasks] = useState<AssignedTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await getEmployeeTasks();

        if (result.success) {
          const mappedTasks = result.tasks.map((task) => ({
            ...task,
            priority: task.priority || ("medium" as "medium"),
            status: mapTaskStatus(task.status),
          }));

          const activeTasks = mappedTasks.filter(
            (task) =>
              task.status === "pending" ||
              task.status === "in_progress" ||
              task.status === "overdue"
          );

          setTasks(activeTasks.slice(0, 5));
        } else {
          setError(result.message || "Failed to fetch tasks");
          setTasks(getDummyTasks());
        }
      } catch (err) {
        console.error("Error fetching tasks:", err);
        setError("Network error occurred");
        setTasks(getDummyTasks());
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const mapTaskStatus = (
    status: string
  ): "pending" | "in_progress" | "completed" | "overdue" => {
    const statusMap: {
      [key: string]: "pending" | "in_progress" | "completed" | "overdue";
    } = {
      open: "pending",
      pending: "pending",
      in_progress: "in_progress",
      completed: "completed",
      overdue: "overdue",
    };

    return statusMap[status] || "pending";
  };

  const getDummyTasks = (): AssignedTask[] => [
    {
      id: 1,
      title: "Complete User Authentication Module",
      description: "Implement login, logout, and user registration features",
      priority: "high",
      status: "in_progress",
      assigned_date: "2025-01-05",
      due_date: "2025-01-15",
      assigned_by: "John Manager",
    },
    {
      id: 2,
      title: "Review Code Documentation",
      description:
        "Update API documentation and add comments to core functions",
      priority: "medium",
      status: "pending",
      assigned_date: "2025-01-06",
      due_date: "2025-01-12",
      assigned_by: "Sarah Team Lead",
    },
    {
      id: 3,
      title: "Fix Payment Gateway Bug",
      description: "Resolve the issue with payment processing timeout",
      priority: "urgent",
      status: "pending",
      assigned_date: "2025-01-07",
      due_date: "2025-01-09",
      assigned_by: "John Manager",
    },
  ];

  const getPriorityClasses = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400";
      case "high":
        return "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-400";
      case "medium":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400";
      case "low":
        return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300";
    }
  };

  const getStatusClasses = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400";
      case "in_progress":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400";
      case "pending":
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300";
      case "overdue":
        return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getDaysUntilDue = (dueDateString: string) => {
    const dueDate = new Date(dueDateString);
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const showCustomMessage = (message: string) => {
    const messageBox = document.createElement("div");
    messageBox.className =
      "fixed inset-0 bg-gray-600 bg-opacity-50 dark:bg-gray-900 dark:bg-opacity-70 flex items-center justify-center z-50 p-4";
    messageBox.innerHTML = `
      <div class="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-lg shadow-xl text-center max-w-sm mx-auto border border-gray-200 dark:border-gray-700 w-full">
        <p class="text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-200 mb-4 whitespace-pre-line">${message}</p>
        <button id="closeMessageBox" class="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition duration-200 text-sm w-full sm:w-auto">
          OK
        </button>
      </div>
    `;
    document.body.appendChild(messageBox);

    document.getElementById("closeMessageBox")!.onclick = () => {
      document.body.removeChild(messageBox);
    };
  };

  const handleTaskClick = (task: AssignedTask) => {
    console.log("Task clicked:", task);
    const daysUntilDue = getDaysUntilDue(task.due_date || "");
    const dueDateInfo =
      daysUntilDue > 0
        ? `Due in ${daysUntilDue} days`
        : daysUntilDue === 0
        ? "Due today"
        : `Overdue by ${Math.abs(daysUntilDue)} days`;

    const details = [
      `Title: ${task.title}`,
      `Description: ${task.description}`,
      `Priority: ${task.priority.toUpperCase()}`,
      `Status: ${task.status.replace("_", " ").toUpperCase()}`,
      `Assigned by: ${task.assigned_by}`,
      `Assigned: ${
        task.assigned_date ? formatDate(task.assigned_date) : "N/A"
      }`,
      `Due: ${task.due_date ? formatDate(task.due_date) : "N/A"} ${
        task.due_date ? `(${dueDateInfo})` : ""
      }`,
    ].join("\n");

    showCustomMessage(`Task Details:\n\n${details}`);
  };

  if (loading) {
    return (
      <div className="w-full max-w-lg bg-white dark:bg-slate-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-4 sm:p-6 h-fit transition-colors duration-300">
        <div className="flex justify-center items-center h-24 sm:h-32">
          <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
          <span className="ml-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            Loading tasks...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-lg bg-white dark:bg-slate-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-4 sm:p-6 h-fit transition-colors duration-300">
        <div className="text-center py-6 sm:py-8">
          <div className="text-red-400 dark:text-red-500 mb-2">
            <svg
              className="mx-auto h-6 w-6 sm:h-8 sm:w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-xs sm:text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Using demo data
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg bg-white dark:bg-slate-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-4 sm:p-6 h-fit transition-colors duration-300">
      {/* Header */}
      <div className="mb-3 sm:mb-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">
            Assigned Tasks
          </h3>
          <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
            {tasks.length} active
          </span>
        </div>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
          Your current assignments
        </p>
      </div>

      {/* Tasks Cards */}
      <div className="space-y-2 sm:space-y-3 max-h-64 sm:max-h-96 overflow-y-auto">
        {tasks.map((task) => {
          const daysUntilDue = task.due_date
            ? getDaysUntilDue(task.due_date)
            : 0;
          return (
            <div
              key={task.id}
              className="bg-gray-50 dark:bg-slate-700 rounded-lg p-3 sm:p-4 border border-gray-200 dark:border-gray-600 cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors duration-150"
              onClick={() => handleTaskClick(task)}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100 truncate pr-2 flex-1">
                  {task.title}
                </span>
                <span
                  className={`px-1.5 py-0.5 sm:px-2 sm:py-1 inline-flex text-xs leading-4 font-medium rounded-full ${getPriorityClasses(
                    task.priority
                  )} flex-shrink-0`}
                >
                  {task.priority}
                </span>
              </div>
              <div className="mb-2">
                <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 pr-2">
                  {task.description}
                </p>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`px-1.5 py-0.5 sm:px-2 sm:py-1 inline-flex text-xs leading-4 font-medium rounded-full ${getStatusClasses(
                    task.status
                  )} flex-shrink-0`}
                >
                  {task.status.replace("_", " ")}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 truncate ml-2">
                  By: {task.assigned_by}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Due:{" "}
                  {task.due_date ? formatDate(task.due_date) : "No due date"}
                </span>
                {task.due_date && (
                  <span
                    className={`text-xs font-medium flex-shrink-0 ${
                      daysUntilDue < 0
                        ? "text-red-600 dark:text-red-400"
                        : daysUntilDue <= 2
                        ? "text-orange-600 dark:text-orange-400"
                        : "text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    {daysUntilDue > 0
                      ? `${daysUntilDue}d left`
                      : daysUntilDue === 0
                      ? "Due today"
                      : `${Math.abs(daysUntilDue)}d overdue`}
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {/* Empty state */}
        {tasks.length === 0 && (
          <div className="text-center py-6 sm:py-8">
            <div className="text-gray-400 dark:text-gray-500 mb-2">
              <svg
                className="mx-auto h-6 w-6 sm:h-8 sm:w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                />
              </svg>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              No active tasks
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              All caught up!
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-gray-200 dark:border-gray-600">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>
            🔥 Urgent:{" "}
            {tasks.filter((task) => task.priority === "urgent").length}
          </span>
          <span>
            ⚠️ Overdue:{" "}
            {tasks.filter((task) => task.status === "overdue").length}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AssignedTasksQuickView;

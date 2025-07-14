import React, { useState, useEffect } from "react";
import { getEmployeeDailyUpdates } from "../../../lib/api";

interface DailyUpdate {
  id: number;
  title: string;
  date: string;
  work_done: string;
  reference_link?: string;
  comment?: string;
  task_id?: number;
}

const TaskHistoryTable = () => {
  const [dailyUpdates, setDailyUpdates] = useState<DailyUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch daily updates on component mount
  useEffect(() => {
    fetchDailyUpdates();
  }, []);

  const fetchDailyUpdates = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getEmployeeDailyUpdates();

      if (response.success) {
        setDailyUpdates(response.daily_updates);
      } else {
        setError(response.message || "Failed to fetch daily updates");
        // Add dummy data for testing
        setDailyUpdates([
          {
            id: 1,
            title: "Chatbot UI Component Creation and Backend Integration",
            date: "2025-07-11",
            work_done:
              "Created the chatbot UI component and integrated with backend API",
            reference_link: "https://github.com/example/repo",
            comment: "Completed successfully",
            task_id: 123,
          },
          {
            id: 2,
            title: "UI integration",
            date: "2025-07-04",
            work_done: "UI Integration for chatbot is done",
            reference_link: "",
            comment: "",
            task_id: null,
          },
        ]);
      }
    } catch (err) {
      setError("An error occurred while fetching daily updates");
      console.error("Fetch daily updates error:", err);
      // Add dummy data for testing
      setDailyUpdates([
        {
          id: 1,
          title: "Chatbot UI Component Creation and Backend Integration",
          date: "2025-07-11",
          work_done:
            "Created the chatbot UI component and integrated with backend API",
          reference_link: "https://github.com/example/repo",
          comment: "Completed successfully",
          task_id: 123,
        },
        {
          id: 2,
          title: "UI integration",
          date: "2025-07-04",
          work_done: "UI Integration for chatbot is done",
          reference_link: "",
          comment: "",
          task_id: null,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Function to display a custom message (replaces alert())
  const showCustomMessage = (message: string) => {
    const messageBox = document.createElement("div");
    messageBox.className =
      "fixed inset-0 bg-gray-600 bg-opacity-50 dark:bg-gray-900 dark:bg-opacity-70 flex items-center justify-center z-50 p-4";
    messageBox.innerHTML = `
      <div class="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-lg shadow-2xl text-center max-w-md mx-auto border border-gray-200 dark:border-gray-700 w-full">
        <p class="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200 mb-6 whitespace-pre-line">${message}</p>
        <button id="closeMessageBox" class="px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition duration-200 text-base w-full sm:w-auto">
          OK
        </button>
      </div>
    `;
    document.body.appendChild(messageBox);

    document.getElementById("closeMessageBox")!.onclick = () => {
      document.body.removeChild(messageBox);
    };
  };

  const handleRowClick = (update: DailyUpdate) => {
    console.log("Daily update clicked:", update);

    const taskInfo = update.task_id
      ? `Task ID: ${update.task_id}`
      : "General Update";
    const referenceInfo = update.reference_link
      ? `Reference: ${update.reference_link}`
      : "";
    const commentInfo = update.comment ? `Comment: ${update.comment}` : "";

    const details = [
      `Title: ${update.title}`,
      `Date: ${update.date}`,
      `Work Done: ${update.work_done}`,
      taskInfo,
      referenceInfo,
      commentInfo,
    ]
      .filter(Boolean)
      .join("\n");

    showCustomMessage(`Daily Update Details:\n\n${details}`);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Truncate text helper
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Loading state
  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto font-inter">
        <div className="bg-white dark:bg-slate-800 p-8 sm:p-10 md:p-12 rounded-lg sm:rounded-xl md:rounded-2xl shadow-2xl dark:shadow-2xl dark:shadow-black/50 border border-gray-200 dark:border-gray-700 transition-all duration-300 relative">
          {/* Enhanced shadow overlay for better depth */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/5 dark:to-white/5 rounded-lg sm:rounded-xl md:rounded-2xl pointer-events-none"></div>

          <div className="relative z-10 flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
            <span className="ml-4 text-lg text-gray-600 dark:text-gray-400 transition-colors duration-300">
              Loading your daily updates...
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && dailyUpdates.length === 0) {
    return (
      <div className="w-full max-w-6xl mx-auto font-inter">
        <div className="bg-white dark:bg-slate-800 p-8 sm:p-10 md:p-12 rounded-lg sm:rounded-xl md:rounded-2xl shadow-2xl dark:shadow-2xl dark:shadow-black/50 border border-gray-200 dark:border-gray-700 transition-all duration-300 relative">
          {/* Enhanced shadow overlay for better depth */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/5 dark:to-white/5 rounded-lg sm:rounded-xl md:rounded-2xl pointer-events-none"></div>

          <div className="relative z-10">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
              <div className="flex items-center">
                <div className="text-red-600 dark:text-red-400 mr-4">⚠️</div>
                <div>
                  <h3 className="text-lg font-semibold text-red-800 dark:text-red-400">
                    Error Loading Daily Updates
                  </h3>
                  <p className="text-red-600 dark:text-red-400 mt-1">{error}</p>
                  <button
                    onClick={fetchDailyUpdates}
                    className="mt-4 px-4 py-2 bg-red-600 dark:bg-red-500 text-white rounded hover:bg-red-700 dark:hover:bg-red-600 transition-colors duration-200"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto font-inter">
      <div className="bg-white dark:bg-slate-800 p-8 sm:p-10 md:p-12 rounded-lg sm:rounded-xl md:rounded-2xl shadow-2xl dark:shadow-2xl dark:shadow-black/50 border border-gray-200 dark:border-gray-700 transition-all duration-300 relative">
        {/* Enhanced shadow overlay for better depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/5 dark:to-white/5 rounded-lg sm:rounded-xl md:rounded-2xl pointer-events-none"></div>

        {/* Content wrapper with relative positioning */}
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-200 drop-shadow-sm transition-colors duration-300">
                Daily Updates History
              </h2>
              <p className="text-gray-700 dark:text-gray-300 text-lg sm:text-xl mt-2 font-medium transition-colors duration-300">
                All daily updates that you have submitted ({dailyUpdates.length}{" "}
                total)
              </p>
            </div>
            <button
              onClick={fetchDailyUpdates}
              className="mt-4 sm:mt-0 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Refresh
            </button>
          </div>

          {/* No updates message */}
          {dailyUpdates.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4 transition-colors duration-300">
                📝
              </div>
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
                No Daily Updates Yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
                You haven't submitted any daily updates yet. Start by submitting
                your first update!
              </p>
            </div>
          ) : (
            <>
              {/* Desktop and Tablet Table View - No horizontal scroll */}
              <div className="hidden md:block rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                <table className="w-full divide-y divide-gray-200 dark:divide-gray-700 table-fixed">
                  <thead className="bg-gray-50 dark:bg-slate-700">
                    <tr>
                      <th
                        scope="col"
                        className="w-[15%] px-4 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider transition-colors duration-300"
                      >
                        Date
                      </th>
                      <th
                        scope="col"
                        className="w-[25%] px-4 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider transition-colors duration-300"
                      >
                        Title
                      </th>
                      <th
                        scope="col"
                        className="w-[35%] px-4 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider transition-colors duration-300"
                      >
                        Work Done
                      </th>
                      <th
                        scope="col"
                        className="w-[10%] px-4 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider transition-colors duration-300"
                      >
                        Task ID
                      </th>
                      <th
                        scope="col"
                        className="w-[15%] px-4 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider transition-colors duration-300"
                      >
                        Reference
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-300">
                    {dailyUpdates.map((update) => (
                      <tr
                        key={update.id}
                        className="hover:bg-gray-50 dark:hover:bg-slate-700 cursor-pointer transition-colors duration-200"
                        onClick={() => handleRowClick(update)}
                      >
                        <td className="px-4 py-4 text-sm font-medium text-gray-900 dark:text-gray-200 transition-colors duration-300">
                          {formatDate(update.date)}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">
                          <div className="break-words" title={update.title}>
                            {truncateText(update.title, 50)}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">
                          <div className="break-words" title={update.work_done}>
                            {truncateText(update.work_done, 80)}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">
                          {update.task_id || "N/A"}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">
                          {update.reference_link ? (
                            <a
                              href={update.reference_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline transition-colors duration-200"
                              onClick={(e) => e.stopPropagation()}
                            >
                              Link
                            </a>
                          ) : (
                            "N/A"
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Tablet View - Simplified table for medium screens */}
              <div className="hidden sm:block md:hidden rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                <table className="w-full divide-y divide-gray-200 dark:divide-gray-700 table-fixed">
                  <thead className="bg-gray-50 dark:bg-slate-700">
                    <tr>
                      <th
                        scope="col"
                        className="w-[20%] px-3 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider transition-colors duration-300"
                      >
                        Date
                      </th>
                      <th
                        scope="col"
                        className="w-[35%] px-3 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider transition-colors duration-300"
                      >
                        Title
                      </th>
                      <th
                        scope="col"
                        className="w-[35%] px-3 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider transition-colors duration-300"
                      >
                        Work Done
                      </th>
                      <th
                        scope="col"
                        className="w-[10%] px-3 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider transition-colors duration-300"
                      >
                        Task
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-300">
                    {dailyUpdates.map((update) => (
                      <tr
                        key={update.id}
                        className="hover:bg-gray-50 dark:hover:bg-slate-700 cursor-pointer transition-colors duration-200"
                        onClick={() => handleRowClick(update)}
                      >
                        <td className="px-3 py-4 text-sm font-medium text-gray-900 dark:text-gray-200 transition-colors duration-300">
                          {formatDate(update.date)}
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">
                          <div className="break-words" title={update.title}>
                            {truncateText(update.title, 35)}
                          </div>
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">
                          <div className="break-words" title={update.work_done}>
                            {truncateText(update.work_done, 40)}
                          </div>
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">
                          {update.task_id || "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile "Card" View */}
              <div className="sm:hidden space-y-4">
                {dailyUpdates.map((update) => (
                  <div
                    key={update.id}
                    className="bg-gray-50 dark:bg-slate-700 rounded-lg shadow-lg p-4 border border-gray-200 dark:border-gray-600 cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-600 transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-xl"
                    onClick={() => handleRowClick(update)}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase transition-colors duration-300">
                        Date:
                      </span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-gray-200 transition-colors duration-300">
                        {formatDate(update.date)}
                      </span>
                    </div>
                    <div className="mb-3">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase block mb-1 transition-colors duration-300">
                        Title:
                      </span>
                      <span className="text-sm text-gray-800 dark:text-gray-200 break-words transition-colors duration-300">
                        {update.title}
                      </span>
                    </div>
                    <div className="mb-3">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase block mb-1 transition-colors duration-300">
                        Work Done:
                      </span>
                      <span className="text-sm text-gray-800 dark:text-gray-200 break-words transition-colors duration-300">
                        {update.work_done}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase transition-colors duration-300">
                        Task ID:
                      </span>
                      <span className="text-sm text-gray-800 dark:text-gray-200 transition-colors duration-300">
                        {update.task_id || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase transition-colors duration-300">
                        Reference:
                      </span>
                      {update.reference_link ? (
                        <a
                          href={update.reference_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline transition-colors duration-200 text-sm"
                          onClick={(e) => e.stopPropagation()}
                        >
                          View Link
                        </a>
                      ) : (
                        <span className="text-sm text-gray-800 dark:text-gray-200 transition-colors duration-300">
                          N/A
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskHistoryTable;

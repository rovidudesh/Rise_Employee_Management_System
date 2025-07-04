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
      }
    } catch (err) {
      setError("An error occurred while fetching daily updates");
      console.error("Fetch daily updates error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Function to display a custom message (replaces alert())
  const showCustomMessage = (message: string) => {
    const messageBox = document.createElement("div");
    messageBox.className =
      "fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50";
    messageBox.innerHTML = `
      <div class="bg-white p-8 rounded-lg shadow-xl text-center max-w-md mx-auto">
        <p class="text-lg font-semibold text-gray-800 mb-6">${message}</p>
        <button id="closeMessageBox" class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 text-base">
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

  // Loading state
  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto font-inter mt-8 px-4 sm:px-6">
        <div className="bg-white p-8 sm:p-10 md:p-12 rounded-2xl shadow-lg border border-gray-200">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <span className="ml-4 text-lg text-gray-600">
              Loading your daily updates...
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full max-w-6xl mx-auto font-inter mt-8 px-4 sm:px-6">
        <div className="bg-white p-8 sm:p-10 md:p-12 rounded-2xl shadow-lg border border-gray-200">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="text-red-600 mr-4">⚠️</div>
              <div>
                <h3 className="text-lg font-semibold text-red-800">
                  Error Loading Daily Updates
                </h3>
                <p className="text-red-600 mt-1">{error}</p>
                <button
                  onClick={fetchDailyUpdates}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto font-inter mt-8 px-4 sm:px-6">
      <div className="bg-white p-8 sm:p-10 md:p-12 rounded-2xl shadow-lg border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Daily Updates History
            </h2>
            <p className="text-gray-700 text-lg sm:text-xl mt-2 font-medium">
              All daily updates that you have submitted ({dailyUpdates.length}{" "}
              total)
            </p>
          </div>
          <button
            onClick={fetchDailyUpdates}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Refresh
          </button>
        </div>

        {/* No updates message */}
        {dailyUpdates.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Daily Updates Yet
            </h3>
            <p className="text-gray-600">
              You haven't submitted any daily updates yet. Start by submitting
              your first update!
            </p>
          </div>
        ) : (
          <>
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
                      Work Done
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 sm:px-8 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider"
                    >
                      Task ID
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 sm:px-8 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider"
                    >
                      Reference
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {dailyUpdates.map((update) => (
                    <tr
                      key={update.id}
                      className="hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                      onClick={() => handleRowClick(update)}
                    >
                      <td className="px-6 py-5 sm:px-8 whitespace-nowrap text-base font-medium text-gray-900">
                        {formatDate(update.date)}
                      </td>
                      <td className="px-6 py-5 sm:px-8 text-base text-gray-600">
                        <div className="max-w-xs truncate">{update.title}</div>
                      </td>
                      <td className="px-6 py-5 sm:px-8 text-base text-gray-600">
                        <div className="max-w-xs truncate">
                          {update.work_done}
                        </div>
                      </td>
                      <td className="px-6 py-5 sm:px-8 whitespace-nowrap text-base text-gray-600">
                        {update.task_id || "N/A"}
                      </td>
                      <td className="px-6 py-5 sm:px-8 whitespace-nowrap text-base text-gray-600">
                        {update.reference_link ? (
                          <a
                            href={update.reference_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline"
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

            {/* Mobile "Card" View */}
            <div className="sm:hidden space-y-6">
              {dailyUpdates.map((update) => (
                <div
                  key={update.id}
                  className="bg-white rounded-lg shadow-md p-6 border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors duration-150"
                  onClick={() => handleRowClick(update)}
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium text-gray-500 uppercase">
                      Date:
                    </span>
                    <span className="text-lg font-semibold text-gray-900">
                      {formatDate(update.date)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium text-gray-500 uppercase">
                      Title:
                    </span>
                    <span className="text-base text-gray-800 text-right">
                      {update.title}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium text-gray-500 uppercase">
                      Work Done:
                    </span>
                    <span className="text-base text-gray-800 text-right max-w-xs truncate">
                      {update.work_done}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium text-gray-500 uppercase">
                      Task ID:
                    </span>
                    <span className="text-base text-gray-800">
                      {update.task_id || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-500 uppercase">
                      Reference:
                    </span>
                    {update.reference_link ? (
                      <a
                        href={update.reference_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        View Link
                      </a>
                    ) : (
                      <span className="text-gray-800">N/A</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TaskHistoryTable;

import React, { useState } from "react";
import { submitDailyUpdate } from "../../../lib/api";

const TaskForm = () => {
  const [taskTitle, setTaskTitle] = useState("");
  const [date, setDate] = useState("");
  const [workDone, setWorkDone] = useState("");
  const [referenceLink, setReferenceLink] = useState("");
  const [comment, setComment] = useState("");
  const [taskId, setTaskId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const updateData = {
        title: taskTitle,
        date,
        work_done: workDone,
        reference_link: referenceLink || undefined,
        comment: comment || undefined,
        task_id: taskId ? parseInt(taskId) : undefined,
      };

      const response = await submitDailyUpdate(updateData);

      if (response.success) {
        showCustomMessage("Daily update submitted successfully!", "success");
        // Reset form after successful submission
        setTaskTitle("");
        setDate("");
        setWorkDone("");
        setReferenceLink("");
        setComment("");
        setTaskId("");
      } else {
        setError(response.message || "Failed to submit daily update");
        showCustomMessage(
          response.message || "Failed to submit daily update",
          "error"
        );
      }
    } catch (err) {
      console.error("Submit daily update error:", err);
      setError(
        "An error occurred while submitting the update. Please try again."
      );
      showCustomMessage(
        "An error occurred while submitting the update. Please try again.",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Function to display a custom message (replaces alert())
  const showCustomMessage = (message, type = "success") => {
    const messageBox = document.createElement("div");
    messageBox.className =
      "fixed inset-0 bg-gray-600 bg-opacity-50 dark:bg-gray-900 dark:bg-opacity-70 flex items-center justify-center z-50 p-4";

    const bgColor =
      type === "success"
        ? "bg-green-600 dark:bg-green-500"
        : "bg-red-600 dark:bg-red-500";
    const hoverColor =
      type === "success"
        ? "hover:bg-green-700 dark:hover:bg-green-600"
        : "hover:bg-red-700 dark:hover:bg-red-600";

    messageBox.innerHTML = `
      <div class="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-lg shadow-2xl text-center max-w-md mx-auto border border-gray-200 dark:border-gray-700 w-full">
        <p class="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200 mb-6 whitespace-pre-line">${message}</p>
        <button id="closeMessageBox" class="px-6 py-3 ${bgColor} text-white rounded-lg ${hoverColor} transition duration-200 text-base w-full sm:w-auto">
          OK
        </button>
      </div>
    `;
    document.body.appendChild(messageBox);

    document.getElementById("closeMessageBox").onclick = () => {
      document.body.removeChild(messageBox);
    };
  };

  return (
    <div className="w-full max-w-6xl mx-auto font-inter">
      <div className="bg-white dark:bg-slate-800 p-8 sm:p-10 md:p-12 rounded-lg sm:rounded-xl md:rounded-2xl shadow-2xl dark:shadow-2xl dark:shadow-black/50 border border-gray-200 dark:border-gray-700 transition-all duration-300 relative max-w-4xl mx-auto">
        {/* Enhanced shadow overlay for better depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/5 dark:to-white/5 rounded-lg sm:rounded-xl md:rounded-2xl pointer-events-none"></div>

        {/* Content wrapper with relative positioning */}
        <div className="relative z-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6 sm:mb-8 md:mb-10 text-gray-800 dark:text-gray-200 drop-shadow-sm transition-colors duration-300">
            Submit Your Daily Update
          </h2>

          {/* Error message display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg transition-colors duration-300">
              <p className="text-red-700 dark:text-red-400 transition-colors duration-300">
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            {/* Task Title and Date - Two columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Task Title */}
              <div>
                <label
                  htmlFor="taskTitle"
                  className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-3 transition-colors duration-300"
                >
                  Task Title
                </label>
                <input
                  type="text"
                  id="taskTitle"
                  className="w-full px-4 sm:px-5 py-3 sm:py-4 border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200 text-sm sm:text-base shadow-sm focus:shadow-md"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  disabled={isLoading}
                  required
                  placeholder="Enter task title"
                />
              </div>

              {/* Date */}
              <div>
                <label
                  htmlFor="date"
                  className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-3 transition-colors duration-300"
                >
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  className="w-full px-4 sm:px-5 py-3 sm:py-4 border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200 text-sm sm:text-base shadow-sm focus:shadow-md"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            {/* Work Done - Full width */}
            <div>
              <label
                htmlFor="workDone"
                className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-3 transition-colors duration-300"
              >
                Work Done
              </label>
              <textarea
                id="workDone"
                rows={5}
                className="w-full px-4 sm:px-5 py-3 sm:py-4 border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200 resize-y text-sm sm:text-base shadow-sm focus:shadow-md"
                value={workDone}
                onChange={(e) => setWorkDone(e.target.value)}
                disabled={isLoading}
                required
                placeholder="Describe the work you completed"
              ></textarea>
            </div>

            {/* Reference Link - Full width */}
            <div>
              <label
                htmlFor="referenceLink"
                className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-3 transition-colors duration-300"
              >
                Reference Link
              </label>
              <input
                type="url"
                id="referenceLink"
                className="w-full px-4 sm:px-5 py-3 sm:py-4 border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200 text-sm sm:text-base shadow-sm focus:shadow-md"
                value={referenceLink}
                onChange={(e) => setReferenceLink(e.target.value)}
                disabled={isLoading}
                placeholder="Add a reference link (optional)"
              />
            </div>

            {/* Comment - Full width */}
            <div>
              <label
                htmlFor="comment"
                className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-3 transition-colors duration-300"
              >
                Comment{" "}
                <span className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm transition-colors duration-300">
                  (Optional)
                </span>
              </label>
              <textarea
                id="comment"
                rows={4}
                className="w-full px-4 sm:px-5 py-3 sm:py-4 border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200 resize-y text-sm sm:text-base shadow-sm focus:shadow-md"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                disabled={isLoading}
                placeholder="Any additional comments or notes..."
              ></textarea>
            </div>

            {/* Task ID - Full width */}
            <div>
              <label
                htmlFor="taskId"
                className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-3 transition-colors duration-300"
              >
                Task ID{" "}
                <span className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm transition-colors duration-300">
                  (Optional)
                </span>
              </label>
              <input
                type="number"
                id="taskId"
                className="w-full px-4 sm:px-5 py-3 sm:py-4 border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200 text-sm sm:text-base shadow-sm focus:shadow-md"
                value={taskId}
                onChange={(e) => setTaskId(e.target.value)}
                disabled={isLoading}
                placeholder="Enter task ID if related to a specific task"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 sm:py-5 rounded-lg transition-all duration-200 text-lg sm:text-xl md:text-2xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 mt-6 sm:mt-8 ${
                isLoading
                  ? "bg-gray-400 dark:bg-gray-600 text-gray-700 dark:text-gray-300 cursor-not-allowed transform-none"
                  : "bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600"
              }`}
            >
              {isLoading ? "Submitting..." : "Submit Daily Update"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskForm;

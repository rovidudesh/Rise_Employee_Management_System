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
      "fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50";

    const bgColor = type === "success" ? "bg-green-600" : "bg-red-600";
    const hoverColor =
      type === "success" ? "hover:bg-green-700" : "hover:bg-red-700";

    messageBox.innerHTML = `
      <div class="bg-white p-8 rounded-lg shadow-xl text-center max-w-md mx-auto">
        <p class="text-lg font-semibold text-gray-800 mb-6">${message}</p>
        <button id="closeMessageBox" class="px-6 py-3 ${bgColor} text-white rounded-lg ${hoverColor} transition duration-200 text-base">
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
    <div className="w-full max-w-6xl mx-auto font-inter mt-8 px-4 sm:px-6">
      <div className="bg-white p-8 sm:p-10 md:p-12 rounded-2xl shadow-lg border border-gray-200 max-w-3xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-10 text-gray-800">
          Submit Your Daily Update
        </h2>

        {/* Error message display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
          {/* Task Title and Date - Two columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Task Title */}
            <div>
              <label
                htmlFor="taskTitle"
                className="block text-base font-medium text-gray-700 mb-3"
              >
                Task Title
              </label>
              <input
                type="text"
                id="taskTitle"
                className="w-full px-5 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 text-base"
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
                className="block text-base font-medium text-gray-700 mb-3"
              >
                Date
              </label>
              <input
                type="date"
                id="date"
                className="w-full px-5 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 text-base"
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
              className="block text-base font-medium text-gray-700 mb-3"
            >
              Work Done
            </label>
            <textarea
              id="workDone"
              rows={5}
              className="w-full px-5 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 resize-y text-base"
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
              className="block text-base font-medium text-gray-700 mb-3"
            >
              Reference Link
            </label>
            <input
              type="url"
              id="referenceLink"
              className="w-full px-5 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 text-base"
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
              className="block text-base font-medium text-gray-700 mb-3"
            >
              Comment <span className="text-gray-500 text-sm">(Optional)</span>
            </label>
            <textarea
              id="comment"
              rows={4}
              className="w-full px-5 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 resize-y text-base"
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
              className="block text-base font-medium text-gray-700 mb-3"
            >
              Task ID <span className="text-gray-500 text-sm">(Optional)</span>
            </label>
            <input
              type="number"
              id="taskId"
              className="w-full px-5 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 text-base"
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
            className={`w-full py-4 sm:py-5 rounded-lg transition duration-200 text-xl sm:text-2xl font-semibold shadow-lg mt-8 ${
              isLoading
                ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            {isLoading ? "Submitting..." : "Submit Daily Update"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;

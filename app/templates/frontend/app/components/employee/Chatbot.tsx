import React, { useState, useRef, useEffect } from "react";
import { sendEmployeeChatMessage } from "../../../lib/api";

const suggestedPrompts = [
  "What tasks do I have today?",
  "Show me my recent submissions",
  "How can I improve my productivity?",
  "What's my current progress?",
];

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Get user name from localStorage (or fallback to "Employee")
  let name = "Employee";
  if (typeof window !== "undefined") {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user?.full_name) name = user.full_name;
    } catch (e) {}
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const generateChatbotResponse = async (prompt) => {
    setIsLoading(true);
    try {
      const result = await sendEmployeeChatMessage(prompt);
      if (result.success) {
        return result.response;
      } else {
        return (
          result.message ||
          "Sorry, I couldn't process your request. Please try again."
        );
      }
    } catch (error) {
      return "Connection error. Please try again later.";
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (text) => {
    if (!text.trim()) return;
    const userMessage = {
      type: "user",
      text: text.trim(),
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    const response = await generateChatbotResponse(text.trim());
    const botMessage = {
      type: "bot",
      text: response,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, botMessage]);
  };

  const handlePromptClick = (prompt) => handleSendMessage(prompt);

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputMessage);
    }
  };

  const clearChat = () => setMessages([]);

  // Check if at least one user message has been sent
  const hasUserMessage = messages.some((msg) => msg.type === "user");

  // Conditionally add bottom padding when input is fixed
  const containerClass = `flex flex-col items-center justify-center w-full h-full min-h-[calc(100vh-64px-56px)] px-2 py-4 bg-gray-50 dark:bg-slate-900 transition-colors duration-300 ${
    hasUserMessage ? "pb-28" : ""
  }`;

  return (
    <div className={containerClass}>
      <div className="w-full max-w-2xl flex flex-col flex-1 justify-center">
        {/* Header */}
        <div className="mb-6 mt-6 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">
            Hi there, <span className="text-purple-500">{name}</span>
          </h1>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-700 dark:text-gray-300 mb-1">
            What would you like to know?
          </h2>
        </div>
        {/* Suggested Prompts */}
        {messages.length === 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {suggestedPrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => handlePromptClick(prompt)}
                disabled={isLoading}
                className="px-3 py-2 bg-white dark:bg-slate-800 rounded-lg shadow hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-800 dark:text-gray-200 text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}
        {/* Chat Area - ChatGPT-like bubbles */}
        <div
          className={`flex flex-col w-full rounded-xl px-3 py-4 mb-3 gap-2 ${
            hasUserMessage ? "mb-32" : ""
          }`}
        >
          {messages.length === 0 && (
            <div className="text-center text-gray-400 mt-4">
              <span>Ask whatever you want…</span>
            </div>
          )}
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                msg.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`whitespace-pre-line text-base max-w-[80%] px-4 py-2
                  ${
                    msg.type === "user"
                      ? "bg-purple-600 text-white rounded-l-2xl rounded-tr-2xl"
                      : "bg-gray-800 text-gray-100 rounded-r-2xl rounded-tl-2xl"
                  }`}
                style={{
                  marginLeft: msg.type === "user" ? "auto" : undefined,
                  marginRight: msg.type === "user" ? undefined : "auto",
                }}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="whitespace-pre-line text-base max-w-[80%] px-4 py-2 bg-gray-800 text-gray-100 rounded-r-2xl rounded-tl-2xl animate-pulse">
                <span>🤖 Typing…</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Bar */}
      {hasUserMessage ? (
        // Fixed input bar at the bottom after first user message
        <div className="fixed bottom-0 left-0 w-full flex justify-center z-50 bg-transparent">
          <div className="w-full max-w-2xl px-2 pb-16">
            {" "}
            {/* Increased pb-16 for more space above bottom */}
            <form
              className="flex items-center gap-2 w-full rounded-xl shadow px-3 py-2 bg-gray-900"
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputMessage);
              }}
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask whatever you want…"
                className="flex-1 px-3 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 text-gray-100 bg-gray-800 text-sm"
                disabled={isLoading}
              />
              <button
                type="submit"
                className="bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50 text-sm"
                disabled={isLoading || !inputMessage.trim()}
              >
                Send
              </button>
              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={clearChat}
                  className="ml-1 px-3 py-1 text-xs bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors duration-200 shadow"
                >
                  Clear
                </button>
              )}
            </form>
          </div>
        </div>
      ) : (
        // Normal input bar before first user message
        <form
          className="flex items-center gap-2 w-full max-w-2xl rounded-xl shadow px-3 py-2 mt-2"
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputMessage);
          }}
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask whatever you want…"
            className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-slate-700 text-sm"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50 text-sm"
            disabled={isLoading || !inputMessage.trim()}
          >
            Send
          </button>
          {messages.length > 0 && (
            <button
              type="button"
              onClick={clearChat}
              className="ml-1 px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 shadow"
            >
              Clear
            </button>
          )}
        </form>
      )}
    </div>
  );
};

export default Chatbot;

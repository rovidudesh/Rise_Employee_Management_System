import React, { useState, useRef, useEffect } from "react";
import { sendManagerChatMessage } from "../../../lib/api";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const suggestedPrompts = [
    "What has my team done today?",
    "Summarize the tasks submitted yesterday",
    "Who hasn't submitted their daily update today?",
  ];

  const generateChatbotResponse = async (prompt) => {
    setIsLoading(true);

    try {
      const response = await sendManagerChatMessage(prompt);

      if (response.success) {
        return response.response;
      } else {
        console.error("Chatbot API Error:", response.message);
        return (
          response.message ||
          "Sorry, I couldn't process your request. Please try again."
        );
      }
    } catch (error) {
      console.error("Chatbot Error:", error);
      return "Connection error. Please try again later.";
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (text) => {
    if (!text.trim()) return;

    // Add user message immediately
    const userMessage = {
      type: "user",
      text: text.trim(),
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");

    // Get bot response
    const response = await generateChatbotResponse(text.trim());

    // Add bot response
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

  const clearChat = () => {
    setMessages([]);
  };

  // Check if at least one user message has been sent
  const hasUserMessage = messages.some((msg) => msg.type === "user");

  // Expanded container class for full width, matching admin chatbot
  const containerClass =
    "flex flex-col items-center justify-center w-full h-full min-h-[calc(100vh-64px-56px)] px-2 py-4 bg-gray-50 dark:bg-slate-900 transition-colors duration-300" +
    (hasUserMessage ? " pb-28" : "");

  return (
    <div className={containerClass}>
      <div className="w-full max-w-2xl flex flex-col flex-1 justify-center">
        {/* Header */}
        <div className="mb-6 mt-6 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">
            Manager Assistant
          </h1>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Ask about your team's progress, updates, and more!
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
                className="px-3 py-2 bg-gray-800 dark:bg-gray-900 text-gray-100 dark:text-gray-200 rounded-lg shadow-none hover:bg-gray-700 dark:hover:bg-gray-800 text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
            <div className="text-center text-gray-400 dark:text-gray-500 mt-4">
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
                      ? "bg-indigo-600 dark:bg-indigo-500 text-white rounded-l-2xl rounded-tr-2xl"
                      : "bg-gray-800 dark:bg-gray-900 text-gray-100 dark:text-gray-200 rounded-r-2xl rounded-tl-2xl"
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
              <div className="whitespace-pre-line text-base max-w-[80%] px-4 py-2 bg-gray-800 dark:bg-gray-900 text-gray-100 dark:text-gray-200 rounded-r-2xl rounded-tl-2xl animate-pulse">
                <span>🤖 Typing…</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        {hasUserMessage ? (
          <div className="fixed bottom-0 left-0 w-full flex justify-center z-50 bg-transparent">
            <div className="w-full max-w-2xl px-2 pb-16">
              <form
                className="flex items-center gap-2 w-full rounded-xl shadow px-3 py-2 bg-white dark:bg-gray-900"
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
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 text-sm"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  className="bg-indigo-600 dark:bg-indigo-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 dark:hover:bg-indigo-600 transition disabled:opacity-50 text-sm"
                  disabled={isLoading || !inputMessage.trim()}
                >
                  Send
                </button>
                {messages.length > 0 && (
                  <button
                    type="button"
                    onClick={clearChat}
                    className="ml-1 px-3 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 shadow"
                  >
                    Clear
                  </button>
                )}
              </form>
            </div>
          </div>
        ) : (
          <form
            className="flex items-center gap-2 w-full max-w-2xl rounded-xl shadow px-3 py-2 mt-2 bg-white dark:bg-gray-900"
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
              className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 text-sm"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="bg-indigo-600 dark:bg-indigo-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 dark:hover:bg-indigo-600 transition disabled:opacity-50 text-sm"
              disabled={isLoading || !inputMessage.trim()}
            >
              Send
            </button>
            {messages.length > 0 && (
              <button
                type="button"
                onClick={clearChat}
                className="ml-1 px-3 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 shadow"
              >
                Clear
              </button>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default Chatbot;

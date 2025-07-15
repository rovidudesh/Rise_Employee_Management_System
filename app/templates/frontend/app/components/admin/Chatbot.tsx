import React, { useState, useRef, useEffect } from "react";
import { sendAdminChatMessage } from "../../../lib/api";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const suggestedPrompts = [
    "Show me all users in the system",
    "How many managers are active?",
    "Generate user activity report",
    "Show inactive employees",
    "Create a new department",
    "System performance overview",
  ];

  const generateChatbotResponse = async (prompt) => {
    setIsLoading(true);

    try {
      console.log("Sending message to admin chatbot:", prompt);

      // Call the actual backend API
      const result = await sendAdminChatMessage(prompt);

      if (result.success) {
        console.log("Admin chatbot response:", result.response);
        return result.response;
      } else {
        console.error("Admin chatbot error:", result.message);
        return (
          result.message ||
          "Sorry, I couldn't process your request. Please try again."
        );
      }
    } catch (error) {
      console.error("Admin Chatbot Error:", error);
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

  return (
    <div className="w-full max-w-6xl mx-auto font-inter">
      <div className="flex justify-center">
        <div className="w-full max-w-4xl bg-white dark:bg-slate-800 p-8 sm:p-10 md:p-12 rounded-2xl shadow-2xl dark:shadow-2xl dark:shadow-black/50 border border-gray-200 dark:border-gray-700 transition-all duration-300 relative">
          {/* Enhanced shadow overlay for better depth */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/5 dark:to-white/5 rounded-2xl pointer-events-none"></div>

          <div className="relative z-10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-200 drop-shadow-sm transition-colors duration-300">
                Admin Control Center
              </h2>
              {messages.length > 0 && (
                <button
                  onClick={clearChat}
                  className="px-4 py-2 text-sm bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors duration-200 shadow-sm hover:shadow-md"
                >
                  Clear Chat
                </button>
              )}
            </div>

            {/* Suggested Prompts */}
            {messages.length === 0 && (
              <div className="mb-6">
                <p className="text-base font-medium text-gray-700 dark:text-gray-300 mb-4 transition-colors duration-300">
                  Administrative commands you can try:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {suggestedPrompts.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => handlePromptClick(prompt)}
                      disabled={isLoading}
                      className="w-full text-left px-4 py-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all duration-200 text-base text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                    >
                      ⚙️ {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Chat Messages */}
            <div className="flex flex-col gap-4 mb-6 max-h-[500px] overflow-y-auto pr-2">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${
                    msg.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`px-5 py-3 rounded-2xl shadow-sm text-base max-w-[75%] transition-all duration-200 ${
                      msg.type === "user"
                        ? "bg-blue-600 dark:bg-blue-500 text-white rounded-br-md shadow-md"
                        : "bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200 rounded-bl-md border border-gray-200 dark:border-gray-600"
                    }`}
                  >
                    {msg.type === "user" ? (
                      <div className="flex items-center">
                        <span className="mr-2">👨‍💼</span>
                        {msg.text}
                      </div>
                    ) : (
                      <div className="flex items-start">
                        <span className="mr-2 mt-0.5">🤖</span>
                        <div className="whitespace-pre-wrap">{msg.text}</div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="px-5 py-3 rounded-2xl rounded-bl-md text-base bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200 animate-pulse border border-gray-200 dark:border-gray-600 transition-colors duration-300">
                    <div className="flex items-center space-x-2">
                      <span className="mr-2">🤖</span>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                      <span>Processing administrative request...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about users, reports, system management..."
                className="flex-1 px-5 py-4 border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-base transition-all duration-200 shadow-sm focus:shadow-md"
                disabled={isLoading}
              />
              <button
                onClick={() => handleSendMessage(inputMessage)}
                className="bg-blue-600 dark:bg-blue-500 text-white px-8 py-4 rounded-xl text-base font-semibold hover:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                disabled={isLoading || !inputMessage.trim()}
              >
                {isLoading ? "Processing..." : "Send"}
              </button>
            </div>

            {/* Footer Info */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                🔧 Administrative commands: user management, reports, system
                monitoring, and more!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;

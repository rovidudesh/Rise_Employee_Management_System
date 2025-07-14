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

    setMessages((prev) => [...prev, { type: "user", text: text.trim() }]);
    setInputMessage("");

    const response = await generateChatbotResponse(text.trim());
    setMessages((prev) => [...prev, { type: "bot", text: response }]);
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
        <div className="w-full max-w-2xl bg-white dark:bg-slate-800 p-8 sm:p-10 md:p-12 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-200">
              Manager Assistant
            </h2>
            {messages.length > 0 && (
              <button
                onClick={clearChat}
                className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
              >
                Clear Chat
              </button>
            )}
          </div>

          {/* Suggested Prompts */}
          {messages.length === 0 && (
            <div className="mb-6">
              <p className="text-base font-medium text-gray-700 dark:text-gray-300 mb-4">
                Try these suggestions:
              </p>
              <div className="space-y-3">
                {suggestedPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => handlePromptClick(prompt)}
                    disabled={isLoading}
                    className="w-full text-left px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors duration-200 text-base text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    💬 {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Chat Messages */}
          <div className="flex flex-col gap-4 mb-6 max-h-[400px] overflow-y-auto pr-2">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-5 py-3 rounded-2xl shadow-sm text-base max-w-[80%] ${
                    msg.type === "user"
                      ? "bg-indigo-600 dark:bg-indigo-500 text-white rounded-br-md"
                      : "bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200 rounded-bl-md border border-gray-200 dark:border-gray-600"
                  }`}
                >
                  {msg.type === "user" ? (
                    <div className="flex items-center">
                      <span className="mr-2">👤</span>
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
                <div className="px-5 py-3 rounded-2xl rounded-bl-md text-base bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200 animate-pulse border border-gray-200 dark:border-gray-600">
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
                    <span>Analyzing your team data...</span>
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
              placeholder="Ask me about your team's progress, daily updates, tasks..."
              className="flex-1 px-5 py-4 border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-base transition-all duration-200"
              disabled={isLoading}
            />
            <button
              onClick={() => handleSendMessage(inputMessage)}
              className="bg-indigo-600 dark:bg-indigo-500 text-white px-8 py-4 rounded-xl text-base font-semibold hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading || !inputMessage.trim()}
            >
              {isLoading ? "Sending..." : "Send"}
            </button>
          </div>

          {/* Footer Info */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              💡 Ask me about daily updates, team progress, task summaries, and
              more!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;

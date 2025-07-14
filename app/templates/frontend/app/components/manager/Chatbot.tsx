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
        <div className="w-full max-w-2xl bg-white dark:bg-slate-800 p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 rounded-lg sm:rounded-xl md:rounded-2xl shadow-2xl dark:shadow-2xl dark:shadow-black/50 border border-gray-200 dark:border-gray-700 transition-all duration-300 relative">
          {/* Enhanced shadow overlay for better depth */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/5 dark:to-white/5 rounded-lg sm:rounded-xl md:rounded-2xl pointer-events-none"></div>

          {/* Content wrapper with relative positioning */}
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-gray-200 mb-2 sm:mb-0 drop-shadow-sm">
                Manager Assistant
              </h2>
              {messages.length > 0 && (
                <button
                  onClick={clearChat}
                  className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-md sm:rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 self-start sm:self-auto shadow-md hover:shadow-lg"
                >
                  Clear Chat
                </button>
              )}
            </div>

            {/* Suggested Prompts */}
            {messages.length === 0 && (
              <div className="mb-4 sm:mb-6">
                <p className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mb-3 sm:mb-4">
                  Try these suggestions:
                </p>
                <div className="space-y-2 sm:space-y-3">
                  {suggestedPrompts.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => handlePromptClick(prompt)}
                      disabled={isLoading}
                      className="w-full text-left px-3 py-2 sm:px-4 sm:py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-gray-600 rounded-md sm:rounded-lg hover:bg-gray-100 dark:hover:bg-slate-600 transition-all duration-200 text-sm sm:text-base text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                    >
                      💬 {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Chat Messages */}
            <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-6 max-h-60 sm:max-h-80 md:max-h-96 lg:max-h-[400px] overflow-y-auto pr-1 sm:pr-2 bg-gray-50 dark:bg-slate-900 rounded-lg p-3 shadow-inner border border-gray-100 dark:border-gray-700">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${
                    msg.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`px-3 py-2 sm:px-4 sm:py-3 md:px-5 md:py-3 rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg text-sm sm:text-base max-w-[85%] sm:max-w-[80%] ${
                      msg.type === "user"
                        ? "bg-indigo-600 dark:bg-indigo-500 text-white rounded-br-md shadow-indigo-200 dark:shadow-indigo-900/50"
                        : "bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 rounded-bl-md border border-gray-200 dark:border-gray-600 shadow-gray-200 dark:shadow-gray-900/50"
                    }`}
                  >
                    {msg.type === "user" ? (
                      <div className="flex items-center">
                        <span className="mr-2 text-sm sm:text-base">👤</span>
                        <span className="break-words">{msg.text}</span>
                      </div>
                    ) : (
                      <div className="flex items-start">
                        <span className="mr-2 mt-0.5 text-sm sm:text-base flex-shrink-0">
                          🤖
                        </span>
                        <div className="whitespace-pre-wrap break-words">
                          {msg.text}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="px-3 py-2 sm:px-4 sm:py-3 md:px-5 md:py-3 rounded-lg sm:rounded-xl md:rounded-2xl rounded-bl-md text-sm sm:text-base bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 animate-pulse border border-gray-200 dark:border-gray-600 shadow-lg">
                    <div className="flex items-center space-x-2">
                      <span className="mr-2 flex-shrink-0">🤖</span>
                      <div className="flex space-x-1">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                      <span className="text-xs sm:text-sm">Analyzing...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:items-center sm:space-x-3 md:space-x-4 p-3 bg-gray-50 dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-inner">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about your team's progress..."
                className="flex-1 px-3 py-2 sm:px-4 sm:py-3 md:px-5 md:py-4 border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm sm:text-base transition-all duration-200 shadow-sm focus:shadow-md"
                disabled={isLoading}
              />
              <button
                onClick={() => handleSendMessage(inputMessage)}
                className="bg-indigo-600 dark:bg-indigo-500 text-white px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none w-full sm:w-auto"
                disabled={isLoading || !inputMessage.trim()}
              >
                {isLoading ? "Sending..." : "Send"}
              </button>
            </div>

            {/* Footer Info */}
            <div className="mt-4 sm:mt-6 text-center">
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 px-2">
                💡 Ask me about daily updates, team progress, task summaries,
                and more!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;

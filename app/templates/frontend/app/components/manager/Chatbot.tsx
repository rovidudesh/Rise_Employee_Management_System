import React, { useState, useRef, useEffect } from 'react';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const suggestedPrompts = [
    "how many tasks have submitted?",
    "What have person1 done today ?",
    "summarize the tasks submitted yesterday?"
  ];

  const generateChatbotResponse = async (prompt) => {
    setIsLoading(true);
    let chatHistory = [];
    chatHistory.push({ role: "user", parts: [{ text: prompt }] });

    const payload = { contents: chatHistory };
    const apiKey = ""; // Canvas will provide at runtime
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();

      if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
        return result.candidates[0].content.parts[0].text;
      } else {
        console.error("Unexpected API response:", result);
        return "Sorry, I couldn't get a response.";
      }
    } catch (error) {
      console.error("API Error:", error);
      return "Connection error. Try again later.";
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (text) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { type: 'user', text }]);
    setInputMessage('');

    const response = await generateChatbotResponse(text);
    setMessages(prev => [...prev, { type: 'bot', text: response }]);
  };

  const handlePromptClick = (prompt) => handleSendMessage(prompt);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputMessage);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto font-inter">
      <div className="flex justify-center">
        <div className="w-full max-w-2xl bg-white p-8 sm:p-10 md:p-12 rounded-2xl shadow-lg border border-gray-200">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6 text-center">
            Chatbot Assistant
          </h2>

          <div className="mb-6 text-center">
            <p className="text-lg sm:text-xl text-gray-600 mb-2">Hi, There!</p>
            <p className="text-xl sm:text-2xl font-semibold text-gray-800">How can we help?</p>
          </div>

          {/* Suggested Prompts */}
          {messages.length === 0 && (
            <div className="mb-6">
              <p className="text-base font-medium text-gray-700 mb-4">Try these suggestions:</p>
              <div className="space-y-3">
                {suggestedPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => handlePromptClick(prompt)}
                    className="w-full text-left px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors duration-200 text-base text-gray-700"
                  >
                    {prompt}
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
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`px-5 py-3 rounded-2xl shadow-sm text-base max-w-[80%] ${
                  msg.type === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-md'
                    : 'bg-gray-100 text-gray-800 rounded-bl-md border border-gray-200'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="px-5 py-3 rounded-2xl rounded-bl-md text-base bg-gray-100 text-gray-800 animate-pulse border border-gray-200">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                    <span>Thinking...</span>
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
              placeholder="Type your message..."
              className="flex-1 px-5 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-base transition-all duration-200"
              disabled={isLoading}
            />
            <button
              onClick={() => handleSendMessage(inputMessage)}
              className="bg-indigo-600 text-white px-8 py-4 rounded-xl text-base font-semibold hover:bg-indigo-700 transition-colors duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;

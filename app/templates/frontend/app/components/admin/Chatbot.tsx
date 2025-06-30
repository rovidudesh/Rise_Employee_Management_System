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
    <div className="w-full px-2 sm:px-4 py-6 sm:py-8 flex justify-center font-inter min-h-screen bg-transparent">
      <div className="w-full max-w-md sm:max-w-xl bg-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-xl flex flex-col">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-3 sm:mb-4 text-center">
          Chatbot
        </h2>

        <div className="mb-3 sm:mb-4 text-center">
          <p className="text-base sm:text-lg text-gray-600">Hi, There!</p>
          <p className="text-lg sm:text-xl font-semibold text-gray-800">How can we help?</p>
        </div>

        <div className="flex flex-col gap-2 sm:gap-3 mb-4 max-h-[50vh] overflow-y-auto pr-1 sm:pr-2">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`px-3 py-2 rounded-xl shadow-sm text-sm max-w-[85%] ${
                msg.type === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-none'
                  : 'bg-gray-200 text-gray-800 rounded-bl-none'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="px-4 py-2 rounded-xl text-sm bg-gray-200 text-gray-800 animate-pulse">
                Thinking...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
            disabled={isLoading}
          />
          <button
            onClick={() => handleSendMessage(inputMessage)}
            className="bg-indigo-700 text-white px-5 py-2 rounded-full text-sm sm:text-base font-semibold hover:bg-indigo-800 transition shadow-md disabled:opacity-60"
            disabled={isLoading}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;

import React, { useState, useEffect } from "react";
import * as GoogleGenerativeAI from "@google/generative-ai";
import { FaRobot } from 'react-icons/fa'; // Import the robot icon

const GeminiChat = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const API_KEY = "AIzaSyDZJoW_njjcjEfkHtaPWF79QkI9YWscwXs";

  useEffect(() => {
    const startChat = async () => {
      const genAI = new GoogleGenerativeAI.GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const initialPrompt = `You are an AI assistant for a farming equipment rental platform. Your role is to help users with questions about renting farming equipment, understanding agricultural practices, and navigating the platform. Please provide helpful, concise, and accurate information. If you're unsure about something, it's okay to say so. Begin by greeting the user and asking how you can assist them today.`;
      const result = await model.generateContent(initialPrompt);
      const response = result.response;
      const text = response.text();
      setMessages([
        {
          text,
          user: false,
        },
      ]);
    };
    startChat();
  }, []);

  const sendMessage = async () => {
    setLoading(true);
    const userMessage = { text: userInput, user: true };
    setMessages([...messages, userMessage]);

    const genAI = new GoogleGenerativeAI.GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const contextPrompt = `You are an AI assistant for a farming equipment rental platform. The user's message is: "${userInput}". Please respond appropriately, keeping in mind the context of farming equipment rentals and agricultural practices. If the user's query is outside this scope, politely guide them back to relevant topics.`;
    const result = await model.generateContent(contextPrompt);
    const response = result.response;
    const text = response.text();
    setMessages([...messages, userMessage, { text, user: false }]);
    setLoading(false);
    setUserInput("");
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const renderMessage = (item, index) => (
    <div key={index} className={`mb-2 ${item.user ? 'text-right' : 'text-left'}`}>
      <p className={`inline-block p-2 rounded-lg ${item.user ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
        {item.text}
      </p>
    </div>
  );

  return (
    <>
      <button 
        className="fixed bottom-4 right-4 bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition-colors duration-300 flex items-center justify-center text-xl" 
        onClick={toggleChat}
        style={{ width: '60px', height: '60px' }}
      >
        <FaRobot className="mr-2 text-2xl" />
      </button>
      {isOpen && (
        <div className="fixed bottom-20 right-4 w-80 bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="bg-green-600 text-white p-4 flex justify-between items-center">
            <h3 className="font-bold">Farm Equipment Assistant</h3>
            <button 
              onClick={toggleChat}
              className="text-white hover:text-gray-200 transition-colors duration-300"
            >
              Close
            </button>
          </div>
          <div className="h-96 overflow-y-auto p-4">
            {messages.map(renderMessage)}
          </div>
          <div className="border-t p-4 flex">
            <input
              type="text"
              placeholder="Ask about farm equipment..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              className="flex-grow mr-2 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button 
              onClick={sendMessage} 
              disabled={loading}
              className={`px-4 py-2 rounded-lg ${loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'} text-white transition-colors duration-300`}
            >
              {loading ? 'Sending...' : 'Send'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default GeminiChat;
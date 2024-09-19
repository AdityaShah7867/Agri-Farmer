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
      const initialPrompt = `You are an AI chatbot assistant for a farming equipment rental platform. Your role is to help users with questions about renting farming equipment, understanding agricultural practices, and navigating the platform. Please provide helpful, concise, and accurate information. If you're unsure about something, it's okay to say so. The app has the following main features and pages:
          - Home page ("/")
          - Add tools ("/addtools")
          - Available tools listing ("/tools")
          - Map view ("/map")
          - Forum ("/forum")
          - Rental calendar ("/calendar")
          - Video call ("/videocall")
          - Product details ("/product/:id")
          - User dashboard ("/dashboard")
          - Settings ("/Setting")
          - Crop information ("/crop")
          - Soil analysis ("/soilAnalysis")

          You can help users navigate the app and provide information about these features. When responding, use ** to denote titles or important sections. For your first response, simply reply with "Hello! How can I help you today?"`;
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
    const contextPrompt = `You are an AI assistant for a farming equipment rental platform. The user's message is: "${userInput}". Please respond appropriately, keeping in mind the context of farming equipment rentals and agricultural practices. If the user's query is outside this scope, politely guide them back to relevant topics. Use ** to denote titles or important sections in your response. Here's an example of how you should format your response:

**Pest Detection and Management with Our Rental Equipment**
Our platform recognizes the challenges pests pose to agricultural productivity. To address this, we offer advanced pest detection equipment rentals that empower farmers with timely and accurate pest identification.

**Rental Equipment Options:**
* **Automated Insect Traps:** These traps collect insects and analyze them using computer vision and machine learning algorithms to identify pests with high accuracy.
* **Multispectral Cameras:** These cameras capture images of crops in multiple wavelengths, highlighting areas affected by pests.
* **Field Sensors:** These devices monitor soil moisture, temperature, and other environmental conditions that can attract pests.

**Benefits of Pest Detection Rentals:**
* **Early Detection:** Our equipment enables farmers to detect pests early on, before they cause significant crop damage.
* **Precise Identification:** Rental equipment employs advanced technologies that accurately identify pests, reducing the risk of misdiagnosis and ineffective treatments.
* **Targeted Treatment:** Accurate pest identification allows farmers to apply specific treatments that target the pest species without harming beneficial insects.
* **Increased Yield:** Timely and effective pest management leads to healthier crops and increased yields.
* **Environmental Sustainability:** By reducing the need for broad-spectrum pesticides, our equipment supports sustainable farming practices.

**Usage Guidelines:**
* Position equipment strategically throughout the field to ensure comprehensive coverage.
* Monitor equipment regularly and respond to alerts promptly.
* Refer to provided documentation for specific equipment usage and data interpretation instructions.

**Additional Support:**
If you require further assistance with pest detection or management, our team of agricultural experts is available to provide guidance and support.

Please let us know if you have any other questions regarding our pest detection rentals or farming equipment in general.`;
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
        {item.text.split('**').map((part, i) => 
          i % 2 === 0 ? part : <strong key={i}>{part}</strong>
        )}
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
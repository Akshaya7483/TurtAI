import React, { useState, useEffect } from "react";
import "../styles/GrantAI.css";
import sen from '../assets/for1.png'
import del from '../assets/del1.png';
const GrantAI = () => {
  const [messages, setMessages] = useState(() => {
    const savedChats = localStorage.getItem("grantAIChats");
    return savedChats ? JSON.parse(savedChats) : [];
  });

  const [input, setInput] = useState("");
  const [model, setModel] = useState("Turt");
  const API_URL = "http://localhost:8081/api/chat"; // Backend API URL

  useEffect(() => {
    localStorage.setItem("grantAIChats", JSON.stringify(messages));
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]); // Add user message to chat

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: model, // Pass the selected model to the backend
          messages: [...messages, userMessage], // Include chat history
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch response from backend API");
      }

      const responseData = await response.json(); // Parse JSON response
      const assistantMessage = {
        role: "assistant",
        content: responseData.message.content,
      };

      setMessages((prev) => [...prev, assistantMessage]); // Add assistant's message to chat
    } catch (error) {
      console.error("Error communicating with backend API:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error: Unable to fetch response." },
      ]);
    }

    setInput(""); // Clear input after sending
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h1>GrantAI Chat</h1>
        <select
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="model-selector"
        >
          <option value="Turt">Turt</option>
          <option value="Turt-L">Turt-L</option>
          <option value="codellama">CodeLlama</option>
        </select>
      
      </div>
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message-bubble ${msg.role === "user" ? "user" : "assistant"}`}
          >
            {msg.content}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={handleSendMessage} className="send-button">
        <img src={sen} alt="send"></img>
        </button>
        <button onClick={() => setMessages([])} className="clear-chat">
        <img src={del} alt="del"></img>
        </button>
      </div>
    </div>
  );
};

export default GrantAI;

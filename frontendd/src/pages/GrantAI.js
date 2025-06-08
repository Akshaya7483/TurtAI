import React, { useState, useEffect, useRef } from "react";
import "../styles/GrantAI.css";
import sen from '../assets/for1.png';
import del from '../assets/del1.png';

const GrantAI = () => {
  const [messages, setMessages] = useState(() => {
    const savedChats = localStorage.getItem("grantAIChats");
    return savedChats ? JSON.parse(savedChats) : [];
  });

  const [input, setInput] = useState("");
  const [model, setModel] = useState("Turt");
  const [isLoading, setIsLoading] = useState(false);
  const chatMessagesEndRef = useRef(null);

  const API_URL = "http://localhost:8081/api/chat"; // Backend API URL

  useEffect(() => {
    localStorage.setItem("grantAIChats", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    // Scroll to the bottom of the chat when a new message is added
    chatMessagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]); // Add user message to chat
    setIsLoading(true); // Show loading indicator

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
    } finally {
      setIsLoading(false); // Hide loading indicator
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
          <option value="mario">mario</option>
          <option value="codellama">CodeLlama</option>
        </select>
      </div>
      <div className="chat-messages" aria-live="polite">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message-bubble ${msg.role === "user" ? "user" : "assistant"}`}
          >
            {msg.content}
          </div>
        ))}
        <div ref={chatMessagesEndRef} /> {/* Scroll anchor */}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={isLoading} // Disable input while loading
        />
        <button onClick={handleSendMessage} className="send-button" disabled={isLoading}>
          {isLoading ? "Sending..." : <img src={sen} alt="send" />}
        </button>
        <button onClick={() => setMessages([])} className="clear-chat">
          <img src={del} alt="delete" />
        </button>
      </div>
    </div>
  );
};

export default GrantAI;

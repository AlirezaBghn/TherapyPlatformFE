import React, { useState, useRef, useEffect } from "react";
import { axiosClient } from "../services/api";

const preMadeQuestions = [
  "How does the therapy matching process work?",
  "What types of therapy do you offer?",
  "Who can benefit from therapy?",
  "How do I book a therapy session?",
  "Is my privacy protected?",
];

function ChatBot() {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [iconClicked, setIconClicked] = useState(false);

  const chatBoxRef = useRef(null);
  const chatIconRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        chatOpen &&
        chatBoxRef.current &&
        !chatBoxRef.current.contains(e.target) &&
        !chatIconRef.current.contains(e.target)
      ) {
        setChatOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [chatOpen]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Helper function to stream the bot response
  const streamResponse = async (responseText) => {
    // Append an empty bot message for streaming
    setMessages((prev) => [...prev, { from: "bot", text: "" }]);
    let streamedText = "";
    for (let i = 0; i < responseText.length; i++) {
      streamedText += responseText[i];
      setMessages((prev) => {
        const updated = [...prev];
        // Update the last message (bot message) with the current streamed text
        updated[updated.length - 1] = { from: "bot", text: streamedText };
        return updated;
      });
      // Adjust the delay (20ms) as needed for your typewriter speed
      await new Promise((resolve) => setTimeout(resolve, 20));
    }
  };

  const handlePreMadeQuestion = async (question) => {
    setMessages((prev) => [...prev, { from: "user", text: question }]);
    setIsStreaming(true);

    try {
      const response = await axiosClient.post("/chatBot", {
        message: question,
      });
      const responseText = response.data.answer;
      await streamResponse(responseText);
      setIsStreaming(false);
    } catch (error) {
      console.error("Error fetching response:", error);
      setIsStreaming(false);
    }
  };

  const handleSendMessage = async () => {
    if (!userInput.trim() || isStreaming) return;
    const question = userInput.trim();
    setUserInput("");
    setMessages((prev) => [...prev, { from: "user", text: question }]);
    setIsStreaming(true);

    try {
      const response = await axiosClient.post("/chatBot", {
        message: question,
      });
      const responseText = response.data.answer;
      await streamResponse(responseText);
      setIsStreaming(false);
    } catch (error) {
      console.error("Error fetching response:", error);
      setIsStreaming(false);
    }
  };

  const toggleChat = () => {
    setChatOpen((prev) => !prev);
    setIconClicked(true);
    setTimeout(() => setIconClicked(false), 200);
  };

  return (
    <>
      <style jsx="true">{`
        .chat-icon-container {
          position: relative;
          width: 70px;
          height: 70px;
          border-radius: 50%;
          background-color: #e0f2fe;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }
        .chat-icon-container:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.25);
        }
        .chat-icon-container:active {
          transform: translateY(0);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
        }
        .chat-icon {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          object-fit: cover;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        }
        .chat-box {
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          animation: slideIn 0.3s ease-out;
          border: 1px solid #cae8ff;
        }
        .header {
          background-color: #d1e9ff;
          color: #2c3e50;
          border-bottom: 1px solid #cae8ff;
        }
        .message-container {
          display: flex;
          width: 100%;
          margin-bottom: 0.75rem;
        }
        .message-user {
          background: linear-gradient(135deg, #a6c0fe, #89a6fb);
          color: white;
          border-radius: 15px 15px 0 15px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          align-self: flex-end;
          margin-left: auto;
        }
        .message-bot {
          background: #f0f8ff;
          color: #2c3e50;
          border-radius: 15px 15px 15px 0;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          align-self: flex-start;
          margin-right: auto;
        }
        .message-text {
          padding: 0.5rem 0.75rem;
          max-width: 75%;
          word-wrap: break-word;
          animation: fadeIn 0.5s ease;
        }
        .premade-question {
          background-color: #e0f2fe;
          color: #2c3e50;
          transition: background 0.3s ease, transform 0.3s ease;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        .premade-question:hover {
          background: #89a6fb;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
        }
        .input-field {
          border: 1px solid #cae8ff;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .input-field:focus {
          border-color: #89a6fb;
          box-shadow: 0 0 8px rgba(137, 166, 251, 0.5);
        }
        @keyframes slideIn {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .blinking-cursor {
          display: inline-block;
          margin-left: 2px;
          width: 10px;
          animation: blink 1s step-end infinite;
        }
        @keyframes blink {
          from,
          to {
            opacity: 1;
          }
          50% {
            opacity: 0;
          }
        }
      `}</style>

      {/* Chat Icon */}
      <div
        ref={chatIconRef}
        onClick={toggleChat}
        className={`fixed bottom-4 right-10 z-50 flex flex-col items-center cursor-pointer transition-all duration-200 ease-out shadow-lg hover:shadow-xl ${
          iconClicked ? "scale-90" : "scale-100"
        }`}
      >
        <div className="w-16 h-16 rounded-full bg-white border-2 border-blue-500 flex items-center justify-center overflow-hidden">
          <img
            src="https://img.icons8.com/?size=80&id=uZrQP6cYos2I&format=png"
            alt="Chatbot Icon"
            className="w-12 h-12 object-cover"
          />
        </div>
      </div>

      {/* Chat Box */}
      {chatOpen && (
        <div
          ref={chatBoxRef}
          className="fixed bottom-20 right-4 w-96 h-[600px] bg-white shadow-2xl rounded-lg flex flex-col overflow-hidden z-50 border border-blue-200 chat-box"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 flex justify-between items-center border-b border-blue-600">
            <div className="flex items-center">
              <img
                src="https://img.icons8.com/?size=80&id=uZrQP6cYos2I&format=png"
                alt="Chatbot Icon"
                className="w-8 h-8 rounded-full mr-2"
              />
              <h2 className="font-semibold">ChatBot Assistant</h2>
            </div>
            <button
              onClick={toggleChat}
              className="text-white text-lg hover:text-red-300 transition-colors"
            >
              ✖
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3">
            <h2 className="mb-2 p-2 rounded-lg bg-blue-500 text-white text-sm">
              How can I help you?
            </h2>
            {messages.map((msg, index) => {
              // Show blinking cursor for the last bot message when streaming
              const isLastMessage =
                index === messages.length - 1 &&
                msg.from === "bot" &&
                isStreaming;
              return (
                <div key={index} className="message-container">
                  <div
                    className={`message-text ${
                      msg.from === "user" ? "message-user" : "message-bot"
                    }`}
                  >
                    {msg.text}
                    {isLastMessage && (
                      <span className="blinking-cursor">|</span>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Pre-made Questions */}
          <div className="p-3 border-t border-blue-200 flex flex-wrap gap-2 bg-blue-100">
            {preMadeQuestions.map((q, index) => (
              <button
                key={index}
                onClick={() => handlePreMadeQuestion(q)}
                className="premade-question px-2 py-1 border border-blue-300 text-blue-800 rounded-full text-xs transition-all duration-300 ease-out hover:bg-blue-500 hover:text-white hover:-translate-y-1 hover:shadow-md"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Field */}
          <div className="p-3 flex items-center border-t border-blue-200 bg-blue-50">
            <input
              type="text"
              className="input-field flex-1 border border-blue-300 rounded-full px-3 py-1 text-sm focus:outline-none bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-out"
              placeholder="Type your question..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              disabled={isStreaming}
            />
            <button
              onClick={handleSendMessage}
              className="ml-2 text-blue-500 text-lg transition-colors duration-300 ease-out hover:text-blue-700"
              disabled={isStreaming}
            >
              ➣
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default ChatBot;

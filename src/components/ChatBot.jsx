import React, { useState, useRef, useEffect } from "react";
import { axiosClient } from "../services/api";
import { X, Bot } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTherapistAuth } from "../context/TherapistAuthContext";

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

  const { isAuthenticated } = useAuth();
  const { isTherapistAuthenticated } = useTherapistAuth();

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

  const streamResponse = async (responseText) => {
    setMessages((prev) => [...prev, { from: "bot", text: "" }]);
    let streamedText = "";
    for (let i = 0; i < responseText.length; i++) {
      streamedText += responseText[i];
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { from: "bot", text: streamedText };
        return updated;
      });
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
    if (!isAuthenticated && !isTherapistAuthenticated) {
      setMessages((prev) => [
        ...prev,
        { from: "user", text: userInput },
        {
          from: "bot",
          text: "Please sign in to chat with the assistant or try premade questions.",
        },
      ]);
      return;
    }
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

  // Function to truncate premade questions for mobile screens
  const getTruncatedQuestion = (question) => {
    // Only truncate on small screens
    const isMobile = window.innerWidth < 640;
    if (isMobile && question.length > 20) {
      return question.substring(0, 18) + "...";
    }
    return question;
  };

  return (
    <>
      <style jsx="true">{`
        .chat-icon-container {
          position: relative;
          width: 70px;
          height: 70px;
          border-radius: 50%;
          background-color: #262626;
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
          border: 1px solid #404040;
        }
        .header {
          background-color: #404040;
          color: #ffffff;
          border-bottom: 1px solid #404040;
        }
        .message-container {
          display: flex;
          width: 100%;
          margin-bottom: 0.75rem;
        }
        .message-user {
          background: #262626;
          color: white;
          border-radius: 15px 15px 0 15px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          align-self: flex-end;
          margin-left: auto;
        }
        .message-bot {
          background: #404040;
          color: #ffffff;
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
          background-color: #262626;
          color: #ffffff;
          transition: background 0.3s ease, transform 0.3s ease;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        .premade-question:hover {
          background: #404040;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
        }
        .input-field {
          border: 1px solid #404040;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .input-field:focus {
          border-color: #ffffff;
          box-shadow: 0 0 8px rgba(255, 255, 255, 0.5);
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

      {/* Chat Icon - Smaller on mobile */}
      <div
        ref={chatIconRef}
        onClick={toggleChat}
        className={`fixed bottom-2 sm:bottom-4 right-3 sm:right-10 z-50 flex flex-col items-center cursor-pointer transition-all duration-200 ease-out hover:scale-110 ${
          iconClicked ? "scale-90" : "scale-100"
        }`}
      >
        <div className="bg-neutral-800 dark:bg-slate-800 rounded-full p-1.5 sm:px-2 sm:pt-1.5 sm:pb-2.5">
          <Bot
            size={36}
            className="sm:w-12 sm:h-12 text-neutral-100 dark:text-slate-300"
          />
        </div>
      </div>

      {/* Chat Box - Responsive sizing */}
      {chatOpen && (
        <div
          ref={chatBoxRef}
          className="fixed bottom-14 sm:bottom-[5.5rem] right-2 sm:right-4 w-[85vw] max-w-[320px] sm:max-w-none sm:w-96 h-[400px] sm:h-[600px] bg-neutral-800 shadow-2xl rounded-lg flex flex-col overflow-hidden z-50 border border-neutral-700 chat-box"
        >
          {/* Header - Smaller on mobile */}
          <div className="bg-neutral-900 text-white p-2 sm:p-3 flex justify-between items-center border-b border-neutral-700">
            <div className="flex items-center">
              <Bot size={24} className="sm:w-8 sm:h-8" />
              <h2 className="font-semibold ml-2 text-sm sm:text-base">
                ChatBot Assistant
              </h2>
            </div>
            <button
              onClick={toggleChat}
              className="text-white text-lg hover:text-gray-200"
            >
              <X size={20} className="sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Messages - Smaller padding and text on mobile */}
          <div className="flex-1 overflow-y-auto p-2 sm:p-3">
            <h2 className="mb-2 p-1.5 sm:p-2 rounded-lg bg-neutral-700 text-white text-xs sm:text-sm">
              How can I help you?
            </h2>
            {messages.map((msg, index) => {
              const isLastMessage =
                index === messages.length - 1 &&
                msg.from === "bot" &&
                isStreaming;
              return (
                <div key={index} className="message-container">
                  <div
                    className={`message-text text-xs sm:text-sm ${
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

          {/* Pre-made Questions - Smaller and more compact on mobile */}
          <div className="p-2 sm:p-3 border-t border-neutral-700 flex flex-wrap gap-1 sm:gap-2 bg-neutral-900">
            {preMadeQuestions.map((q, index) => (
              <button
                key={index}
                onClick={() => handlePreMadeQuestion(q)}
                className="premade-question px-1.5 sm:px-2 py-0.5 sm:py-1 border border-neutral-500 text-white rounded-full text-[0.6rem] sm:text-xs transition-all duration-300 ease-out hover:bg-neutral-700 hover:text-white hover:-translate-y-1 hover:shadow-md"
              >
                {getTruncatedQuestion(q)}
              </button>
            ))}
          </div>

          {/* Input Field - Smaller on mobile */}
          <div className="p-2 sm:p-3 flex items-center border-t border-neutral-700 bg-neutral-900">
            <input
              type="text"
              className="input-field flex-1 border border-neutral-500 rounded-full px-2 sm:px-3 py-1 text-xs sm:text-sm focus:outline-none bg-neutral-800 text-white shadow-sm focus:border-neutral-400 focus:ring-1 sm:focus:ring-2 focus:ring-neutral-400 transition-all duration-300 ease-out"
              placeholder="Type your question..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              disabled={isStreaming}
            />
            <button
              onClick={handleSendMessage}
              className="ml-2 text-neutral-400 text-base sm:text-lg transition-colors duration-300 ease-out hover:text-neutral-200"
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

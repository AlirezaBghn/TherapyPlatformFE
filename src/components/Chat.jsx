import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { axiosClient } from "../services/api";
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_BASE_URL; // WebSocket server URL

const Chat = ({
  conversationPartnerId,
  currentUser,
  currentModel,
  partnerModel,
}) => {
  const [messages, setMessages] = useState([]); // Stores all messages (old + new)
  const [chatMessage, setChatMessage] = useState("");
  const messagesEndRef = useRef(null);
  const [partnerInfo, setPartnerInfo] = useState(null);
  const socketRef = useRef(null);

  // Fetch previous messages when the chat loads
  useEffect(() => {
    const fetchPreviousMessages = async () => {
      try {
        const params = {
          from: currentUser._id,
          to: conversationPartnerId,
          fromModel: currentModel,
          toModel: partnerModel,
        };
        const res = await axiosClient.get("/messages", { params });
        setMessages(res.data); // Load previous messages
      } catch (error) {
        console.error("Error fetching previous messages", error);
      }
    };

    if (currentUser && currentUser._id) {
      fetchPreviousMessages();
    }
  }, [currentUser, conversationPartnerId, currentModel, partnerModel]);

  useEffect(() => {
    socketRef.current = io(SOCKET_URL, { withCredentials: true });

    // Join the chat room
    socketRef.current.emit("joinChat", {
      from: currentUser._id,
      to: conversationPartnerId,
    });

    // Listen for new messages and update state
    socketRef.current.on("message", (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [currentUser, conversationPartnerId]);

  useEffect(() => {
    const fetchPartnerInfo = async () => {
      try {
        let res;
        if (partnerModel === "Therapist") {
          res = await axiosClient.get(`/therapists/${conversationPartnerId}`, {
            withCredentials: true,
          });
        } else if (partnerModel === "User") {
          res = await axiosClient.get(`/users/${conversationPartnerId}`, {
            withCredentials: true,
          });
        }
        setPartnerInfo(res.data);
      } catch (error) {
        console.error("Error fetching partner info", error);
      }
    };

    if (partnerModel) fetchPartnerInfo();
  }, [conversationPartnerId, partnerModel]);

  // Auto-scroll to the bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const newMessage = {
      from: currentUser._id,
      fromModel: currentModel,
      to: conversationPartnerId,
      toModel: partnerModel,
      message: chatMessage,
    };

    // Send the message via WebSockets
    socketRef.current.emit("sendMessage", newMessage);
    setChatMessage("");
  };

  const getSenderInfo = (msg) => {
    if (msg.from.toString() === currentUser._id.toString()) {
      return {
        name: "You",
        image: currentUser.image || "https://via.placeholder.com/40",
      };
    } else {
      return {
        name: partnerInfo?.name || partnerModel,
        image: partnerInfo?.image || "https://via.placeholder.com/40",
      };
    }
  };

  if (!currentUser || !currentUser._id) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-black dark:text-white shadow-lg mb-4">
      {/* Header */}
      <div className="flex items-center px-4 py-3 border-b border-gray-300 dark:border-gray-700">
        {partnerInfo && (
          <img
            src={partnerInfo.image || "https://via.placeholder.com/40"}
            alt={partnerInfo.name}
            className="w-10 h-10 rounded-full mr-3"
          />
        )}
        <h2 className="text-xl font-semibold">
          Chat with {partnerInfo ? partnerInfo.name : partnerModel}
        </h2>
      </div>

      {/* Messages */}
      <div className="p-4 max-h-64 overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const sender = getSenderInfo(msg);
          const isCurrentUser =
            msg.from.toString() === currentUser._id.toString();

          return (
            <div
              key={msg._id}
              className={`flex ${
                isCurrentUser ? "justify-end" : "justify-start"
              }`}
            >
              <div className="flex items-end space-x-2 max-w-xs">
                {!isCurrentUser && (
                  <img
                    src={sender.image}
                    alt={sender.name}
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <div>
                  <div className="text-xs text-gray-500 mb-1">
                    {sender.name}
                  </div>
                  <div
                    className={`px-4 py-2 rounded-lg shadow-md break-words ${
                      isCurrentUser
                        ? "bg-blue-500 text-white rounded-br-none"
                        : "bg-gray-200 text-gray-900 rounded-bl-none"
                    }`}
                  >
                    {msg.message}
                  </div>
                </div>
                {isCurrentUser && (
                  <img
                    src={sender.image}
                    alt={sender.name}
                    className="w-8 h-8 rounded-full"
                  />
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form
        onSubmit={handleSendMessage}
        className="px-4 py-3 border-t border-gray-300 dark:border-gray-700"
      >
        <textarea
          value={chatMessage}
          onChange={(e) => setChatMessage(e.target.value)}
          placeholder="Type your message..."
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="3"
        ></textarea>
        <div className="flex justify-end mt-2">
          <button
            type="submit"
            className="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition duration-300"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

Chat.propTypes = {
  conversationPartnerId: PropTypes.string.isRequired,
  currentUser: PropTypes.object.isRequired,
  currentModel: PropTypes.string.isRequired, // "User" or "Therapist"
  partnerModel: PropTypes.string.isRequired, // "User" or "Therapist"
};

export default Chat;

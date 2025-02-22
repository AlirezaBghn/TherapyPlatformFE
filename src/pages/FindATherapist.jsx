import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { axiosClient } from "../services/api";
import Layout from "../components/Layout";
import Chat from "../components/Chat"; // Import the Chat component
import { useAuth } from "../context/AuthContext"; // Import useAuth to get the current user

const FindATherapist = () => {
  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTherapist, setSelectedTherapist] = useState(null); // State to track the selected therapist for chat
  const { user } = useAuth(); // Get the current user

  useEffect(() => {
    const fetchTherapists = async () => {
      try {
        const response = await axiosClient.get("/therapists");
        setTherapists(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to fetch therapists");
        setLoading(false);
      }
    };

    fetchTherapists();
  }, []);

  // Function to open the chat pop-up
  const openChatPopup = (therapist) => {
    setSelectedTherapist(therapist);
  };

  // Function to close the chat pop-up
  const closeChatPopup = () => {
    setSelectedTherapist(null);
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-10">Loading therapists...</div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="text-center py-10 text-red-500">Error: {error}</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-center mb-8">
          Find a Therapist
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {therapists.map((therapist) => (
            <div
              key={therapist._id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <img
                src={therapist.image || "https://via.placeholder.com/400"}
                alt={therapist.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{therapist.name}</h2>
                <p className="text-gray-600 mb-4">{therapist.specialty}</p>
                <div className="flex space-x-4">
                  {/* Profile Button */}
                  <Link
                    to={`/therapist/${therapist._id}`}
                    className="px-6 py-2 text-lg font-semibold rounded border border-gray-900 text-gray-900 hover:text-gray-700 hover:border-gray-700 transition duration-200"
                  >
                    Profile
                  </Link>
                  {/* Chat Button */}
                  <button
                    onClick={() => openChatPopup(therapist)}
                    className="px-6 py-2 text-lg font-semibold rounded bg-gray-900 text-white hover:bg-gray-700 transition duration-200"
                  >
                    Chat
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Chat Pop-up Modal */}
        {selectedTherapist && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4">
              <div className="flex justify-between items-center p-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold">
                  Chat with {selectedTherapist.name}
                </h2>
                <button
                  onClick={closeChatPopup}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="p-4">
                {/* Chat Component */}
                <Chat
                  conversationPartnerId={selectedTherapist._id}
                  currentUser={user}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default FindATherapist;

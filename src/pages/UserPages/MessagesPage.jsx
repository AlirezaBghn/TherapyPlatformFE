import { useState, useEffect } from "react";
import { axiosClient } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import Chat from "../../components/Chat";
import SkeletonLoader from "../../components/loadings/SkeletonLoader";

const MessagesPage = () => {
  const { user } = useAuth();
  const [therapists, setTherapists] = useState([]);
  const [selectedTherapist, setSelectedTherapist] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTherapists = async () => {
      if (!user || !user._id) {
        return;
      }

      try {
        // Fetch chatters where the user is the recipient
        const res = await axiosClient.get(
          `/messages/chattees?from=${user._id}&fromModel=User`,
          { withCredentials: true }
        );

        // Extract unique therapist IDs from the chatters
        const therapistIds = res.data.map((chatter) => chatter._id);

        // Fetch therapist details for each unique therapist ID
        const therapistPromises = therapistIds.map((therapistId) =>
          axiosClient.get(`/therapists/${therapistId}`, {
            withCredentials: true,
          })
        );
        const therapistResponses = await Promise.all(therapistPromises);

        // Set therapists state with therapist details and mark loading as false
        setTherapists(therapistResponses.map((response) => response.data));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching therapists:", error);
        setLoading(false);
      }
    };

    fetchTherapists();
  }, [user]);

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-12 mt-24">
        <SkeletonLoader skeletonColor="bg-gray-500" count={6} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12 mt-24">
      <h1 className="text-3xl font-bold mb-8">Your Therapists</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {therapists.map((therapist) => (
          <div
            key={therapist._id}
            className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
          >
            <h2 className="text-xl font-semibold">{therapist.name}</h2>
            <button
              onClick={() => setSelectedTherapist(therapist)}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Chat
            </button>
          </div>
        ))}
      </div>
      {selectedTherapist && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-700 rounded-lg shadow-xl w-full max-w-4xl mx-4">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-600">
              <h2 className="text-xl font-semibold">
                Chat with {selectedTherapist.name}
              </h2>
              <button
                onClick={() => setSelectedTherapist(null)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-400"
              >
                Close
              </button>
            </div>
            <div className="p-4">
              <Chat
                conversationPartnerId={selectedTherapist._id}
                partnerModel="Therapist"
                currentUser={user}
                currentModel="User"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesPage;

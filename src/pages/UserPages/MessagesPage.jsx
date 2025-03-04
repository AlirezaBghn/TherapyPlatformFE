import { useState, useEffect } from "react";
import { axiosClient } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import Chat from "../../components/Chat";
import SkeletonLoader from "../../components/loadings/SkeletonLoader";
import { MessagesSquare, UserRound } from "lucide-react";
import { Link } from "react-router-dom";

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
      <h1 className="text-3xl font-bold mb-8">Contacted Therapists</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {therapists.map((therapist) => (
          <div
            key={therapist._id}
            className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg flex gap-8"
          >
            <div className="avatar">
              <div className="w-24 h-24 rounded-full">
                <img src={therapist.image} alt={`Photo of ${therapist.name}`} />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold">{therapist.name}</h2>
              <a className="italic text-sm" href={`mailto:${therapist.email}`}>
                {therapist.email}
              </a>
              <div className="flex justify-left items-center gap-3">
                <Link
                  to={`/therapist/${therapist._id}`}
                  className="mt-3 px-6 py-2 text-lg font-semibold rounded bg-neutral-900 dark:bg-gray-200 text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-300 transition duration-200"
                >
                  <UserRound />
                </Link>
                <button
                  onClick={() => setSelectedTherapist(therapist)}
                  className="mt-3 px-6 py-2 text-lg font-semibold rounded bg-neutral-900 dark:bg-gray-200 text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-300 transition duration-200"
                >
                  <MessagesSquare size={24} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {selectedTherapist && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-neutral-100 dark:bg-gray-700 rounded-lg shadow-xl w-full max-w-4xl mx-4">
            <div className="flex justify-between items-center p-4 border-b border-neutral-400 dark:border-gray-600">
              <div className="flex items-center gap-4">
                <MessagesSquare
                  className="text-neutral-800 dark:text-neutral-200"
                  size={32}
                />
                <div className="text-xl font-semibold text-neutral-800 dark:text-neutral-200">
                  Chat
                </div>
              </div>
              <button
                onClick={() => setSelectedTherapist(null)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-400"
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

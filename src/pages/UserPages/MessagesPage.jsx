import { useState, useEffect } from "react";
import { axiosClient } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import Chat from "../../components/Chat";
import SkeletonLoader from "../../components/loadings/SkeletonLoader";
import { MessagesSquare, UserRound, User, X, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import ReactDOM from "react-dom"; // Added import for createPortal

const MessagesPage = () => {
  const { user } = useAuth();
  const [therapists, setTherapists] = useState([]);
  const [selectedTherapist, setSelectedTherapist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [brokenImages, setBrokenImages] = useState({});
  const navigate = useNavigate();

  // Handle image loading errors
  const handleImageError = (id) => {
    setBrokenImages((prev) => ({
      ...prev,
      [id]: true,
    }));
  };

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

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedTherapist) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedTherapist]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 mt-20 sm:mt-24">
        <SkeletonLoader skeletonColor="bg-gray-500" count={6} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 sm:px-6 py-6 sm:py-12 mt-16 sm:mt-24">
      {/* Back button for dashboard */}
      <button
        onClick={() => navigate("/dashboard")}
        className="flex items-center mt-4 mb-4 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
      >
        <ArrowLeft size={18} className="mr-1" />
        <span className="text-sm">Back to Dashboard</span>
      </button>

      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 dark:text-white">
        Contacted Therapists
      </h1>

      {therapists.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6 text-center">
          <p className="text-base sm:text-lg dark:text-gray-200">
            You haven't contacted any therapists yet.
          </p>
          <Link
            to="/find-therapist"
            className="inline-block mt-3 sm:mt-4 px-4 py-2 bg-neutral-900 dark:bg-gray-200 text-white dark:text-gray-900 rounded hover:bg-gray-700 dark:hover:bg-gray-300 transition duration-200"
          >
            Find Therapists
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6">
          {therapists.map((therapist) => (
            <div
              key={therapist._id}
              className="p-3 sm:p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-6"
            >
              <div className="flex-shrink-0">
                {brokenImages[therapist._id] || !therapist.image ? (
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <User
                      size={24}
                      className="text-gray-400 dark:text-gray-500 sm:size-8"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden">
                    <img
                      src={therapist.image}
                      alt={`Photo of ${therapist.name}`}
                      className="w-full h-full object-cover"
                      onError={() => handleImageError(therapist._id)}
                    />
                  </div>
                )}
              </div>

              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-lg sm:text-xl font-semibold dark:text-white mb-1">
                  {therapist.name}
                </h2>
                <a
                  className="italic text-xs sm:text-sm text-gray-600 dark:text-gray-300 break-all"
                  href={`mailto:${therapist.email}`}
                >
                  {therapist.email}
                </a>
                <div className="flex justify-center sm:justify-start items-center gap-2 sm:gap-3 mt-3">
                  <Link
                    to={`/therapist/${therapist._id}`}
                    className="px-3 sm:px-4 py-2 text-sm sm:text-base font-medium rounded-full bg-neutral-900 dark:bg-gray-200 text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-300 transition duration-200"
                    aria-label="View therapist profile"
                  >
                    <UserRound size={18} className="sm:size-5" />
                  </Link>
                  <button
                    onClick={() => setSelectedTherapist(therapist)}
                    className="px-3 sm:px-4 py-2 text-sm sm:text-base font-medium rounded-full bg-neutral-900 dark:bg-gray-200 text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-300 transition duration-200"
                    aria-label="Chat with therapist"
                  >
                    <MessagesSquare size={18} className="sm:size-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Chat Modal - using createPortal to ensure proper positioning */}
      {selectedTherapist &&
        ReactDOM.createPortal(
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-0">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-[calc(100vw-24px)] sm:max-w-3xl md:max-w-4xl max-h-[90vh] flex flex-col">
              <div className="flex justify-between items-center p-3 sm:p-4 border-b border-gray-200 dark:border-gray-600">
                <div className="flex items-center gap-2 sm:gap-4 overflow-hidden">
                  <MessagesSquare
                    className="text-neutral-800 dark:text-neutral-200 flex-shrink-0"
                    size={20}
                    strokeWidth={1.5}
                  />
                  <div className="text-base sm:text-lg font-semibold text-neutral-800 dark:text-neutral-200 truncate">
                    Chat with {selectedTherapist.name}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedTherapist(null)}
                  className="flex-shrink-0 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100 p-1 sm:p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                  aria-label="Close chat"
                >
                  <X size={20} className="sm:size-5" />
                </button>
              </div>
              <div className="p-3 sm:p-4 overflow-y-auto flex-grow">
                <Chat
                  conversationPartnerId={selectedTherapist._id}
                  partnerModel="Therapist"
                  currentUser={user}
                  currentModel="User"
                />
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default MessagesPage;

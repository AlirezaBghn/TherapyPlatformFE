import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ReactDOM from "react-dom";
import { axiosClient } from "../../services/api";
import Chat from "../../components/Chat";
import { useAuth } from "../../context/AuthContext";
import { useMatching } from "../../context/MatchingContext";
import { useFavoritesShow } from "../../context/FavoritesShowContext";
import SkeletonLoader from "../../components/loadings/SkeletonLoader";
import { MessagesSquare, Star } from "lucide-react";
import { useLocation } from "react-router-dom";

const FindATherapist = () => {
  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTherapist, setSelectedTherapist] = useState(null);
  const [showAllTherapists, setShowAllTherapists] = useState(false);
  const [showMatchingResults, setShowMatchingResults] = useState(false);
  const { showFavoritesOnly, setShowFavoritesOnly } = useFavoritesShow();
  const { user } = useAuth();
  const {
    matchingResults,
    fetchMatchingResults,
    loading: matchingLoading,
    error: matchingError,
  } = useMatching();

  const location = useLocation();

  useEffect(() => {
    setShowFavoritesOnly(location.state?.showFavoritesOnly);
  }, [location.state?.showFavoritesOnly]);

  // New state to cache matching results so they aren't re-fetched
  const [savedMatchingResults, setSavedMatchingResults] = useState([]);

  const [filters, setFilters] = useState({
    yearsOfWork: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  // New state to manage favorite therapists
  const [favorites, setFavorites] = useState(() => {
    // Load favorites from local storage
    const savedFavorites = localStorage.getItem("favorites");
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  useEffect(() => {
    const fetchTherapists = async () => {
      setLoading(true);
      try {
        const res = await axiosClient.get("/therapists");
        const therapistsData = res.data;
        const therapistsWithAnswers = await Promise.all(
          therapistsData.map(async (therapist) => {
            try {
              const answerRes = await axiosClient.get(
                `/therapists/${therapist._id}/therapist-answers`
              );
              let additionalInfo = {};
              answerRes.data.forEach((item) => {
                const questionText = item.question_id.question.toLowerCase();
                if (questionText.includes("specialization")) {
                  additionalInfo.specialization = item.answer.join(", ");
                } else if (questionText.includes("experience")) {
                  additionalInfo.yearsOfWork = item.answer.join(", ");
                }
              });
              return { ...therapist, ...additionalInfo };
            } catch (err) {
              console.error(
                "Error fetching answers for therapist",
                therapist._id,
                err
              );
              return therapist;
            }
          })
        );
        setTherapists(therapistsWithAnswers);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to fetch therapists");
      } finally {
        setLoading(false);
      }
    };

    fetchTherapists();
  }, []);

  // Cache matching results when they first update
  useEffect(() => {
    if (
      matchingResults &&
      matchingResults.length > 0 &&
      savedMatchingResults.length === 0
    ) {
      setSavedMatchingResults([...matchingResults]);
    }
  }, [matchingResults, savedMatchingResults]);

  // Save favorites to local storage whenever they change
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  // NEW: Prevent background scrolling when modal is open
  useEffect(() => {
    if (selectedTherapist) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedTherapist]);

  // Helper function to extract the minimum years of experience from the yearsOfWork string
  const extractMinYears = (yearsOfWork) => {
    if (!yearsOfWork) return 0;

    // Handle cases like "8-10 years", "1-3 years", "more than 10 years", etc.
    const match = yearsOfWork.match(/\d+/g);
    if (match) {
      return Math.min(...match.map(Number));
    }

    return 0;
  };

  // Filtering for all therapistss
  const filteredTherapists = therapists.filter((therapist) => {
    const matchesSearchTerm = searchTerm
      ? therapist.name.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    const matchesYearsOfWork = filters.yearsOfWork
      ? extractMinYears(therapist.yearsOfWork) >=
        parseInt(filters.yearsOfWork, 10)
      : true;

    const matchesFavorites = showFavoritesOnly
      ? favorites.includes(therapist._id)
      : true;

    return matchesSearchTerm && matchesYearsOfWork && matchesFavorites;
  });

  // Filtering for matching results (using cached matching results)
  const filteredMatchingResults = savedMatchingResults.filter((result) => {
    const therapist = therapists.find((t) => t._id === result._id);
    if (!therapist) return false;

    const matchesSearchTerm = searchTerm
      ? therapist.name.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    const matchesYearsOfWork = filters.yearsOfWork
      ? extractMinYears(therapist.yearsOfWork) >=
        parseInt(filters.yearsOfWork, 10)
      : true;

    const matchesFavorites = showFavoritesOnly
      ? favorites.includes(therapist._id)
      : true;

    return matchesSearchTerm && matchesYearsOfWork && matchesFavorites;
  });

  // Sort matching results (highest matchPercentage first) and limit to top 6
  const sortedMatchingResults = [...filteredMatchingResults].sort(
    (a, b) => b.matchPercentage - a.matchPercentage
  );
  const topMatchingResults = sortedMatchingResults.slice(0, 6);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const openChatPopup = (therapist) => {
    setSelectedTherapist(therapist);
  };

  const closeChatPopup = () => {
    setSelectedTherapist(null);
  };

  const handleMatchingClick = async () => {
    setShowMatchingResults(true);
    setShowAllTherapists(false);
    if (savedMatchingResults.length === 0) {
      const results = await fetchMatchingResults(user._id);
      // savedMatchingResults will be updated by the useEffect above
    }
  };

  const toggleFavorite = (therapistId) => {
    setFavorites((prevFavorites) =>
      prevFavorites.includes(therapistId)
        ? prevFavorites.filter((id) => id !== therapistId)
        : [...prevFavorites, therapistId]
    );
  };

  const toggleShowFavoritesOnly = () => {
    setShowFavoritesOnly((prev) => !prev);
  };

  if (loading) {
    return (
      <div className="text-center py-10 mt-16 ml-10">
        <SkeletonLoader />
        <div className="hidden">Loading therapists...</div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-6 py-12 dark:bg-gray-800 dark:text-white mt-28 mb-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold dark:text-gray-200">
          Find a Therapist
        </h1>
      </div>

      <div className="flex gap-5 items-center mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Search by Name"
            value={searchTerm}
            onChange={handleSearchChange}
            className="p-3 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            name="yearsOfWork"
            value={filters.yearsOfWork}
            onChange={handleFilterChange}
            className="p-3 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Filter by Years of Work</option>
            <option value="1">1+ years</option>
            <option value="5">5+ years</option>
            <option value="10">10+ years</option>
            <option value="15">15+ years</option>
          </select>
        </div>
        <button
          onClick={handleMatchingClick}
          className="ml-auto px-6 py-2 text-lg font-semibold rounded bg-gray-900 dark:bg-gray-200 text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-300 transition duration-200"
        >
          Find Best Match
        </button>
        <button
          onClick={toggleShowFavoritesOnly}
          className="px-6 py-2 text-lg font-semibold rounded bg-gray-900 dark:bg-gray-200 text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-300 transition duration-200"
        >
          {showFavoritesOnly ? "Show All" : "Show Favorites"}
        </button>
      </div>

      {showMatchingResults && (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold dark:text-gray-200">
              Best Matches
            </h2>
            <button
              onClick={() => setShowAllTherapists(!showAllTherapists)}
              className="px-4 py-2 text-sm font-semibold rounded bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 transition duration-200"
            >
              {showAllTherapists
                ? "Hide All Therapists"
                : "View All Therapists"}
            </button>
          </div>

          {matchingLoading && (
            <div className="text-center py-10">
              <SkeletonLoader />
              <div className="hidden">Loading matching results...</div>
            </div>
          )}

          {matchingError && (
            <div className="text-center py-10 text-red-500">
              Error: {matchingError}
            </div>
          )}

          {!matchingLoading && !matchingError && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topMatchingResults.length > 0 ? (
                topMatchingResults.map((result) => {
                  const therapist = therapists.find(
                    (t) => t._id === result._id
                  );
                  return (
                    <div
                      key={result._id}
                      className="bg-white dark:bg-gray-700 rounded-lg shadow-sm overflow-hidden flex flex-col items-center p-4 h-full"
                    >
                      <img
                        src={
                          therapist?.image || "https://via.placeholder.com/400"
                        }
                        alt={therapist?.name}
                        className="w-32 h-32 object-cover rounded-full mb-4"
                      />
                      <div className="text-center flex-grow">
                        <h2 className="text-xl font-semibold mb-2 dark:text-gray-200">
                          {therapist?.name}
                        </h2>
                        <p className="text-gray-600 mb-2 dark:text-gray-400">
                          <span className="font-medium">Specialization:</span>{" "}
                          {therapist?.specialization || "N/A"}
                        </p>
                        <p className="text-gray-600 mb-2 dark:text-gray-400">
                          <span className="font-medium">Years of Work:</span>{" "}
                          {therapist?.yearsOfWork || "N/A"}
                        </p>
                        <p className="text-gray-600 mb-2 dark:text-gray-400">
                          <span className="font-medium">Match Percentage:</span>{" "}
                          {result.matchPercentage}%
                        </p>
                      </div>
                      <div className="flex flex-row space-x-4 justify-center mt-auto">
                        <Link
                          to={`/therapist/${result._id}`}
                          className="px-6 py-2 text-lg font-semibold rounded border border-gray-900 dark:border-gray-200 text-gray-900 dark:text-gray-200 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-700 dark:hover:border-gray-300 transition duration-200"
                        >
                          Profile
                        </Link>
                        <button
                          onClick={() => openChatPopup(therapist)}
                          className="px-6 py-2 text-lg font-semibold rounded bg-neutral-900 dark:bg-gray-200 text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-300 transition duration-200"
                        >
                          <MessagesSquare size={24} />
                        </button>
                        <button
                          onClick={() => toggleFavorite(therapist._id)}
                          className={`px-6 py-2 text-xl font-semibold rounded ${
                            favorites.includes(therapist._id)
                              ? "bg-yellow-500 text-white"
                              : "bg-neutral-900 dark:bg-gray-200 text-white dark:text-gray-900"
                          } hover:bg-yellow-600 transition duration-200`}
                        >
                          <Star />
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-10">
                  No matching therapists found.
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {(showAllTherapists || !showMatchingResults) && (
        <>
          {showAllTherapists && showMatchingResults && (
            <hr className="my-16 border-2 border-gray-300 dark:border-gray-600" />
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTherapists.map((therapist) => (
              <div
                key={therapist._id}
                className="bg-white dark:bg-gray-700 rounded-lg shadow-sm overflow-hidden flex flex-col items-center p-4 h-full"
              >
                <img
                  src={therapist.image || "https://via.placeholder.com/400"}
                  alt={therapist.name}
                  className="w-32 h-32 object-cover rounded-full mb-4"
                />
                <div className="text-center flex-grow">
                  <h2 className="text-xl font-semibold mb-2 dark:text-gray-200">
                    {therapist.name}
                  </h2>
                  <p className="text-gray-600 mb-2 dark:text-gray-400">
                    <span className="font-medium">Specialization:</span>{" "}
                    {therapist.specialization || "N/A"}
                  </p>
                  <p className="text-gray-600 mb-4 dark:text-gray-400">
                    <span className="font-medium">Years of Work:</span>{" "}
                    {therapist.yearsOfWork || "N/A"}
                  </p>
                </div>
                <div className="flex flex-row space-x-4 justify-center mt-auto">
                  <Link
                    to={`/therapist/${therapist._id}`}
                    className="px-6 py-2 text-lg font-semibold rounded border border-gray-900 dark:border-gray-200 text-gray-900 dark:text-gray-200 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-700 dark:hover:border-gray-300 transition duration-200"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => openChatPopup(therapist)}
                    className="px-6 py-2 text-lg font-semibold rounded bg-neutral-900 dark:bg-gray-200 text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-300 transition duration-200"
                  >
                    <MessagesSquare size={24} />
                  </button>
                  <button
                    onClick={() => toggleFavorite(therapist._id)}
                    className={`px-6 py-2 text-xl font-semibold rounded ${
                      favorites.includes(therapist._id)
                        ? "bg-yellow-500 text-white"
                        : "bg-neutral-900 dark:bg-gray-200 text-white dark:text-gray-900 dark:hover:bg-gray-300"
                    } hover:bg-yellow-600 transition duration-200`}
                  >
                    <Star />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* UPDATED: Render the chat modal using ReactDOM.createPortal */}
      {selectedTherapist &&
        ReactDOM.createPortal(
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-700 rounded-lg shadow-xl w-full max-w-4xl mx-4">
              <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-600">
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
                  onClick={closeChatPopup}
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
                  currentUser={user}
                  partnerModel="Therapist"
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

export default FindATherapist;

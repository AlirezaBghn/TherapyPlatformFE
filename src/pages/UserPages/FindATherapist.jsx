import { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { axiosClient } from "../../services/api";
import Chat from "../../components/Chat";
import { useAuth } from "../../context/AuthContext";
import { useMatching } from "../../context/MatchingContext";
import { useFavoritesShow } from "../../context/FavoritesShowContext";
import RingLoader from "../../components/loadings/RingLoader";
import { MessagesSquare, X } from "lucide-react";
import { useLocation } from "react-router-dom";
import TherapistCard from "../../components/TherapistCard";

const FindATherapist = () => {
  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTherapist, setSelectedTherapist] = useState(null);
  const [showMatchingResults, setShowMatchingResults] = useState(false); // Toggle between best matches and all therapists
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

  const [savedMatchingResults, setSavedMatchingResults] = useState([]);

  const [filters, setFilters] = useState({
    yearsOfWork: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  const [favorites, setFavorites] = useState(() => {
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

  useEffect(() => {
    if (
      matchingResults &&
      matchingResults.length > 0 &&
      savedMatchingResults.length === 0
    ) {
      setSavedMatchingResults([...matchingResults]);
    }
  }, [matchingResults, savedMatchingResults]);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

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

  const extractMinYears = (yearsOfWork) => {
    if (!yearsOfWork) return 0;

    const match = yearsOfWork.match(/\d+/g);
    if (match) {
      return Math.min(...match.map(Number));
    }

    return 0;
  };

  const filteredTherapists = therapists.filter((therapist) => {
    if (therapist.isActive === false) {
      return false;
    }
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

  const toggleMatchingResults = async () => {
    if (!showMatchingResults) {
      // Fetch matching results if not already fetched
      if (savedMatchingResults.length === 0) {
        await fetchMatchingResults(user._id);
      }
    }
    setShowMatchingResults((prev) => !prev); // Toggle between best matches and all therapists
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
      <div className="flex justify-center items-center min-h-screen">
        <div style={{ transform: "scale(6)" }}>
          <RingLoader />
        </div>
      </div>
    );
  }

  if (matchingLoading) {
    return (
      <div className="flex flex-col justify-center gap-8 items-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="transform scale-[3]">
          <RingLoader />
        </div>
        <h2 className="text-xl sm:text-2xl text-gray-800 dark:text-gray-200 mb-6 sm:mb-6 text-center font-semibold">
          Hold tight! The AI is finding your perfect match!
        </h2>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-8 sm:py-10 md:py-12 lg:py-14 xl:py-16 dark:bg-gray-800 dark:text-white mt-20 sm:mt-24 md:mt-28 lg:mt-32 xl:mt-36 mb-8 sm:mb-10 md:mb-12 lg:mb-14 xl:mb-16">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold dark:text-gray-200">
          Find a Therapist
        </h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-5 items-center mb-8">
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search by Name"
            value={searchTerm}
            onChange={handleSearchChange}
            className="p-2 border border-gray-300 rounded-xl bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-neutral-700 w-full sm:w-auto"
          />

          <select
            name="yearsOfWork"
            value={filters.yearsOfWork}
            onChange={handleFilterChange}
            className="select select-bordered w-full sm:w-auto bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white hover:bg-gray-50 transition duration-200 focus:outline-none focus:ring-2 focus:ring-neutral-700"
          >
            <option value="" defaultValue={true}>
              Filter by Years of Work
            </option>
            <option value="1" className="">
              1+ years
            </option>
            <option value="5" className="">
              5+ years
            </option>
            <option value="10" className="">
              10+ years
            </option>
            <option value="15" className="">
              15+ years
            </option>
          </select>
        </div>
        <div className="lg:ml-auto flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <button
            onClick={toggleMatchingResults}
            className="px-6 py-2.5 text-lg font-semibold rounded-full bg-gray-900 dark:bg-gray-200 text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-300 transition duration-200 w-full sm:w-auto"
          >
            {showMatchingResults ? "Show All Therapists" : "Find Best Match"}
          </button>
          <button
            onClick={toggleShowFavoritesOnly}
            className="px-6 py-2.5 text-lg font-semibold rounded-full bg-gray-900 dark:bg-gray-200 text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-300 transition duration-200 w-full sm:w-auto"
          >
            {showFavoritesOnly ? "Show All" : "Show Favorites"}
          </button>
        </div>
      </div>

      {showMatchingResults && (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold dark:text-gray-200">
              Best Matches
            </h2>
          </div>

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
                    <TherapistCard
                      key={result._id}
                      therapist={therapist}
                      result={result}
                      favorites={favorites}
                      toggleFavorite={toggleFavorite}
                      openChatPopup={openChatPopup}
                    />
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

      {!showMatchingResults && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTherapists.map((therapist) => (
            <TherapistCard
              key={therapist._id}
              therapist={therapist}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              openChatPopup={openChatPopup}
            />
          ))}
        </div>
      )}

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
                  <X />
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

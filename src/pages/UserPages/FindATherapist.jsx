import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { axiosClient } from "../../services/api";
import Chat from "../../components/Chat";
import { useAuth } from "../../context/AuthContext";

const FindATherapist = () => {
  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTherapist, setSelectedTherapist] = useState(null);
  const { user } = useAuth();

  // State for filters and search term
  const [filters, setFilters] = useState({
    yearsOfWork: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

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

  // Function to filter therapists
  const filteredTherapists = therapists.filter((therapist) => {
    const matchesSearchTerm = searchTerm
      ? therapist.name.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    const matchesYearsOfWork = filters.yearsOfWork
      ? therapist.yearsOfWork &&
        therapist.yearsOfWork?.toString().includes(filters.yearsOfWork)
      : true;

    return matchesSearchTerm && matchesYearsOfWork;
  });

  // Function to handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  // Function to handle search term changes
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Function to open the chat pop-up
  const openChatPopup = (therapist) => {
    setSelectedTherapist(therapist);
  };

  // Function to close the chat pop-up
  const closeChatPopup = () => {
    setSelectedTherapist(null);
  };

  if (loading) {
    return <div className="text-center py-10">Loading therapists...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-6 py-12 dark:bg-gray-800 dark:text-white mt-28">
      <h1 className="text-3xl font-bold mb-8 dark:text-gray-200">
        Find a Therapist
      </h1>

      {/* Filter and Search Section */}
      <div className="flex">
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search by Name"
            value={searchTerm}
            onChange={handleSearchChange}
            className="p-3 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Years of Work Dropdown */}
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
      </div>

      {/* Therapists Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTherapists.map((therapist) => (
          <div
            key={therapist._id}
            className="bg-white dark:bg-gray-700 rounded-lg shadow-strong-lg overflow-hidden flex flex-col items-center p-4"
          >
            <img
              src={therapist.image || "https://via.placeholder.com/400"}
              alt={therapist.name}
              className="w-32 h-32 object-cover rounded-full mb-4"
            />
            <div className="text-center">
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
              <div className="flex flex-row space-x-4 justify-center">
                {/* Profile Button */}
                <Link
                  to={`/therapist/${therapist._id}`}
                  className="px-6 py-2 text-lg font-semibold rounded border border-gray-900 dark:border-gray-200 text-gray-900 dark:text-gray-200 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-700 dark:hover:border-gray-300 transition duration-200"
                >
                  Profile
                </Link>
                {/* Chat Button */}
                <button
                  onClick={() => openChatPopup(therapist)}
                  className="px-6 py-2 text-lg font-semibold rounded bg-gray-900 dark:bg-gray-200 text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-300 transition duration-200"
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
          <div className="bg-white dark:bg-gray-700 rounded-lg shadow-xl w-full max-w-4xl mx-4">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-600">
              <h2 className="text-xl font-semibold dark:text-gray-200">
                Chat with {selectedTherapist.name}
              </h2>
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
              {/* Chat Component */}
              <Chat
                conversationPartnerId={selectedTherapist._id}
                currentUser={user}
                partnerModel="Therapist"
                currentModel="User"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FindATherapist;

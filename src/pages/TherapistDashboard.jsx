import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { axiosClient } from "../services/api";

const TherapistDashboard = () => {
  const [therapists, setTherapists] = useState([]);
  const [visibleTherapists, setVisibleTherapists] = useState(8);
  const [filters, setFilters] = useState({
    specialization: "",
    experience: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTherapists = async () => {
      setLoading(true);
      try {
        const res = await axiosClient.get("/therapists");
        const therapistsData = res.data;
        // For each therapist, fetch their answers and merge in additional info.
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
                  additionalInfo.experience = item.answer.join(", ");
                } else if (questionText.includes("therapy approaches")) {
                  additionalInfo.approach = item.answer.join(", ");
                } else if (questionText.includes("clients")) {
                  additionalInfo.clients = item.answer.join(", ");
                } else if (questionText.includes("additional services")) {
                  additionalInfo.additionalServices = item.answer.join(", ");
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
        setError("Failed to fetch therapists");
      } finally {
        setLoading(false);
      }
    };

    fetchTherapists();
  }, []);

  // Client-side filtering based on specialization and experience.
  const filteredTherapists = therapists.filter((therapist) => {
    const matchesSpecialization = filters.specialization
      ? therapist.specialization &&
        therapist.specialization
          .toLowerCase()
          .includes(filters.specialization.toLowerCase())
      : true;
    const matchesExperience = filters.experience
      ? therapist.experience &&
        therapist.experience
          .toLowerCase()
          .includes(filters.experience.toLowerCase())
      : true;
    return matchesSpecialization && matchesExperience;
  });

  const handleReadMore = () => setVisibleTherapists((prev) => prev + 8);
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <h2 className="text-2xl font-bold mb-6">Therapist Dashboard</h2>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <input
          type="text"
          name="specialization"
          value={filters.specialization}
          onChange={handleFilterChange}
          placeholder="Filter by Specialization"
          className="p-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="experience"
          value={filters.experience}
          onChange={handleFilterChange}
          placeholder="Filter by Experience"
          className="p-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Loading / Error States */}
      {loading && (
        <div className="text-center text-lg">Loading therapists...</div>
      )}
      {error && <div className="text-center text-red-500">{error}</div>}

      {/* Therapists Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredTherapists.slice(0, visibleTherapists).map((therapist) => (
            <div
              key={therapist._id}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300"
            >
              <div className="flex flex-col items-center">
                <img
                  src={therapist.image || "https://via.placeholder.com/100"}
                  alt={therapist.name}
                  className="w-24 h-24 rounded-full object-cover shadow-md mb-4"
                />
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {therapist.name}
                </h3>
                <p className="text-gray-600 mb-1">
                  <span className="font-medium">Email:</span> {therapist.email}
                </p>
                <p className="text-gray-600 mb-1">
                  <span className="font-medium">Phone:</span> {therapist.phone}
                </p>
                <p className="text-gray-600 mb-1">
                  <span className="font-medium">Specialization:</span>{" "}
                  {therapist.specialization || "N/A"}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Experience:</span>{" "}
                  {therapist.experience || "N/A"}
                </p>
                {/* Chat Now button */}
                <Link
                  to={`/chat/${therapist._id}`}
                  className="mt-2 inline-block text-blue-500 hover:underline"
                >
                  Chat Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* "Load More" Button */}
      {visibleTherapists < filteredTherapists.length && (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleReadMore}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default TherapistDashboard;

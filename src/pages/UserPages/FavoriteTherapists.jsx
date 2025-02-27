import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { axiosClient } from "../../services/api";

const FavoriteTherapists = () => {
  const [favoriteTherapists, setFavoriteTherapists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavoriteTherapists = async () => {
      setLoading(true);
      try {
        // Retrieve favorite therapist IDs from local storage
        const savedFavorites = localStorage.getItem("favorites");
        const favoriteIds = savedFavorites ? JSON.parse(savedFavorites) : [];

        // Fetch details for each favorite therapist
        const therapistPromises = favoriteIds.map((id) =>
          axiosClient.get(`/therapists/${id}`)
        );
        const therapistResponses = await Promise.all(therapistPromises);

        // Set the favorite therapists state with the fetched details
        setFavoriteTherapists(therapistResponses.map((res) => res.data));
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to fetch favorite therapists");
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteTherapists();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-10">Loading favorite therapists...</div>
    );
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-6 py-12 dark:bg-gray-800 dark:text-white mt-28">
      <h1 className="text-3xl font-bold dark:text-gray-200 mb-8">
        Favorite Therapists
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favoriteTherapists.length > 0 ? (
          favoriteTherapists.map((therapist) => (
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
                <Link
                  to={`/therapist/${therapist._id}`}
                  className="px-6 py-2 text-lg font-semibold rounded border border-gray-900 dark:border-gray-200 text-gray-900 dark:text-gray-200 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-700 dark:hover:border-gray-300 transition duration-200"
                >
                  Profile
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10">No favorite therapists found.</div>
        )}
      </div>
    </div>
  );
};

export default FavoriteTherapists;

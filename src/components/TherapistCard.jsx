import { Link } from "react-router-dom";
import { Star, MessagesSquare } from "lucide-react";

const TherapistCard = ({
  therapist,
  result,
  favorites,
  toggleFavorite,
  openChatPopup,
}) => {
  return (
    <div
      key={therapist._id}
      className="bg-white dark:bg-gray-700 rounded-lg shadow-sm overflow-hidden flex flex-col items-center p-4 h-full"
    >
      <img
        src={therapist?.image}
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
        {result && (
          <p className="text-gray-600 mb-2 dark:text-gray-400">
            <span className="font-medium">Match Percentage:</span>{" "}
            {result.matchPercentage}%
          </p>
        )}
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
              : "bg-neutral-900 dark:bg-gray-200 text-white dark:text-gray-900"
          } hover:bg-yellow-600 transition duration-200`}
        >
          <Star />
        </button>
      </div>
    </div>
  );
};

export default TherapistCard;

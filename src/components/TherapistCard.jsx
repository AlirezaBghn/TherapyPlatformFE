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
      <div className="text-center flex flex-col flex-grow">
        <h2 className="text-xl font-bold mb-2 dark:text-gray-200">
          {therapist?.name}
        </h2>
        <p className="mb-2 dark:text-gray-400">
          <span className="font-medium">Specialization:</span>{" "}
          {therapist?.specialization
            ? therapist.specialization.slice(0, 70) +
              (therapist.specialization.length > 70 ? "..." : "")
            : "N/A"}
        </p>
        <p className="mb-2 mt-auto dark:text-gray-400">
          <span className="font-medium">Years of Work:</span>{" "}
          {therapist?.yearsOfWork || "N/A"}
        </p>
        {result && (
          <div className="flex flex-col items-center mt-2">
            <progress
              className="progress w-56 mb-1"
              value={result.matchPercentage}
              max="100"
            ></progress>
            <span className="text-sm font-bold text-neutral-900 dark:text-gray-400 mb-6">
              Match Percentage: {result.matchPercentage}%
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-row space-x-4 justify-center mt-auto">
        <Link
          to={`/therapist/${therapist._id}`}
          className="px-6 py-2 text-lg font-semibold rounded-full border border-gray-900 dark:border-gray-200 text-gray-900 dark:text-gray-200 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-700 dark:hover:border-gray-300 transition duration-200"
        >
          Profile
        </Link>
        <button
          onClick={() => openChatPopup(therapist)}
          className="p-3 text-lg font-semibold rounded-full bg-neutral-900 dark:bg-gray-200 text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-300 transition duration-200"
        >
          <MessagesSquare size={24} />
        </button>
        <button
          onClick={() => toggleFavorite(therapist._id)}
          className={`p-3 text-xl font-semibold rounded-full ${
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

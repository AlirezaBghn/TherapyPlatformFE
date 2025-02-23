import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const JournalCard = ({ journal }) => {
  return (
    <Link to={`/journal/${journal.id}`} className="block">
      <div className=" relative bg-[#f3f4f6] dark:bg-gray-800 border border-gray-300 dark:border-gray-700 shadow-lg p-6 rounded-lg cursor-pointer transition duration-300 hover:border-gray-400 hover:shadow-xl group">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-transparent opacity-0 group-hover:opacity-20 transition duration-500"></div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {journal.title}
        </h3>
        <p className="text-sm mt-4 text-gray-900 dark:text-white">
          {journal.content.substring(0, 100)}...
        </p>
        <div className="mt-6 flex space-x-4 relative z-10">
          <span className="text-blue-600 dark:text-blue-600 hover:text-blue-800 transition duration-200">
            View
          </span>
        </div>
      </div>
    </Link>
  );
};

JournalCard.propTypes = {
  journal: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
  }).isRequired,
};

export default JournalCard;

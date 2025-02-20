import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const JournalCard = ({ journal }) => {
  return (
    <Link to={`/journal/${journal.id}`} className="block">
      <div className="relative bg-[#f3f4f6] dark:bg-white/10 border border-white/10 dark:border-gray-300 shadow-lg p-6 rounded-lg cursor-pointer transition-all duration-300 hover:border-white/20 dark:hover:border-gray-400 hover:shadow-xl group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-transparent opacity-0 group-hover:opacity-20 transition duration-500"></div>

        <h3 className="text-lg font-semibold text-black dark:text-white">
          {journal.title}
        </h3>

        <p className="text-sm mt-4 text-black dark:text-white">
          {journal.content.substring(0, 100)}...
        </p>

        <div className="mt-6 flex space-x-4 relative z-10">
          <span className="text-blue-800 dark:text-blue-500 hover:text-blue-400 dark:hover:text-blue-400 transition duration-300">
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

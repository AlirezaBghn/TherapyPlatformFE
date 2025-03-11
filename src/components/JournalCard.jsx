import React, { useState } from "react";
import PropTypes from "prop-types";
import SkeletonLoader from "../components/loadings/SkeletonLoader";
import FormattedDate from "./FormattedDate";
import { Link } from "react-router-dom";
import { Pencil } from "lucide-react";

const JournalCard = ({ journal, loading }) => {
  const [expanded, setExpanded] = useState(false);

  if (loading) {
    return (
      <SkeletonLoader count={1} skeletonColor="bg-gray-500" linesOnly={true} />
    );
  }

  // Simple helper to truncate text to a given limit
  const truncate = (text, limit) => {
    if (text.length <= limit) return text;
    return text.slice(0, limit) + "...";
  };

  return (
    <div className="bg-white dark:bg-gray-700 rounded-lg shadow-sm overflow-hidden flex flex-col items-center p-4 h-full">
      <div className="card-body w-full">
        <h2 className="card-title">{journal.title}</h2>
        <div className="italic text-sm">
          <FormattedDate dateString={journal.date} />
        </div>

        {/* Journal content */}
        <p className="text-sm mt-2">
          {/* On small screens, show truncated version with toggle */}
          <span className="block sm:hidden">
            {expanded ? journal.content : truncate(journal.content, 100)}
          </span>
          {/* On screens sm and larger, show full content */}
          <span className="hidden sm:block">{journal.content}</span>
        </p>
        {/* Read More button only on small screens if content is long */}
        {journal.content.length > 100 && (
          <div className="sm:hidden mt-1">
            <button
              className="text-black-500 font-semibold text-xs focus:outline-none"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? "Show Less" : "Read More"}
            </button>
          </div>
        )}

        <div className="card-actions justify-end mt-4">
          <Link
            to={`/journal/${journal._id}`}
            className="ml-auto w-11 h-11 flex items-center justify-center text-lg font-semibold rounded-full bg-neutral-900 dark:bg-gray-200 text-white dark:text-gray-900 hover:bg-neutral-700 dark:hover:bg-gray-300 transition duration-200"
          >
            <Pencil />
          </Link>
        </div>
      </div>
    </div>
  );
};

JournalCard.propTypes = {
  journal: PropTypes.shape({
    _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
  }).isRequired,
  loading: PropTypes.bool,
};

export default JournalCard;

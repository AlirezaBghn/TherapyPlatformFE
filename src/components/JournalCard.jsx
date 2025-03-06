import PropTypes from "prop-types";
import SkeletonLoader from "../components/loadings/SkeletonLoader";
import FormattedDate from "./FormattedDate";
import { Link } from "react-router-dom";
import { Pencil } from "lucide-react";

const JournalCard = ({ journal, loading }) => {
  if (loading) {
    return (
      <SkeletonLoader count={1} skeletonColor="bg-gray-500" linesOnly={true} />
    );
  }

  return (
    <div className="bg-white dark:bg-gray-700 rounded-lg shadow-sm overflow-hidden flex flex-col items-center p-4 h-full">
      <div className="card-body">
        <h2 className="card-title">{journal.title}</h2>
        <div className="italic text-sm">
          <FormattedDate dateString={journal.date} />
        </div>

        <p>{journal.content}</p>
        <div className="card-actions justify-end">
          <Link
            to={`/journal/${journal._id}`}
            className="ml-auto px-5 py-2 text-lg font-semibold rounded bg-neutral-900 dark:bg-gray-200 text-white dark:text-gray-900 hover:bg-neutral-700 dark:hover:bg-gray-300 transition duration-200"
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

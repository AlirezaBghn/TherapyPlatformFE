import { useJournals } from "../../context/JournalContext";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import JournalCard from "../../components/JournalCard";
import SkeletonLoader from "../../components/loadings/SkeletonLoader"; // Added import

const JournalPage = () => {
  const { journals, loading, setJournals } = useJournals();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/journal/${user._id}/edit`);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this journal entry?")) {
      // Ensure your context provides setJournals if you wish to update the list.
      setJournals(journals.filter((journal) => journal.id !== id));
    }
  };

  return (
    <div className="container mx-auto p-6 mt-24">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-black dark:text-white">
          Your Journals
        </h2>
        <Link
          to="/add-journal"
          className="ml-auto px-6 py-2 text-lg font-semibold rounded bg-neutral-900 dark:bg-gray-200 text-white dark:text-gray-900 hover:bg-neutral-700 dark:hover:bg-gray-300 transition duration-200"
        >
          New Journal
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[50vh]">
          <SkeletonLoader
            skeletonColor="bg-gray-200"
            count={6}
            linesOnly={true}
          />
        </div>
      ) : (
        <div className="flex flex-wrap gap-4">
          {journals.map((journal) => (
            <JournalCard
              key={journal._id}
              journal={journal}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default JournalPage;

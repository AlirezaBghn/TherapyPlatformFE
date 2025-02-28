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
          className="px-6 py-2 text-lg font-semibold rounded border border-white-900 text-gray-900 border-gray-700 dark:text-white hover:text-gray-700 hover:border-gray-700 transition duration-200"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

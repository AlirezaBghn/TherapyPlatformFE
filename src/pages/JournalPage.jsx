import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import JournalCard from "../components/JournalCard";

const JournalPage = () => {
  const navigate = useNavigate();
  const [journals, setJournals] = useState([
    {
      id: 1,
      title: "First Entry",
      content: "Today was a great day......",
    },
    {
      id: 2,
      title: "Second Entry",
      content: "Felt a bit down today......",
    },
  ]);

  // The onEdit and onDelete handlers remain if needed.
  const handleEdit = (id) => {
    navigate(`/journal/${id}/edit`);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this journal entry?")) {
      setJournals(journals.filter((journal) => journal.id !== id));
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-black dark:text-white">
            Your Journals
          </h2>
          <Link
            to="/add-journal"
            className="px-4 py-2 bg-white/10 dark:bg-black/10 border border-black text-black dark:text-white rounded-lg hover:bg-white/20 dark:hover:bg-black/20 hover:border-black transition duration-300"
          >
            New Journal
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {journals.map((journal) => (
            <JournalCard
              key={journal.id}
              journal={journal}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default JournalPage;

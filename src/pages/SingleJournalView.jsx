import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

const SingleJournalView = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Dummy data; in a real app, fetch based on id.
  const dummyJournal = {
    id,
    title: "Journal Entry " + id,
    content:
      "Full content of the journal entry. Detailed text goes here. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  };

  const [journal, setJournal] = useState(dummyJournal);
  const [isEditing, setIsEditing] = useState(false);
  const [editedJournal, setEditedJournal] = useState(journal);

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this journal entry?")) {
      // In a real app, delete via API then navigate.
      navigate("/journals");
    }
  };

  const toggleEditMode = () => {
    if (isEditing) {
      setEditedJournal(journal);
    }
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedJournal((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setJournal(editedJournal);
    setIsEditing(false);
  };

  return (
    <Layout>
      <div className="container mx-auto p-6">
        {/* Back button above the card */}
        <div className="mb-4">
          <button
            onClick={() => navigate("/journals")}
            className="flex items-center text-blue-600 dark:text-white hover:underline"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Journals
          </button>
        </div>
        <div className="max-w-2xl mx-auto p-6 bg-[#f3f4f6] dark:bg-black border border-gray-300 dark:border-gray-700 shadow-lg rounded-lg">
          {!isEditing ? (
            <>
              {/* View Mode */}
              <h3 className="text-2xl font-semibold text-black dark:text-white">
                {journal.title}
              </h3>
              <p className="text-sm mt-4 text-black dark:text-white">
                {journal.content}
              </p>
              <div className="mt-6 flex space-x-4">
                <button
                  onClick={toggleEditMode}
                  className="text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition duration-300"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 transition duration-300"
                >
                  Delete
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Edit Mode */}
              <input
                type="text"
                name="title"
                value={editedJournal.title}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded mb-4 bg-white dark:bg-gray-800 text-black dark:text-white"
              />
              <textarea
                name="content"
                value={editedJournal.content}
                onChange={handleChange}
                rows="6"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded mb-4 bg-white dark:bg-gray-800 text-black dark:text-white"
              ></textarea>
              <div className="mt-6 flex space-x-4">
                <button
                  onClick={handleSave}
                  className="text-green-500 dark:text-green-400 hover:text-green-600 dark:hover:text-green-300 transition duration-300"
                >
                  Save
                </button>
                <button
                  onClick={toggleEditMode}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition duration-300"
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default SingleJournalView;

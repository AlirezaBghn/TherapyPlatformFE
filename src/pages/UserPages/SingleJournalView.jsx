import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const SingleJournalView = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const dummyJournal = {
    id,
    title: "Journal Entry " + id,
    content:
      "Full content of the journal entry. Detailed text goes here. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  };

  const [journal, setJournal] = useState(dummyJournal);
  const [isEditing, setIsEditing] = useState(false);
  const [editedJournal, setEditedJournal] = useState(journal);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Instead of using window.confirm, we open our custom modal
  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setShowDeleteModal(false);
    navigate("/journals");
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
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
    <div className="container mx-auto px-6 py-12">
      {/* Back button */}
      <div className="mb-4">
        <button
          onClick={() => navigate("/journals")}
          className="flex items-center text-blue-600 dark:text-white hover:underline transition duration-300"
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

      <div className="max-w-2xl mx-auto p-6 bg-[#f3f4f6] dark:bg-gray-800 border border-gray-300 dark:border-gray-700 shadow-lg rounded-lg mt-20 transition duration-300">
        {!isEditing ? (
          <>
            <h3 className="text-2xl font-semibold text-black dark:text-white">
              {journal.title}
            </h3>
            <p className="text-sm mt-4 text-black dark:text-white">
              {journal.content}
            </p>
            <div className="mt-6 flex space-x-4">
              <button
                onClick={toggleEditMode}
                className="text-blue-500 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-300 transition duration-300"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="text-red-500 dark:text-red-500 hover:text-red-700 dark:hover:text-red-500 transition duration-300"
              >
                Delete
              </button>
            </div>
          </>
        ) : (
          <>
            <input
              type="text"
              name="title"
              value={editedJournal.title}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded mb-4 bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            />
            <textarea
              name="content"
              value={editedJournal.content}
              onChange={handleChange}
              rows="6"
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded mb-4 bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            ></textarea>
            <div className="mt-6 flex space-x-4">
              <button
                onClick={handleSave}
                className="text-green-500 dark:text-green-400 hover:text-green-600 transition duration-300"
              >
                Save
              </button>
              <button
                onClick={toggleEditMode}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-600 transition duration-300"
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              Delete Journal Entry
            </h3>
            <p className="mb-6 text-gray-600 dark:text-gray-300">
              Are you sure you want to delete this journal entry?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={cancelDelete}
                className="px-6 py-2 text-lg font-semibold rounded border border-gray-900 text-gray-900 hover:text-gray-700 hover:border-gray-700 transition duration-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-6 py-2 text-lg font-semibold rounded border border-red-600 text-red-600 hover:text-red-500 hover:border-red-500 transition duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleJournalView;

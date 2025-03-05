import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useJournals } from "../../context/JournalContext";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { Pencil, Trash, ArrowLeft } from "lucide-react";
// *** ADD: Import toast from react-hot-toast ***
import toast from "react-hot-toast";

const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

const SingleJournalView = () => {
  const { journals, setJournals } = useJournals();
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const [journal, setJournal] = useState(
    journals.find((j) => j._id === id) || null
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editedJournal, setEditedJournal] = useState(journal);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (!journal) {
      const fetchJournal = async () => {
        try {
          const response = await axios.get(
            `${VITE_BASE_URL}/users/${user._id}/journals/${id}`,
            {
              withCredentials: true,
            }
          );
          setJournal(response.data);
          setEditedJournal(response.data);
        } catch (error) {
          console.error("Failed to fetch journal:", error);
        }
      };

      fetchJournal();
    }
  }, [id, user._id, journal]);

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${VITE_BASE_URL}/users/${user._id}/journals/${id}`, {
        withCredentials: true,
      });
      setJournals(journals.filter((journal) => journal._id !== id));
      // *** ADD: Show toast on successful deletion ***
      toast.success("Successfully deleted!");
      navigate("/journals");
    } catch (error) {
      console.error("Failed to delete journal:", error);
    }
    setShowDeleteModal(false);
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

  const handleSave = async () => {
    try {
      // *** ADD: Wrap the PUT request in toast.promise for edit notifications ***
      const putPromise = axios.put(
        `${VITE_BASE_URL}/users/${user._id}/journals/${id}`,
        editedJournal,
        {
          withCredentials: true,
        }
      );
      const response = await toast.promise(putPromise, {
        loading: "Saving...",
        success: <b>Journal entry saved!</b>,
        error: <b>Could not save.</b>,
      });
      setJournal(response.data);
      setJournals(journals.map((j) => (j._id === id ? response.data : j)));
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save journal:", error);
    }
  };

  if (!journal) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-6 py-12 mt-20">
      <div className="max-w-2xl mx-auto p-8 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 shadow-lg rounded-lg transition duration-300">
        <div className="mb-4">
          <button
            onClick={() => navigate("/journals")}
            className="flex items-center text-gray-900 dark:text-white hover:underline transition"
          >
            <ArrowLeft className="w-5 h-5 mr-2" /> Back to Journals
          </button>
        </div>
        {!isEditing ? (
          <>
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
              {journal.title}
            </h2>
            <p className="text-lg leading-relaxed text-gray-900 dark:text-gray-300">
              {journal.content}
            </p>
            <div className="mt-6 flex space-x-4">
              <button
                onClick={toggleEditMode}
                className="flex items-center px-4 py-2 text-sm font-semibold rounded border border-black text-black bg-white hover:bg-gray-100 transition duration-200"
              >
                <Pencil className="w-4 h-4 mr-1" /> Edit
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center px-4 py-2 text-sm font-semibold rounded border border-black text-black bg-white hover:bg-gray-100 transition duration-200"
              >
                <Trash className="w-4 h-4 mr-1" /> Delete
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
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            />
            <textarea
              name="content"
              value={editedJournal.content}
              onChange={handleChange}
              rows="6"
              className="w-full p-3 mt-4 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            ></textarea>
            <div className="mt-6 flex space-x-4">
              <button
                onClick={() => {
                  handleSave();
                  toggleEditMode();
                }}
                className="px-4 py-2 text-sm font-semibold rounded border border-black text-black bg-white hover:bg-gray-100 transition duration-200"
              >
                Save
              </button>
              <button
                onClick={toggleEditMode}
                className="px-4 py-2 text-sm font-semibold rounded border border-black text-black bg-white hover:bg-gray-100 transition duration-200"
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              Delete Journal Entry
            </h3>
            <p className="mb-6 text-gray-600 dark:text-gray-300">
              Are you sure you want to delete this journal entry?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-sm font-semibold rounded border border-black text-black bg-white hover:bg-gray-100 transition duration-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-semibold rounded border border-red-600 text-red-600 bg-white hover:bg-red-100 transition duration-200"
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

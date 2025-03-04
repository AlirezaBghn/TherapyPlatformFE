import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useJournals } from "../../context/JournalContext";
import SkeletonLoader from "../../components/loadings/SkeletonLoader";
import RingLoader from "../../components/loadings/RingLoader";
import { ArrowLeft } from "lucide-react";
const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

const AddJournalEntry = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setJournals } = useJournals();
  const [formData, setFormData] = useState({
    user_id: user._id,
    title: "",
    content: "",
  });
  // New state for showing the skeleton while saving
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const response = await axios.post(
        `${VITE_BASE_URL}/users/${user._id}/journals`,
        formData,
        {
          withCredentials: true,
        }
      );
      setJournals((prevJournals) => [...prevJournals, response.data]);
      navigate("/journals");
    } catch (error) {
      console.error("Failed to add journal:", error);
      setIsSaving(false);
    }
  };

  // When saving, show only the skeleton with a message
  if (isSaving) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        {/* Saving message at the top center */}

        {/* RingLoader centered and scaled 2x */}
        <div className="mb-6" style={{ transform: "scale(4)" }}>
          <RingLoader />
        </div>
        {/* Skeleton loader remains below */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="flex justify-center">
            <div
              className="w-full max-w-sm"
              style={{ transform: "scale(1.2)" }}
            >
              <SkeletonLoader
                skeletonColor="bg-gray-200"
                count={1}
                linesOnly={true}
              />
            </div>
          </div>
        </div>
      </div>
    );
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
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          New Journal Entry
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 text-gray-900 dark:text-white">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-gray-900 dark:text-white">
              Content
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows="6"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full py-3 text-lg font-semibold rounded border border-gray-800 text-gray-900 dark:text-white hover:text-gray-700 hover:border-gray-700 transition duration-200"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddJournalEntry;

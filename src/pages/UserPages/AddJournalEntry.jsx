import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useJournals } from "../../context/JournalContext";

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    }
  };

  return (
    <div className="container mx-auto px-6 py-12 mt-20">
      <div className="max-w-2xl mx-auto p-8 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 shadow-lg rounded-lg transition duration-300">
        <div className="mb-4">
          <Link
            to="/journals"
            className="text-blue-600 dark:text-blue-500 hover:underline transition"
          >
            ← Back to Journals
          </Link>
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

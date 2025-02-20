import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

const AddJournalEntry = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("New Journal:", formData);
    navigate("/journals");
  };

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <div className="max-w-2xl mx-auto p-6 bg-black/10 dark:bg-white/10 border border-white/10 dark:border-gray-300 shadow-lg rounded-lg">
          <div className="mb-4">
            <Link
              to="/journals"
              className="text-blue-600 dark:text-blue-600 hover:underline"
            >
              ← Back to Journals
            </Link>
          </div>
          <h2 className="text-2xl font-bold mb-6 text-black dark:text-white">
            New Journal Entry
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-2 text-black dark:text-white">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded mb-4 bg-white dark:bg-gray-800 text-black dark:text-white"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-black dark:text-white">
                Content
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows="6"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded mb-4 bg-white dark:bg-gray-800 text-black dark:text-white"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default AddJournalEntry;

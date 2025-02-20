import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";

const UserProfile = () => {
  const [user, setUser] = useState({
    name: "John Doe",
    email: "john@example.com",
    phone: "123-456-7890",
    image: "https://via.placeholder.com/100",
    joinDate: "January 2023",
    location: "New York, USA",
    bio: "Mental health enthusiast and wellness advocate.",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleEdit = () => setIsEditing(true);
  const handleDelete = () => setShowDeleteConfirm(true);
  const handleCancelDelete = () => setShowDeleteConfirm(false);
  const handleConfirmDelete = () => {
    // Add delete logic here
    alert("Profile deleted");
    setShowDeleteConfirm(false);
  };

  const handleSave = () => {
    // Add save logic here
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser((prevUser) => ({ ...prevUser, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-6">
        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
              <h3 className="text-2xl font-bold mb-4">Delete Account</h3>
              <p className="mb-6 text-gray-600 dark:text-gray-300">
                Are you sure you want to permanently delete your account? This
                action cannot be undone and all your data will be lost.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={handleCancelDelete}
                  className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          {/* Profile Header */}
          <div className="bg-blue-50 dark:bg-gray-700 p-6">
            <div className="flex items-center space-x-6">
              <label className="relative group cursor-pointer">
                <img
                  src={user.image}
                  alt={user.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-lg"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-sm font-medium">Edit</span>
                </div>
                <input
                  type="file"
                  onChange={handleImageChange}
                  className="hidden"
                  accept="image/*"
                />
              </label>
              <div>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                  {user.name}
                </h1>
                <p className="text-gray-600 dark:text-gray-300">{user.email}</p>
                <p className="text-gray-600 dark:text-gray-300">{user.phone}</p>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-6 space-y-6">
            {isEditing ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={user.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={user.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={user.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Profile Photo
                    </label>
                    <input
                      type="file"
                      onChange={handleImageChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-gray-600 dark:file:text-gray-100"
                    />
                  </div>
                </div>

                <div className="flex space-x-4 justify-end">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                      Joined Date
                    </h3>
                    <p className="text-gray-800 dark:text-gray-200">
                      {user.joinDate}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                      Location
                    </h3>
                    <p className="text-gray-800 dark:text-gray-200">
                      {user.location}
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    Bio
                  </h3>
                  <p className="text-gray-800 dark:text-gray-200">{user.bio}</p>
                </div>

                <div className="flex space-x-4 border-t pt-6">
                  <button
                    onClick={handleEdit}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                    Edit Profile
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition flex items-center"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Delete Account
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserProfile;

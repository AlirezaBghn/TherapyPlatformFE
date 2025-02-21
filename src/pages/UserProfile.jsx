import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import { axiosClient } from "../services/api";

const UserProfile = () => {
  // Get current user from AuthContext
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  // Local states for loading, error, edit mode, deletion confirmation, and a copy for editing
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // On component mount, fetch the current user if not present
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        // Fetch current user from a dedicated endpoint (must be implemented on the backend)
        const res = await axiosClient.get("/users/me");
        setUser(res.data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        navigate("/signin", { replace: true });
      }
    };

    if (!user) {
      fetchCurrentUser();
    } else {
      setLoading(false);
    }
  }, [user, setUser, navigate]);

  // When entering edit mode, create a local copy of the user for editing
  const handleEdit = () => {
    setEditedUser({ ...user });
    setIsEditing(true);
  };

  // Handler to cancel edit mode
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedUser(null);
  };

  // Handler to save changes – only send fields that have changed
  const handleSave = async () => {
    try {
      // Build an object with only the fields that have been modified
      const updatedFields = {};
      if (editedUser.name !== user.name) updatedFields.name = editedUser.name;
      if (editedUser.username !== user.username)
        updatedFields.username = editedUser.username;
      if (editedUser.email !== user.email)
        updatedFields.email = editedUser.email;
      if (editedUser.phone !== user.phone)
        updatedFields.phone = editedUser.phone;
      if (editedUser.image !== user.image)
        updatedFields.image = editedUser.image;

      // Send the PUT request with only the updated fields
      const res = await axiosClient.put(`/users/${user._id}`, updatedFields);
      setUser(res.data);
      setIsEditing(false);
      setEditedUser(null);
    } catch (err) {
      setError(err.response?.data?.error || "Update failed");
    }
  };

  // Handler for changes in edit form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({ ...prev, [name]: value }));
  };

  // Handler for image changes in edit mode
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedUser((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handlers for delete confirmation modal
  const handleDelete = () => setShowDeleteConfirm(true);
  const handleCancelDelete = () => setShowDeleteConfirm(false);
  const handleConfirmDelete = () => {
    // Add deletion logic here
    alert("Account deleted");
    setShowDeleteConfirm(false);
    navigate("/", { replace: true });
  };

  if (loading)
    return (
      <Layout>
        <div className="text-center py-10 text-xl">
          Loading user information...
        </div>
      </Layout>
    );
  if (error)
    return (
      <Layout>
        <div className="text-center py-10 text-red-500 text-xl">{error}</div>
      </Layout>
    );
  if (!user)
    return (
      <Layout>
        <div className="text-center py-10 text-xl">
          No user information available.
        </div>
      </Layout>
    );

  // Use editedUser if in edit mode, otherwise use user data
  const displayUser = isEditing ? editedUser : user;

  return (
    <Layout>
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold mb-4">Delete Account</h3>
            <p className="mb-6 text-gray-600">
              Are you sure you want to permanently delete your account? This
              action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCancelDelete}
                className="px-8 py-3 text-lg font-semibold rounded border border-gray-900 text-gray-900 hover:text-gray-700 hover:border-gray-700 transition duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-8 py-3 text-lg font-semibold rounded border border-gray-900 text-gray-900 hover:text-gray-700 hover:border-gray-700 transition duration-200"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Card Container (20% smaller than before) */}
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden my-10 p-8">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center border-b pb-8 mb-8">
          <div className="relative group w-32 h-32 flex-shrink-0">
            <img
              src={displayUser.image || "https://via.placeholder.com/150"}
              alt={displayUser.name}
              className="w-full h-full rounded-full object-contain border border-gray-900"
            />
            {isEditing && (
              <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                <span className="text-white text-sm font-medium">Edit</span>
                <input
                  type="file"
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  accept="image/*"
                />
              </div>
            )}
          </div>
          <div className="mt-4 md:mt-0 md:ml-8 text-center md:text-left space-y-2">
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={displayUser.name}
                onChange={handleChange}
                className="text-4xl font-bold text-gray-900 bg-gray-200 dark:bg-gray-700 border border-gray-900 rounded px-3 py-2 focus:outline-none"
              />
            ) : (
              <h1 className="text-4xl font-bold text-gray-900">
                {displayUser.name}
              </h1>
            )}
            {isEditing ? (
              <input
                type="text"
                name="username"
                value={displayUser.username}
                onChange={handleChange}
                className="text-xl text-gray-900 bg-gray-200 dark:bg-gray-700 border border-gray-900 rounded px-3 py-2 focus:outline-none"
              />
            ) : (
              <p className="text-xl text-gray-900">{displayUser.username}</p>
            )}
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={displayUser.email}
                onChange={handleChange}
                className="text-xl text-gray-900 bg-gray-200 dark:bg-gray-700 border border-gray-900 rounded px-3 py-2 focus:outline-none"
              />
            ) : (
              <p className="text-xl text-gray-900">{displayUser.email}</p>
            )}
            {isEditing ? (
              <input
                type="tel"
                name="phone"
                value={displayUser.phone}
                onChange={handleChange}
                className="text-xl text-gray-900 bg-gray-200 dark:bg-gray-700 border border-gray-900 rounded px-3 py-2 focus:outline-none"
              />
            ) : (
              <p className="text-xl text-gray-900">{displayUser.phone}</p>
            )}
          </div>
        </div>

        {/* Edit Mode Section */}
        {isEditing ? (
          <div className="bg-gray-100 p-8 rounded-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Edit Profile
            </h2>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-lg font-medium text-gray-900 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={displayUser.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-200 dark:bg-gray-700 border border-gray-900 rounded focus:outline-none focus:ring-2 focus:ring-gray-700"
                />
              </div>
              <div>
                <label className="block text-lg font-medium text-gray-900 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={displayUser.username}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-200 dark:bg-gray-700 border border-gray-900 rounded focus:outline-none focus:ring-2 focus:ring-gray-700"
                />
              </div>
              <div>
                <label className="block text-lg font-medium text-gray-900 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={displayUser.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-200 dark:bg-gray-700 border border-gray-900 rounded focus:outline-none focus:ring-2 focus:ring-gray-700"
                />
              </div>
              <div>
                <label className="block text-lg font-medium text-gray-900 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={displayUser.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-200 dark:bg-gray-700 border border-gray-900 rounded focus:outline-none focus:ring-2 focus:ring-gray-700"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={handleCancelEdit}
                className="px-8 py-3 text-lg font-semibold rounded border border-gray-900 text-gray-900 hover:text-gray-700 hover:border-gray-700 transition duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-8 py-3 text-lg font-semibold rounded border border-gray-900 text-gray-900 hover:text-gray-700 hover:border-gray-700 transition duration-200"
              >
                Save Changes
              </button>
            </div>
          </div>
        ) : (
          // Display Mode: Edit and Delete buttons
          <div className="flex justify-end mt-6">
            <button
              onClick={handleEdit}
              className="px-8 py-3 text-lg font-semibold rounded border border-gray-900 text-gray-900 hover:text-gray-700 hover:border-gray-700 transition duration-200 flex items-center"
            >
              Edit Profile
            </button>
            <button
              onClick={handleDelete}
              className="ml-4 px-8 py-3 text-lg font-semibold rounded border border-gray-900 text-gray-900 hover:text-gray-700 hover:border-gray-700 transition duration-200 flex items-center"
            >
              Delete Account
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default UserProfile;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { axiosClient } from "../../services/api";
import { useAuth } from "../../context/AuthContext.jsx";
import ProfileSkeleton from "../../components/loadings/ProfileSkeleton";
import RingLoader from "../../components/loadings/RingLoader.jsx";

const UserProfile = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [isSavingProfile, setIsSavingProfile] = useState(false); // New state for saving
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [usernameError, setUsernameError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axiosClient.get(`/users/${user._id}`, {
          withCredentials: true,
        });
        setUser(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
        navigate("/signin", { replace: true });
      }
    };

    if (user && user._id) {
      fetchUserData();
    } else {
      navigate("/signin", { replace: true });
    }
  }, []);

  const handleEdit = () => {
    setEditedUser({ ...user });
    setIsEditing(true);
    setEmailError("");
    setUsernameError("");
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedUser(null);
    setEmailError("");
    setUsernameError("");
  };

  const handleSave = async () => {
    try {
      setIsSavingProfile(true); // Start saving, show skeleton
      setEmailError("");
      setUsernameError("");
      setError(null);

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

      console.log("Updated fields:", updatedFields);

      const res = await axiosClient.put(`/users/${user._id}`, updatedFields, {
        withCredentials: true,
      });
      setUser(res.data);
      setIsEditing(false);
      setEditedUser(null);
      setIsSavingProfile(false); // Save complete, hide skeleton
    } catch (err) {
      console.error("Update failed:", err.response?.data || err.message);
      if (err.response && err.response.status === 413) {
        setError("Payload too large. Please reduce the file size.");
      } else if (err.response?.data?.error === "Email is already taken") {
        setEmailError("This email is already in use.");
        setError(null);
      } else if (err.response?.data?.error === "Username is already taken") {
        setUsernameError("This username is already taken.");
        setError(null);
      } else {
        setError(err.response?.data?.error || "Update failed");
      }
      setIsSavingProfile(false); // On error, hide skeleton as well
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({ ...prev, [name]: value }));
  };

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

  const handleDelete = () => setShowDeleteConfirm(true);
  const handleCancelDelete = () => setShowDeleteConfirm(false);
  const handleConfirmDelete = () => {
    alert("Account deleted");
    setShowDeleteConfirm(false);
    navigate("/", { replace: true });
  };

  // Show initial loading skeleton
  if (loading) {
    return (
      <div className="container mx-auto px-6 py-12 mt-24">
        <div className="flex justify-start">
          <div
            className="w-full max-w-sm ml-5"
            style={{ transform: "scale(1.2)" }}
          >
            <ProfileSkeleton
              profile={true}
              skeletonColor="bg-gray-200"
              count={1}
            />
          </div>
        </div>
      </div>
    );
  }
  //

  // Show skeleton while saving profile changes
  if (isSavingProfile) {
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
              <ProfileSkeleton
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

  if (error)
    return (
      <div className="container mx-auto px-6 py-12">
        <div className="text-center text-red-500 text-xl">{error}</div>
      </div>
    );
  if (!user)
    return (
      <div className="container mx-auto px-6 py-12">
        <div className="text-center text-xl text-gray-900 dark:text-white">
          No user information available.
        </div>
      </div>
    );

  const displayUser = isEditing ? editedUser : user;

  return (
    <>
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              Delete Account
            </h3>
            <p className="mb-6 text-gray-600 dark:text-gray-300">
              Are you sure you want to permanently delete your account? This
              action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCancelDelete}
                className="px-6 py-2 text-lg font-semibold rounded border border-gray-900 text-gray-900 hover:text-gray-700 hover:border-gray-700 transition duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-6 py-2 text-lg font-semibold rounded border border-red-500 text-red-500 hover:text-red-500 hover:border-red-500 transition duration-200"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="container mx-auto px-6 py-12 mt-16">
        <div className="max-w-5xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow overflow-hidden ">
          <div className="flex flex-col md:flex-row items-center border-b border-gray-300 dark:border-gray-700 p-8">
            <div className="relative group w-32 h-32 flex-shrink-0">
              <img
                src={displayUser.image || "https://via.placeholder.com/150"}
                alt={displayUser.name}
                className="w-full h-full rounded-full border border-gray-300 dark:border-gray-600 shadow-sm object-cover"
              />
              {isEditing && (
                <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full opacity-0 group-hover:opacity-100  flex items-center justify-center">
                  <label
                    htmlFor="image-upload"
                    className="text-white text-sm font-medium cursor-pointer"
                  >
                    Change
                  </label>
                  <input
                    type="file"
                    id="image-upload"
                    onChange={handleImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    accept="image/*"
                  />
                </div>
              )}
            </div>
            <div className="mt-6 md:mt-0 md:ml-10 text-center md:text-left space-y-3">
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={displayUser.name}
                  onChange={handleChange}
                  className="w-full text-4xl font-bold text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 "
                />
              ) : (
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                  {displayUser.name}
                </h1>
              )}
              {isEditing ? (
                <>
                  <input
                    type="text"
                    name="username"
                    value={displayUser.username}
                    onChange={handleChange}
                    className={`w-full text-xl text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 border ${
                      usernameError ? "border-red-500" : "border-gray-300"
                    } dark:border-gray-600 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 `}
                  />
                  {usernameError && (
                    <p className="text-red-500 text-sm">{usernameError}</p>
                  )}
                </>
              ) : (
                <p className="text-xl text-gray-900 dark:text-white">
                  {displayUser.username}
                </p>
              )}
              {isEditing ? (
                <>
                  <input
                    type="email"
                    name="email"
                    value={displayUser.email}
                    onChange={handleChange}
                    className={`w-full text-xl text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 border ${
                      emailError ? "border-red-500" : "border-gray-300"
                    } dark:border-gray-600 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 `}
                  />
                  {emailError && (
                    <p className="text-red-500 text-sm">{emailError}</p>
                  )}
                </>
              ) : (
                <p className="text-xl text-gray-900 dark:text-white">
                  {displayUser.email}
                </p>
              )}
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={displayUser.phone}
                  onChange={handleChange}
                  className="w-full text-xl text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 "
                />
              ) : (
                <p className="text-xl text-gray-900 dark:text-white">
                  {displayUser.phone}
                </p>
              )}
            </div>
          </div>
          {isEditing ? (
            <div className="bg-gray-50 dark:bg-gray-800 p-8 ">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Edit Profile
              </h2>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block mb-2 text-lg font-medium text-gray-900 dark:text-gray-300">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={displayUser.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 "
                  />
                </div>
                <div>
                  <label className="block mb-2 text-lg font-medium text-gray-900 dark:text-gray-300">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={displayUser.username}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border ${
                      usernameError ? "border-red-500" : "border-gray-300"
                    } dark:border-gray-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 `}
                  />
                  {usernameError && (
                    <p className="text-red-500 text-sm">{usernameError}</p>
                  )}
                </div>
                <div>
                  <label className="block mb-2 text-lg font-medium text-gray-900 dark:text-gray-300">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={displayUser.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border ${
                      emailError ? "border-red-500" : "border-gray-300"
                    } dark:border-gray-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 `}
                  />
                  {emailError && (
                    <p className="text-red-500 text-sm">{emailError}</p>
                  )}
                </div>
                <div>
                  <label className="block mb-2 text-lg font-medium text-gray-900 dark:text-gray-300">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={displayUser.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 "
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={handleCancelEdit}
                  className="ml-4 px-6 py-2 text-lg font-semibold rounded border border-red-600 text-red-600 hover:text-red-500 hover:border-red-500 transition duration-200 flex items-center"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-2 text-lg font-semibold rounded border border-green-700 text-green-700 hover:text-green-600 hover:border-green-600 transition duration-200"
                >
                  Save Changes
                </button>
              </div>
            </div>
          ) : (
            <div className="flex justify-end p-8">
              <button
                onClick={handleEdit}
                className="px-6 py-2 text-lg font-semibold rounded border border-blue-500 text-blue-500 dark:text-blue-500 hover:text-blue-300 hover:border-blue-700 transition duration-200"
              >
                Edit Profile
              </button>
              <button
                onClick={handleDelete}
                className="ml-4 px-6 py-2 text-lg font-semibold rounded border border-red-600 text-red-600 hover:text-red-500 hover:border-red-500 transition duration-200 flex items-center"
              >
                Delete Account
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UserProfile;

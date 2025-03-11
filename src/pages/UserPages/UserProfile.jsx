import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { axiosClient } from "../../services/api";
import { useAuth } from "../../context/AuthContext.jsx";
import ProfileSkeleton from "../../components/loadings/ProfileSkeleton";
import RingLoader from "../../components/loadings/RingLoader.jsx";
import { ArrowLeft } from "lucide-react";

import { toast } from "react-hot-toast";

import { FaImage } from "react-icons/fa";

const UserProfile = () => {
  const {
    user,
    setUser,
    setIsAuthenticated,
    setQuestionsSubmitted,
    setUserRole,
  } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
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
    toast("Edit mode activated!", { icon: "✏️" });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedUser(null);
    setEmailError("");
    setUsernameError("");
    toast("Edit cancelled", { icon: "🚫" });
  };

  const handleSave = async () => {
    try {
      setIsSavingProfile(true);
      setEmailError("");
      setUsernameError("");
      setError(null);

      const formData = new FormData();
      if (editedUser.name !== user.name)
        formData.append("name", editedUser.name);
      if (editedUser.username !== user.username)
        formData.append("username", editedUser.username);
      if (editedUser.email !== user.email)
        formData.append("email", editedUser.email);
      if (editedUser.phone !== user.phone)
        formData.append("phone", editedUser.phone);

      if (editedUser.image !== user.image && editedUser.imageFile) {
        formData.append("image", editedUser.imageFile);
      }

      const savePromise = axiosClient.put(`/users/${user._id}`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.promise(savePromise, {
        loading: "Saving profile changes...",
        success: "Profile updated successfully!",
        error: "Profile update failed!",
      });

      const res = await savePromise;
      setUser(res.data);
      setIsEditing(false);
      setEditedUser(null);
      setIsSavingProfile(false);
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
      setIsSavingProfile(false);
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
        setEditedUser((prev) => ({
          ...prev,
          image: reader.result,
          imageFile: file,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };
  const handleCancelDelete = () => setShowDeleteConfirm(false);
  const handleConfirmDelete = async () => {
    try {
      await axiosClient.delete(`/users/${user._id}`, { withCredentials: true });
      setUser(null);
      setIsAuthenticated(false);
      setQuestionsSubmitted(false);
      setUserRole("");
      setShowDeleteConfirm(false);
      navigate("/", { replace: true });
      toast.success("Account deleted!");
    } catch (err) {
      console.error("Delete failed:", err.response?.data || err.message);
      setError(err.response?.data?.error || "Delete failed");
      toast.error("Account deletion failed!");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-12 mt-24">
        <div className="flex justify-start">
          <div
            className="w-full max-w-sm ml-5"
            style={{ transform: "scale(1.2)" }}
          >
            <RingLoader />
          </div>
        </div>
      </div>
    );
  }

  if (isSavingProfile) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <div className="mb-6" style={{ transform: "scale(4)" }}>
          <RingLoader />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="flex justify-center">
            <div
              className="w-full max-w-sm"
              style={{ transform: "scale(1.2)" }}
            ></div>
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
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 p-5 sm:p-8 rounded-xl shadow-2xl w-full max-w-md animate-fade-in">
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gray-900 dark:text-white">
              Delete Account
            </h3>
            <p className="mb-5 sm:mb-6 text-gray-600 dark:text-gray-300 text-sm sm:text-base">
              Are you sure you want to permanently delete your account? This
              action cannot be undone.
            </p>
            <div className="flex flex-col sm:flex-row sm:justify-end gap-3 sm:space-x-4">
              <button
                onClick={handleCancelDelete}
                className="w-full sm:w-auto order-2 sm:order-1 px-4 py-2 bg-white text-gray-500 border-2 border-gray-300 rounded-full hover:bg-gray-50 transition-all duration-200 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-900"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="w-full sm:w-auto order-1 sm:order-2 px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-200"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-3 sm:px-6 py-6 sm:py-12 mt-20 sm:mt-16 max-w-4xl">
        {/* Back button for mobile */}
        <button
          onClick={() => window.history.back()}
          className="flex items-center mb-4 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
        >
          <ArrowLeft size={18} className="mr-1" />
          <span className="text-sm">Back to Dashboard</span>
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-8">
          {/* Profile Header */}
          <div className="flex flex-col sm:flex-row items-center border-b border-gray-200 dark:border-gray-700 pb-5 sm:pb-6 mb-5 sm:mb-6">
            <div className="w-24 h-24 sm:w-32 sm:h-32 relative mb-4 sm:mb-0">
              <img
                src={displayUser.image}
                alt={displayUser.name}
                className="w-24 h-24 rounded-full border border-gray-200 dark:border-gray-700 shadow-sm object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://ui-avatars.com/api/?name=" +
                    encodeURIComponent(displayUser.name) +
                    "&background=random";
                }}
              />
            </div>
            <div className="ml-0 sm:ml-8 text-base sm:text-lg space-y-1 sm:space-y-2 text-center sm:text-left w-full">
              <p className="text-gray-800 dark:text-gray-200">
                <span className="font-semibold">Name:</span> {displayUser.name}
              </p>
              <p className="text-gray-800 dark:text-gray-200">
                <span className="font-semibold">Username:</span>{" "}
                <span className="break-words">{displayUser.username}</span>
              </p>
              <p className="text-gray-800 dark:text-gray-200">
                <span className="font-semibold">Email:</span>{" "}
                <span className="break-words">{displayUser.email}</span>
              </p>
              <p className="text-gray-800 dark:text-gray-200">
                <span className="font-semibold">Phone:</span>{" "}
                {displayUser.phone || "Not provided"}
              </p>
            </div>
          </div>

          {/* Edit Form */}
          {isEditing ? (
            <div className="animate-fade-in">
              <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white">
                Edit Profile
              </h2>
              <div className="grid gap-4 sm:gap-6">
                {/* Form Fields */}
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={displayUser.name}
                      onChange={handleChange}
                      className="w-full px-3 sm:px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white transition-colors duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Username
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={displayUser.username}
                      onChange={handleChange}
                      className="w-full px-3 sm:px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white transition-colors duration-200"
                    />
                    {usernameError && (
                      <p className="text-red-500 text-xs mt-1">
                        {usernameError}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={displayUser.email}
                      onChange={handleChange}
                      className="w-full px-3 sm:px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white transition-colors duration-200"
                    />
                    {emailError && (
                      <p className="text-red-500 text-xs mt-1">{emailError}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={displayUser.phone || ""}
                      onChange={handleChange}
                      className="w-full px-3 sm:px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white transition-colors duration-200"
                    />
                  </div>
                  <div className="pt-1">
                    <label className="flex items-center gap-2 border-2 border-gray-300 dark:border-gray-600 py-2.5 sm:py-3 px-3 sm:px-4 rounded-2xl cursor-pointer hover:border-gray-500 dark:hover:border-gray-400 transition-all duration-300 group">
                      <FaImage className="h-5 w-5 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors" />
                      <span className="text-sm text-gray-700 dark:text-gray-300 flex-grow truncate">
                        {editedUser.imageFile?.name || "Upload profile picture"}
                      </span>
                      <input
                        type="file"
                        name="profileImage"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                      <span className="bg-gray-200 dark:bg-gray-700 px-3 sm:px-4 py-1 rounded-lg text-gray-800 dark:text-gray-200 text-xs sm:text-sm font-medium whitespace-nowrap">
                        Browse
                      </span>
                    </label>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row sm:justify-end gap-3 sm:space-x-4 mt-4 sm:mt-6">
                  <button
                    onClick={handleCancelEdit}
                    className="w-full sm:w-auto order-2 sm:order-1 px-4 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100 transition-all duration-200 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="w-full sm:w-auto order-1 sm:order-2 px-4 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-700 transition-all duration-200 dark:bg-gray-200 dark:text-gray-900 dark:hover:bg-gray-300"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:justify-end gap-3 sm:space-x-4">
              <button
                onClick={handleEdit}
                className="w-full sm:w-auto px-4 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-700 transition-all duration-200 dark:bg-gray-200 dark:text-gray-900 dark:hover:bg-gray-300 order-1"
              >
                Edit Profile
              </button>
              <button
                onClick={handleDelete}
                className="w-full sm:w-auto px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-200 order-2"
              >
                Delete Account
              </button>
            </div>
          )}

          {/* Form Errors */}
          {error && (
            <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm">
              {error}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UserProfile;

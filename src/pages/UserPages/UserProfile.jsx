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
  const { user, setUser } = useAuth();
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
    toast("Are you sure you want to delete your account?", {
      icon: "⚠️",
    });
  };
  const handleCancelDelete = () => setShowDeleteConfirm(false);
  const handleConfirmDelete = () => {
    toast.success("Account deleted!");
    setShowDeleteConfirm(false);
    navigate("/", { replace: true });
  };

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
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl max-w-md w-full mx-4 animate-fade-in">
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
                className="px-4 py-2 bg-white text-gray-500 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-900"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 py-12 mt-16 max-w-4xl">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8">
          {/* Profile Header */}
          <div className="flex flex-col sm:flex-row items-center border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
            <div className="w-32 h-32 relative mb-4 sm:mb-0">
              <img
                src={displayUser.image}
                alt={displayUser.name}
                className="w-full h-full rounded-full border border-gray-200 dark:border-gray-700 shadow-sm object-cover"
              />
            </div>
            <div className="ml-0 sm:ml-8 text-lg space-y-2 text-center sm:text-left">
              <p className="text-gray-800 dark:text-gray-200">
                <span className="font-semibold">Name:</span> {displayUser.name}
              </p>
              <p className="text-gray-800 dark:text-gray-200">
                <span className="font-semibold">Username:</span>{" "}
                {displayUser.username}
              </p>
              <p className="text-gray-800 dark:text-gray-200">
                <span className="font-semibold">Email:</span>{" "}
                {displayUser.email}
              </p>
              <p className="text-gray-800 dark:text-gray-200">
                <span className="font-semibold">Phone:</span>{" "}
                {displayUser.phone}
              </p>
            </div>
          </div>

          {/* Edit Form */}
          {isEditing ? (
            <div className="animate-fade-in">
              <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
                Edit Profile
              </h2>
              <div className="grid gap-6">
                {/* Form Fields */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={displayUser.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white transition-colors duration-200"
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
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white transition-colors duration-200"
                    />
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
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white transition-colors duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={displayUser.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white transition-colors duration-200"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 border-2 border-gray-300 dark:border-gray-600 py-3 px-4 rounded-2xl cursor-pointer hover:border-gray-500 dark:hover:border-gray-400 transition-all duration-300 group">
                      <FaImage className="h-5 w-5 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors" />
                      <input
                        type="file"
                        name="profileImage"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                      <span className="ml-auto bg-gray-200 dark:bg-gray-700 px-4 py-1 rounded-lg text-gray-800 dark:text-gray-200 text-sm font-medium">
                        Browse
                      </span>
                    </label>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-all duration-200 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-white text-gray-900 border-2 border-gray-900 rounded-lg hover:bg-gray-100 transition-all duration-200 dark:border-gray-200 dark:text-gray-200"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleEdit}
                className="px-4 py-2 bg-white text-gray-900 border-2 border-gray-900 rounded-lg hover:bg-gray-100 transition-all duration-200 dark:border-gray-200 dark:text-gray-200"
              >
                Edit Profile
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-white text-red-500 border-2 border-red-500 rounded-lg hover:bg-red-50 transition-all duration-200"
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

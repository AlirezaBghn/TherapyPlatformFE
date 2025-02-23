import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosClient } from "../../services/api";
import { useTherapistAuth } from "../../context/TherapistAuthContext";

const TherapistPortalProfile = () => {
  const { therapist, setTherapist } = useTherapistAuth();
  const navigate = useNavigate();

  // If no therapist is available in context, redirect to sign in.
  if (!therapist) {
    navigate("/therapist-signin", { replace: true });
    return null;
  }

  const [isEditing, setIsEditing] = useState(false);
  const [editedTherapist, setEditedTherapist] = useState({ ...therapist });
  const [error, setError] = useState(null);
  const [emailError, setEmailError] = useState("");
  const [usernameError, setUsernameError] = useState("");

  const handleEdit = () => {
    setEditedTherapist({ ...therapist });
    setIsEditing(true);
    setEmailError("");
    setUsernameError("");
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedTherapist({ ...therapist });
    setEmailError("");
    setUsernameError("");
  };

  const handleSave = async () => {
    try {
      setEmailError("");
      setUsernameError("");
      setError(null);

      const updatedFields = {};
      if (editedTherapist.name !== therapist.name)
        updatedFields.name = editedTherapist.name;
      if (editedTherapist.username !== therapist.username)
        updatedFields.username = editedTherapist.username;
      if (editedTherapist.email !== therapist.email)
        updatedFields.email = editedTherapist.email;
      if (editedTherapist.phone !== therapist.phone)
        updatedFields.phone = editedTherapist.phone;
      // Only update image if a new nonempty value is provided
      if (editedTherapist.image && editedTherapist.image !== therapist.image)
        updatedFields.image = editedTherapist.image;

      console.log("Updated fields:", updatedFields);

      const res = await axiosClient.put(
        `/therapists/${therapist._id}`,
        updatedFields,
        { withCredentials: true }
      );
      setTherapist(res.data);
      setIsEditing(false);
    } catch (err) {
      console.error("Update failed:", err.response?.data || err.message);
      if (err.response && err.response.status === 413) {
        setError("Payload too large. Please reduce the file size.");
      } else if (err.response?.data?.error === "Email is already taken") {
        setEmailError("This email is already in use.");
      } else if (err.response?.data?.error === "Username is already taken") {
        setUsernameError("This username is already taken.");
      } else {
        setError(err.response?.data?.error || "Update failed");
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedTherapist((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedTherapist((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = () => {
    alert("Account deleted");
    navigate("/", { replace: true });
  };

  const displayTherapist = isEditing ? editedTherapist : therapist;

  return (
    <>
      {error && (
        <div className="container mx-auto px-6 py-12">
          <div className="text-center text-red-500 text-xl">{error}</div>
        </div>
      )}
      <div className="container mx-auto px-6 py-12 mt-16">
        <div className="max-w-5xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow overflow-hidden transition duration-300">
          <div className="flex flex-col md:flex-row items-center border-b border-gray-300 dark:border-gray-700 p-8">
            <div className="relative group w-32 h-32 flex-shrink-0">
              <img
                src={
                  displayTherapist.image || "https://via.placeholder.com/150"
                }
                alt={displayTherapist.name}
                className="w-full h-full rounded-full border border-gray-300 dark:border-gray-600 shadow-sm object-cover"
              />
              {isEditing && (
                <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
                  <label
                    htmlFor="image-upload"
                    className="text-white text-sm font-medium cursor-pointer"
                  >
                    Change
                  </label>
                  <input
                    type="file"
                    id="image-upload"
                    name="profileImage"
                    autoComplete="off"
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
                  value={displayTherapist.name}
                  onChange={handleChange}
                  className="w-full text-4xl font-bold text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                />
              ) : (
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                  {displayTherapist.name}
                </h1>
              )}
              {isEditing ? (
                <>
                  <input
                    type="text"
                    name="username"
                    value={displayTherapist.username}
                    onChange={handleChange}
                    className={`w-full text-xl text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 border ${
                      usernameError ? "border-red-500" : "border-gray-300"
                    } dark:border-gray-600 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300`}
                  />
                  {usernameError && (
                    <p className="text-red-500 text-sm">{usernameError}</p>
                  )}
                </>
              ) : (
                <p className="text-xl text-gray-900 dark:text-white">
                  {displayTherapist.username}
                </p>
              )}
              {isEditing ? (
                <>
                  <input
                    type="email"
                    name="email"
                    value={displayTherapist.email}
                    onChange={handleChange}
                    className={`w-full text-xl text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 border ${
                      emailError ? "border-red-500" : "border-gray-300"
                    } dark:border-gray-600 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300`}
                  />
                  {emailError && (
                    <p className="text-red-500 text-sm">{emailError}</p>
                  )}
                </>
              ) : (
                <p className="text-xl text-gray-900 dark:text-white">
                  {displayTherapist.email}
                </p>
              )}
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={displayTherapist.phone}
                  onChange={handleChange}
                  className="w-full text-xl text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                />
              ) : (
                <p className="text-xl text-gray-900 dark:text-white">
                  {displayTherapist.phone}
                </p>
              )}
            </div>
          </div>
          {isEditing ? (
            <div className="bg-gray-50 dark:bg-gray-800 p-8 transition duration-300">
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
                    value={displayTherapist.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-lg font-medium text-gray-900 dark:text-gray-300">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={displayTherapist.username}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border ${
                      usernameError ? "border-red-500" : "border-gray-300"
                    } dark:border-gray-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300`}
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
                    value={displayTherapist.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border ${
                      emailError ? "border-red-500" : "border-gray-300"
                    } dark:border-gray-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300`}
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
                    value={displayTherapist.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
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

export default TherapistPortalProfile;

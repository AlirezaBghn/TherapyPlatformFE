import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { axiosClient } from "../../services/api.js";
import { useTherapistAuth } from "../../context/TherapistAuthContext";
import {
  FaUser,
  FaUserTag,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaImage,
  FaExclamationCircle,
} from "react-icons/fa";

const TherapistPortalRegistration = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    phoneNumber: "",
    profileImage: null,
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("No file chosen");
  const navigate = useNavigate();
  const { setTherapist } = useTherapistAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFileName(e.target.files[0].name);
      setFormData((prev) => ({ ...prev, profileImage: e.target.files[0] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (
        !formData.fullName ||
        !formData.username ||
        !formData.email ||
        !formData.password ||
        !formData.phoneNumber
      ) {
        setError("Please provide all required fields");
        setLoading(false);
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.fullName);
      formDataToSend.append("username", formData.username);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("phone", formData.phoneNumber);

      if (formData.profileImage) {
        formDataToSend.append("image", formData.profileImage);
      }

      console.log("Submitting therapist registration form...");

      const response = await axiosClient.post(
        "/therapists/register",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setTherapist(response.data.therapist);
      navigate("/therapist/questions", { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
      console.error("Therapist registration error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen md:flex bg-white dark:bg-gray-900">
      {/* Left Side Image */}
      <div
        className="relative overflow-hidden md:flex w-3/5 justify-around items-center hidden"
        style={{
          backgroundImage:
            "url('https://img.freepik.com/premium-vector/outline-illustration-seated-woman-playing-with-her-cell-phone_642097-648.jpg?w=740')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>

      {/* Right Side Form */}
      <div className="flex md:w-2/5 justify-start items-center bg-white dark:bg-gray-900 px-10 py-4 overflow-auto">
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 w-full max-w-md p-8 rounded-3xl shadow-2xl transform transition-all duration-300 border-2 border-gray-100 dark:border-gray-700"
        >
          <h1 className="text-gray-900 dark:text-white font-extrabold text-3xl mb-1 text-center">
            Therapist Registration
          </h1>
          <p className="text-md font-normal text-gray-600 dark:text-gray-300 mb-6 text-center">
            Create your therapist account
          </p>

          {/* Full Name Input */}
          <div className="flex items-center border-2 border-gray-300 dark:border-gray-600 py-3 px-4 rounded-2xl mb-4 hover:border-gray-500 dark:hover:border-gray-400 transition-all duration-300 group">
            <FaUser className="h-5 w-5 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors" />
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              className="pl-3 w-full outline-none bg-transparent dark:text-white text-lg"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          {/* Username Input */}
          <div className="flex items-center border-2 border-gray-300 dark:border-gray-600 py-3 px-4 rounded-2xl mb-4 hover:border-gray-500 dark:hover:border-gray-400 transition-all duration-300 group">
            <FaUserTag className="h-5 w-5 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors" />
            <input
              type="text"
              name="username"
              placeholder="Username"
              className="pl-3 w-full outline-none bg-transparent dark:text-white text-lg"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email Input */}
          <div className="flex items-center border-2 border-gray-300 dark:border-gray-600 py-3 px-4 rounded-2xl mb-4 hover:border-gray-500 dark:hover:border-gray-400 transition-all duration-300 group">
            <FaEnvelope className="h-5 w-5 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors" />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              className="pl-3 w-full outline-none bg-transparent dark:text-white text-lg"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password Input */}
          <div className="flex items-center border-2 border-gray-300 dark:border-gray-600 py-3 px-4 rounded-2xl mb-4 hover:border-gray-500 dark:hover:border-gray-400 transition-all duration-300 group">
            <FaLock className="h-5 w-5 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="pl-3 w-full outline-none bg-transparent dark:text-white text-lg"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Phone Number Input */}
          <div className="flex items-center border-2 border-gray-300 dark:border-gray-600 py-3 px-4 rounded-2xl mb-4 hover:border-gray-500 dark:hover:border-gray-400 transition-all duration-300 group">
            <FaPhone className="h-5 w-5 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors" />
            <input
              type="tel"
              name="phoneNumber"
              placeholder="Phone Number"
              className="pl-3 w-full outline-none bg-transparent dark:text-white text-lg"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
          </div>

          {/* Profile Image Input - Custom Styled */}
          <div className="mb-4">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 px-1">
              Profile Image (Optional)
            </div>
            <label className="flex items-center gap-2 border-2 border-gray-300 dark:border-gray-600 py-3 px-4 rounded-2xl cursor-pointer hover:border-gray-500 dark:hover:border-gray-400 transition-all duration-300 group">
              <FaImage className="h-5 w-5 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors" />
              <span className="text-gray-500 dark:text-gray-400 text-lg">
                {fileName}
              </span>
              <input
                type="file"
                name="profileImage"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              <span className="ml-auto bg-gray-200 dark:bg-gray-700 px-4 py-1 rounded-lg text-gray-800 dark:text-gray-200 text-sm font-medium">
                Browse
              </span>
            </label>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 text-red-500 mb-4 p-2 bg-red-50 dark:bg-red-900/20 rounded-xl">
              <FaExclamationCircle />
              <p>{error}</p>
            </div>
          )}

          {/* Register Button */}
          <button
            type="submit"
            disabled={loading}
            className="block w-full py-3.5 px-6 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] border-2 border-gray-900 dark:border-white disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Creating Account..." : "Join as Therapist"}
          </button>

          {/* Sign In Link */}
          <p className="text-center text-gray-600 dark:text-gray-400 mt-6">
            Already have an account?{" "}
            <Link
              to="/therapist-signin"
              className="text-gray-900 dark:text-white font-bold hover:underline transition-colors"
            >
              Sign in here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default TherapistPortalRegistration;

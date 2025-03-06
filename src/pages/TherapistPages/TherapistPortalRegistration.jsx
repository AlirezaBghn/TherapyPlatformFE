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
    <div className="min-h-screen flex flex-col md:flex-row bg-white dark:bg-gray-900">
      {/* Left Side Image - Hidden on mobile, shown on md+ screens */}
      <div className="relative overflow-hidden md:flex md:w-1/2 lg:w-3/5 justify-around items-center hidden bg-gray-50 dark:bg-gray-800">
        <div
          className="absolute inset-0 bg-center bg-cover"
          style={{
            backgroundImage:
              "url('https://img.freepik.com/premium-vector/outline-illustration-seated-woman-playing-with-her-cell-phone_642097-648.jpg?w=740')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>

        {/* Optional overlay for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10"></div>
      </div>

      {/* Right Side Form - Full width on mobile, partial on larger screens */}
      <div className="flex flex-1 md:w-1/2 lg:w-2/5 justify-center items-center bg-white dark:bg-gray-900 px-4 sm:px-6 md:px-8 py-8 md:py-0 overflow-auto">
        <div className="w-full max-w-md">
          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-gray-800 w-full p-5 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl md:rounded-3xl shadow-lg sm:shadow-xl md:shadow-2xl border border-gray-100 dark:border-gray-700"
          >
            <h1 className="text-gray-900 dark:text-white font-bold text-xl sm:text-2xl md:text-3xl mb-1 sm:mb-2 text-center">
              Therapist Registration
            </h1>
            <p className="text-xs sm:text-sm md:text-base font-normal text-gray-600 dark:text-gray-300 mb-4 sm:mb-6 text-center">
              Create your therapist account
            </p>

            {/* Full Name Input */}
            <div className="flex items-center border-2 border-gray-300 dark:border-gray-600 py-2 sm:py-2.5 md:py-3 px-3 sm:px-4 rounded-lg sm:rounded-xl md:rounded-2xl mb-3 sm:mb-4 hover:border-gray-500 dark:hover:border-gray-400 transition-all duration-300 group focus-within:border-blue-500 dark:focus-within:border-blue-400">
              <FaUser className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors" />
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                className="pl-2 sm:pl-3 w-full outline-none bg-transparent dark:text-white text-sm sm:text-base md:text-lg"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>

            {/* Username Input */}
            <div className="flex items-center border-2 border-gray-300 dark:border-gray-600 py-2 sm:py-2.5 md:py-3 px-3 sm:px-4 rounded-lg sm:rounded-xl md:rounded-2xl mb-3 sm:mb-4 hover:border-gray-500 dark:hover:border-gray-400 transition-all duration-300 group focus-within:border-blue-500 dark:focus-within:border-blue-400">
              <FaUserTag className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors" />
              <input
                type="text"
                name="username"
                placeholder="Username"
                className="pl-2 sm:pl-3 w-full outline-none bg-transparent dark:text-white text-sm sm:text-base md:text-lg"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            {/* Email Input */}
            <div className="flex items-center border-2 border-gray-300 dark:border-gray-600 py-2 sm:py-2.5 md:py-3 px-3 sm:px-4 rounded-lg sm:rounded-xl md:rounded-2xl mb-3 sm:mb-4 hover:border-gray-500 dark:hover:border-gray-400 transition-all duration-300 group focus-within:border-blue-500 dark:focus-within:border-blue-400">
              <FaEnvelope className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                className="pl-2 sm:pl-3 w-full outline-none bg-transparent dark:text-white text-sm sm:text-base md:text-lg"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Password Input */}
            <div className="flex items-center border-2 border-gray-300 dark:border-gray-600 py-2 sm:py-2.5 md:py-3 px-3 sm:px-4 rounded-lg sm:rounded-xl md:rounded-2xl mb-3 sm:mb-4 hover:border-gray-500 dark:hover:border-gray-400 transition-all duration-300 group focus-within:border-blue-500 dark:focus-within:border-blue-400">
              <FaLock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="pl-2 sm:pl-3 w-full outline-none bg-transparent dark:text-white text-sm sm:text-base md:text-lg"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {/* Phone Number Input */}
            <div className="flex items-center border-2 border-gray-300 dark:border-gray-600 py-2 sm:py-2.5 md:py-3 px-3 sm:px-4 rounded-lg sm:rounded-xl md:rounded-2xl mb-3 sm:mb-4 hover:border-gray-500 dark:hover:border-gray-400 transition-all duration-300 group focus-within:border-blue-500 dark:focus-within:border-blue-400">
              <FaPhone className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors" />
              <input
                type="tel"
                name="phoneNumber"
                placeholder="Phone Number"
                className="pl-2 sm:pl-3 w-full outline-none bg-transparent dark:text-white text-sm sm:text-base md:text-lg"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
            </div>

            {/* Profile Image Input - Custom Styled */}
            <div className="mb-3 sm:mb-4">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 px-1">
                Profile Image (Optional)
              </div>
              <label className="flex items-center border-2 border-gray-300 dark:border-gray-600 py-2 sm:py-2.5 md:py-3 px-3 sm:px-4 rounded-lg sm:rounded-xl md:rounded-2xl cursor-pointer hover:border-gray-500 dark:hover:border-gray-400 transition-all duration-300 group focus-within:border-blue-500 dark:focus-within:border-blue-400">
                <FaImage className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors flex-shrink-0" />
                <span className="pl-2 sm:pl-3 text-gray-500 dark:text-gray-400 text-sm sm:text-base md:text-lg truncate">
                  {fileName}
                </span>
                <input
                  type="file"
                  name="profileImage"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <span className="ml-auto bg-gray-200 dark:bg-gray-700 px-2 sm:px-3 md:px-4 py-1 rounded-md sm:rounded-lg text-gray-800 dark:text-gray-200 text-xs sm:text-sm font-medium flex-shrink-0">
                  Browse
                </span>
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-start sm:items-center gap-1.5 sm:gap-2 text-red-500 mb-3 sm:mb-4 p-2 bg-red-50 dark:bg-red-900/20 rounded-lg sm:rounded-xl text-xs sm:text-sm">
                <FaExclamationCircle className="h-4 w-4 mt-0.5 sm:mt-0 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {/* Register Button */}
            <button
              type="submit"
              disabled={loading}
              className="block w-full py-2.5 sm:py-3 md:py-3.5 px-4 sm:px-6 rounded-lg sm:rounded-xl md:rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold sm:font-bold text-sm sm:text-base md:text-lg shadow-md sm:shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.01] sm:hover:scale-[1.02] border border-gray-900 dark:border-white disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Account..." : "Join as Therapist"}
            </button>

            {/* Sign In Link */}
            <p className="text-center text-gray-600 dark:text-gray-400 mt-4 sm:mt-6 text-xs sm:text-sm md:text-base">
              Already have an account?{" "}
              <Link
                to="/therapist-signin"
                className="text-gray-900 dark:text-white font-semibold sm:font-bold hover:underline transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TherapistPortalRegistration;

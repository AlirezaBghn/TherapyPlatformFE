import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { axiosClient } from "../../services/api";
import { useTherapistAuth } from "../../context/TherapistAuthContext";
import { FaEnvelope, FaLock, FaExclamationCircle } from "react-icons/fa";

const TherapistPortalSignIn = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { setTherapist, setIsTherapistAuthenticated, setTherapistRole } =
    useTherapistAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await axiosClient.post("/therapists/login", formData);
      setTherapist(response.data.therapist);
      setIsTherapistAuthenticated(true);
      setTherapistRole("therapist");
      navigate("/therapist/patients", { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Please try again.");
      console.error("Therapist login error:", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white dark:bg-gray-900">
      {/* Left Side Image - Hidden on mobile, shown on md+ screens */}
      <div className="relative overflow-hidden md:flex md:w-1/2 lg:w-3/5 justify-around items-center hidden bg-gray-50 dark:bg-gray-800">
        {/* Fallback background color in case image fails to load */}
        <div
          className="absolute inset-0 bg-center bg-cover"
          style={{
            backgroundImage:
              "url('https://img.freepik.com/free-vector/hand-drawn-business-woman-drawing-illustration_23-2151188713.jpg?t=st=1741086319~exp=1741089919~hmac=690177e7a02102e04c06b71420ef97f480024fc84cf4059d64b6cfb6a0bb8d97&w=740')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>

        {/* Optional overlay for better text visibility if you add text on the image */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10"></div>
      </div>

      {/* Right Side Form - Full width on mobile, partial on larger screens */}
      <div className="flex flex-1 md:w-1/2 lg:w-2/5 justify-center items-center bg-white dark:bg-gray-900 px-4 sm:px-6 md:px-8 py-10 md:py-0">
        <div className="w-full max-w-md">
          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-gray-800 w-full p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl md:shadow-2xl border border-gray-100 dark:border-gray-700"
          >
            <h1 className="text-gray-900 dark:text-white font-bold text-2xl sm:text-3xl mb-1 text-center">
              Therapist Sign In
            </h1>
            <p className="text-sm sm:text-md font-normal text-gray-600 dark:text-gray-300 mb-4 sm:mb-6 text-center">
              Sign in to continue
            </p>

            {/* Email Input */}
            <div className="flex items-center border-2 border-gray-300 dark:border-gray-600 py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl sm:rounded-2xl mb-3 sm:mb-4 hover:border-gray-500 dark:hover:border-gray-400 transition-all duration-300 group focus-within:border-blue-500 dark:focus-within:border-blue-400">
              <FaEnvelope className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                className="pl-2 sm:pl-3 w-full outline-none bg-transparent dark:text-white text-base sm:text-lg"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Password Input */}
            <div className="flex items-center border-2 border-gray-300 dark:border-gray-600 py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl sm:rounded-2xl mb-4 sm:mb-6 hover:border-gray-500 dark:hover:border-gray-400 transition-all duration-300 group focus-within:border-blue-500 dark:focus-within:border-blue-400">
              <FaLock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="pl-2 sm:pl-3 w-full outline-none bg-transparent dark:text-white text-base sm:text-lg"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-start sm:items-center gap-1.5 sm:gap-2 text-red-500 mb-4 p-2 bg-red-50 dark:bg-red-900/20 rounded-lg sm:rounded-xl text-sm sm:text-base">
                <FaExclamationCircle className="h-4 w-4 sm:h-5 sm:w-5 mt-0.5 sm:mt-0 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {/* Sign In Button */}
            <button
              type="submit"
              className="block w-full py-2.5 sm:py-3.5 px-4 sm:px-6 rounded-xl sm:rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold sm:font-bold text-base sm:text-lg shadow-md sm:shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.01] sm:hover:scale-[1.02] border border-gray-900 dark:border-white"
            >
              Sign In
            </button>

            {/* Sign Up Link */}
            <p className="text-center text-gray-600 dark:text-gray-400 mt-4 sm:mt-6 text-sm sm:text-base">
              Don't have an account?{" "}
              <Link
                to="/therapist-signup"
                className="text-gray-900 dark:text-white font-semibold sm:font-bold hover:underline transition-colors"
              >
                Sign up now
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TherapistPortalSignIn;

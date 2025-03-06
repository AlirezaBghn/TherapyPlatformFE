import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { axiosClient } from "../../services/api.js";
import { useAuth } from "../../context/AuthContext.jsx";
import {
  FaEnvelope,
  FaLock,
  FaExclamationCircle,
  FaChevronRight,
} from "react-icons/fa";

const SignInPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { setUser, setIsAuthenticated, setUserRole } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await axiosClient.post("/users/login", formData);
      setUser(response.data.user);
      setIsAuthenticated(true);
      setUserRole("user");
      navigate("/home", { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Please try again.");
      console.error("Login error:", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white dark:bg-gray-900">
      {/* Left Side Image */}
      <div
        className="relative overflow-hidden md:flex md:w-1/2 justify-around items-center hidden"
        style={{
          backgroundImage:
            "url('https://img.freepik.com/premium-vector/woman-profile-female-beauty-concept-line-drawing-vector-illustration-woman-face-line-art-drawing_1169356-705.jpg?w=740",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>

      {/* Right Side Form */}
      <div className="flex flex-1 md:w-1/2 justify-center items-center bg-white dark:bg-gray-900 px-4 sm:px-6 py-8 md:py-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 w-full max-w-md p-5 sm:p-8 rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl transform transition-all duration-300 border-2 border-gray-100 dark:border-gray-700"
        >
          <h1 className="text-gray-900 dark:text-white font-extrabold text-2xl sm:text-3xl mb-1 sm:mb-2 text-center">
            Welcome Back!
          </h1>
          <p className="text-sm sm:text-md font-normal text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 text-center">
            Sign in to continue your journey
          </p>

          {/* Email Input */}
          <div className="flex items-center border-2 border-gray-300 dark:border-gray-600 py-3 sm:py-4 px-3 sm:px-4 rounded-xl sm:rounded-2xl mb-4 sm:mb-6 hover:border-gray-500 dark:hover:border-gray-400 transition-all duration-300 group">
            <FaEnvelope className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors flex-shrink-0" />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              className="pl-3 w-full outline-none bg-transparent dark:text-white text-base sm:text-lg"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password Input */}
          <div className="flex items-center border-2 border-gray-300 dark:border-gray-600 py-3 sm:py-4 px-3 sm:px-4 rounded-xl sm:rounded-2xl mb-6 sm:mb-8 hover:border-gray-500 dark:hover:border-gray-400 transition-all duration-300 group">
            <FaLock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors flex-shrink-0" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="pl-3 w-full outline-none bg-transparent dark:text-white text-base sm:text-lg"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 text-red-500 mb-6 p-2 sm:p-3 bg-red-50 dark:bg-red-900/20 rounded-lg sm:rounded-xl text-sm sm:text-base">
              <FaExclamationCircle className="flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {/* Sign In Button */}
          <button
            type="submit"
            className="block w-full py-3 sm:py-4 px-4 sm:px-6 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold text-base sm:text-lg shadow-md sm:shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] border-2 border-gray-900 dark:border-white"
          >
            Sign In
          </button>

          {/* Sign Up Link */}
          <p className="text-center text-gray-600 dark:text-gray-400 mt-6 sm:mt-8 text-sm sm:text-base">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-gray-900 dark:text-white font-bold hover:underline transition-colors"
            >
              Sign up now
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignInPage;

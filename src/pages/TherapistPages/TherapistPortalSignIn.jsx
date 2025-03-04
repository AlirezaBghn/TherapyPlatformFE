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
    <div className="h-screen md:flex bg-white dark:bg-gray-900">
      {/* Left Side Image */}
      <div
        className="relative overflow-hidden md:flex w-3/5 justify-around items-center hidden"
        style={{
          backgroundImage:
            "url('https://img.freepik.com/free-vector/hand-drawn-business-woman-drawing-illustration_23-2151188713.jpg?t=st=1741086319~exp=1741089919~hmac=690177e7a02102e04c06b71420ef97f480024fc84cf4059d64b6cfb6a0bb8d97&w=740')",
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
            Therapist Sign In
          </h1>
          <p className="text-md font-normal text-gray-600 dark:text-gray-300 mb-6 text-center">
            Sign in to continue
          </p>

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
          <div className="flex items-center border-2 border-gray-300 dark:border-gray-600 py-3 px-4 rounded-2xl mb-6 hover:border-gray-500 dark:hover:border-gray-400 transition-all duration-300 group">
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

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 text-red-500 mb-4 p-2 bg-red-50 dark:bg-red-900/20 rounded-xl">
              <FaExclamationCircle />
              <p>{error}</p>
            </div>
          )}

          {/* Sign In Button */}
          <button
            type="submit"
            className="block w-full py-3.5 px-6 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] border-2 border-gray-900 dark:border-white"
          >
            Sign In
          </button>

          {/* Sign Up Link */}
          <p className="text-center text-gray-600 dark:text-gray-400 mt-6">
            Don't have an account?{" "}
            <Link
              to="/therapist-signup"
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

export default TherapistPortalSignIn;

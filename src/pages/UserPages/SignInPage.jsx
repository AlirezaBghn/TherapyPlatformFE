import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { axiosClient } from "../../services/api.js";
import { useAuth } from "../../context/AuthContext.jsx";

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
    <div className="h-screen md:flex">
      <div
        className="relative overflow-hidden md:flex w-1/2 justify-around items-center hidden"
        style={{
          backgroundImage:
            "url('https://img.freepik.com/free-photo/melancholic-black-white-shot-forest_181624-1380.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="relative text-center text-white z-10 px-10 mt-[-290px] max-w-[85%]">
          <h1 className="font-bold text-5xl mb-4">Welcome Back</h1>
          <p className="text-xl font-light">
            Reconnect with expert therapists and continue your journey.
          </p>
        </div>
      </div>

      <div className="flex md:w-1/2 justify-center items-center bg-white">
        <form
          onSubmit={handleSubmit}
          className="bg-white w-96 p-8 rounded-lg shadow-lg"
        >
          <h1 className="text-gray-900 font-bold text-3xl mb-2 text-center">
            Welcome Back!
          </h1>
          <p className="text-md font-normal text-gray-600 mb-6 text-center">
            Sign in to continue
          </p>

          <div className="flex items-center border-2 border-gray-300 py-3 px-4 rounded-2xl mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M2.94 6.94a1 1 0 011.414 0L10 12.586l5.646-5.646a1 1 0 011.414 1.414L10 15.414 2.94 8.354a1 1 0 010-1.414z" />
            </svg>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              className="pl-3 w-full outline-none bg-white text-lg"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex items-center border-2 border-gray-300 py-3 px-4 rounded-2xl mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" />
            </svg>
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="pl-3 w-full outline-none bg-white text-lg"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          <button
            type="submit"
            className="block w-full border-2 border-black mt-6 py-3 rounded-2xl text-black font-semibold text-lg hover:bg-gray-100 transition"
          >
            Sign In
          </button>

          <p className="text-center text-gray-600 mt-4">
            Don't have an account?{" "}
            <Link to="/signup" className="text-black font-bold hover:underline">
              Sign up now
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignInPage;

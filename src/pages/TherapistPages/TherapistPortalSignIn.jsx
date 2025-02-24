import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { axiosClient } from "../../services/api";
import { useTherapistAuth } from "../../context/TherapistAuthContext";

const TherapistPortalSignIn = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { setTherapist } = useTherapistAuth();

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
      // After sign in, redirect to Patients page.
      navigate("/therapist/patients", { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Please try again.");
      console.error("Therapist login error:", err);
    }
  };

  return (
    <div className="h-screen md:flex">
      <div
        className="relative overflow-hidden md:flex w-1/2 justify-around items-center hidden"
        style={{
          backgroundImage: "url('https://example.com/therapist-signin.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="relative text-center text-white z-10 px-10 mt-[-290px] max-w-[85%]">
          <h1 className="font-bold text-5xl mb-4">Welcome Back, Therapist</h1>
          <p className="text-xl font-light">
            Sign in to manage your practice and connect with patients.
          </p>
        </div>
      </div>

      <div className="flex md:w-1/2 justify-center items-center bg-white">
        <form
          onSubmit={handleSubmit}
          className="bg-white w-96 p-8 rounded-lg shadow-lg"
        >
          <h1 className="text-gray-900 font-bold text-3xl mb-2 text-center">
            Therapist Sign In
          </h1>
          <p className="text-md font-normal text-gray-600 mb-6 text-center">
            Sign in to continue
          </p>

          <div className="flex items-center border-2 border-gray-300 py-3 px-4 rounded-2xl mb-4">
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
            <Link
              to="/therapist-signup"
              className="text-black font-bold hover:underline"
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

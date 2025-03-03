import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { axiosClient } from "../../services/api.js";
import { useAuth } from "../../context/AuthContext.jsx";

const RegistrationPage = () => {
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
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, profileImage: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate form inputs
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

      // Create FormData object to send multipart/form-data
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.fullName);
      formDataToSend.append("username", formData.username);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("phone", formData.phoneNumber);

      // Only append image if one is selected
      if (formData.profileImage) {
        formDataToSend.append("image", formData.profileImage);
      }

      console.log("Submitting registration form...");

      // Send registration request to the correct endpoint
      const response = await axiosClient.post(
        "/users/register",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUser(response.data.user); // Ensure user data is set here
      console.log(response.data.user);
      navigate("/questions", { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
      console.error("Registration error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen md:flex">
      <div
        className="relative overflow-hidden md:flex w-1/2 justify-around items-center hidden"
        style={{
          backgroundImage:
            "url('https://img.freepik.com/free-photo/greyscale-shot-wooden-dog-near-sea-with-foggy-background_181624-12858.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="relative text-center text-white z-10 px-10 mt-[-290px] max-w-[80%]">
          <h1 className="font-bold text-5xl mb-4">Join Us Today</h1>
          <p className="text-xl font-light">
            Take control of your mental well-being.
          </p>
          <p className="text-xl font-light mt-2">
            Sign up now and connect with experienced therapists.
          </p>
        </div>
      </div>

      <div className="flex md:w-1/2 justify-center items-center bg-white">
        <form
          onSubmit={handleSubmit}
          className="bg-white w-[600px] min-h-[400px] p-10 rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.3)]"
        >
          <h1 className="text-gray-900 font-bold text-4xl mb-4 text-center">
            Hello Again!
          </h1>
          <p className="text-xl font-normal text-gray-600 mb-8 text-center">
            Create an account to get started
          </p>

          <div className="flex items-center border-2 border-gray-300 py-4 px-5 rounded-2xl mb-6">
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              className="pl-4 w-full outline-none bg-white text-xl"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex items-center border-2 border-gray-300 py-4 px-5 rounded-2xl mb-6">
            <input
              type="text"
              name="username"
              placeholder="Username"
              className="pl-4 w-full outline-none bg-white text-xl"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex items-center border-2 border-gray-300 py-4 px-5 rounded-2xl mb-6">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              className="pl-4 w-full outline-none bg-white text-xl"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex items-center border-2 border-gray-300 py-4 px-5 rounded-2xl mb-6">
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="pl-4 w-full outline-none bg-white text-xl"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex items-center border-2 border-gray-300 py-4 px-5 rounded-2xl mb-6">
            <input
              type="tel"
              name="phoneNumber"
              placeholder="Phone Number"
              className="pl-4 w-full outline-none bg-white text-xl"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex items-center border-2 border-gray-300 py-4 px-5 rounded-2xl mb-8">
            <input
              type="file"
              name="profileImage"
              accept="image/*"
              className="w-full text-xl"
              onChange={handleFileChange}
            />
          </div>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-10 py-4 text-xl font-semibold rounded text-gray-900 border border-gray-900 hover:text-gray-700 hover:border-gray-700 transition duration-200"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </div>
          <p className="text-center text-gray-600 mt-6 text-xl">
            Already have an account?{" "}
            <Link to="/signin" className="text-black font-bold hover:underline">
              Sign in here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegistrationPage;

import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NotFound = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth(); // Get auth state from context

  const handleRedirect = () => {
    if (isAuthenticated) {
      navigate("/home"); // Redirect to /home if authenticated
    } else {
      navigate("/"); // Redirect to / if not authenticated
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-2xl mb-8">Page Not Found!</p>
      <button
        onClick={handleRedirect}
        className="px-6 py-3 bg-[#262626] text-white rounded-full hover:bg-[#4f4f4f] transition duration-300"
      >
        Return to Home
      </button>
    </div>
  );
};

export default NotFound;

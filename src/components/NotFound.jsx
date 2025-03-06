import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-2xl mb-8">Page Not Found</p>
      <Link
        to="/"
        className="px-6 py-3 bg-[#262626] text-white rounded-lg hover:bg-[#4f4f4f] transition duration-300"
      >
        Go to Home
      </Link>
    </div>
  );
};

export default NotFound;

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DarkModeToggle from "./DarkModeToggle";
import { useAuth } from "../context/AuthContext";
import { axiosClient } from "../services/api";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const toggleDropdown = () => setIsOpen(!isOpen);

  const signOut = async () => {
    try {
      await axiosClient.post("/users/logout");
      setUser(null);
      navigate("/signin", { replace: true });
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-900 text-black dark:text-white py-4 border-b border-gray-300 dark:border-gray-700 fixed top-0 left-0 w-full z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="text-2xl font-light tracking-widest">
          Therapy
        </Link>
        <div className="flex items-center space-x-6">
          <Link
            to="/journals"
            className="hover:text-gray-500 text-sm uppercase"
          >
            Journal
          </Link>
          <Link
            to="/find-therapist"
            className="hover:text-gray-500 text-sm uppercase"
          >
            Therapist
          </Link>
          <Link to="/tips" className="hover:text-gray-500 text-sm uppercase">
            Advice
          </Link>
          <Link to="/forum" className="hover:text-gray-500 text-sm uppercase">
            Forum
          </Link>
          <DarkModeToggle />
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center space-x-3 focus:outline-none"
            >
              <img
                src={user?.image}
                alt="User"
                className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-600"
              />
              <span className="text-sm font-semibold">
                {user?.name || "Guest"}
              </span>
            </button>
            {isOpen && (
              <div className="absolute right-0 mt-3 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-lg py-2">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Profile
                </Link>
                <button
                  onClick={signOut}
                  className="block w-full text-left px-4 py-2 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

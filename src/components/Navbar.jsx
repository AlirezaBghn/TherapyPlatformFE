import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import DarkModeToggle from "./DarkModeToggle";
import { useAuth } from "../context/AuthContext";
import { axiosClient } from "../services/api";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, setUser, setUserRole, setIsAuthenticated } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef(null); // Ref for the dropdown container
  const location = useLocation();

  const toggleDropdown = () => setIsOpen(!isOpen);

  const closeDropdown = () => setIsOpen(false);

  const signOut = async () => {
    try {
      await axiosClient.post("/users/logout");
      setUser(null);
      setUserRole(null);
      setIsAuthenticated(false);
      navigate("/signin", { replace: true });
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const handleProfileClick = () => {
    closeDropdown(); // Close dropdown when Profile is clicked
    navigate("/profile"); // Navigate to the profile page
  };

  const handleMessagesClick = () => {
    closeDropdown(); // Close dropdown when Messages is clicked
    navigate("/messages"); // Navigate to the messages page
  };

  const handleSignOutClick = () => {
    closeDropdown(); // Close dropdown when Sign Out is clicked
    signOut(); // Perform sign-out logic
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeDropdown(); // Close dropdown if click is outside
      }
    };

    // Attach the event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up the event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white dark:bg-gray-800 text-black dark:text-white py-4 border-b border-gray-300 dark:border-gray-700 fixed top-0 left-0 w-full z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link
          to="/journals"
          className="text-2xl font-light tracking-widest hover:text-gray-700 dark:hover:text-gray-300 transition duration-300"
        >
          Therapy
        </Link>
        <div className="flex items-center space-x-6">
          <Link
            to="/journals"
            className={`hover:text-gray-500 text-sm uppercase transition duration-300 ${
              isActive("/journals")
                ? "text-blue-500 dark:text-blue-400 font-semibold"
                : ""
            }`}
          >
            Journals
          </Link>
          <Link
            to="/find-therapist"
            className={`hover:text-gray-500 text-sm uppercase transition duration-300 ${
              isActive("/find-therapist")
                ? "text-blue-500 dark:text-blue-400 font-semibold"
                : ""
            }`}
          >
            Therapists
          </Link>
          <Link
            to="/tips"
            className={`hover:text-gray-500 text-sm uppercase transition duration-300 ${
              isActive("/tips")
                ? "text-blue-500 dark:text-blue-400 font-semibold"
                : ""
            }`}
          >
            Advice
          </Link>
          <Link
            to="/forum"
            className={`hover:text-gray-500 text-sm uppercase transition duration-300 ${
              isActive("/forum")
                ? "text-blue-500 dark:text-blue-400 font-semibold"
                : ""
            }`}
          >
            Forum
          </Link>
          <DarkModeToggle />
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={toggleDropdown}
              className="flex items-center space-x-3 focus:outline-none"
            >
              <img
                src={user?.image}
                alt="User"
                className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-600 shadow-sm"
              />
              <span className="text-sm font-semibold">
                {user?.name || "Guest"}
              </span>
            </button>
            {isOpen && (
              <div className="absolute right-0 mt-3 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-lg py-2 z-50 transition-transform">
                <button
                  onClick={handleProfileClick}
                  className="block w-full text-left px-4 py-2 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-300"
                >
                  Profile
                </button>
                <button
                  onClick={handleMessagesClick}
                  className="block w-full text-left px-4 py-2 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-300"
                >
                  Messages
                </button>
                <button
                  onClick={handleSignOutClick}
                  className="block w-full text-left px-4 py-2 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-300"
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

import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import DarkModeToggle from "./DarkModeToggle";
import { useAuth } from "../context/AuthContext";
import { axiosClient } from "../services/api";
import { toast } from "react-hot-toast";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    user,
    setUser,
    setUserRole,
    setIsAuthenticated,
    setQuestionsSubmitted,
  } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const location = useLocation();

  const toggleDropdown = () => setIsOpen(!isOpen);
  const closeDropdown = () => setIsOpen(false);

  const signOut = async () => {
    try {
      await axiosClient.post("/users/logout");
      setUser(null);
      setUserRole(null);
      setIsAuthenticated(false);
      setQuestionsSubmitted(false);
      navigate("/signin", { replace: true });
    } catch (error) {
      console.error("Sign out error:", error);
      throw error;
    }
  };

  const handleDashboardClick = () => {
    closeDropdown();
    navigate("/dashboard");
  };

  const handleProfileClick = () => {
    closeDropdown();
    navigate("/profile");
  };

  const handleMessagesClick = () => {
    closeDropdown();
    navigate("/messages");
  };

  const handleSignOutClick = async () => {
    closeDropdown();
    await toast.promise(signOut(), {
      loading: "Signing out...",
      success: "Signed out successfully!",
      error: "Sign out failed",
    });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeDropdown();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-neutral-800 dark:bg-gray-800 text-white dark:text-white py-6 fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link
          to="/home"
          className="text-4xl hover:text-gray-500 transition duration-300"
        >
          Therapy
        </Link>
        <div className="flex items-center space-x-6">
          <Link
            to="/home"
            className={`hover:text-gray-500 transition duration-300 ${
              isActive("/home") ? "font-bold" : ""
            }`}
          >
            Home
          </Link>
          <Link
            to="/journals"
            className={`hover:text-gray-500 transition duration-300 ${
              isActive("/journals") ? "font-bold" : ""
            }`}
          >
            Journals
          </Link>
          <Link
            to="/find-therapist"
            className={`hover:text-gray-500 transition duration-300 ${
              isActive("/find-therapist") ? "font-bold" : ""
            }`}
          >
            Therapists
          </Link>
          <Link
            to="/tips"
            className={`hover:text-gray-500 transition duration-300 ${
              isActive("/tips") ? "font-bold" : ""
            }`}
          >
            Advice
          </Link>
          {/* Updated DarkModeToggle with onToggle toast */}
          <DarkModeToggle
            onToggle={() => toast("Theme changed!", { icon: "🌙" })}
          />
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={toggleDropdown}
              className="flex items-center space-x-3 focus:outline-none"
            >
              <img
                src={user?.image}
                alt="User"
                className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-600 shadow-sm object-cover"
              />
              <span className="text-sm font-semibold">
                {user?.name || "Guest"}
              </span>
            </button>
            {isOpen && (
              <div className="absolute right-0 mt-3 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-lg py-2 z-50 transition-transform">
                <button
                  onClick={handleDashboardClick}
                  className="block w-full text-left px-4 py-2 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-300"
                >
                  Dashboard
                </button>
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

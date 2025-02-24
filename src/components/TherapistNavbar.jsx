import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import DarkModeToggle from "../components/DarkModeToggle";
import { useTherapistAuth } from "../context/TherapistAuthContext";
import { axiosClient } from "../services/api";

const TherapistNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { therapist, setTherapist } = useTherapistAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const location = useLocation();

  const toggleDropdown = () => setIsOpen(!isOpen);
  const closeDropdown = () => setIsOpen(false);

  const signOut = async () => {
    try {
      await axiosClient.post("/therapists/logout");
      setTherapist(null);
      navigate("/therapist-signin", { replace: true });
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const handleProfileClick = () => {
    closeDropdown();
    navigate("/therapist/profile");
  };

  const handleSignOutClick = () => {
    closeDropdown();
    signOut();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeDropdown();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-white dark:bg-gray-800 text-black dark:text-white py-4 border-b border-gray-300 dark:border-gray-700 fixed top-0 left-0 w-full z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Brand link directs to Patients page */}
        <Link
          to="/therapist/patients"
          className="text-2xl font-light tracking-widest hover:text-gray-700 dark:hover:text-gray-300 transition duration-300"
        >
          Therapy Portal
        </Link>
        <div className="flex items-center space-x-6">
          {/* Only Patients link in the main nav */}
          <Link
            to="/therapist/patients"
            className="hover:text-gray-500 text-sm uppercase transition duration-300"
          >
            Patients
          </Link>
          <DarkModeToggle />
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={toggleDropdown}
              className="flex items-center space-x-3 focus:outline-none"
            >
              <img
                src={therapist?.image || "https://via.placeholder.com/40"}
                alt="Therapist"
                className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-600 shadow-sm"
              />
              <span className="text-sm font-semibold">
                {therapist?.name || "Therapist"}
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

export default TherapistNavbar;

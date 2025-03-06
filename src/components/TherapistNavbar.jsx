import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import DarkModeToggle from "../components/DarkModeToggle";
import { useTherapistAuth } from "../context/TherapistAuthContext";
import { axiosClient } from "../services/api";

const TherapistNavbar = () => {
  const [isOpen, setIsOpen] = useState(false); // for user dropdown
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // for mobile menu

  const {
    therapist,
    setTherapist,
    setTherapistRole,
    setIsTherapistAuthenticated,
    setQuestionsSubmitted,
  } = useTherapistAuth();

  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const location = useLocation();

  const toggleDropdown = () => setIsOpen(!isOpen);
  const closeDropdown = () => setIsOpen(false);

  // Toggle mobile menu (hamburger remains the same)
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  const signOut = async () => {
    try {
      await axiosClient.post("/therapists/logout");
      setTherapist(null);
      setTherapistRole(null);
      setIsTherapistAuthenticated(false);
      setQuestionsSubmitted(false);
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

  // Navigation handler for mobile menu
  const handleNavigate = (path) => {
    closeMobileMenu();
    navigate(path);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeDropdown();
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        closeMobileMenu();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu when changing pages
  useEffect(() => {
    closeMobileMenu();
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-neutral-800 dark:bg-gray-800 text-white py-4 sm:py-6 fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center">
        {/* Left side: Hamburger (mobile) and Brand */}
        <div className="flex items-center">
          {/* Hamburger Menu (visible on mobile) */}
          <button
            className="lg:hidden text-white focus:outline-none mr-4"
            onClick={toggleMobileMenu}
            aria-label="Menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          {/* Brand/Logo - Hidden on small screens */}
          <Link
            to="/therapist/patients"
            className="hidden sm:block text-3xl lg:text-4xl font-bold hover:text-gray-300 transition duration-300"
          >
            TheraSync
          </Link>
        </div>

        {/* Right side: Desktop nav and user dropdown */}
        <div className="flex items-center">
          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center mr-6">
            <Link
              to="/therapist/patients"
              className={`hover:text-gray-300 transition duration-300 mr-6 ${
                isActive("/therapist/patients") ? "font-bold" : ""
              }`}
            >
              Patients
            </Link>
          </div>
          {/* DarkMode Toggle & User Profile Dropdown */}
          <div className="flex items-center">
            <DarkModeToggle />
            <div className="relative ml-4" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className="flex items-center focus:outline-none"
                aria-label="User menu"
              >
                {therapist?.image && (
                  <img
                    src={therapist.image}
                    alt="Therapist"
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-gray-300 dark:border-gray-600 shadow-sm object-cover"
                  />
                )}
                <span className="hidden lg:inline-block ml-3 text-sm font-semibold">
                  {therapist?.name || "Therapist"}
                </span>
              </button>
              {isOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-lg py-2 z-50">
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
      </div>

      {/* Mobile Menu Dropdown (Overlay fixed below nav) */}
      {mobileMenuOpen && (
        <div ref={mobileMenuRef}>
          <div className="px-6 py-3">
            <button
              onClick={() => handleNavigate("/therapist/patients")}
              className={`block w-full text-left py-2 ${
                isActive("/therapist/patients") ? "font-bold" : ""
              }`}
            >
              Patients
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default TherapistNavbar;

import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import DarkModeToggle from "./DarkModeToggle";
import { useAuth } from "../context/AuthContext";
import { axiosClient } from "../services/api";
import { toast } from "react-hot-toast";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false); // for user dropdown
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // for mobile menu

  const {
    user,
    setUser,
    setUserRole,
    setIsAuthenticated,
    setQuestionsSubmitted,
  } = useAuth();

  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const location = useLocation();

  const toggleDropdown = () => setIsOpen(!isOpen);
  const closeDropdown = () => setIsOpen(false);

  // Always toggle mobile menu using the same icon (hamburger)
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMobileMenu = () => setMobileMenuOpen(false);

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

  // Navigation handler for mobile menu
  const handleNavigate = (path) => {
    closeMobileMenu();
    navigate(path);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close dropdown if click is outside
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeDropdown();
      }
      // Close mobile menu if click is outside
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
    <nav className="bg-neutral-800 dark:bg-gray-800 text-white dark:text-white py-4 sm:py-6 fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center">
        {/* Left side: Logo and mobile hamburger */}
        <div className="flex items-center">
          {/* Hamburger Menu (mobile only) */}
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

          {/* Brand/Logo - Hidden on smallest screens, visible from sm breakpoint */}
          <div className="h-12 w-12 mr-2">
            <img
              src="../public/assets/TheraSyncLogo2.png"
              alt="TheraSync Logo"
            />
          </div>
          <Link
            to="/home"
            className="hidden font-[700] sm:block text-2xl sm:text-3xl lg:text-4xl hover:text-gray-300 transition duration-300"
          >
            TheraSync
          </Link>
        </div>

        {/* Right side: Navigation Links and User Profile */}
        <div className="flex items-center">
          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center mr-6">
            <Link
              to="/home"
              className={`hover:text-gray-300 transition duration-300 mr-6 ${
                isActive("/home") ? "font-bold" : ""
              }`}
            >
              Home
            </Link>
            <Link
              to="/journals"
              className={`hover:text-gray-300 transition duration-300 mr-6 ${
                isActive("/journals") ? "font-bold" : ""
              }`}
            >
              Journals
            </Link>
            <Link
              to="/find-therapist"
              className={`hover:text-gray-300 transition duration-300 mr-6 ${
                isActive("/find-therapist") ? "font-bold" : ""
              }`}
            >
              Therapists
            </Link>
            <Link
              to="/tips"
              className={`hover:text-gray-300 transition duration-300 ${
                isActive("/tips") ? "font-bold" : ""
              }`}
            >
              Advice
            </Link>
          </div>

          {/* DarkMode Toggle & User Profile */}
          <div className="flex items-center">
            <DarkModeToggle
              onToggle={() => toast("Theme changed!", { icon: "🌙" })}
            />
            <div className="relative ml-4" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className="flex items-center focus:outline-none"
                aria-label="User menu"
              >
                <img
                  src={user?.image}
                  alt="User"
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-gray-300 dark:border-gray-600 shadow-sm object-cover"
                />
                {/* Username visible only on desktop */}
                <span className="hidden lg:inline-block ml-3 text-sm font-semibold">
                  {user?.name || "Guest"}
                </span>
              </button>
              {isOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-lg py-2 z-50">
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
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="lg:hidden w-full bg-neutral-800 dark:bg-gray-800 mt-4 py-2"
        >
          <div className="px-6 py-3">
            <button
              onClick={() => handleNavigate("/home")}
              className={`block w-full text-left py-2 ${
                isActive("/home") ? "font-bold" : ""
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavigate("/journals")}
              className={`block w-full text-left py-2 ${
                isActive("/journals") ? "font-bold" : ""
              }`}
            >
              Journals
            </button>
            <button
              onClick={() => handleNavigate("/find-therapist")}
              className={`block w-full text-left py-2 ${
                isActive("/find-therapist") ? "font-bold" : ""
              }`}
            >
              Therapists
            </button>
            <button
              onClick={() => handleNavigate("/tips")}
              className={`block w-full text-left py-2 ${
                isActive("/tips") ? "font-bold" : ""
              }`}
            >
              Advice
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

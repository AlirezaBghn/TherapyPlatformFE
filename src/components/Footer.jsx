import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 text-black dark:text-white py-6 border-t border-gray-300 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
        <div className="flex space-x-8 text-sm uppercase mb-4">
          <Link to="/about" className="hover:text-gray-500">
            About
          </Link>
          <Link to="/stockists" className="hover:text-gray-500">
            Stockists
          </Link>
          <Link to="/contact" className="hover:text-gray-500">
            Contact
          </Link>
          <Link to="/stay-in-touch" className="hover:text-gray-500">
            Stay in Touch
          </Link>
        </div>
        <p className="text-xs">&copy; 2025 Therapy. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;

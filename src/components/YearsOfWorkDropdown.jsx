import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const YearsOfWorkDropdown = ({ filters, handleFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const options = [
    { value: "", label: "Filter by Years of Work" },
    { value: "1", label: "1+ years" },
    { value: "5", label: "5+ years" },
    { value: "10", label: "10+ years" },
    { value: "15", label: "15+ years" },
  ];

  const getSelectedLabel = () => {
    const selected = options.find(
      (option) => option.value === filters.yearsOfWork
    );
    return selected ? selected.label : "Filter by Years of Work";
  };

  const handleOptionClick = (value) => {
    handleFilterChange({ target: { name: "yearsOfWork", value } });
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full sm:w-64" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-2.5 text-base font-medium border border-gray-300 rounded-xl bg-white text-black dark:bg-gray-700 dark:border-gray-600 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
      >
        <span className="truncate">{getSelectedLabel()}</span>
        <ChevronDown
          className={`w-5 h-5 ml-2 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 shadow-lg rounded-md">
          <ul className="py-1 max-h-60 overflow-auto">
            {options.map((option) => (
              <li key={option.value}>
                <button
                  type="button"
                  onClick={() => handleOptionClick(option.value)}
                  className={`flex w-full px-4 py-2 text-left ${
                    option.value === filters.yearsOfWork
                      ? "bg-gray-100 dark:bg-gray-700"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  } text-black dark:text-white`}
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default YearsOfWorkDropdown;

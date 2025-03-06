import React, { useContext, useState, useEffect } from "react";
import { axiosClient } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { AdviceContext } from "../../context/AdviceContext";
import { useFavoritesShow } from "../../context/FavoritesShowContext";
import DOMPurify from "dompurify";
import { Link } from "react-router-dom";
import { MessagesSquare, Star, UserRoundPen } from "lucide-react";

const UserDashboard = () => {
  const { user } = useAuth();
  const [diagnosis, setDiagnosis] = useState(null);
  const { advice } = useContext(AdviceContext);
  const [displayedAdvice, setDisplayedAdvice] = useState("");
  const { setShowFavoritesOnly, showFavoritesOnly } = useFavoritesShow();

  useEffect(() => {
    const fetchDiagnosis = async () => {
      try {
        const res = await axiosClient.get(`/diagnosis/${user._id}`, {
          withCredentials: true,
        });
        setDiagnosis(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchDiagnosis();
  }, [user._id]);

  useEffect(() => {
    if (advice) {
      const cleanAdvice = advice?.trim(); // Clean up the advice
      const sanitizedAdvice = DOMPurify.sanitize(cleanAdvice); // Sanitize the HTML
      setDisplayedAdvice(sanitizedAdvice); // Set the sanitized HTML
    }
  }, [advice]);

  const renderList = (items) => {
    return items && items.length > 0 ? items.join(", ") : "-";
  };

  const extractConclusion = (advice) => {
    const conclusionStart = advice.indexOf("Conclusion:");
    if (conclusionStart !== -1) {
      return advice.substring(conclusionStart + "Conclusion:".length).trim();
    }
    return "No conclusion available.";
  };

  const conclusion = extractConclusion(displayedAdvice);

  if (!diagnosis) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 mt-20 sm:mt-24">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 dark:text-white">
        {user.name}'s Dashboard
      </h1>

      {/* Navigation Buttons - Stack on mobile, row on desktop */}
      <div className="flex flex-col sm:flex-row gap-3 sm:space-x-4 sm:gap-0 w-full mb-6 sm:mb-8">
        <button className="w-full px-3 sm:px-4 py-2 text-base sm:text-lg font-medium sm:font-semibold rounded bg-neutral-900 dark:bg-gray-200 text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-300 transition duration-200">
          <Link
            to={"/profile"}
            className="flex items-center justify-center gap-2 sm:gap-3"
          >
            <UserRoundPen size={20} className="sm:size-6" /> Profile
          </Link>
        </button>
        <button className="w-full px-3 sm:px-4 py-2 text-base sm:text-lg font-medium sm:font-semibold rounded bg-neutral-900 dark:bg-gray-200 text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-300 transition duration-200">
          <Link
            to={"/messages"}
            className="flex items-center justify-center gap-2 sm:gap-3"
          >
            <MessagesSquare size={20} className="sm:size-6" /> Messages
          </Link>
        </button>
        <Link
          to="/find-therapist"
          state={{ showFavoritesOnly: true }}
          className="w-full px-3 sm:px-4 py-2 text-base sm:text-lg font-medium sm:font-semibold rounded bg-neutral-900 dark:bg-gray-200 text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-300 transition duration-200"
        >
          <div className="flex items-center justify-center gap-2 sm:gap-3">
            <Star size={20} className="sm:size-6" /> Therapists
          </div>
        </Link>
      </div>

      {/* Analysis Cards */}
      <div className="space-y-6 sm:space-y-8">
        {/* Initial Diagnosis Card */}
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm">
          <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 dark:text-white">
            Initial Diagnosis
          </h2>
          <div className="space-y-2 sm:space-y-3">
            <p className="text-sm sm:text-base break-words dark:text-gray-200">
              <span className="font-semibold">Diagnosis:</span>{" "}
              {renderList(diagnosis.initialDiagnosis?.diagnosis)}
            </p>
            <p className="text-sm sm:text-base break-words dark:text-gray-200">
              <span className="font-semibold">Emotions:</span>{" "}
              {renderList(diagnosis.initialDiagnosis?.emotions)}
            </p>
            <p className="text-sm sm:text-base break-words dark:text-gray-200">
              <span className="font-semibold">Therapist Specialties:</span>{" "}
              {renderList(diagnosis.initialDiagnosis?.therapist_specialties)}
            </p>
          </div>
        </div>

        {/* Journal Analysis Card */}
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm">
          <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 dark:text-white">
            Journal Analysis
          </h2>
          <div className="space-y-2 sm:space-y-3">
            <p className="text-sm sm:text-base break-words dark:text-gray-200">
              <span className="font-semibold">Diagnosis:</span>{" "}
              {renderList(diagnosis.journalAnalysis?.diagnosis)}
            </p>
            <p className="text-sm sm:text-base break-words dark:text-gray-200">
              <span className="font-semibold">Emotions:</span>{" "}
              {renderList(diagnosis.journalAnalysis?.emotions)}
            </p>
            <p className="text-sm sm:text-base break-words dark:text-gray-200">
              <span className="font-semibold">Therapist Specialties:</span>{" "}
              {renderList(diagnosis.journalAnalysis?.therapist_specialties)}
            </p>
          </div>
        </div>

        {/* Advice Conclusion Card */}
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm">
          <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 dark:text-white">
            Advice Conclusion
          </h2>
          <div
            className="prose prose-sm sm:prose max-w-none dark:prose-invert prose-headings:text-lg sm:prose-headings:text-xl prose-p:text-sm sm:prose-p:text-base"
            dangerouslySetInnerHTML={{ __html: conclusion }}
          />
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;

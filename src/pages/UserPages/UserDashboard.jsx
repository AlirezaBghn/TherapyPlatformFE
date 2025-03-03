import React, { useContext, useState, useEffect } from "react";
import { axiosClient } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { AdviceContext } from "../../context/AdviceContext";
import DOMPurify from "dompurify";
import { Link } from "react-router-dom";
import { MessagesSquare, Star, UserRoundPen } from "lucide-react";

const UserDashboard = () => {
  const { user } = useAuth();
  const [diagnosis, setDiagnosis] = useState(null);
  const { advice } = useContext(AdviceContext);
  const [displayedAdvice, setDisplayedAdvice] = useState("");

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
    <div className="container mx-auto px-6 py-12 mt-24">
      <h1 className="text-3xl font-bold mb-8">{user.name}'s Dashboard</h1>
      <div className="flex flex-row space-x-4 w-full mb-8">
        <button className="w-full px-4 py-2 text-lg font-semibold rounded bg-neutral-900 dark:bg-gray-200 text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-300 transition duration-200">
          <Link
            to={"/profile"}
            className="flex items-center justify-center gap-3"
          >
            Profile <UserRoundPen size={24} />
          </Link>
        </button>
        <button className="w-full px-4 py-2 text-lg font-semibold rounded bg-neutral-900 dark:bg-gray-200 text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-300 transition duration-200">
          <Link
            to={"/messages"}
            className="flex items-center justify-center gap-3"
          >
            Messages <MessagesSquare size={24} />
          </Link>
        </button>
        <button className="w-full px-4 py-2 text-lg font-semibold rounded bg-neutral-900 dark:bg-gray-200 text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-300 transition duration-200">
          <Link
            to={"/find-therapist"}
            className="flex items-center justify-center gap-3"
          >
            Therapists <Star size={24} />
          </Link>
        </button>
      </div>
      <div className="space-y-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">Initial Diagnosis</h2>
          <p>
            <strong>Diagnosis:</strong>{" "}
            {renderList(diagnosis.initialDiagnosis?.diagnosis)}
          </p>
          <p>
            <strong>Emotions:</strong>{" "}
            {renderList(diagnosis.initialDiagnosis?.emotions)}
          </p>
          <p>
            <strong>Therapist Specialties:</strong>{" "}
            {renderList(diagnosis.initialDiagnosis?.therapist_specialties)}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">Journal Analysis</h2>
          <p>
            <strong>Diagnosis:</strong>{" "}
            {renderList(diagnosis.journalAnalysis?.diagnosis)}
          </p>
          <p>
            <strong>Emotions:</strong>{" "}
            {renderList(diagnosis.journalAnalysis?.emotions)}
          </p>
          <p>
            <strong>Therapist Specialties:</strong>{" "}
            {renderList(diagnosis.journalAnalysis?.therapist_specialties)}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">Advice Conclusion</h2>
          <div dangerouslySetInnerHTML={{ __html: conclusion }} />
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;

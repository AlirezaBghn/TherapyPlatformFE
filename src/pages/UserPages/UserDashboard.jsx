import { axiosClient } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";

const UserDashboard = () => {
  const { user } = useAuth();
  const [diagnosis, setDiagnosis] = useState(null);

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

  if (!diagnosis) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-6 py-12 mt-24">
      <h1 className="text-3xl font-bold mb-8">User Dashboard</h1>
      <div className="space-y-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">Initial Diagnosis</h2>
          <p>
            <strong>Diagnosis:</strong>{" "}
            {diagnosis.initialDiagnosis.diagnosis.join(", ")}
          </p>
          <p>
            <strong>Emotions:</strong>{" "}
            {diagnosis.initialDiagnosis.emotions.join(", ")}
          </p>
          <p>
            <strong>Therapist Specialties:</strong>{" "}
            {diagnosis.initialDiagnosis.therapist_specialties.join(", ")}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">Journal Analysis</h2>
          <p>
            <strong>Diagnosis:</strong>{" "}
            {diagnosis.journalAnalysis.diagnosis.join(", ")}
          </p>
          <p>
            <strong>Emotions:</strong>{" "}
            {diagnosis.journalAnalysis.emotions.join(", ")}
          </p>
          <p>
            <strong>Therapist Specialties:</strong>{" "}
            {diagnosis.journalAnalysis.therapist_specialties.join(", ")}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">Messages</h2>
          {/* Add logic to display messages */}
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">Favorited Therapists</h2>
          {/* Add logic to display favorited therapists */}
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">Advice Summary</h2>
          <p>{diagnosis.adviceSummary}</p>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;

import { useState, useEffect } from "react";
import { axiosClient } from "../../services/api";
import { useTherapistAuth } from "../../context/TherapistAuthContext";
import Chat from "../../components/Chat";
import SkeletonLoader from "../../components/loadings/SkeletonLoader";
import { MessagesSquare, UserRound } from "lucide-react";
import { Link } from "react-router-dom";

const TherapistPortalPatients = () => {
  const { therapist } = useTherapistAuth();
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [diagnosis, setDiagnosis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDiagnosisModalOpen, setIsDiagnosisModalOpen] = useState(false); // State to control modal visibility

  useEffect(() => {
    const fetchPatients = async () => {
      if (!therapist || !therapist._id) {
        return;
      }

      try {
        // Fetch chatters where the therapist is the recipient
        const res = await axiosClient.get(
          `/messages/chatters?to=${therapist._id}&toModel=Therapist`,
          { withCredentials: true }
        );

        // Extract unique user IDs from the chatters
        const userIds = res.data.map((chatter) => chatter._id);

        // Fetch user details for each unique user ID
        const userPromises = userIds.map((userId) =>
          axiosClient.get(`/users/${userId}`, {
            withCredentials: true,
          })
        );
        const userResponses = await Promise.all(userPromises);

        // Set patients state with user details and mark loading as false
        setPatients(userResponses.map((response) => response.data));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching patients:", error);
        setLoading(false);
      }
    };

    fetchPatients();
  }, [therapist]);

  const getDiagnosis = async (patient) => {
    try {
      const res = await axiosClient.get(`/diagnosis/${patient._id}`, {
        withCredentials: true,
      });
      setDiagnosis(res.data); // Set diagnosis data
      setIsDiagnosisModalOpen(true); // Open the modal
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-12 mt-24">
        <SkeletonLoader skeletonColor="bg-gray-500" count={6} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12 mt-24">
      <h1 className="text-3xl font-bold mb-8">Your Patients</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {patients.map((patient) => (
          <div
            key={patient._id}
            className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg flex gap-8"
          >
            <div className="avatar">
              <div className="w-24 h-24 rounded-full">
                <img src={patient.image} alt={`Photo of ${patient.name}`} />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold">{patient.name}</h2>
              <a className="italic text-sm" href={`mailto:${patient.email}`}>
                {patient.email}
              </a>
              <div className="flex justify-left items-center gap-3">
                <button
                  onClick={() => getDiagnosis(patient)} // Fetch diagnosis and open modal
                  className="mt-3 px-6 py-2 text-lg font-semibold rounded bg-neutral-900 dark:bg-gray-200 text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-300 transition duration-200"
                >
                  <UserRound />
                </button>
                <button
                  onClick={() => setSelectedPatient(patient)}
                  className="mt-3 px-6 py-2 text-lg font-semibold rounded bg-neutral-900 dark:bg-gray-200 text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-300 transition duration-200"
                >
                  <MessagesSquare size={24} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Diagnosis Modal */}
      {isDiagnosisModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl mx-4 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">
                Patient's Diagnosis Details by AI
              </h2>
              <button
                onClick={() => setIsDiagnosisModalOpen(false)} // Close modal
                className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-400"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="text-neutral-800 dark:text-neutral-200">
              {diagnosis ? (
                <div>
                  <p>
                    <strong>Initial Diagnosis:</strong>
                    {diagnosis.initialDiagnosis.diagnosis.map((d, index) => (
                      <span key={index}>
                        {" "}
                        {d}
                        {index <
                          diagnosis.initialDiagnosis.diagnosis.length - 1 &&
                          ", "}
                      </span>
                    ))}
                  </p>
                  <p>
                    <strong>Initial Emotions:</strong>
                    {diagnosis.initialDiagnosis.emotions.map((d, index) => (
                      <span key={index}>
                        {" "}
                        {d}
                        {index <
                          diagnosis.initialDiagnosis.emotions.length - 1 &&
                          ", "}
                      </span>
                    ))}
                  </p>
                  <p>
                    <strong>Journal Analysis Diagnosis:</strong>{" "}
                    {diagnosis.journalAnalysis.diagnosis.length > 0 || "N/A"}
                  </p>
                  <p>
                    <strong>Emotions from Latest Journal:</strong>{" "}
                    {diagnosis.journalAnalysis.emotions.map((d, index) => (
                      <span key={index}>
                        {" "}
                        {d.charAt(0).toUpperCase() + d.slice(1).toLowerCase()}
                        {index <
                          diagnosis.journalAnalysis.emotions.length - 1 && ", "}
                      </span>
                    ))}
                  </p>
                </div>
              ) : (
                <p>No diagnosis data available.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Chat Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-neutral-100 dark:bg-gray-700 rounded-lg shadow-xl w-full max-w-4xl mx-4">
            <div className="flex justify-between items-center p-4 border-b border-neutral-400 dark:border-gray-600">
              <div className="flex items-center gap-4">
                <MessagesSquare
                  className="text-neutral-800 dark:text-neutral-200"
                  size={32}
                />
                <div className="text-xl font-semibold text-neutral-800 dark:text-neutral-200">
                  Chat
                </div>
              </div>
              <button
                onClick={() => setSelectedPatient(null)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-400"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="p-4">
              <Chat
                conversationPartnerId={selectedPatient._id}
                partnerModel="User"
                currentUser={therapist}
                currentModel="Therapist"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TherapistPortalPatients;

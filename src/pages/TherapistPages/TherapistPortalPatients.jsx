import { useState, useEffect } from "react";
import { axiosClient } from "../../services/api";
import { useTherapistAuth } from "../../context/TherapistAuthContext";
import Chat from "../../components/Chat";

const TherapistPortalPatients = () => {
  const { therapist } = useTherapistAuth();
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        // Assuming an endpoint exists to get all active users (patients)
        const res = await axiosClient.get(
          `/users?therapistId=${therapist._id}`,
          { withCredentials: true }
        );
        setPatients(res.data);
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };
    fetchPatients();
  }, [therapist._id]);

  return (
    <div className="container mx-auto px-6 py-12 mt-24">
      <h1 className="text-3xl font-bold mb-8">Your Patients</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {patients.map((patient) => (
          <div
            key={patient._id}
            className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
          >
            <h2 className="text-xl font-semibold">{patient.name}</h2>
            <button
              onClick={() => setSelectedPatient(patient)}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Chat
            </button>
          </div>
        ))}
      </div>
      {selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-700 rounded-lg shadow-xl w-full max-w-4xl mx-4">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-600">
              <h2 className="text-xl font-semibold">
                Chat with {selectedPatient.name}
              </h2>
              <button
                onClick={() => setSelectedPatient(null)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-400"
              >
                Close
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

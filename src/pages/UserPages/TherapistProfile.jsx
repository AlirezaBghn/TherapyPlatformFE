import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { axiosClient } from "../../services/api";
import Chat from "../../components/Chat";
import { useAuth } from "../../context/AuthContext";

const TherapistProfile = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [therapist, setTherapist] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTherapistProfile = async () => {
      try {
        const res = await axiosClient.get(`/therapists/${id}`);
        setTherapist(res.data);
        const ansRes = await axiosClient.get(
          `/therapists/${id}/therapist-answers`
        );
        let additionalInfo = {};
        ansRes.data.forEach((item) => {
          const questionText = item.question_id.question.toLowerCase();
          if (questionText.includes("specialization")) {
            additionalInfo.specialization = item.answer.join(", ");
          } else if (questionText.includes("experience")) {
            additionalInfo.experience = item.answer.join(", ");
          } else if (questionText.includes("therapy approaches")) {
            additionalInfo.approach = item.answer.join(", ");
          } else if (questionText.includes("clients")) {
            additionalInfo.clients = item.answer.join(", ");
          } else if (questionText.includes("additional services")) {
            additionalInfo.additionalServices = item.answer.join(", ");
          }
        });
        setAnswers(additionalInfo);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch therapist profile");
      } finally {
        setLoading(false);
      }
    };

    fetchTherapistProfile();
  }, [id]);

  if (loading)
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="text-center text-lg">Loading profile...</div>
      </div>
    );

  if (error)
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="text-center text-red-500">{error}</div>
      </div>
    );

  if (!therapist)
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="text-center text-lg">Therapist not found</div>
      </div>
    );

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex items-center mb-8">
        <Link
          to="/therapist-dashboard"
          className="mr-4 px-4 py-2 bg-white/10 dark:bg-black/10 border border-black/20 dark:border-white/20 text-black dark:text-white rounded-lg hover:bg-white/20 dark:hover:bg-black/20 transition duration-300"
        >
          ← Back
        </Link>
        <h2 className="text-3xl font-bold text-black dark:text-white">
          Therapist Profile
        </h2>
      </div>

      <div className="mb-6">
        <div className="p-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <img
              src={therapist.image || "https://placehold.co/400"}
              alt={therapist.name}
              className="w-48 h-48 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-lg"
            />
            <div className="space-y-4 flex-1">
              <h1 className="text-3xl font-bold text-black dark:text-white">
                {therapist.name}
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ProfileField label="Name" value={therapist.name} />
                <ProfileField label="Phone" value={therapist.phone} />
                <ProfileField label="Email" value={therapist.email} />
                <ProfileField label="Username" value={therapist.username} />
                <ProfileField
                  label="Specialization"
                  value={answers.specialization}
                />
                <ProfileField label="Experience" value={answers.experience} />
                <ProfileField
                  label="Therapy Approaches"
                  value={answers.approach}
                />
                <ProfileField label="Clients" value={answers.clients} />
                <ProfileField
                  label="Additional Services"
                  value={answers.additionalServices}
                />
              </div>
            </div>
          </div>
        </div>
        <hr className="border dark:border-gray-600" />
      </div>

      <Chat
        conversationPartnerId={therapist._id}
        currentUser={user}
        partnerModel="Therapist"
        currentModel="User"
      />
    </div>
  );
};

const ProfileField = ({ label, value }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
      {label}
    </label>
    <div className="mt-1 block w-full dark:text-white">{value || "N/A"}</div>
  </div>
);

export default TherapistProfile;

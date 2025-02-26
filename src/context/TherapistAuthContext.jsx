// TherapistAuthContext.jsx
import { createContext, useState, useContext, useEffect } from "react";
import { axiosClient } from "../services/api";

const TherapistAuthContext = createContext();

export const TherapistAuthProvider = ({ children }) => {
  const [therapist, setTherapist] = useState(null);
  const [questionsSubmitted, setQuestionsSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkTherapistSession = async () => {
      try {
        const res = await axiosClient.get(`/therapists/check-session`, {
          withCredentials: true,
        });
        if (res.data.authenticated && res.data.user.role === "therapist") {
          const therapistId = res.data.user.id;
          const therapistRes = await axiosClient.get(
            `/therapists/${therapistId}`,
            {
              withCredentials: true,
            }
          );
          setTherapist(therapistRes.data);
        } else {
          setTherapist(null);
        }
      } catch (error) {
        if (!error.response || error.response.status !== 401) {
          console.error("Therapist session check failed", error);
        }
        setTherapist(null);
      } finally {
        setLoading(false);
      }
    };

    checkTherapistSession();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <TherapistAuthContext.Provider
      value={{
        therapist,
        setTherapist,
        questionsSubmitted,
        setQuestionsSubmitted,
      }}
    >
      {children}
    </TherapistAuthContext.Provider>
  );
};

export const useTherapistAuth = () => useContext(TherapistAuthContext);
export default TherapistAuthContext;

// TherapistAuthContext.jsx
import { createContext, useState, useContext, useEffect } from "react";
import { axiosClient } from "../services/api";

const TherapistAuthContext = createContext();

export const TherapistAuthProvider = ({ children }) => {
  const [therapist, setTherapist] = useState(null);
  const [isTherapistAuthenticated, setIsTherapistAuthenticated] =
    useState(false);
  const [questionsSubmitted, setQuestionsSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkTherapistSession = async () => {
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
        setIsTherapistAuthenticated(true);
      } else {
        setTherapist(null);
        setIsTherapistAuthenticated(false);
      }
      setLoading(false);
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
        isTherapistAuthenticated,
        setIsTherapistAuthenticated,
      }}
    >
      {children}
    </TherapistAuthContext.Provider>
  );
};

export const useTherapistAuth = () => useContext(TherapistAuthContext);
export default TherapistAuthContext;

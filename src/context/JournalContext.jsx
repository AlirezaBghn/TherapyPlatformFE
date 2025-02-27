import { createContext, useState, useContext, useEffect } from "react";
import { axiosClient } from "../services/api";
import { useAuth } from "./AuthContext";

const JournalContext = createContext();

export const JournalProvider = ({ children }) => {
  const { user } = useAuth();
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJournals = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const response = await axiosClient.get(`/users/${user._id}/journals`, {
          withCredentials: true,
        });
        setJournals(response.data);
      } catch (error) {
        console.error("Failed to fetch journals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJournals();
  }, [user]);

  if (loading) return <div>Loading...</div>;

  return (
    <JournalContext.Provider value={{ journals, setJournals }}>
      {children}
    </JournalContext.Provider>
  );
};

export const useJournals = () => useContext(JournalContext);

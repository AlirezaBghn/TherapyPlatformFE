import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

// Create the context
const JournalContext = createContext();

// Create a provider component
export const JournalProvider = ({ children }) => {
  const { user } = useAuth();
  const [journals, setJournals] = useState([]);

  useEffect(() => {
    // Fetch journals from the API using axios
    const fetchJournals = async () => {
      try {
        const response = await axios.get(
          `${VITE_BASE_URL}/users/${user._id}/journals`,
          {
            withCredentials: true,
          }
        );
        setJournals(response.data);
      } catch (error) {
        console.error("Failed to fetch journals:", error);
      }
    };

    fetchJournals();
  }, []);

  return (
    <JournalContext.Provider value={{ journals, setJournals }}>
      {children}
    </JournalContext.Provider>
  );
};

// Custom hook to use the JournalContext
export const useJournals = () => {
  return useContext(JournalContext);
};

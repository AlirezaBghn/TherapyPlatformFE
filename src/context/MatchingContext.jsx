import { createContext, useState, useContext } from "react";
import { axiosClient } from "../services/api";

const MatchingContext = createContext();

export const MatchingProvider = ({ children }) => {
  const [matchingResults, setMatchingResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMatchingResults = async (userId) => {
    setLoading(true);
    try {
      const res = await axiosClient.get(`/matching/match/${userId}`);
      setMatchingResults(res.data);
    } catch (err) {
      setError(err.message || "Failed to fetch matching results");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MatchingContext.Provider
      value={{ matchingResults, fetchMatchingResults, loading, error }}
    >
      {children}
    </MatchingContext.Provider>
  );
};

export const useMatching = () => useContext(MatchingContext);

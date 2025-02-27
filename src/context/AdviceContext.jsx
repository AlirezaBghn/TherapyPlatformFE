import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

export const AdviceContext = createContext();

export const AdviceProvider = ({ children }) => {
  const [advice, setAdvice] = useState(null);
  const { user } = useAuth();

  const fetchAdvice = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/advice/${user._id}`,
        {
          withCredentials: true,
        }
      );
      setAdvice(response.data);
    } catch (error) {
      console.error("Error fetching advice:", error);
    }
  };

  return (
    <AdviceContext.Provider value={{ advice, fetchAdvice }}>
      {children}
    </AdviceContext.Provider>
  );
};

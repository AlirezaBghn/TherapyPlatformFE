import React, { createContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { axiosClient } from "../services/api";

export const AdviceContext = createContext();

export const AdviceProvider = ({ children }) => {
  const [advice, setAdvice] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    // Check local storage for advice on initial load
    const storedAdvice = localStorage.getItem(`advice-${user._id}`);
    if (storedAdvice) {
      setAdvice(storedAdvice);
    }
  }, [user]);

  const fetchAdvice = async () => {
    setLoading(true);
    setAdvice("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/advice/${user._id}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let result = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        result += decoder.decode(value, { stream: true });
        setAdvice(result); // Update advice dynamically
        // Save advice in local storage
        localStorage.setItem(`advice-${user._id}`, result);
      }
    } catch (error) {
      console.error("Error fetching advice:", error);
    }

    setLoading(false);
  };

  return (
    <AdviceContext.Provider value={{ advice, fetchAdvice, loading }}>
      {children}
    </AdviceContext.Provider>
  );
};

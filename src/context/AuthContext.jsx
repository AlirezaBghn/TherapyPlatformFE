import { createContext, useState, useContext, useEffect } from "react";
import { axiosClient } from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [questionsSubmitted, setQuestionsSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await axiosClient.get(`/users/check-session`, {
          withCredentials: true,
        });
        if (res.data.authenticated && res.data.user.role === "user") {
          const userId = res.data.user.id;
          const userRes = await axiosClient.get(`/users/${userId}`, {
            withCredentials: true,
          });
          setUser(userRes.data);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Session check failed", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        questionsSubmitted,
        setQuestionsSubmitted,
        isAuthenticated,
        setIsAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

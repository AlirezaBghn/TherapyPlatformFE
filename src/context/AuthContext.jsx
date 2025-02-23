import { createContext, useState, useContext, useEffect } from "react";
import { axiosClient } from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [questionsSubmitted, setQuestionsSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        // Using a dummy id "session" to match the backend route
        const res = await axiosClient.get(`/users/check-session/session`, {
          withCredentials: true,
        });
        console.log("Session response:", res.data);
        if (res.data.authenticated) {
          // Use the 'id' property returned from the JWT payload
          const userId = res.data.user.id;
          const userRes = await axiosClient.get(`/users/${userId}`, {
            withCredentials: true,
          });
          setUser(userRes.data);
        } else {
          setUser(null);
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
      value={{ user, setUser, questionsSubmitted, setQuestionsSubmitted }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

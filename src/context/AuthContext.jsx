import { createContext, useState, useContext, useEffect } from "react";
import { axiosClient } from "../services/api";
import RingLoader from "../components/loadings/RingLoader";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [questionsSubmitted, setQuestionsSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState("user"); // Default role for regular users

  useEffect(() => {
    const checkSession = async () => {
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
      setLoading(false);
    };
    checkSession();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div style={{ transform: "scale(6)" }}>
          <RingLoader />
        </div>
      </div>
    );

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        questionsSubmitted,
        setQuestionsSubmitted,
        isAuthenticated,
        setIsAuthenticated,
        userRole,
        setUserRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

import { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // In-memory state for current user and flag for submitted questions.
  const [user, setUser] = useState(null);
  const [questionsSubmitted, setQuestionsSubmitted] = useState(false);

  return (
    <AuthContext.Provider
      value={{ user, setUser, questionsSubmitted, setQuestionsSubmitted }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// instead of localstorage

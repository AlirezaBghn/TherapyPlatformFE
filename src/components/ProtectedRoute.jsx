import { useAuth } from "../context/AuthContext";
import { useTherapistAuth } from "../context/TherapistAuthContext";
import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  const { isTherapistAuthenticated } = useTherapistAuth();

  return isAuthenticated || isTherapistAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/" />
  );
};

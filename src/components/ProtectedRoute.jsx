import { useAuth } from "../context/AuthContext";
import { useTherapistAuth } from "../context/TherapistAuthContext";
import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = ({ redirectPath = "/" }) => {
  const { isAuthenticated } = useAuth();
  const { isTherapistAuthenticated } = useTherapistAuth();

  if (!isAuthenticated && !isTherapistAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

import { useAuth } from "../context/AuthContext";
import { useTherapistAuth } from "../context/TherapistAuthContext";
import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = ({
  redirectPath = "/",
  allowedRoles = [], // Array of allowed roles (e.g., ["user", "therapist"])
}) => {
  const { isAuthenticated, userRole } = useAuth();
  const { isTherapistAuthenticated, therapistRole } = useTherapistAuth();

  // Determine if the user has the required role
  const isAllowed =
    (isAuthenticated && allowedRoles.includes(userRole)) ||
    (isTherapistAuthenticated && allowedRoles.includes(therapistRole));

  // If the user is not authenticated or doesn't have the required role, redirect them
  if (!isAllowed) {
    return <Navigate to={redirectPath} replace />;
  }

  // If the user is allowed, render the nested routes
  return <Outlet />;
};

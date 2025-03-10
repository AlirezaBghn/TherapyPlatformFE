import { useAuth } from "../context/AuthContext";
import { useTherapistAuth } from "../context/TherapistAuthContext";
import { Navigate, Outlet } from "react-router-dom";

export const PublicRoute = ({
  userRedirectPath = "/journals",
  therapistRedirectPath = "/therapist/patients",
}) => {
  const { isAuthenticated, questionsSubmitted } = useAuth();
  const { isTherapistAuthenticated } = useTherapistAuth();

  // Redirect regular users to /journals
  if (isAuthenticated && questionsSubmitted) {
    return <Navigate to={userRedirectPath} replace />;
  }

  // Redirect therapists to /therapist/patients
  if (isTherapistAuthenticated && questionsSubmitted) {
    return <Navigate to={therapistRedirectPath} replace />;
  }

  // If not authenticated, allow access to the public route
  return <Outlet />;
};

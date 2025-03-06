import { Routes, Route, useLocation } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { PublicRoute } from "./components/PublicRoute";

// User-side pages
import RegistrationPage from "./pages/UserPages/RegistrationPage";
import SignInPage from "./pages/UserPages/SignInPage";
import QuestionFormPage from "./pages/UserPages/QuestionFormPage";
import UserDashboard from "./pages/UserPages/UserDashboard";
import JournalPage from "./pages/UserPages/JournalPage";
import SingleJournalView from "./pages/UserPages/SingleJournalView";
import AddJournalEntry from "./pages/UserPages/AddJournalEntry";
import FindATherapist from "./pages/UserPages/FindATherapist";
import TherapistProfile from "./pages/UserPages/TherapistProfile";
import GetTipsAndAdvice from "./pages/UserPages/GetTipsAndAdvice";
import UserProfile from "./pages/UserPages/UserProfile";
import TherapistDashboard from "./pages/UserPages/TherapistDashboard";
import MessagesPage from "./pages/UserPages/MessagesPage";
import HomePage from "./pages/UserPages/HomePage";

// Therapist-side pages
import TherapistPortalSignIn from "./pages/TherapistPages/TherapistPortalSignIn";
import TherapistPortalRegistration from "./pages/TherapistPages/TherapistPortalRegistration";
import TherapistPortalQuestionnaire from "./pages/TherapistPages/TherapistPortalQuestionnaire";
import TherapistPortalPatients from "./pages/TherapistPages/TherapistPortalPatients";
import TherapistPortalProfile from "./pages/TherapistPages/TherapistPortalProfile";

// Navbar and footer components
import GlobalDarkModeToggle from "./components/GlobalDarkModeToggle";
import Navbar from "./components/Navbar";
import TherapistNavbar from "./components/TherapistNavbar";
import Footer from "./components/Footer";

// New ChatBot component
import ChatBot from "./components/ChatBot";

// Context providers
import { AuthProvider } from "./context/AuthContext";
import {
  TherapistAuthProvider,
  useTherapistAuth,
} from "./context/TherapistAuthContext";
import { JournalProvider } from "./context/JournalContext";
import { MatchingProvider } from "./context/MatchingContext";
import { AdviceProvider } from "./context/AdviceContext";
import { FavoritesShowProvider } from "./context/FavoritesShowContext";

import NotFound from "./components/NotFound";

// Animation wrapper
import AnimatedSection from "./components/AnimatedSection";

const AppContent = () => {
  const location = useLocation();
  const { isTherapistAuthenticated } = useTherapistAuth();

  // Routes where UI elements should be hidden (like sign in/up pages)
  const hideUIElementsRoutes = [
    "/",
    "/signin",
    "/signup",
    "/questions",
    "/therapist-signin",
    "/therapist-signup",
    "/therapist/questions",
  ];
  const showUIElements = !hideUIElementsRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col bg-neutral-100 dark:bg-gray-900 text-black dark:text-white">
      {showUIElements && <GlobalDarkModeToggle />}
      {showUIElements && (
        <>{isTherapistAuthenticated ? <TherapistNavbar /> : <Navbar />}</>
      )}
      <AnimatedSection key={location.pathname} className="flex-grow">
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route
              element={
                <PublicRoute
                  userRedirectPath="/home"
                  therapistRedirectPath="/therapist/patients"
                />
              }
            >
              <Route path="/" element={<LandingPage />} />
              <Route path="/signin" element={<SignInPage />} />
              <Route path="/signup" element={<RegistrationPage />} />
              <Route path="/questions" element={<QuestionFormPage />} />
              <Route
                path="/therapist-signin"
                element={<TherapistPortalSignIn />}
              />
              <Route
                path="/therapist-signup"
                element={<TherapistPortalRegistration />}
              />
              <Route
                path="/therapist/questions"
                element={<TherapistPortalQuestionnaire />}
              />
            </Route>

            {/* Protected routes for regular users */}
            <Route
              element={
                <ProtectedRoute
                  redirectPath="/signin"
                  allowedRoles={["user"]}
                />
              }
            >
              <Route path="/home" element={<HomePage />} />
              <Route
                path="/dashboard"
                element={
                  <AdviceProvider>
                    <FavoritesShowProvider>
                      <UserDashboard />
                    </FavoritesShowProvider>
                  </AdviceProvider>
                }
              />
              <Route path="/messages" element={<MessagesPage />} />
              <Route
                path="/journals"
                element={
                  <JournalProvider>
                    <JournalPage />
                  </JournalProvider>
                }
              />
              <Route
                path="/journal/:id"
                element={
                  <JournalProvider>
                    <SingleJournalView />
                  </JournalProvider>
                }
              />
              <Route
                path="/add-journal"
                element={
                  <JournalProvider>
                    <AddJournalEntry />
                  </JournalProvider>
                }
              />
              <Route
                path="/find-therapist"
                element={
                  <FavoritesShowProvider>
                    <FindATherapist />
                  </FavoritesShowProvider>
                }
              />
              <Route path="/therapist/:id" element={<TherapistProfile />} />
              <Route
                path="/tips"
                element={
                  <AdviceProvider>
                    <GetTipsAndAdvice />
                  </AdviceProvider>
                }
              />
              <Route path="/profile" element={<UserProfile />} />
            </Route>

            {/* Protected Routes for Therapists */}
            <Route
              element={
                <ProtectedRoute
                  redirectPath="/therapist-signin"
                  allowedRoles={["therapist"]}
                />
              }
            >
              <Route
                path="/therapist-dashboard"
                element={<TherapistDashboard />}
              />
              <Route
                path="/therapist/patients"
                element={<TherapistPortalPatients />}
              />
              <Route
                path="/therapist/profile"
                element={<TherapistPortalProfile />}
              />
            </Route>

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </AnimatedSection>
      <Footer />
      <ChatBot />
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <TherapistAuthProvider>
        <MatchingProvider>
          <AppContent />
        </MatchingProvider>
      </TherapistAuthProvider>
    </AuthProvider>
  );
};

export default App;

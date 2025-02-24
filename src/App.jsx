// App.jsx
import { Routes, Route, useLocation } from "react-router-dom";
import LandingPage from "./pages/LandingPage";

// User-side pages
import RegistrationPage from "./pages/UserPages/RegistrationPage";
import SignInPage from "./pages/UserPages/SignInPage";
import QuestionFormPage from "./pages/UserPages/QuestionFormPage";
import JournalPage from "./pages/UserPages/JournalPage";
import SingleJournalView from "./pages/UserPages/SingleJournalView";
import AddJournalEntry from "./pages/UserPages/AddJournalEntry";
import FindATherapist from "./pages/UserPages/FindATherapist";
import TherapistProfile from "./pages/UserPages/TherapistProfile";
import GetTipsAndAdvice from "./pages/UserPages/GetTipsAndAdvice";
import UserProfile from "./pages/UserPages/UserProfile";
import CommunityForum from "./pages/UserPages/CommunityForum";
import TherapistDashboard from "./pages/UserPages/TherapistDashboard";

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

// Context providers
import { AuthProvider } from "./context/AuthContext";
import { TherapistAuthProvider } from "./context/TherapistAuthContext";
import { JournalProvider } from "./context/JournalContext";

// Animation wrapper
import AnimatedSection from "./components/AnimatedSection";

const App = () => {
  const location = useLocation();

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

  // If the current route starts with "/therapist/" then we consider it part of the therapist portal.
  const isTherapistPortal =
    location.pathname.startsWith("/therapist/") &&
    !hideUIElementsRoutes.includes(location.pathname);

  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-black dark:text-white">
        {showUIElements && <GlobalDarkModeToggle />}
        {showUIElements && (
          <>
            {isTherapistPortal ? (
              <TherapistAuthProvider>
                <TherapistNavbar />
              </TherapistAuthProvider>
            ) : (
              <Navbar />
            )}
          </>
        )}
        <AnimatedSection key={location.pathname} className="flex-grow">
          <main className="flex-grow">
            <Routes>
              {/* Public Landing Page */}
              <Route path="/" element={<LandingPage />} />

              {/* User-side Routes */}
              <Route path="/signin" element={<SignInPage />} />
              <Route path="/signup" element={<RegistrationPage />} />
              <Route path="/questions" element={<QuestionFormPage />} />

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

              <Route path="/find-therapist" element={<FindATherapist />} />
              <Route path="/therapist/:id" element={<TherapistProfile />} />
              <Route path="/tips" element={<GetTipsAndAdvice />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/forum" element={<CommunityForum />} />
              <Route
                path="/therapist-dashboard"
                element={<TherapistDashboard />}
              />

              {/* Therapist-side Routes */}
              <Route
                path="/therapist-signin"
                element={
                  <TherapistAuthProvider>
                    <TherapistPortalSignIn />
                  </TherapistAuthProvider>
                }
              />
              <Route
                path="/therapist-signup"
                element={
                  <TherapistAuthProvider>
                    <TherapistPortalRegistration />
                  </TherapistAuthProvider>
                }
              />
              <Route
                path="/therapist/questions"
                element={
                  <TherapistAuthProvider>
                    <TherapistPortalQuestionnaire />
                  </TherapistAuthProvider>
                }
              />
              <Route
                path="/therapist/patients"
                element={
                  <TherapistAuthProvider>
                    <TherapistPortalPatients />
                  </TherapistAuthProvider>
                }
              />
              <Route
                path="/therapist/profile"
                element={
                  <TherapistAuthProvider>
                    <TherapistPortalProfile />
                  </TherapistAuthProvider>
                }
              />
            </Routes>
          </main>
        </AnimatedSection>
        <Footer />
      </div>
    </AuthProvider>
  );
};

export default App;

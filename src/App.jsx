import { Routes, Route, useLocation } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import RegistrationPage from "./pages/RegistrationPage";
import SignInPage from "./pages/SignInPage";
import QuestionFormPage from "./pages/QuestionFormPage";
import JournalPage from "./pages/JournalPage";
import SingleJournalView from "./pages/SingleJournalView";
import AddJournalEntry from "./pages/AddJournalEntry";
import FindATherapist from "./pages/FindATherapist";
import TherapistProfile from "./pages/TherapistProfile";
import GetTipsAndAdvice from "./pages/GetTipsAndAdvice";
import UserProfile from "./pages/UserProfile";
import CommunityForum from "./pages/CommunityForum";
import TherapistDashboard from "./pages/TherapistDashboard";
import GlobalDarkModeToggle from "./components/GlobalDarkModeToggle";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { AuthProvider } from "./context/AuthContext";
import AnimatedSection from "./components/AnimatedSection";

const App = () => {
  const location = useLocation();

  // Hide Navbar on "/" (LandingPage), "/signin", "/signup", and "/questions"
  const hideNavbarRoutes = ["/", "/signin", "/signup", "/questions"];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  // Hide Footer on "/signin", "/signup", and "/questions" (landing page will show footer)
  const hideFooterRoutes = ["/signin", "/signup", "/questions"];
  const shouldHideFooter = hideFooterRoutes.includes(location.pathname);

  // Hide GlobalDarkModeToggle on Landing, SignIn, Registration, and QuestionForm pages
  const hideDarkModeToggleRoutes = ["/", "/signin", "/signup", "/questions"];
  const shouldHideDarkModeToggle = hideDarkModeToggleRoutes.includes(
    location.pathname
  );

  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-black dark:text-white">
        {/* Global Dark Mode Toggle appears only on routes not in hideDarkModeToggleRoutes */}
        {!shouldHideDarkModeToggle && <GlobalDarkModeToggle />}

        {/* Navbar appears only if not on hidden routes */}
        {!shouldHideNavbar && <Navbar />}

        {/* Main content with route transitions */}
        <AnimatedSection key={location.pathname} className="flex-grow">
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/signin" element={<SignInPage />} />
              <Route path="/signup" element={<RegistrationPage />} />
              <Route path="/questions" element={<QuestionFormPage />} />
              <Route path="/journals" element={<JournalPage />} />
              <Route path="/journal/:id" element={<SingleJournalView />} />
              <Route path="/add-journal" element={<AddJournalEntry />} />
              <Route path="/find-therapist" element={<FindATherapist />} />
              <Route path="/therapist/:id" element={<TherapistProfile />} />
              <Route path="/tips" element={<GetTipsAndAdvice />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/forum" element={<CommunityForum />} />
              <Route
                path="/therapist-dashboard"
                element={<TherapistDashboard />}
              />
            </Routes>
          </main>
        </AnimatedSection>

        {/* Footer appears only if not on hidden routes */}
        {!shouldHideFooter && <Footer />}
      </div>
    </AuthProvider>
  );
};

export default App;

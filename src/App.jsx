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

const App = () => {
  const location = useLocation();
  const hideLayoutRoutes = ["/signin", "/signup", "/questions", "/"];
  const shouldHideLayout = hideLayoutRoutes.includes(location.pathname);

  return (
    <AuthProvider>
      {/* Full-height container with flex layout so the footer stays at the bottom */}
      <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-black dark:text-white">
        {/* Optionally render GlobalDarkModeToggle */}
        {!shouldHideLayout && <GlobalDarkModeToggle />}

        {/* Navbar appears at the top */}
        {!shouldHideLayout && <Navbar />}

        {/* User content area */}
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

        {/* Footer appears at the bottom */}
        {!shouldHideLayout && <Footer />}
      </div>
    </AuthProvider>
  );
};

export default App;

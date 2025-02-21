import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
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
import Chat from "./pages/Chat";
import CommunityForum from "./pages/CommunityForum";
import TherapistDashboard from "./pages/TherapistDashboard";
import GlobalDarkModeToggle from "./components/GlobalDarkModeToggle";

const AppContent = () => {
  const location = useLocation();
  // Hide the dark mode toggle on /signin, /signup, and /questions pages.
  const hideToggleRoutes = ["/signin", "/signup", "/questions"];
  return (
    <>
      {!hideToggleRoutes.includes(location.pathname) && (
        <GlobalDarkModeToggle />
      )}
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
        <Route path="/chat" element={<Chat />} />
        <Route path="/forum" element={<CommunityForum />} />
        <Route path="/therapist-dashboard" element={<TherapistDashboard />} />
      </Routes>
    </>
  );
};

const App = () => (
  <Router>
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  </Router>
);

export default App;

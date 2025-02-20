import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import SignUpPage from "./pages/SignUpPage";
import SignInPage from "./pages/SignInPage";
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

const App = () => {
  return (
    <Router>
      {/* Global dark mode toggle always visible */}
      <GlobalDarkModeToggle />
      <Routes>
        {/* Unauthenticated Pages */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />d
        {/* Authenticated Pages (wrapped with Layout inside each page) */}
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
    </Router>
  );
};

export default App;

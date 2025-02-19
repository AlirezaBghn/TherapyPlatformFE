import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import SignUpPage from "./pages/SignUpPage"; // If you want to include the multi-step signup page.
import SignInPage from "./pages/SignInPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/signin" element={<SignInPage />} />
      </Routes>
    </Router>
  );
};

export default App;

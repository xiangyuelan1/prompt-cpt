import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Header } from "./components/layout/Header";
import { HomePage } from "./pages/Home";
import { ChallengesPage } from "./pages/Challenges";
import { ChallengeDetailPage } from "./pages/ChallengeDetail";
import { EditorPage } from "./pages/Editor";
import { TemplatesPage } from "./pages/Templates";
import { LeaderboardPage } from "./pages/Leaderboard";
import { ProfilePage } from "./pages/Profile";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-dark-200">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/challenges" element={<ChallengesPage />} />
          <Route path="/challenges/:id" element={<ChallengeDetailPage />} />
          <Route path="/challenges/:id/editor" element={<EditorPage />} />
          <Route path="/templates" element={<TemplatesPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

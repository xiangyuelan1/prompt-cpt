import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Header } from "./components/layout/Header";
import { HomePage } from "./pages/Home";
import { ChallengesPage } from "./pages/Challenges";
import { ChallengeDetailPage } from "./pages/ChallengeDetail";
import { EditorPage } from "./pages/Editor";
import { TemplatesPage } from "./pages/Templates";
import { LeaderboardPage } from "./pages/Leaderboard";
import { ProfilePage } from "./pages/Profile";
import { AuthPage } from "./pages/Auth";
import { BattlePage } from "./pages/Battle";
import { AdminSettingsPage } from "./pages/AdminSettings";
import { KnowledgeTreePage } from "./pages/KnowledgeTree";
import { QuestionDetailPage } from "./pages/QuestionDetail";
import { CreateQuestionPage } from "./pages/CreateQuestion";
import { AuthProvider } from "./contexts/AuthContext";
import { BattleProvider } from "./contexts/BattleContext";
import { QuestionProvider } from "./contexts/QuestionContext";

function App() {
  return (
    <AuthProvider>
      <QuestionProvider>
        <BattleProvider>
          <Router>
            <div className="min-h-screen bg-dark-200">
              <Routes>
                <Route path="/auth" element={<><Header /><AuthPage /></>} />
                <Route path="/*" element={
                  <>
                    <Header />
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/challenges" element={<ChallengesPage />} />
                      <Route path="/challenges/:id" element={<ChallengeDetailPage />} />
                      <Route path="/challenges/:id/editor" element={<EditorPage />} />
                      <Route path="/templates" element={<TemplatesPage />} />
                      <Route path="/leaderboard" element={<LeaderboardPage />} />
                      <Route path="/profile" element={<ProfilePage />} />
                      <Route path="/battle" element={<BattlePage />} />
                      <Route path="/admin" element={<AdminSettingsPage />} />
                      <Route path="/knowledge" element={<KnowledgeTreePage />} />
                      <Route path="/questions" element={<ChallengesPage />} />
                      <Route path="/questions/create" element={<CreateQuestionPage />} />
                      <Route path="/questions/:id" element={<QuestionDetailPage />} />
                      <Route path="/editor/:id" element={<EditorPage />} />
                    </Routes>
                  </>
                } />
              </Routes>
            </div>
          </Router>
        </BattleProvider>
      </QuestionProvider>
    </AuthProvider>
  );
}

export default App;

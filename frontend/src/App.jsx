import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import AddCandidate from './pages/AddCandidate';
import CandidatesList from './pages/CandidatesList';
import MatchRequirements from './pages/MatchRequirements';
import AIShortlist from './pages/AIShortlist';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Navigate to="/candidates" replace />} />
            <Route path="/candidates" element={<CandidatesList />} />
            <Route path="/add" element={<AddCandidate />} />
            <Route path="/match" element={<MatchRequirements />} />
            <Route path="/ai-shortlist" element={<AIShortlist />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

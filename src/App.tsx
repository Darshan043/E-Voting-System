import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AuthenticationPage from './pages/AuthenticationPage';
import DigitalVotingPage from './pages/DigitalVotingPage';
import LiveAnalyticsPage from './pages/LiveAnalyticsPage';
import MobileResponsivePage from './pages/MobileResponsivePage';
import VotingPortal from './pages/VotingPortal';
import AdminPanel from './pages/AdminPanel';
import { VotingProvider } from './context/VotingContext';
import './styles/globals.css';

function App() {
  return (
    <VotingProvider>
      <Router>
        <div className="app">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/authentication" element={<AuthenticationPage />} />
            <Route path="/digital-voting" element={<DigitalVotingPage />} />
            <Route path="/live-analytics" element={<LiveAnalyticsPage />} />
            <Route path="/mobile-responsive" element={<MobileResponsivePage />} />
            <Route path="/voting-portal" element={<VotingPortal />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </div>
      </Router>
    </VotingProvider>
  );
}

export default App;
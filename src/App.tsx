import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AuthenticationPage from './pages/AuthenticationPage';
import DigitalVotingPage from './pages/DigitalVotingPage';
import LiveAnalyticsPage from './pages/LiveAnalyticsPage';
import MobileResponsivePage from './pages/MobileResponsivePage';
import VotingPortal from './pages/VotingPortal';
import AdminPanel from './pages/AdminPanel';
import { VotingProvider, useVoting } from './context/VotingContext';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorDisplay from './components/ErrorBoundary';
import './styles/globals.css';

function AppContent() {
  const { loading, error, refreshData, clearError } = useVoting();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner 
          size="lg" 
          message="Loading voting system..."
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <ErrorDisplay
          error={error}
          onRetry={refreshData}
          onDismiss={clearError}
        />
      </div>
    );
  }

  return (
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
  );
}

function App() {
  return (
    <VotingProvider>
      <AppContent />
    </VotingProvider>
  );
}

export default App;
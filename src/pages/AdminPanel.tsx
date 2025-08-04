import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, BarChart3, Users, Settings, Download, RotateCcw, ToggleLeft } from 'lucide-react';
import { useVoting } from '../context/VotingContext';
import Header from '../components/Header';
import FloatingParticles from '../components/FloatingParticles';

const AdminPanel: React.FC = () => {
  const navigate = useNavigate();
  const { votes, students, candidates, votingEnabled, toggleVoting, resetVotes } = useVoting();
  const [adminPassword, setAdminPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const totalVotes = votes.length;
  const totalStudents = students.length;
  const turnoutRate = totalStudents > 0 ? (totalVotes / totalStudents) * 100 : 0;

  const handleAdminAuth = () => {
    if (adminPassword === 'rit2025admin') {
      setIsAuthenticated(true);
    } else {
      alert('Invalid admin password!');
    }
  };

  const handleResetVotes = () => {
    if (window.confirm('Are you sure you want to reset all votes? This action cannot be undone.')) {
      resetVotes();
      alert('All votes have been reset successfully!');
    }
  };

  const exportResults = () => {
    const results = {
      timestamp: new Date().toISOString(),
      totalVotes,
      totalStudents,
      turnoutRate: turnoutRate.toFixed(2) + '%',
      candidates: candidates.map(c => ({
        name: c.name,
        votes: c.votes,
        percentage: totalVotes > 0 ? ((c.votes / totalVotes) * 100).toFixed(2) + '%' : '0%'
      }))
    };

    const dataStr = JSON.stringify(results, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileName = `RIT_Election_Results_${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileName);
    linkElement.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-700 via-slate-600 to-zinc-700 relative overflow-hidden">
      <FloatingParticles />
      
      <div className="container mx-auto px-6 py-8 relative z-10">
        <button
          onClick={() => navigate('/')}
          className="mb-8 bg-white/10 backdrop-blur-lg text-white px-6 py-3 rounded-xl flex items-center gap-3 hover:bg-white/20 transition-all duration-300 border border-white/20"
        >
          <ArrowLeft size={20} />
          Back to Home
        </button>

        <Header 
          title="Admin Dashboard"
          subtitle="Complete election management and monitoring system"
        />

        {/* Admin Authentication */}
        {!isAuthenticated && (
          <div className="max-w-md mx-auto mb-12">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
              <div className="text-center mb-6">
                <Shield size={48} className="text-yellow-300 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Admin Access Required</h3>
                <p className="text-gray-200">Enter admin password to continue</p>
              </div>
              
              <div className="space-y-4">
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full px-4 py-4 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-300"
                />
                <button
                  onClick={handleAdminAuth}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 text-white py-4 rounded-xl font-bold hover:from-yellow-600 hover:to-orange-700 transition-all duration-300"
                >
                  Access Admin Panel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Admin Dashboard */}
        {isAuthenticated && (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              <div className="stat-card bg-gradient-to-r from-blue-500 to-cyan-600 text-white p-6 rounded-2xl">
                <div className="flex items-center gap-4">
                  <BarChart3 size={32} />
                  <div>
                    <div className="text-3xl font-bold">{totalVotes}</div>
                    <div className="text-blue-100">Total Votes</div>
                  </div>
                </div>
              </div>

              <div className="stat-card bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-2xl">
                <div className="flex items-center gap-4">
                  <Users size={32} />
                  <div>
                    <div className="text-3xl font-bold">{totalStudents}</div>
                    <div className="text-green-100">Students</div>
                  </div>
                </div>
              </div>

              <div className="stat-card bg-gradient-to-r from-purple-500 to-violet-600 text-white p-6 rounded-2xl">
                <div className="flex items-center gap-4">
                  <Users size={32} />
                  <div>
                    <div className="text-3xl font-bold">{turnoutRate.toFixed(1)}%</div>
                    <div className="text-purple-100">Turnout</div>
                  </div>
                </div>
              </div>

              <div className="stat-card bg-gradient-to-r from-orange-500 to-red-600 text-white p-6 rounded-2xl">
                <div className="flex items-center gap-4">
                  <Settings size={32} />
                  <div>
                    <div className="text-3xl font-bold">{candidates.length}</div>
                    <div className="text-orange-100">Candidates</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Admin Controls */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold text-white mb-6">Election Controls</h3>
                
                <div className="space-y-4">
                  <button
                    onClick={toggleVoting}
                    className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl font-bold transition-all duration-300 ${
                      votingEnabled 
                        ? 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700' 
                        : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
                    } text-white`}
                  >
                    <ToggleLeft size={24} />
                    {votingEnabled ? 'Disable Voting' : 'Enable Voting'}
                  </button>

                  <button
                    onClick={handleResetVotes}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-4 rounded-xl font-bold hover:from-orange-600 hover:to-red-700 transition-all duration-300 flex items-center justify-center gap-3"
                  >
                    <RotateCcw size={24} />
                    Reset All Votes
                  </button>

                  <button
                    onClick={exportResults}
                    className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-4 rounded-xl font-bold hover:from-purple-600 hover:to-indigo-700 transition-all duration-300 flex items-center justify-center gap-3"
                  >
                    <Download size={24} />
                    Export Results
                  </button>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold text-white mb-6">Live Results</h3>
                
                <div className="space-y-4">
                  {candidates.sort((a, b) => b.votes - a.votes).map((candidate, index) => {
                    const percentage = totalVotes > 0 ? (candidate.votes / totalVotes) * 100 : 0;
                    return (
                      <div key={candidate.id} className="result-item">
                        <div className="flex justify-between text-white mb-2">
                          <span className="font-semibold">{candidate.name}</span>
                          <span>{candidate.votes} votes ({percentage.toFixed(1)}%)</span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-3">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-full transition-all duration-1000"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold text-white mb-6">System Status</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
                    votingEnabled ? 'bg-green-500' : 'bg-red-500'
                  }`}>
                    <Settings size={24} className="text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-white">Voting Status</h4>
                  <p className={votingEnabled ? 'text-green-300' : 'text-red-300'}>
                    {votingEnabled ? 'Active' : 'Disabled'}
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <BarChart3 size={24} className="text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-white">System Load</h4>
                  <p className="text-blue-300">Normal (23%)</p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Shield size={24} className="text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-white">Security</h4>
                  <p className="text-purple-300">All Clear</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
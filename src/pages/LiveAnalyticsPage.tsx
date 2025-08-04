import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BarChart3, Users, TrendingUp, PieChart, Activity, Clock } from 'lucide-react';
import { useVoting } from '../context/VotingContext';
import Header from '../components/Header';
import FloatingParticles from '../components/FloatingParticles';

const LiveAnalyticsPage: React.FC = () => {
  const navigate = useNavigate();
  const { candidates, votes, students } = useVoting();
  const [realTimeStats, setRealTimeStats] = useState({
    activeUsers: 0,
    votesPerMinute: 0,
    systemLoad: 0
  });

  useEffect(() => {
    // Simulate real-time data updates
    const interval = setInterval(() => {
      setRealTimeStats({
        activeUsers: Math.floor(Math.random() * 50) + 10,
        votesPerMinute: Math.floor(Math.random() * 15) + 5,
        systemLoad: Math.floor(Math.random() * 30) + 70
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const totalVotes = votes.length;
  const totalStudents = students.length;
  const turnoutRate = totalStudents > 0 ? (totalVotes / totalStudents) * 100 : 0;

  const departmentStats = students.reduce((acc, student) => {
    acc[student.department] = (acc[student.department] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const votingPatternData = Array.from({ length: 24 }, (_, hour) => ({
    hour: `${hour}:00`,
    votes: Math.floor(Math.random() * 20) + (hour >= 9 && hour <= 17 ? 30 : 5)
  }));

  const getPositionColor = (index: number) => {
    const colors = ['from-yellow-400 to-orange-500', 'from-gray-400 to-gray-500', 'from-orange-600 to-red-500', 'from-blue-500 to-purple-600'];
    return colors[index] || 'from-gray-400 to-gray-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-800 relative overflow-hidden">
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
          title="Live Analytics Dashboard"
          subtitle="Real-time election monitoring and comprehensive data insights"
        />

        {/* Real-time Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
                <Activity size={24} className="text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{realTimeStats.activeUsers}</div>
                <div className="text-green-200 text-sm">Active Users</div>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center">
                <TrendingUp size={24} className="text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{realTimeStats.votesPerMinute}</div>
                <div className="text-blue-200 text-sm">Votes/Minute</div>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl flex items-center justify-center">
                <BarChart3 size={24} className="text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{realTimeStats.systemLoad}%</div>
                <div className="text-purple-200 text-sm">System Load</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Election Results */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <BarChart3 size={28} />
              Live Election Results
            </h3>
            
            <div className="space-y-6">
              {candidates.sort((a, b) => b.votes - a.votes).map((candidate, index) => {
                const percentage = totalVotes > 0 ? (candidate.votes / totalVotes) * 100 : 0;
                return (
                  <div key={candidate.id} className="candidate-result">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 bg-gradient-to-r ${getPositionColor(index)} rounded-lg flex items-center justify-center text-white font-bold`}>
                          {candidate.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-white font-semibold">{candidate.name}</div>
                          <div className="text-blue-200 text-sm">{candidate.department}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-bold">{candidate.votes} votes</div>
                        <div className="text-blue-200 text-sm">{percentage.toFixed(1)}%</div>
                      </div>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${getPositionColor(index)} transition-all duration-1000 ease-out rounded-full`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Voter Statistics */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Users size={28} />
              Voter Demographics
            </h3>
            
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">{totalVotes}</div>
                <div className="text-blue-200">Total Votes</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">{turnoutRate.toFixed(1)}%</div>
                <div className="text-blue-200">Turnout Rate</div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Department Breakdown</h4>
              {Object.entries(departmentStats).map(([dept, count]) => {
                const percentage = (count / totalStudents) * 100;
                return (
                  <div key={dept} className="dept-stat">
                    <div className="flex justify-between text-white mb-2">
                      <span>{dept}</span>
                      <span>{count} students ({percentage.toFixed(1)}%)</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div 
                        className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-1000"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Voting Pattern Chart */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 mb-12">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Clock size={28} />
            24-Hour Voting Pattern
          </h3>
          
          <div className="grid grid-cols-12 gap-2 h-64">
            {votingPatternData.map((data, index) => (
              <div key={index} className="flex flex-col items-center justify-end">
                <div
                  className="w-full bg-gradient-to-t from-purple-500 to-pink-400 rounded-t transition-all duration-1000 hover:from-purple-400 hover:to-pink-300"
                  style={{ height: `${(data.votes / 50) * 100}%` }}
                  title={`${data.hour}: ${data.votes} votes`}
                />
                <div className="text-white text-xs mt-2 rotate-45 origin-bottom-left">
                  {index % 3 === 0 ? data.hour : ''}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Advanced Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 text-center">
            <PieChart size={48} className="text-blue-300 mx-auto mb-4" />
            <h4 className="text-xl font-bold text-white mb-2">Vote Distribution</h4>
            <p className="text-blue-100 mb-4">Detailed breakdown of voting patterns across all demographics</p>
            <div className="text-3xl font-bold text-white">Fair</div>
            <div className="text-blue-200 text-sm">Distribution Score</div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 text-center">
            <TrendingUp size={48} className="text-green-300 mx-auto mb-4" />
            <h4 className="text-xl font-bold text-white mb-2">Participation Trend</h4>
            <p className="text-blue-100 mb-4">Voter engagement analysis and participation forecasting</p>
            <div className="text-3xl font-bold text-white">↗ 24%</div>
            <div className="text-green-200 text-sm">Above Expected</div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 text-center">
            <Activity size={48} className="text-purple-300 mx-auto mb-4" />
            <h4 className="text-xl font-bold text-white mb-2">System Performance</h4>
            <p className="text-blue-100 mb-4">Real-time monitoring of platform stability and response times</p>
            <div className="text-3xl font-bold text-white">99.9%</div>
            <div className="text-purple-200 text-sm">Uptime</div>
          </div>
        </div>

        {/* Export Options */}
        <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 backdrop-blur-lg rounded-3xl p-8 border border-indigo-400/30 text-center">
          <BarChart3 size={48} className="text-indigo-300 mx-auto mb-4" />
          <h4 className="text-2xl font-bold text-white mb-4">Export Analytics Report</h4>
          <p className="text-indigo-100 mb-6 max-w-2xl mx-auto">
            Generate comprehensive reports with detailed voting analytics, demographic breakdowns, and performance metrics.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-700 transition-all duration-300">
              Export PDF Report
            </button>
            <button className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300">
              Download CSV Data
            </button>
            <button className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-700 transition-all duration-300">
              Real-time Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveAnalyticsPage;
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Vote, BarChart3, Smartphone, Settings, Trophy } from 'lucide-react';
import Header from '../components/Header';
import FloatingParticles from '../components/FloatingParticles';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Shield,
      title: 'Secure Authentication',
      description: 'Multi-layer student verification system',
      path: '/authentication',
      gradient: 'from-blue-500 to-purple-600'
    },
    {
      icon: Vote,
      title: 'Digital Voting',
      description: 'Intuitive candidate selection interface',
      path: '/digital-voting',
      gradient: 'from-green-500 to-teal-600'
    },
    {
      icon: BarChart3,
      title: 'Live Analytics',
      description: 'Real-time vote tracking and statistics',
      path: '/live-analytics',
      gradient: 'from-orange-500 to-red-600'
    },
    {
      icon: Smartphone,
      title: 'Mobile Responsive',
      description: 'Seamless experience across all devices',
      path: '/mobile-responsive',
      gradient: 'from-purple-500 to-pink-600'
    }
  ];

  const quickActions = [
    {
      icon: Vote,
      title: 'Start Voting',
      description: 'Access the voting portal',
      path: '/voting-portal',
      color: 'bg-gradient-to-r from-blue-600 to-indigo-700'
    },
    {
      icon: Settings,
      title: 'Admin Panel',
      description: 'Manage elections',
      path: '/admin',
      color: 'bg-gradient-to-r from-gray-600 to-gray-700'
    },
    {
      icon: Trophy,
      title: 'View Results',
      description: 'See live election results',
      path: '/live-analytics',
      color: 'bg-gradient-to-r from-green-600 to-emerald-700'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 relative overflow-hidden">
      <FloatingParticles />
      
      <div className="container mx-auto px-6 py-8 relative z-10">
        <Header />
        
        {/* Hero Section */}
        <div className="text-center py-16 mb-16">
          <h2 className="text-5xl font-bold text-white mb-6 animate-fade-in-up">
            Democracy in Digital Era
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto animate-fade-in-up animation-delay-300">
            Experience the future of student elections with our secure, transparent, and user-friendly e-voting platform
          </p>
          <div className="flex flex-wrap justify-center gap-4 animate-fade-in-up animation-delay-600">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => navigate(action.path)}
                className={`${action.color} text-white px-8 py-4 rounded-2xl font-semibold flex items-center gap-3 hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-xl`}
              >
                <action.icon size={24} />
                <div className="text-left">
                  <div className="font-bold">{action.title}</div>
                  <div className="text-sm opacity-90">{action.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4">System Features</h3>
            <p className="text-blue-100 text-lg">Advanced e-voting capabilities with enterprise-grade security</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                onClick={() => navigate(feature.path)}
                className="feature-card group cursor-pointer bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 hover:bg-white/20 transform hover:scale-105 transition-all duration-500 hover:shadow-2xl"
              >
                <div className={`w-20 h-20 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-200 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-blue-100 leading-relaxed">
                  {feature.description}
                </p>
                <div className="mt-6 text-blue-300 font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Learn More →
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="stat-card bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 text-center">
            <div className="text-4xl font-bold text-white mb-2">2,547</div>
            <div className="text-blue-100">Registered Students</div>
          </div>
          <div className="stat-card bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 text-center">
            <div className="text-4xl font-bold text-white mb-2">4</div>
            <div className="text-blue-100">Active Candidates</div>
          </div>
          <div className="stat-card bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 text-center">
            <div className="text-4xl font-bold text-white mb-2">99.9%</div>
            <div className="text-blue-100">System Uptime</div>
          </div>
        </div>

        {/* Security Banner */}
        <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-lg rounded-3xl p-8 border border-green-400/30 text-center">
          <Shield size={48} className="text-green-300 mx-auto mb-4" />
          <h4 className="text-2xl font-bold text-white mb-2">Bank-Level Security</h4>
          <p className="text-green-100 max-w-2xl mx-auto">
            Our e-voting system employs advanced encryption, blockchain verification, and multi-factor authentication to ensure every vote is secure and verifiable.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Vote, Users, CheckCircle, Clock, Shield, Zap } from 'lucide-react';
import Header from '../components/Header';
import FloatingParticles from '../components/FloatingParticles';

const DigitalVotingPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedDemo, setSelectedDemo] = useState(1);

  const votingFeatures = [
    {
      icon: Vote,
      title: 'Intuitive Interface',
      description: 'Clean, user-friendly design that makes voting simple and accessible',
      details: ['One-click candidate selection', 'Clear visual feedback', 'Confirmation dialogs']
    },
    {
      icon: Shield,
      title: 'Secure Ballot Casting',
      description: 'End-to-end encryption ensures vote privacy and integrity',
      details: ['Anonymous voting', 'Tamper-proof records', 'Audit trail maintenance']
    },
    {
      icon: Zap,
      title: 'Instant Processing',
      description: 'Real-time vote processing with immediate confirmation',
      details: ['Sub-second response time', 'Live result updates', 'System redundancy']
    },
    {
      icon: Users,
      title: 'Accessibility First',
      description: 'Designed for users of all technical skill levels',
      details: ['Screen reader compatible', 'Keyboard navigation', 'Multiple languages']
    }
  ];

  const demoScenarios = [
    {
      id: 1,
      title: 'Presidential Election',
      description: 'Student Council President voting interface',
      candidates: ['B.Darshan', 'Aravind Raj', 'Aswin R', 'Assema']
    },
    {
      id: 2,
      title: 'Department Representative',
      description: 'Department-specific representative selection',
      candidates: ['Computer Science Rep', 'Electronics Rep', 'Mechanical Rep']
    },
    {
      id: 3,
      title: 'Cultural Secretary',
      description: 'Cultural activities coordinator selection',
      candidates: ['Cultural Candidate A', 'Cultural Candidate B']
    }
  ];

  const votingProcess = [
    {
      step: 1,
      title: 'Authenticate',
      description: 'Verify student identity',
      icon: Shield
    },
    {
      step: 2,
      title: 'Review Candidates',
      description: 'Browse candidate profiles',
      icon: Users
    },
    {
      step: 3,
      title: 'Cast Vote',
      description: 'Select your candidate',
      icon: Vote
    },
    {
      step: 4,
      title: 'Confirm',
      description: 'Verify and submit',
      icon: CheckCircle
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 relative overflow-hidden">
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
          title="Digital Voting Platform"
          subtitle="Next-generation voting interface with advanced user experience"
        />

        {/* Voting Process Flow */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-white text-center mb-12">Voting Process Flow</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {votingProcess.map((process, index) => (
              <div key={index} className="text-center">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <process.icon size={32} className="text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {process.step}
                  </div>
                </div>
                <h4 className="text-lg font-bold text-white mb-2">{process.title}</h4>
                <p className="text-blue-100">{process.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Demo */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-white text-center mb-12">Interactive Voting Demo</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            {demoScenarios.map((scenario) => (
              <button
                key={scenario.id}
                onClick={() => setSelectedDemo(scenario.id)}
                className={`p-6 rounded-2xl border transition-all duration-300 text-left ${
                  selectedDemo === scenario.id
                    ? 'bg-white/20 border-blue-400 text-white'
                    : 'bg-white/10 border-white/20 text-blue-100 hover:bg-white/15'
                }`}
              >
                <h4 className="font-bold text-lg mb-2">{scenario.title}</h4>
                <p className="text-sm opacity-90">{scenario.description}</p>
              </button>
            ))}
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
            <div className="text-center mb-8">
              <h4 className="text-2xl font-bold text-white mb-2">
                {demoScenarios.find(s => s.id === selectedDemo)?.title} Demo
              </h4>
              <p className="text-blue-100">
                {demoScenarios.find(s => s.id === selectedDemo)?.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {demoScenarios.find(s => s.id === selectedDemo)?.candidates.map((candidate, index) => (
                <div
                  key={index}
                  className="demo-candidate-card bg-white/10 border border-white/30 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 cursor-pointer group"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {candidate.charAt(0)}
                    </div>
                    <div>
                      <h5 className="text-lg font-bold text-white">{candidate}</h5>
                      <p className="text-blue-200 text-sm">Click to select candidate</p>
                    </div>
                  </div>
                  <div className="text-blue-100 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Sample manifesto: Committed to student welfare and campus improvement...
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <button className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-green-600 hover:to-emerald-700 transform hover:scale-105 transition-all duration-300 shadow-lg">
                Cast Demo Vote
              </button>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-white text-center mb-12">Platform Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {votingFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-500 transform hover:scale-105"
              >
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <feature.icon size={24} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-white mb-3">{feature.title}</h4>
                    <p className="text-blue-100 mb-4">{feature.description}</p>
                    <ul className="space-y-2">
                      {feature.details.map((detail, idx) => (
                        <li key={idx} className="text-blue-200 flex items-center gap-2">
                          <CheckCircle size={16} className="text-green-400" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-3xl p-8 border border-purple-400/30 text-center">
          <Vote size={48} className="text-purple-300 mx-auto mb-4" />
          <h4 className="text-2xl font-bold text-white mb-4">Ready to Start Voting?</h4>
          <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
            Experience our state-of-the-art digital voting platform with real candidates and live results.
          </p>
          <button
            onClick={() => navigate('/voting-portal')}
            className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-purple-600 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
          >
            Enter Voting Portal
          </button>
        </div>
      </div>
    </div>
  );
};

export default DigitalVotingPage;
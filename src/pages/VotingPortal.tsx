import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Vote, User, Building, Calendar, CheckCircle } from 'lucide-react';
import { useVoting } from '../context/VotingContext';
import Header from '../components/Header';
import FloatingParticles from '../components/FloatingParticles';

const VotingPortal: React.FC = () => {
  const navigate = useNavigate();
  const { authenticateStudent, setCurrentUser, currentUser, candidates, addVote, votingEnabled } = useVoting();
  const [formData, setFormData] = useState({
    studentId: '',
    studentName: '',
    department: '',
    year: ''
  });
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null);
  const [showVoting, setShowVoting] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const departments = [
    { value: 'IT', label: 'Information Technology' },
    { value: 'CSE', label: 'Computer Science Engineering' },
    { value: 'ECE', label: 'Electronics & Communication' },
    { value: 'EEE', label: 'Electrical & Electronics' },
    { value: 'MECH', label: 'Mechanical Engineering' },
    { value: 'CIVIL', label: 'Civil Engineering' }
  ];

  const years = [
    { value: '1', label: 'First Year' },
    { value: '2', label: 'Second Year' },
    { value: '3', label: 'Third Year' },
    { value: '4', label: 'Fourth Year' }
  ];

  // AI Voice function - ONLY NEW ADDITION
  const speakSuccessMessage = () => {
    if ('speechSynthesis' in window) {
      const messages = [
        `Congratulations! Your vote has been successfully recorded. Thank you for participating in this democratic process and making your voice heard.`,
        `Excellent! Your vote has been cast successfully. Your participation strengthens our democratic values and student community.`,
        `Outstanding! Your vote has been securely registered. Thank you for being an active participant in shaping the future of your student body.`,
        `Wonderful! Your democratic choice has been recorded successfully. Your engagement in this voting process is truly commendable and valuable.`,
        `Fantastic! Your vote has been cast with success. Thank you for exercising your democratic right and contributing to positive change.`
      ];
      
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      const utterance = new SpeechSynthesisUtterance(randomMessage);
      
      // Configure voice settings for a pleasant AI voice
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 0.8;
      
      // Try to use a female voice if available
      const voices = speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.name.includes('Female') || 
        voice.name.includes('Samantha') || 
        voice.name.includes('Karen') ||
        voice.name.includes('Zira')
      );
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      speechSynthesis.speak(utterance);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!votingEnabled) {
      showMessage('Voting is currently disabled!', 'error');
      return;
    }

    const student = authenticateStudent(
      formData.studentId,
      formData.studentName,
      formData.department,
      formData.year
    );

    if (!student) {
      showMessage('Authentication failed! Please check your credentials.', 'error');
      return;
    }

    setCurrentUser(student);
    showMessage('Authentication successful! Redirecting to voting page...', 'success');
    
    setTimeout(() => {
      setShowVoting(true);
    }, 1500);
  };

  const handleVote = () => {
    if (!currentUser || !selectedCandidate) return;

    const vote = {
      studentId: currentUser.id,
      candidateId: selectedCandidate,
      timestamp: new Date().toISOString(),
      department: currentUser.department,
      year: currentUser.year
    };

    addVote(vote);
    
    // ONLY NEW LINE - Trigger AI voice when vote is cast
    speakSuccessMessage();
    
    setShowSuccessModal(true);
    
    setTimeout(() => {
      setShowSuccessModal(false);
      setShowVoting(false);
      setFormData({ studentId: '', studentName: '', department: '', year: '' });
      setSelectedCandidate(null);
      setCurrentUser(null);
    }, 4000);
  };

  const showMessage = (msg: string, type: 'success' | 'error') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 5000);
  };

  if (showVoting && currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden">
        <FloatingParticles />
        
        {/* Success Modal */}
        {showSuccessModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 p-8 rounded-3xl shadow-2xl transform animate-pulse border-4 border-white/30 max-w-md w-full text-center">
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 rounded-3xl animate-ping"></div>
                <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/30">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <CheckCircle size={40} className="text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">🎉 Vote Cast Successfully! 🎉</h3>
                  <p className="text-white/90 text-lg mb-4">Your voice has been heard!</p>
                  <div className="bg-white/20 rounded-xl p-3 border border-white/30">
                    <p className="text-white font-semibold">Thank you for participating in democracy</p>
                    <p className="text-green-100 text-sm mt-1">Your vote is secure and anonymous</p>
                  </div>
                  <div className="mt-4 flex justify-center">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="container mx-auto px-6 py-8 relative z-10">
          <button
            onClick={() => setShowVoting(false)}
            className="mb-8 bg-white/10 backdrop-blur-lg text-white px-6 py-3 rounded-xl flex items-center gap-3 hover:bg-white/20 transition-all duration-300 border border-white/20"
          >
            <ArrowLeft size={20} />
            Back to Login
          </button>

          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">Cast Your Vote</h1>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 inline-block">
              <h2 className="text-xl text-white mb-2">Welcome, {currentUser.name}!</h2>
              <p className="text-blue-200">
                {currentUser.id} | {currentUser.department} | Year {currentUser.year}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {candidates.map((candidate) => (
              <div
                key={candidate.id}
                onClick={() => setSelectedCandidate(candidate.id)}
                className={`candidate-card cursor-pointer p-8 rounded-3xl border transition-all duration-500 transform hover:scale-105 ${
                  selectedCandidate === candidate.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 border-white/40 text-white shadow-2xl scale-105'
                    : 'bg-white/10 backdrop-blur-lg border-white/20 text-white hover:bg-white/20'
                }`}
              >
                <div className="text-center mb-6">
                  <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-bold ${
                    selectedCandidate === candidate.id 
                      ? 'bg-white/20' 
                      : 'bg-gradient-to-r from-purple-500 to-pink-500'
                  }`}>
                    {candidate.name.charAt(0)}
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{candidate.name}</h3>
                  <p className="opacity-90">{candidate.department} - {candidate.year}</p>
                </div>
                
                <div className={`p-6 rounded-2xl ${
                  selectedCandidate === candidate.id ? 'bg-white/20' : 'bg-white/10'
                }`}>
                  <p className="text-sm leading-relaxed">{candidate.manifesto}</p>
                </div>
                
                {selectedCandidate === candidate.id && (
                  <div className="mt-6 text-center">
                    <CheckCircle size={32} className="text-green-300 mx-auto" />
                    <p className="font-semibold mt-2">Selected</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={handleVote}
              disabled={!selectedCandidate}
              className="bg-gradient-to-r from-green-500 to-emerald-600 disabled:from-gray-500 disabled:to-gray-600 text-white px-12 py-4 rounded-xl font-bold text-xl hover:from-green-600 hover:to-emerald-700 disabled:hover:from-gray-500 disabled:hover:to-gray-600 transform hover:scale-105 disabled:hover:scale-100 transition-all duration-300 shadow-lg disabled:cursor-not-allowed"
            >
              <Vote size={24} className="inline mr-3" />
              Cast My Vote
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 relative overflow-hidden">
      <FloatingParticles />
      
      <div className="container mx-auto px-6 py-8 relative z-10">
        <button
          onClick={() => navigate('/')}
          className="mb-8 bg-white/10 backdrop-blur-lg text-white px-6 py-3 rounded-xl flex items-center gap-3 hover:bg-white/20 transition-all duration-300 border border-white/20"
        >
          <ArrowLeft size={20} />
          Back to Home
        </button>

        <Header />

        <div className="max-w-2xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
            <div className="text-center mb-8">
              <User size={48} className="text-blue-300 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Student Authentication</h2>
              <p className="text-blue-100">Secure login for verified students</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="form-group">
                <label className="block text-white font-semibold mb-2 flex items-center gap-2">
                  <User size={20} />
                  Student ID
                </label>
                <input
                  type="text"
                  value={formData.studentId}
                  onChange={(e) => handleInputChange('studentId', e.target.value)}
                  placeholder="Enter your Student ID (e.g., 21IT001)"
                  className="w-full px-4 py-4 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
                  required
                />
              </div>

              <div className="form-group">
                <label className="block text-white font-semibold mb-2 flex items-center gap-2">
                  <User size={20} />
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.studentName}
                  onChange={(e) => handleInputChange('studentName', e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-4 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
                  required
                />
              </div>

              <div className="form-group">
                <label className="block text-white font-semibold mb-2 flex items-center gap-2">
                  <Building size={20} />
                  Department
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                  className="w-full px-4 py-4 bg-white/10 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
                  required
                >
                  <option value="" className="bg-gray-800">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept.value} value={dept.value} className="bg-gray-800">
                      {dept.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="block text-white font-semibold mb-2 flex items-center gap-2">
                  <Calendar size={20} />
                  Academic Year
                </label>
                <select
                  value={formData.year}
                  onChange={(e) => handleInputChange('year', e.target.value)}
                  className="w-full px-4 py-4 bg-white/10 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
                  required
                >
                  <option value="" className="bg-gray-800">Select Year</option>
                  {years.map((year) => (
                    <option key={year.value} value={year.value} className="bg-gray-800">
                      {year.label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg flex items-center justify-center gap-3"
              >
                <Vote size={24} />
                Authenticate & Vote
              </button>
            </form>

            {message && (
              <div className={`mt-6 p-4 rounded-xl text-center font-semibold ${
                messageType === 'success' 
                  ? 'bg-green-500/20 border border-green-400/30 text-green-200' 
                  : 'bg-red-500/20 border border-red-400/30 text-red-200'
              }`}>
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VotingPortal;
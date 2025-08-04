import React, { useState } from 'react';
import { ArrowLeft, Shield, Key, Eye, EyeOff, Fingerprint, Smartphone, Lock, Camera, User, Scan, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

const AuthenticationPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showBiometricVerification, setShowBiometricVerification] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState({
    fingerprint: 'pending',
    photo: 'pending',
    iris: 'pending'
  });
  const [fingerprintScanning, setFingerprintScanning] = useState(false);
  const [fingerprintHover, setFingerprintHover] = useState(false);

  // Simple Header Component
  const Header = ({ title, subtitle }) => (
    <div className="text-center mb-16">
      <h1 className="text-5xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl text-blue-100 max-w-3xl mx-auto">{subtitle}</p>
    </div>
  );

  // Simple FloatingParticles Component
  const FloatingParticles = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-white/20 rounded-full animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDuration: `${2 + Math.random() * 3}s`,
            animationDelay: `${Math.random() * 2}s`
          }}
        />
      ))}
    </div>
  );

  const authMethods = [
    {
      icon: Key,
      title: 'Student ID Authentication',
      description: 'Primary verification using university credentials',
      features: ['Instant verification', 'Database validation', 'Anti-fraud protection']
    },
    {
      icon: Fingerprint,
      title: 'Biometric Verification',
      description: 'Advanced biometric scanning for enhanced security',
      features: ['Unique identification', 'Cannot be duplicated', 'Instant processing'],
      onClick: () => setShowBiometricVerification(true)
    },
    {
      icon: Smartphone,
      title: 'Two-Factor Authentication',
      description: 'Mobile device verification for additional security',
      features: ['SMS verification', 'App-based codes', 'Time-sensitive tokens']
    }
  ];

  const securityFeatures = [
    {
      title: 'End-to-End Encryption',
      description: 'All data is encrypted using AES-256 standards',
      icon: Lock
    },
    {
      title: 'Blockchain Verification',
      description: 'Votes are recorded on immutable blockchain',
      icon: Shield
    },
    {
      title: 'Zero-Knowledge Proof',
      description: 'Vote verification without revealing identity',
      icon: Eye
    }
  ];

  const biometricMethods = [
    {
      id: 'fingerprint',
      icon: Fingerprint,
      title: 'Fingerprint Scanning',
      description: 'Scan your fingerprint for unique identification',
      status: verificationStatus.fingerprint,
      action: 'Place your finger on the scanner'
    },
    {
      id: 'photo',
      icon: Camera,
      title: 'Photo Verification',
      description: 'Facial recognition for identity confirmation',
      status: verificationStatus.photo,
      action: 'Look directly at the camera'
    },
    {
      id: 'iris',
      icon: Scan,
      title: 'Iris Recognition',
      description: 'Advanced iris pattern scanning',
      status: verificationStatus.iris,
      action: 'Look into the iris scanner'
    }
  ];

  const simulateVerification = (type) => {
    if (type === 'fingerprint') {
      setFingerprintScanning(true);
      setVerificationStatus(prev => ({ ...prev, [type]: 'processing' }));
      return; // Don't auto-complete for fingerprint
    }
    
    setVerificationStatus(prev => ({ ...prev, [type]: 'processing' }));
    
    setTimeout(() => {
      setVerificationStatus(prev => ({ ...prev, [type]: 'success' }));
    }, 3000);
  };

  const handleFingerprintScan = () => {
    if (fingerprintHover && fingerprintScanning) {
      setTimeout(() => {
        setVerificationStatus(prev => ({ ...prev, fingerprint: 'success' }));
        setFingerprintScanning(false);
      }, 1500);
    }
  };

  // Check fingerprint hover status
  React.useEffect(() => {
    if (fingerprintHover && fingerprintScanning) {
      handleFingerprintScan();
    }
  }, [fingerprintHover, fingerprintScanning]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="text-green-400" size={24} />;
      case 'processing':
        return <RefreshCw className="text-blue-400 animate-spin" size={24} />;
      case 'failed':
        return <XCircle className="text-red-400" size={24} />;
      default:
        return <div className="w-6 h-6 border-2 border-white/30 rounded-full"></div>;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'border-green-400 bg-green-400/20';
      case 'processing':
        return 'border-blue-400 bg-blue-400/20';
      case 'failed':
        return 'border-red-400 bg-red-400/20';
      default:
        return 'border-white/30 bg-white/10';
    }
  };

  if (showBiometricVerification) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden">
        <FloatingParticles />
        
        <div className="container mx-auto px-6 py-8 relative z-10">
          <button
            onClick={() => setShowBiometricVerification(false)}
            className="mb-8 bg-white/10 backdrop-blur-lg text-white px-6 py-3 rounded-xl flex items-center gap-3 hover:bg-white/20 transition-all duration-300 border border-white/20"
          >
            <ArrowLeft size={20} />
            Back to Authentication
          </button>

          <Header 
            title="Biometric Verification System"
            subtitle="Advanced multi-modal biometric authentication for maximum security"
          />

          {/* Biometric Progress */}
          <div className="mb-12">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-4">Verification Progress</h3>
              <div className="flex justify-center items-center gap-8">
                {biometricMethods.map((method) => (
                  <div key={method.id} className="flex flex-col items-center">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${getStatusColor(method.status)}`}>
                      <method.icon size={28} className="text-white" />
                    </div>
                    <span className="text-white text-sm font-medium">{method.title.split(' ')[0]}</span>
                    <div className="mt-1">{getStatusIcon(method.status)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Biometric Verification Methods */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {biometricMethods.map((method) => (
              <div
                key={method.id}
                className={`bg-white/10 backdrop-blur-lg rounded-3xl p-8 border transition-all duration-500 transform hover:scale-105 ${getStatusColor(method.status)}`}
              >
                <div className="text-center mb-6">
                  <div className={`w-24 h-24 mx-auto rounded-2xl flex items-center justify-center mb-4 ${
                    method.status === 'success' ? 'bg-gradient-to-r from-green-500 to-green-600' :
                    method.status === 'processing' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                    'bg-gradient-to-r from-purple-500 to-pink-600'
                  }`}>
                    <method.icon size={40} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{method.title}</h3>
                  <p className="text-blue-100 mb-4">{method.description}</p>
                </div>

                {/* Verification Area */}
                <div className="bg-black/30 rounded-2xl p-6 mb-6 min-h-[200px] flex flex-col items-center justify-center">
                  {method.status === 'pending' && (
                    <div className="text-center">
                      {method.id === 'fingerprint' ? (
                        <>
                          <div className="w-20 h-20 border-4 border-white/30 border-dashed rounded-full flex items-center justify-center mb-4 animate-pulse">
                            <method.icon size={32} className="text-white/60" />
                          </div>
                          <p className="text-white/80 mb-4">{method.action}</p>
                          <button
                            onClick={() => simulateVerification(method.id)}
                            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
                          >
                            Start Fingerprint Scan
                          </button>
                        </>
                      ) : (
                        <>
                          <div className="w-20 h-20 border-4 border-white/30 border-dashed rounded-full flex items-center justify-center mb-4 animate-pulse">
                            <method.icon size={32} className="text-white/60" />
                          </div>
                          <p className="text-white/80 mb-4">{method.action}</p>
                          <button
                            onClick={() => simulateVerification(method.id)}
                            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
                          >
                            Start Scan
                          </button>
                        </>
                      )}
                    </div>
                  )}

                  {method.status === 'processing' && (
                    <div className="text-center">
                      {method.id === 'fingerprint' && fingerprintScanning ? (
                        <>
                          <div 
                            className={`w-20 h-20 border-4 rounded-full flex items-center justify-center mb-4 transition-all duration-500 cursor-pointer ${
                              fingerprintHover ? 'border-green-400 bg-green-400/20 scale-110' : 'border-blue-400 animate-pulse'
                            }`}
                            onMouseEnter={() => setFingerprintHover(true)}
                            onMouseLeave={() => setFingerprintHover(false)}
                          >
                            <Fingerprint size={32} className={`transition-all duration-300 ${
                              fingerprintHover ? 'text-green-400' : 'text-blue-400'
                            }`} />
                          </div>
                          <p className={`mb-2 transition-all duration-300 ${
                            fingerprintHover ? 'text-green-300' : 'text-blue-300'
                          }`}>
                            {fingerprintHover ? 'Fingerprint detected!' : 'Place your finger on the scanner'}
                          </p>
                          <p className="text-white/60 text-sm">
                            {fingerprintHover ? 'Scanning...' : 'Hover your mouse over the scanner'}
                          </p>
                          {fingerprintHover && (
                            <div className="w-full bg-white/20 rounded-full h-2 mt-4">
                              <div className="bg-green-400 h-2 rounded-full animate-pulse" style={{width: '90%'}}></div>
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          <div className="w-20 h-20 border-4 border-blue-400 rounded-full flex items-center justify-center mb-4 animate-pulse">
                            <RefreshCw size={32} className="text-blue-400 animate-spin" />
                          </div>
                          <p className="text-blue-300 mb-2">Scanning in progress...</p>
                          <p className="text-white/60 text-sm">Please hold still</p>
                          <div className="w-full bg-white/20 rounded-full h-2 mt-4">
                            <div className="bg-blue-400 h-2 rounded-full animate-pulse" style={{width: '70%'}}></div>
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {method.status === 'success' && (
                    <div className="text-center">
                      <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle size={32} className="text-white" />
                      </div>
                      <p className="text-green-300 mb-2">Verification Successful</p>
                      <p className="text-white/60 text-sm">Identity confirmed</p>
                    </div>
                  )}

                  {method.status === 'failed' && (
                    <div className="text-center">
                      <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mb-4">
                        <XCircle size={32} className="text-white" />
                      </div>
                      <p className="text-red-300 mb-2">Verification Failed</p>
                      <p className="text-white/60 text-sm mb-4">Please try again</p>
                      <button
                        onClick={() => {
                          setVerificationStatus(prev => ({ ...prev, [method.id]: 'pending' }));
                          if (method.id === 'fingerprint') {
                            setFingerprintScanning(false);
                            setFingerprintHover(false);
                          }
                        }}
                        className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-4 py-2 rounded-lg font-bold hover:from-red-600 hover:to-pink-700 transition-all duration-300"
                      >
                        Retry
                      </button>
                    </div>
                  )}
                </div>

                {/* Status Indicator */}
                <div className="text-center">
                  <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${
                    method.status === 'success' ? 'bg-green-500/20 text-green-300' :
                    method.status === 'processing' ? 'bg-blue-500/20 text-blue-300' :
                    method.status === 'failed' ? 'bg-red-500/20 text-red-300' :
                    'bg-white/20 text-white/60'
                  }`}>
                    {getStatusIcon(method.status)}
                    {method.status === 'success' ? 'Verified' :
                     method.status === 'processing' ? 'Processing' :
                     method.status === 'failed' ? 'Failed' : 'Waiting'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Security Information */}
          <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-lg rounded-3xl p-8 border border-blue-400/30 mb-8">
            <h4 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <Shield size={28} />
              Biometric Security Features
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-blue-100">
              <div>
                <h5 className="font-bold text-white mb-2">Privacy Protection</h5>
                <p>Biometric data is processed locally and never stored permanently</p>
              </div>
              <div>
                <h5 className="font-bold text-white mb-2">Anti-Spoofing</h5>
                <p>Advanced liveness detection prevents fake biometric attempts</p>
              </div>
              <div>
                <h5 className="font-bold text-white mb-2">Multi-Modal Security</h5>
                <p>Combination of multiple biometrics for enhanced accuracy</p>
              </div>
              <div>
                <h5 className="font-bold text-white mb-2">Instant Verification</h5>
                <p>Real-time processing with sub-second response times</p>
              </div>
            </div>
          </div>

          {/* Complete Verification Button */}
          {Object.values(verificationStatus).every(status => status === 'success') && (
            <div className="text-center">
              <button
                onClick={() => {
                  setShowBiometricVerification(false);
                  setCurrentStep(3);
                }}
                className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-green-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
              >
                Complete Biometric Verification
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden">
      <FloatingParticles />
      
      <div className="container mx-auto px-6 py-8 relative z-10">
        <button
          onClick={() => window.history.back()}
          className="mb-8 bg-white/10 backdrop-blur-lg text-white px-6 py-3 rounded-xl flex items-center gap-3 hover:bg-white/20 transition-all duration-300 border border-white/20"
        >
          <ArrowLeft size={20} />
          Back to Home
        </button>

        <Header 
          title="Secure Authentication System"
          subtitle="Multi-layered security for verified student access"
        />

        {/* Authentication Steps */}
        <div className="mb-16">
          <div className="flex justify-center mb-12">
            <div className="flex items-center space-x-8">
              {[1, 2, 3].map((step) => (
                <React.Fragment key={step}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                    currentStep >= step 
                      ? 'bg-gradient-to-r from-green-400 to-blue-500 text-white' 
                      : 'bg-white/20 text-white/60'
                  }`}>
                    {step}
                  </div>
                  {step < 3 && (
                    <div className={`w-16 h-1 transition-all duration-300 ${
                      currentStep > step ? 'bg-gradient-to-r from-green-400 to-blue-500' : 'bg-white/20'
                    }`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="text-center text-white mb-8">
            <h3 className="text-2xl font-bold mb-2">
              {currentStep === 1 && "Step 1: Primary Authentication"}
              {currentStep === 2 && "Step 2: Biometric Verification"}
              {currentStep === 3 && "Step 3: Final Security Check"}
            </h3>
            <p className="text-blue-100">
              {currentStep === 1 && "Enter your student credentials for initial verification"}
              {currentStep === 2 && "Biometric scan for identity confirmation"}
              {currentStep === 3 && "Two-factor authentication completion"}
            </p>
          </div>
        </div>

        {/* Authentication Methods */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {authMethods.map((method, index) => (
            <div
              key={index}
              onClick={method.onClick}
              className={`bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-500 transform hover:scale-105 ${
                currentStep === index + 1 ? 'ring-2 ring-blue-400 bg-white/20' : ''
              } ${method.onClick ? 'cursor-pointer' : ''}`}
            >
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <method.icon size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{method.title}</h3>
              <p className="text-blue-100 mb-6">{method.description}</p>
              <ul className="space-y-2">
                {method.features.map((feature, idx) => (
                  <li key={idx} className="text-blue-200 flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Demo Authentication Form */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
            <h3 className="text-2xl font-bold text-white mb-6 text-center flex items-center justify-center gap-3">
              <Key size={28} />
              Demo Authentication
            </h3>
            
            <div className="space-y-6">
              <div className="form-group">
                <label className="block text-white font-semibold mb-2">Student ID</label>
                <input
                  type="text"
                  placeholder="Enter your Student ID (e.g., 21IT001)"
                  className="w-full px-4 py-4 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
                />
              </div>

              <div className="form-group">
                <label className="block text-white font-semibold mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="w-full px-4 py-4 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setCurrentStep(currentStep < 3 ? currentStep + 1 : 1)}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
              >
                {currentStep < 3 ? `Proceed to Step ${currentStep + 1}` : 'Complete Authentication'}
              </button>
            </div>
          </div>
        </div>

        {/* Security Features */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-white text-center mb-12">Advanced Security Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {securityFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 text-center hover:bg-white/15 transition-all duration-500 transform hover:scale-105"
              >
                <feature.icon size={48} className="text-blue-300 mx-auto mb-4" />
                <h4 className="text-xl font-bold text-white mb-3">{feature.title}</h4>
                <p className="text-blue-100">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Authentication Flow Demo */}
        <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-lg rounded-3xl p-8 border border-blue-400/30 text-center">
          <h4 className="text-2xl font-bold text-white mb-4">Ready to Experience Secure Voting?</h4>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Our authentication system ensures that only verified students can participate in elections while maintaining complete privacy and security.
          </p>
          <button
            onClick={() => alert('Navigate to voting portal')}
            className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-green-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
          >
            Start Secure Voting Process
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthenticationPage;
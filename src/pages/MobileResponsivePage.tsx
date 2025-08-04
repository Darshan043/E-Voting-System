import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Smartphone, Tablet, Monitor, Wifi, Zap, Shield } from 'lucide-react';
import Header from '../components/Header';
import FloatingParticles from '../components/FloatingParticles';

const MobileResponsivePage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedDevice, setSelectedDevice] = useState('mobile');

  const devices = [
    { id: 'mobile', name: 'Mobile', icon: Smartphone, width: '375px', height: '667px' },
    { id: 'tablet', name: 'Tablet', icon: Tablet, width: '768px', height: '1024px' },
    { id: 'desktop', name: 'Desktop', icon: Monitor, width: '1200px', height: '800px' }
  ];

  const responsiveFeatures = [
    {
      icon: Smartphone,
      title: 'Mobile-First Design',
      description: 'Optimized for touch interfaces and mobile usage patterns',
      details: ['Touch-optimized buttons', 'Swipe gestures', 'Thumb-friendly navigation']
    },
    {
      icon: Wifi,
      title: 'Offline Capability',
      description: 'Works seamlessly even with poor internet connectivity',
      details: ['Local data caching', 'Queue votes offline', 'Auto-sync when online']
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Optimized performance across all device types',
      details: ['Sub-second loading', 'Minimal data usage', 'Smooth animations']
    },
    {
      icon: Shield,
      title: 'Secure on Mobile',
      description: 'Advanced security features for mobile devices',
      details: ['Biometric authentication', 'Device fingerprinting', 'Session management']
    }
  ];

  const performanceMetrics = [
    { label: 'Load Time', mobile: '0.8s', tablet: '0.6s', desktop: '0.4s' },
    { label: 'Bundle Size', mobile: '45KB', tablet: '52KB', desktop: '68KB' },
    { label: 'Performance Score', mobile: '98/100', tablet: '99/100', desktop: '100/100' },
    { label: 'Accessibility', mobile: '100%', tablet: '100%', desktop: '100%' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-600 via-rose-600 to-orange-600 relative overflow-hidden">
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
          title="Mobile Responsive Design"
          subtitle="Seamless experience across all devices and screen sizes"
        />

        {/* Device Selector */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-white text-center mb-8">Interactive Device Preview</h3>
          <div className="flex justify-center gap-4 mb-8">
            {devices.map((device) => (
              <button
                key={device.id}
                onClick={() => setSelectedDevice(device.id)}
                className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-300 ${
                  selectedDevice === device.id
                    ? 'bg-white/20 text-white border border-white/40'
                    : 'bg-white/10 text-white/70 border border-white/20 hover:bg-white/15'
                }`}
              >
                <device.icon size={20} />
                {device.name}
              </button>
            ))}
          </div>

          {/* Device Frame */}
          <div className="flex justify-center">
            <div className="device-frame bg-gray-800 p-6 rounded-3xl shadow-2xl">
              <div className="device-screen bg-white rounded-2xl overflow-hidden shadow-inner relative">
                <div 
                  className="demo-interface bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col transition-all duration-500"
                  style={{ 
                    width: devices.find(d => d.id === selectedDevice)?.width, 
                    height: devices.find(d => d.id === selectedDevice)?.height,
                    transform: `scale(${selectedDevice === 'desktop' ? 0.5 : selectedDevice === 'tablet' ? 0.6 : 0.8})`
                  }}
                >
                  {/* Demo Interface */}
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 text-center">
                    <h4 className="font-bold">RIT E-Voting</h4>
                    <p className="text-sm opacity-90">Mobile Interface</p>
                  </div>
                  
                  <div className="flex-1 p-6 space-y-4">
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-full"></div>
                        <div>
                          <div className="font-semibold text-gray-800">Candidate A</div>
                          <div className="text-gray-600 text-sm">Computer Science</div>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full w-3/4"></div>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-green-500 rounded-full"></div>
                        <div>
                          <div className="font-semibold text-gray-800">Candidate B</div>
                          <div className="text-gray-600 text-sm">Information Technology</div>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full w-1/2"></div>
                      </div>
                    </div>
                    
                    <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold">
                      Cast Vote
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Responsive Features */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-white text-center mb-12">Responsive Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {responsiveFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-500"
              >
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <feature.icon size={24} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-white mb-3">{feature.title}</h4>
                    <p className="text-rose-100 mb-4">{feature.description}</p>
                    <ul className="space-y-2">
                      {feature.details.map((detail, idx) => (
                        <li key={idx} className="text-rose-200 flex items-center gap-2">
                          <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
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

        {/* Performance Metrics */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 mb-12">
          <h3 className="text-2xl font-bold text-white mb-8 text-center">Performance Across Devices</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left text-white font-semibold py-3">Metric</th>
                  <th className="text-center text-white font-semibold py-3">Mobile</th>
                  <th className="text-center text-white font-semibold py-3">Tablet</th>
                  <th className="text-center text-white font-semibold py-3">Desktop</th>
                </tr>
              </thead>
              <tbody>
                {performanceMetrics.map((metric, index) => (
                  <tr key={index} className="border-b border-white/10">
                    <td className="text-white py-4 font-medium">{metric.label}</td>
                    <td className="text-center text-rose-200 py-4">{metric.mobile}</td>
                    <td className="text-center text-rose-200 py-4">{metric.tablet}</td>
                    <td className="text-center text-rose-200 py-4">{metric.desktop}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-orange-500/20 to-pink-500/20 backdrop-blur-lg rounded-3xl p-8 border border-orange-400/30 text-center">
          <Smartphone size={48} className="text-orange-300 mx-auto mb-4" />
          <h4 className="text-2xl font-bold text-white mb-4">Experience Mobile Voting</h4>
          <p className="text-orange-100 mb-6 max-w-2xl mx-auto">
            Try our mobile-optimized voting interface on your device. Experience the smooth, responsive design that works perfectly on any screen size.
          </p>
          <button
            onClick={() => navigate('/voting-portal')}
            className="bg-gradient-to-r from-orange-500 to-pink-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-orange-600 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
          >
            Test Mobile Interface
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileResponsivePage;
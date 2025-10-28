// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Stethoscope, Shield, Zap, Users } from 'lucide-react';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className={`space-y-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      {/* Hero Section */}
      <section className="text-center space-y-8">
        <h1 className="text-5xl font-light text-slate-800 animate-fade-in">
          AI-Powered Tuberculosis Detection
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed animate-fade-in delay-200">
          Advanced deep learning technology for accurate and early detection of Tuberculosis from chest X-ray images
        </p>
        
        {!isAuthenticated && (
          <div className="space-x-4 animate-fade-in delay-400">
            <Link 
              to="/signup" 
              className="bg-gradient-to-r from-[#FF8F8F] to-[#B7A3E3] text-white px-8 py-4 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-medium text-lg shadow-lg"
            >
              Get Started
            </Link>
            <Link 
              to="/login" 
              className="bg-white/60 text-slate-700 px-8 py-4 rounded-full border border-slate-300 hover:border-[#FF8F8F] backdrop-blur-sm transition-all duration-300 font-medium text-lg hover:shadow-lg transform hover:scale-105"
            >
              Patient Login
            </Link>
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-3 gap-8">
        <div className="bg-white/60 backdrop-blur-lg rounded-3xl p-8 border border-[#FF8F8F]/20 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-500 text-center group">
          <div className="bg-[#FF8F8F]/10 p-4 rounded-2xl inline-flex mb-6 group-hover:scale-110 transition-transform duration-300">
            <Zap className="h-8 w-8 text-[#FF8F8F]" />
          </div>
          <h3 className="text-xl font-medium text-slate-800 mb-3 group-hover:text-[#FF8F8F] transition-colors duration-300">AI-Powered Analysis</h3>
          <p className="text-slate-600 leading-relaxed group-hover:text-slate-700 transition-colors duration-300">
            Advanced deep learning models provide accurate TB detection from chest X-rays
          </p>
        </div>
        
        <div className="bg-white/60 backdrop-blur-lg rounded-3xl p-8 border border-[#B7A3E3]/20 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-500 delay-100 text-center group">
          <div className="bg-[#B7A3E3]/10 p-4 rounded-2xl inline-flex mb-6 group-hover:scale-110 transition-transform duration-300">
            <Shield className="h-8 w-8 text-[#B7A3E3]" />
          </div>
          <h3 className="text-xl font-medium text-slate-800 mb-3 group-hover:text-[#B7A3E3] transition-colors duration-300">Secure & Private</h3>
          <p className="text-slate-600 leading-relaxed group-hover:text-slate-700 transition-colors duration-300">
            Your medical data is encrypted and stored securely with strict privacy controls
          </p>
        </div>
        
        <div className="bg-white/60 backdrop-blur-lg rounded-3xl p-8 border border-[#C2E2FA]/20 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-500 delay-200 text-center group">
          <div className="bg-[#C2E2FA]/10 p-4 rounded-2xl inline-flex mb-6 group-hover:scale-110 transition-transform duration-300">
            <Users className="h-8 w-8 text-[#C2E2FA]" />
          </div>
          <h3 className="text-xl font-medium text-slate-800 mb-3 group-hover:text-[#C2E2FA] transition-colors duration-300">Expert Review</h3>
          <p className="text-slate-600 leading-relaxed group-hover:text-slate-700 transition-colors duration-300">
            Certified radiologists provide secondary validation for critical cases
          </p>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="bg-gradient-to-r from-[#FF8F8F]/10 to-[#B7A3E3]/10 rounded-3xl p-12 text-center border border-[#FF8F8F]/20 backdrop-blur-sm animate-fade-in delay-600">
          <h2 className="text-3xl font-light text-slate-800 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Join thousands of users who trust DeepTB for accurate TB screening and early detection
          </p>
          <div className="space-x-4">
            <Link 
              to="/signup" 
              className="bg-gradient-to-r from-[#FF8F8F] to-[#B7A3E3] text-white px-8 py-4 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-medium text-lg shadow-lg"
            >
              Create Account
            </Link>
            <Link 
              to="/doctor/login" 
              className="bg-white/60 text-slate-700 px-8 py-4 rounded-full border border-slate-300 hover:border-[#FF8F8F] backdrop-blur-sm transition-all duration-300 font-medium text-lg hover:shadow-lg transform hover:scale-105"
            >
              Doctor Login
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
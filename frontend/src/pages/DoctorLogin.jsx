// src/pages/DoctorLogin.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { doctorAPI } from '../services/api';
import { Eye, EyeOff, Stethoscope, Heart, Shield } from 'lucide-react';

const DoctorLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [doctorExists, setDoctorExists] = useState(true);
  
  const { doctorLogin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    checkDoctorExists();
  }, []);

  const checkDoctorExists = async () => {
    try {
      const response = await doctorAPI.checkExists();
      setDoctorExists(response.data.hasDoctor);
    } catch (error) {
      console.error('Error checking doctor exists:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await doctorLogin(formData.email, formData.password);
    
    if (result.success) {
      navigate('/doctor/dashboard');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF1CB] to-[#C2E2FA] flex items-center justify-center p-4 animate-fade-in">
      {/* Medical-themed background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#FF8F8F]/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#B7A3E3]/20 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-[#C2E2FA]/30 rounded-full blur-2xl animate-bounce-slow"></div>
      </div>

      <div className="relative max-w-md w-full bg-white/80 backdrop-blur-lg rounded-3xl p-8 border border-white/60 shadow-2xl shadow-[#FF8F8F]/20 transform hover:scale-[1.02] transition-all duration-500 animate-slide-up">
        {/* Medical badge */}
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="bg-white border border-[#FF8F8F] rounded-2xl px-4 py-2 shadow-lg flex items-center space-x-2">
            <Shield className="h-4 w-4 text-[#FF8F8F]" />
            <span className="text-sm font-medium text-[#FF8F8F]">Medical Portal</span>
          </div>
        </div>

        <div className="flex items-center justify-center mb-8 mt-4 animate-scale-in">
          <div className="relative">
            <div className="bg-gradient-to-br from-[#FF8F8F] to-[#B7A3E3] p-4 rounded-2xl shadow-lg transform hover:rotate-12 transition-transform duration-300">
              <Stethoscope className="h-8 w-8 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 bg-[#FF8F8F] rounded-full p-1 shadow-lg animate-pulse">
              <Heart className="h-4 w-4 text-white" />
            </div>
          </div>
          <div className="ml-4">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-[#FF8F8F] to-[#B7A3E3] bg-clip-text text-transparent">
              Doctor Login
            </h2>
            <p className="text-sm text-slate-600 mt-1">Secure medical access</p>
          </div>
        </div>
        
        {!doctorExists && (
          <div className="bg-[#C2E2FA] border border-[#B7A3E3] rounded-2xl p-4 mb-6 transform transition-all duration-300 hover:shadow-md hover:scale-[1.02] animate-fade-in">
            <div className="flex items-start">
              <div className="bg-[#B7A3E3] p-2 rounded-xl mr-3">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-[#FF8F8F]">No doctor registered yet</p>
                <p className="text-sm text-[#B7A3E3] mt-1">
                  <Link to="/doctor/signup" className="underline font-medium hover:text-[#FF8F8F] transition-colors duration-300">
                    Register as the first doctor
                  </Link>
                </p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 transform transition-all duration-300 hover:shadow-md hover:scale-[1.02] animate-shake">
            <div className="flex items-center">
              <div className="bg-red-100 p-2 rounded-xl mr-3">
                <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2 animate-slide-up delay-100">
            <label htmlFor="email" className="block text-sm font-semibold text-slate-700">
              Professional Email
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-4 border border-slate-300 rounded-2xl focus:outline-none focus:ring-3 focus:ring-[#FF8F8F]/50 focus:border-[#FF8F8F] transition-all duration-300 bg-white/80 backdrop-blur-sm hover:border-[#B7A3E3]"
                placeholder="doctor@hospital.com"
                required
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="space-y-2 animate-slide-up delay-200">
            <label htmlFor="password" className="block text-sm font-semibold text-slate-700">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-4 border border-slate-300 rounded-2xl focus:outline-none focus:ring-3 focus:ring-[#FF8F8F]/50 focus:border-[#FF8F8F] transition-all duration-300 bg-white/80 backdrop-blur-sm pr-12 hover:border-[#B7A3E3]"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center transition-colors duration-300 hover:text-[#FF8F8F]"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-slate-500" />
                ) : (
                  <Eye className="h-5 w-5 text-slate-500" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#FF8F8F] to-[#B7A3E3] text-white py-4 rounded-2xl hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 font-semibold disabled:opacity-50 disabled:transform-none disabled:hover:shadow-none flex items-center justify-center space-x-2 animate-pulse hover:animate-none"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <Stethoscope className="h-5 w-5" />
                <span>Sign In as Doctor</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-8 space-y-4 animate-fade-in delay-500">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white/80 text-slate-600">Quick Access</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-center">
            <Link 
              to="/doctor/signup" 
              className="bg-white border border-slate-300 text-slate-700 py-3 rounded-2xl hover:border-[#FF8F8F] hover:text-[#FF8F8F] transition-all duration-300 font-medium hover:shadow-md transform hover:scale-[1.05]"
            >
              Register
            </Link>
            <Link 
              to="/login" 
              className="bg-white border border-slate-300 text-slate-700 py-3 rounded-2xl hover:border-[#B7A3E3] hover:text-[#B7A3E3] transition-all duration-300 font-medium hover:shadow-md transform hover:scale-[1.05]"
            >
              Patient Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorLogin;
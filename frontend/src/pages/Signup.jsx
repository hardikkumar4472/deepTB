import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, User, Heart, Calendar, Phone, Mail, ArrowLeft } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
    age: '',
    gender: ''
  });
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1: Basic info, 2: OTP verification
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const { signup, verifyOTP } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate basic fields
    if (!formData.name || !formData.email || !formData.phoneNumber || !formData.age || !formData.gender) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    // Validate age is a number
    if (formData.age && isNaN(formData.age)) {
      setError('Age must be a valid number');
      setLoading(false);
      return;
    }

    try {
      const result = await signup(formData);
      
      if (result.success) {
        setStep(2);
        setSuccess('OTP sent to your email! Please check your inbox.');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  if (!otp || otp.length !== 6) {
    setError('Please enter a valid 6-digit OTP');
    setLoading(false);
    return;
  }

  try {
    // ✅ CORRECT: Pass email and OTP as separate parameters
    const result = await verifyOTP(formData.email, otp);
    
    if (result.success) {
      setSuccess('Registration successful! Redirecting...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } else {
      setError(result.error);
    }
  } catch (err) {
    setError('Failed to verify OTP');
  } finally {
    setLoading(false);
  }
};

 const handleResendOTP = async () => {
  setLoading(true);
  setError('');
  
  try {
    // Just call signup again with the same data
    const result = await signup(formData);
    
    if (result.success) {
      setSuccess('New OTP sent to your email!');
    } else {
      setError(result.error);
    }
  } catch (err) {
    setError('Failed to resend OTP');
  } finally {
    setLoading(false);
  }
};

  const goBackToForm = () => {
    setStep(1);
    setOtp('');
    setError('');
    setSuccess('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF1CB] to-[#C2E2FA] py-8 px-4 animate-fade-in">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 w-32 h-32 bg-[#FF8F8F]/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-[#B7A3E3]/20 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>
        <div className="absolute top-1/3 left-1/4 w-24 h-24 bg-[#C2E2FA]/30 rounded-full blur-2xl animate-bounce-slow"></div>
      </div>

      <div className="relative max-w-2xl mx-auto bg-white/80 backdrop-blur-lg rounded-3xl border border-white/60 shadow-2xl shadow-[#FF8F8F]/20 overflow-hidden transform hover:scale-[1.01] transition-all duration-500 animate-slide-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#FF8F8F] to-[#B7A3E3] p-6 text-white">
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm transform hover:rotate-12 transition-transform duration-300">
              <User className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold animate-scale-in">
                {step === 1 ? 'Patient Registration' : 'Verify Email'}
              </h1>
              <p className="text-[#FFF1CB]">
                {step === 1 ? 'Join our healthcare platform' : 'Enter OTP sent to your email'}
              </p>
            </div>
          </div>
        </div>

        <div className="p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 animate-shake">
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

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6 animate-fade-in">
              <div className="flex items-center">
                <div className="bg-green-100 p-2 rounded-xl mr-3">
                  <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-green-700 font-medium">{success}</p>
              </div>
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleSendOTP} className="space-y-6">
              {/* Personal Information */}
              <div className="bg-[#FFF1CB]/50 rounded-2xl p-6 transform transition-all duration-300 hover:scale-[1.01] animate-slide-up delay-100">
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                  <Heart className="h-5 w-5 text-[#FF8F8F] mr-2 animate-pulse" />
                  Personal Information
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="animate-slide-up delay-150">
                    <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#FF8F8F] focus:border-transparent transition-all duration-300 bg-white hover:border-[#B7A3E3]"
                      placeholder="John Smith"
                      required
                    />
                  </div>

                  <div className="animate-slide-up delay-200">
                    <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#FF8F8F] focus:border-transparent transition-all duration-300 bg-white hover:border-[#B7A3E3]"
                      placeholder="patient@example.com"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-[#C2E2FA]/50 rounded-2xl p-6 transform transition-all duration-300 hover:scale-[1.01] animate-slide-up delay-300">
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                  <Phone className="h-5 w-5 text-[#B7A3E3] mr-2 animate-bounce" />
                  Contact Information
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="animate-slide-up delay-350">
                    <label htmlFor="phoneNumber" className="block text-sm font-semibold text-slate-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#FF8F8F] focus:border-transparent transition-all duration-300 bg-white hover:border-[#B7A3E3]"
                      placeholder="+1234567890"
                      required
                    />
                  </div>

                  <div className="animate-slide-up delay-400">
                    <label htmlFor="age" className="block text-sm font-semibold text-slate-700 mb-2">
                      <Calendar className="h-4 w-4 inline mr-1 animate-pulse" />
                      Age
                    </label>
                    <input
                      type="number"
                      id="age"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      min="1"
                      max="120"
                      className="w-full px-4 py-3 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#FF8F8F] focus:border-transparent transition-all duration-300 bg-white hover:border-[#B7A3E3]"
                      placeholder="25"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Gender Selection */}
              <div className="bg-[#FFF1CB]/50 rounded-2xl p-6 transform transition-all duration-300 hover:scale-[1.01] animate-slide-up delay-500">
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                  <svg className="h-5 w-5 text-[#FF8F8F] mr-2 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                  Gender
                </h3>
                <div className="grid md:grid-cols-3 gap-4 animate-slide-up delay-550">
                  {['Male', 'Female', 'Other'].map((genderOption) => (
                    <label
                      key={genderOption}
                      className={`flex items-center p-4 border-2 rounded-2xl cursor-pointer transition-all duration-300 ${
                        formData.gender === genderOption
                          ? 'border-[#FF8F8F] bg-[#FF8F8F]/10'
                          : 'border-slate-300 hover:border-[#B7A3E3] hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="gender"
                        value={genderOption}
                        checked={formData.gender === genderOption}
                        onChange={handleChange}
                        className="sr-only"
                        required
                      />
                      <div className={`w-5 h-5 border-2 rounded-full mr-3 flex items-center justify-center transition-all duration-300 ${
                        formData.gender === genderOption
                          ? 'border-[#FF8F8F] bg-[#FF8F8F]'
                          : 'border-slate-400'
                      }`}>
                        {formData.gender === genderOption && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                      <span className="font-medium text-slate-700">{genderOption}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Security */}
              <div className="bg-[#C2E2FA]/50 rounded-2xl p-6 transform transition-all duration-300 hover:scale-[1.01] animate-slide-up delay-700">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Security</h3>
                <div className="animate-slide-up delay-750">
                  <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#FF8F8F] focus:border-transparent transition-all duration-300 bg-white pr-12 hover:border-[#B7A3E3]"
                      placeholder="Minimum 6 characters"
                      required
                      minLength="6"
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
                  <p className="text-sm text-slate-500 mt-2">Minimum 6 characters required</p>
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
                    <span>Sending OTP...</span>
                  </>
                ) : (
                  <>
                    <Mail className="h-5 w-5" />
                    <span>Send Verification OTP</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            // OTP Verification Step
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <div className="text-center mb-6">
                <div className="bg-[#FFF1CB]/50 p-6 rounded-2xl mb-4">
                  <Mail className="h-12 w-12 text-[#FF8F8F] mx-auto mb-4 animate-bounce" />
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">
                    Verify Your Email
                  </h3>
                  <p className="text-slate-600">
                    We've sent a 6-digit OTP to:<br />
                    <strong className="text-[#FF8F8F]">{formData.email}</strong>
                  </p>
                  <p className="text-sm text-slate-500 mt-2">
                    The OTP will expire in 5 minutes
                  </p>
                </div>
              </div>

              <div className="bg-[#C2E2FA]/50 rounded-2xl p-6">
                <label htmlFor="otp" className="block text-sm font-semibold text-slate-700 mb-4 text-center">
                  Enter OTP Code
                </label>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full px-4 py-4 text-2xl font-bold text-center border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#FF8F8F] focus:border-transparent transition-all duration-300 bg-white hover:border-[#B7A3E3] tracking-widest"
                  placeholder="000000"
                  maxLength="6"
                  required
                />
                <p className="text-sm text-slate-500 mt-2 text-center">
                  Enter the 6-digit code from your email
                </p>
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={goBackToForm}
                  disabled={loading}
                  className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-2xl hover:bg-slate-50 transition-all duration-200 font-medium disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back</span>
                </button>
                
                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="flex-1 bg-gradient-to-r from-[#FF8F8F] to-[#B7A3E3] text-white py-3 rounded-2xl hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 font-semibold disabled:opacity-50 disabled:transform-none disabled:hover:shadow-none flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <User className="h-5 w-5" />
                      <span>Complete Registration</span>
                    </>
                  )}
                </button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={loading}
                  className="text-[#FF8F8F] hover:text-[#B7A3E3] font-medium transition-colors duration-300 text-sm"
                >
                  Didn't receive the code? Resend OTP
                </button>
              </div>
            </form>
          )}

          <div className="mt-8 text-center animate-fade-in delay-1000">
            <p className="text-slate-600">
              Already have an account?{' '}
              <Link to="/login" className="text-[#FF8F8F] hover:text-[#B7A3E3] font-semibold transition-colors duration-300">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
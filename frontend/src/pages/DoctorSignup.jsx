// src/pages/DoctorSignup.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { doctorAPI } from '../services/api';
import { Eye, EyeOff, Stethoscope, Heart, Shield, Award, Calendar } from 'lucide-react';

const DoctorSignup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
    licenseNumber: '',
    specialization: '',
    hospital: '',
    qualifications: '',
    yearsOfExperience: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [doctorExists, setDoctorExists] = useState(false);
  
  const { doctorSignup } = useAuth();
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

    const submitData = {
      ...formData,
      qualifications: formData.qualifications ? formData.qualifications.split(',').map(q => q.trim()) : [],
      yearsOfExperience: parseInt(formData.yearsOfExperience)
    };

    const result = await doctorSignup(submitData);
    
    if (result.success) {
      navigate('/doctor/dashboard');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  if (doctorExists) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFF1CB] to-[#C2E2FA] flex items-center justify-center p-4 animate-fade-in">
        <div className="max-w-md w-full bg-white/80 backdrop-blur-lg rounded-3xl p-8 border border-white/60 shadow-2xl shadow-[#FF8F8F]/20 text-center transform hover:scale-[1.02] transition-all duration-500 animate-bounce-in">
          <div className="bg-[#FF8F8F] p-4 rounded-2xl inline-flex mb-6 animate-pulse">
            <Shield className="h-12 w-12 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-[#FF8F8F] mb-4">Doctor Already Registered</h2>
          <p className="text-slate-600 mb-6 leading-relaxed">
            This medical system already has a registered healthcare professional. 
            For security reasons, only one doctor account can be created per instance.
          </p>
          <Link 
            to="/doctor/login" 
            className="bg-gradient-to-r from-[#FF8F8F] to-[#B7A3E3] text-white px-8 py-4 rounded-2xl hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 font-semibold inline-flex items-center space-x-2 animate-pulse hover:animate-none"
          >
            <Stethoscope className="h-5 w-5" />
            <span>Go to Doctor Login</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF1CB] to-[#C2E2FA] py-8 px-4 animate-fade-in">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-[#FF8F8F]/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-[#B7A3E3]/20 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>
        <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-[#C2E2FA]/30 rounded-full blur-2xl animate-bounce-slow"></div>
      </div>

      <div className="relative max-w-4xl mx-auto bg-white/80 backdrop-blur-lg rounded-3xl border border-white/60 shadow-2xl shadow-[#FF8F8F]/20 overflow-hidden transform hover:scale-[1.01] transition-all duration-500 animate-slide-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#FF8F8F] to-[#B7A3E3] p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm transform hover:rotate-12 transition-transform duration-300">
                <Stethoscope className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold animate-scale-in">Doctor Registration</h1>
                <p className="text-[#FFF1CB]">Join our medical platform</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-2xl backdrop-blur-sm transform hover:scale-110 transition-transform duration-300">
              <Shield className="h-5 w-5" />
              <span className="font-semibold">Secure Registration</span>
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

          <form onSubmit={handleSubmit} className="space-y-8">
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
                    placeholder="Dr. John Smith"
                    required
                  />
                </div>

                <div className="animate-slide-up delay-200">
                  <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                    Professional Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#FF8F8F] focus:border-transparent transition-all duration-300 bg-white hover:border-[#B7A3E3]"
                    placeholder="doctor@hospital.com"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Professional Details */}
            <div className="bg-[#C2E2FA]/50 rounded-2xl p-6 transform transition-all duration-300 hover:scale-[1.01] animate-slide-up delay-300">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                <Award className="h-5 w-5 text-[#B7A3E3] mr-2 animate-bounce" />
                Professional Details
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="animate-slide-up delay-350">
                  <label htmlFor="licenseNumber" className="block text-sm font-semibold text-slate-700 mb-2">
                    Medical License Number
                  </label>
                  <input
                    type="text"
                    id="licenseNumber"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#FF8F8F] focus:border-transparent transition-all duration-300 bg-white hover:border-[#B7A3E3]"
                    placeholder="MED123456"
                    required
                  />
                </div>

                <div className="animate-slide-up delay-400">
                  <label htmlFor="specialization" className="block text-sm font-semibold text-slate-700 mb-2">
                    Specialization
                  </label>
                  <select
                    id="specialization"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#FF8F8F] focus:border-transparent transition-all duration-300 bg-white hover:border-[#B7A3E3]"
                    required
                  >
                    <option value="">Select Specialization</option>
                    <option value="Radiology">Radiology</option>
                    <option value="Pulmonology">Pulmonology</option>
                    <option value="Infectious Diseases">Infectious Diseases</option>
                    <option value="General Medicine">General Medicine</option>
                    <option value="Tuberculosis Specialist">Tuberculosis Specialist</option>
                    <option value="Chest Physician">Chest Physician</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="animate-slide-up delay-450">
                  <label htmlFor="yearsOfExperience" className="block text-sm font-semibold text-slate-700 mb-2">
                    <Calendar className="h-4 w-4 inline mr-1 animate-pulse" />
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    id="yearsOfExperience"
                    name="yearsOfExperience"
                    value={formData.yearsOfExperience}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#FF8F8F] focus:border-transparent transition-all duration-300 bg-white hover:border-[#B7A3E3]"
                    min="0"
                    max="60"
                    required
                  />
                </div>

                <div className="animate-slide-up delay-500">
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
                    required
                  />
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="bg-[#FFF1CB]/50 rounded-2xl p-6 transform transition-all duration-300 hover:scale-[1.01] animate-slide-up delay-550">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Additional Information</h3>
              <div className="space-y-6">
                <div className="animate-slide-up delay-600">
                  <label htmlFor="hospital" className="block text-sm font-semibold text-slate-700 mb-2">
                    Hospital/Clinic
                  </label>
                  <input
                    type="text"
                    id="hospital"
                    name="hospital"
                    value={formData.hospital}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#FF8F8F] focus:border-transparent transition-all duration-300 bg-white hover:border-[#B7A3E3]"
                    required
                  />
                </div>

                <div className="animate-slide-up delay-650">
                  <label htmlFor="qualifications" className="block text-sm font-semibold text-slate-700 mb-2">
                    Qualifications (comma separated)
                  </label>
                  <input
                    type="text"
                    id="qualifications"
                    name="qualifications"
                    value={formData.qualifications}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#FF8F8F] focus:border-transparent transition-all duration-300 bg-white hover:border-[#B7A3E3]"
                    placeholder="MBBS, MD, etc."
                  />
                </div>
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
                  <span>Registering...</span>
                </>
              ) : (
                <>
                  <Stethoscope className="h-5 w-5" />
                  <span>Complete Registration</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center animate-fade-in delay-1000">
            <p className="text-slate-600">
              Already have an account?{' '}
              <Link to="/doctor/login" className="text-[#FF8F8F] hover:text-[#B7A3E3] font-semibold transition-colors duration-300">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorSignup;
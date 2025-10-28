import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI, doctorAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const doctorToken = localStorage.getItem('doctorToken');
      
      if (token) {
        const userDataString = localStorage.getItem('userData');
        if (userDataString && userDataString !== 'undefined') {
          try {
            const userData = JSON.parse(userDataString);
            setUser(userData);
          } catch (parseError) {
            console.error('Failed to parse userData:', parseError);
            localStorage.removeItem('userData');
            localStorage.removeItem('token');
          }
        }
      }
      
      if (doctorToken) {
        const doctorDataString = localStorage.getItem('doctorData');
        if (doctorDataString && doctorDataString !== 'undefined') {
          try {
            const doctorData = JSON.parse(doctorDataString);
            setDoctor(doctorData);
          } catch (parseError) {
            console.error('Failed to parse doctorData:', parseError);
            localStorage.removeItem('doctorData');
            localStorage.removeItem('doctorToken');
          }
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('userData');
      localStorage.removeItem('doctorData');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('userData', JSON.stringify(user));
      setUser(user);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.msg || 'Login failed' 
      };
    }
  };

  const doctorLogin = async (email, password) => {
    try {
      const response = await doctorAPI.login({ email, password });
      const { token, doctor } = response.data;
      
      localStorage.setItem('doctorToken', token);
      localStorage.setItem('doctorData', JSON.stringify(doctor));
      setDoctor(doctor);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.msg || 'Doctor login failed' 
      };
    }
  };

const signup = async (userData) => {
  try {
    console.log('💾 SIGNUP: Saving user data to localStorage', userData);
    
    localStorage.setItem('pendingUserData', JSON.stringify(userData));
    localStorage.setItem('pendingEmail', userData.email);
    
    const saved = localStorage.getItem('pendingUserData');
    const savedEmail = localStorage.getItem('pendingEmail');
    console.log('✅ SIGNUP: Data saved -', { saved, savedEmail });

    const response = await authAPI.signup(userData);
    
    return { 
      success: true, 
      message: 'OTP sent to your email',
      data: response.data 
    };
  } catch (error) {
    console.error('❌ SIGNUP: Failed -', error.response?.data);
    
    localStorage.removeItem('pendingUserData');
    localStorage.removeItem('pendingEmail');
    
    return { 
      success: false, 
      error: error.response?.data?.msg || 'Signup failed' 
    };
  }
};

  const doctorSignup = async (doctorData) => {
    try {
      const response = await doctorAPI.signup(doctorData);
      
      return { 
        success: true, 
        message: 'OTP sent to your email',
        data: response.data 
      };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.msg || 'Doctor registration failed' 
      };
    }
  };

const verifyOTP = async (email, otp) => {
  try {
    console.log('🔍 DEBUG: Starting OTP verification');
    console.log('Email:', email);
    console.log('OTP:', otp);

    const pendingUserDataStr = localStorage.getItem('pendingUserData');
    console.log('Stored user data (raw):', pendingUserDataStr);
    
    let userData = {};
    if (pendingUserDataStr && pendingUserDataStr !== 'undefined') {
      try {
        userData = JSON.parse(pendingUserDataStr);
        console.log('Parsed user data:', userData);
      } catch (parseError) {
        console.error('Failed to parse user data:', parseError);
      }
    }

    const requestData = {
      name: userData.name || '',
      email: email,
      password: userData.password || '',
      age: userData.age || '',
      gender: userData.gender || '',
      phoneNumber: userData.phoneNumber || '',
      otp: otp
    };

    console.log('🎯 Final request data:', requestData);

    const response = await authAPI.verifyOTP(requestData);
    console.log('✅ OTP verification successful:', response.data);
    
    const { token, user } = response.data;
    
    localStorage.setItem('token', token);
    localStorage.setItem('userData', JSON.stringify(user));
    
    localStorage.removeItem('pendingUserData');
    localStorage.removeItem('pendingEmail');
    
    setUser(user);
    
    return { success: true };
  } catch (error) {
    console.error('❌ OTP verification failed:');
    console.error('Status:', error.response?.status);
    console.error('Error data:', error.response?.data);
    console.error('Error message:', error.message);
    
    return { 
      success: false, 
      error: error.response?.data?.msg || 'OTP verification failed' 
    };
  }
};

  const verifyDoctorOTP = async (email, otp) => {
    try {
      const response = await doctorAPI.verifyOTP({ email, otp });
      const { token, doctor } = response.data;
      
      localStorage.setItem('doctorToken', token);
      localStorage.setItem('doctorData', JSON.stringify(doctor));
      setDoctor(doctor);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.msg || 'OTP verification failed' 
      };
    }
  };

  const resendOTP = async (email) => {
    try {
      const response = await authAPI.resendOTP({ email });
      return { 
        success: true, 
        message: response.data?.msg || 'OTP resent successfully' 
      };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.msg || 'Failed to resend OTP' 
      };
    }
  };

  const resendDoctorOTP = async (email) => {
    try {
      const response = await doctorAPI.resendOTP({ email });
      return { 
        success: true, 
        message: response.data?.msg || 'OTP resent successfully' 
      };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.msg || 'Failed to resend OTP' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    localStorage.removeItem('doctorToken');
    localStorage.removeItem('doctorData');
    setUser(null);
    setDoctor(null);
  };

  const value = {
    user,
    doctor,
    login,
    doctorLogin,
    signup,
    doctorSignup,
    verifyOTP,
    verifyDoctorOTP,
    resendOTP,
    resendDoctorOTP,
    logout,
    loading,
    isAuthenticated: !!user || !!doctor,
    isDoctor: !!doctor,
    isPatient: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
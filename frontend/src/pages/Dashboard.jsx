// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { resultsAPI, reportsAPI } from '../services/api';
import { Upload, History, User, Activity, FileText } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalPredictions: 0,
    totalReports: 0
  });
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    fetchStats();
    setIsVisible(true);
  }, []);

  const fetchStats = async () => {
    try {
      const [predictionsResponse, reportsResponse] = await Promise.all([
        resultsAPI.getCount(),
        reportsAPI.getCount()
      ]);

      setStats({
        totalPredictions: predictionsResponse.data.totalReports || 0,
        totalReports: reportsResponse.data.totalReports || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statsData = [
    {
      title: 'TB Predictions',
      value: loading ? '...' : stats.totalPredictions.toString(),
      description: 'Total predictions made',
      icon: Activity,
      color: 'text-[#FF8F8F]',
      bgColor: 'bg-[#FF8F8F]/10',
      borderColor: 'border-[#FF8F8F]/20'
    },

  ];

  const quickActions = [
    {
      title: 'Predict TB',
      description: 'Upload chest X-ray for TB detection',
      icon: Upload,
      link: '/predict',
      gradient: 'from-[#FF8F8F] to-[#B7A3E3]',
      hoverGradient: 'from-[#FF8F8F]/90 to-[#B7A3E3]/90'
    },
  ];

  return (
    <div className={`space-y-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      {/* Welcome Section */}
      <div className="text-center">
        <h1 className="text-3xl font-light text-slate-800">
          Welcome back, <span className="font-medium text-[#FF8F8F]">{user?.name}!</span>
        </h1>
        <p className="text-slate-600 mt-3">
          Manage your TB screening and medical reports
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <div 
            key={index} 
            className={`bg-white/60 backdrop-blur-lg rounded-3xl p-6 border ${stat.borderColor} shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-500 delay-${index * 100}`}
          >
            <div className="flex items-center">
              <div className={`p-3 rounded-2xl ${stat.bgColor} backdrop-blur-sm`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                <p className="text-2xl font-light text-slate-800">
                  {stat.value}
                </p>
                <p className="text-xs text-slate-500 mt-1">{stat.description}</p>
              </div>
            </div>
          </div>
        ))}
        
        {/* User Info Card */}
        <div className="bg-white/60 backdrop-blur-lg rounded-3xl p-6 border border-[#C2E2FA]/20 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-500 delay-300">
          <div className="flex items-center">
            <div className="p-3 rounded-2xl bg-[#C2E2FA]/10 backdrop-blur-sm">
              <User className="h-6 w-6 text-[#C2E2FA]" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600">Patient ID</p>
              <p className="text-2xl font-light text-slate-800">
                {user?.id?.slice(-8) || 'N/A'}
              </p>
              <p className="text-xs text-slate-500 mt-1">Your unique identifier</p>
            </div>
          </div>
        </div>

        {/* Additional Info Card */}
        <div className="bg-white/60 backdrop-blur-lg rounded-3xl p-6 border border-[#FFF1CB]/20 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-500 delay-450">
          <div className="flex items-center">
            <div className="p-3 rounded-2xl bg-[#FFF1CB]/10 backdrop-blur-sm">
              <History className="h-6 w-6 text-[#FFF1CB]" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600">Success Rate</p>
              <p className="text-2xl font-light text-slate-800">
                {loading ? '...' : stats.totalPredictions > 0 ? '100%' : '0%'}
              </p>
              <p className="text-xs text-slate-500 mt-1">Completed screenings</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className={`transition-all duration-700 delay-600 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <h2 className="text-xl font-light text-slate-800 mb-6">Quick Actions</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.link}
              className="bg-white/60 backdrop-blur-lg rounded-3xl p-6 border border-slate-200/40 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-500 group"
            >
              <div className="flex items-center">
                <div className={`p-3 rounded-2xl bg-gradient-to-r ${action.gradient} text-white group-hover:bg-gradient-to-r ${action.hoverGradient} transition-all duration-300 shadow-lg`}>
                  <action.icon className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-slate-800 group-hover:text-[#FF8F8F] transition-colors duration-300">
                    {action.title}
                  </h3>
                  <p className="text-slate-600 group-hover:text-slate-700 transition-colors duration-300">{action.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className={`bg-white/60 backdrop-blur-lg rounded-3xl p-6 border border-slate-200/40 shadow-lg transition-all duration-700 delay-800 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <h2 className="text-xl font-light text-slate-800 mb-4">Recent Activity</h2>
        <div className="text-center py-8">
          {stats.totalPredictions === 0 ? (
            <>
              <Activity className="h-12 w-12 text-slate-400 mx-auto mb-4 animate-pulse" />
              <p className="text-slate-500">No predictions yet</p>
              <p className="text-sm text-slate-400 mt-1">
                Get started by uploading your first chest X-ray
              </p>
              <Link 
                to="/predict" 
                className="bg-gradient-to-r from-[#FF8F8F] to-[#B7A3E3] text-white px-6 py-3 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-medium mt-4 inline-block shadow-lg"
              >
                Make First Prediction
              </Link>
            </>
          ) : (
            <>
              <History className="h-12 w-12 text-[#FF8F8F] mx-auto mb-4 animate-bounce" />
              <p className="text-slate-600">
                You have made {stats.totalPredictions} prediction{stats.totalPredictions !== 1 ? 's' : ''} and our system has
                generated {stats.totalReports} report{stats.totalReports !== 1 ? 's' : ''} till now
              </p>
              <p className="text-sm text-slate-400 mt-1">
                Check your history for detailed results and reports
              </p>
              <div className="flex justify-center space-x-4 mt-4">
                <Link 
                  to="/history" 
                  className="bg-gradient-to-r from-[#FF8F8F] to-[#B7A3E3] text-white px-6 py-3 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-medium shadow-lg"
                >
                  View History
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

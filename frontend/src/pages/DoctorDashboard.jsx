// src/pages/DoctorDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { reportsAPI, patientsAPI } from '../services/api';
import { Users, FileText, Clock, CheckCircle, Plus } from 'lucide-react';
import CreateReportModal from '../components/doctor/CreateReportModal';

const DoctorDashboard = () => {
  const { doctor } = useAuth();
  const navigate = useNavigate();
  const [pendingReports, setPendingReports] = useState([]);
  const [stats, setStats] = useState({
    totalReports: 0,
    pendingReviews: 0,
    approvedReports: 0,
    totalPatients: 0
  });
  const [loading, setLoading] = useState(true);
  const [createReportModal, setCreateReportModal] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    fetchDashboardData();
    setIsVisible(true);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [reportsResponse, countResponse, patientsResponse] = await Promise.all([
        reportsAPI.getPending(),
        reportsAPI.getCount(),
        patientsAPI.getAll()
      ]);
      
      setPendingReports(reportsResponse.data.reports || []);
      setStats({
        totalReports: countResponse.data.totalReports || 0,
        pendingReviews: reportsResponse.data.reports?.length || 0,
        approvedReports: 0,
        totalPatients: patientsResponse.data.count || 0
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReportCreated = (newReport) => {
    fetchDashboardData();
  };

  const statsData = [
    {
      title: 'Pending Reviews',
      value: stats.pendingReviews,
      icon: Clock,
      color: 'text-[#FF8F8F]',
      bgColor: 'bg-[#FF8F8F]/10',
      borderColor: 'border-[#FF8F8F]/20'
    },
    {
      title: 'Total Reports',
      value: stats.totalReports,
      icon: FileText,
      color: 'text-[#B7A3E3]',
      bgColor: 'bg-[#B7A3E3]/10',
      borderColor: 'border-[#B7A3E3]/20'
    },
    {
      title: 'Total Patients',
      value: stats.totalPatients,
      icon: Users,
      color: 'text-[#C2E2FA]',
      bgColor: 'bg-[#C2E2FA]/10',
      borderColor: 'border-[#C2E2FA]/20'
    },
    {
      title: 'Create Report',
      value: 'New',
      icon: Plus,
      color: 'text-[#FFF1CB]',
      bgColor: 'bg-[#FFF1CB]/10',
      borderColor: 'border-[#FFF1CB]/20',
      action: true
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF8F8F]"></div>
      </div>
    );
  }

  return (
    <div className={`space-y-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      {/* Welcome Section */}
      <div className="text-center">
        <h1 className="text-3xl font-light text-slate-800">
          Welcome, <span className="font-medium text-[#FF8F8F]">Dr. {doctor?.name}!</span>
        </h1>
        <p className="text-slate-600 mt-3">
          {doctor?.specialization} • {doctor?.hospital}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <div 
            key={index} 
            className={`bg-white/60 backdrop-blur-lg rounded-3xl p-6 border ${stat.borderColor} shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-500 delay-${index * 100} cursor-pointer group`}
            onClick={stat.action ? () => setCreateReportModal(true) : undefined}
          >
            <div className="flex items-center">
              <div className={`p-3 rounded-2xl ${stat.bgColor} backdrop-blur-sm group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                <p className="text-2xl font-light text-slate-800">{stat.value}</p>
                {stat.action && (
                  <p className="text-xs text-slate-500 mt-1 group-hover:text-[#FF8F8F] transition-colors duration-300">Click to create</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions & Pending Reports */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <h2 className="text-xl font-light text-slate-800 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/doctor/reports')}
              className="w-full text-left p-4 border border-slate-200/40 rounded-2xl hover:bg-white/40 backdrop-blur-sm transition-all duration-300 bg-white/60 backdrop-blur-lg hover:shadow-lg transform hover:scale-105 group"
            >
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-[#B7A3E3] mr-3 group-hover:scale-110 transition-transform duration-300" />
                <div>
                  <h3 className="font-medium text-slate-800 group-hover:text-[#B7A3E3] transition-colors duration-300">Review Reports</h3>
                  <p className="text-sm text-slate-600">Check pending patient reports</p>
                </div>
              </div>
            </button>
            
            <button 
              onClick={() => navigate('/doctor/patients')}
              className="w-full text-left p-4 border border-slate-200/40 rounded-2xl hover:bg-white/40 backdrop-blur-sm transition-all duration-300 bg-white/60 backdrop-blur-lg hover:shadow-lg transform hover:scale-105 group"
            >
              <div className="flex items-center">
                <Users className="h-5 w-5 text-[#C2E2FA] mr-3 group-hover:scale-110 transition-transform duration-300" />
                <div>
                  <h3 className="font-medium text-slate-800 group-hover:text-[#C2E2FA] transition-colors duration-300">Patient Management</h3>
                  <p className="text-sm text-slate-600">View patient history and data</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Pending Reports */}
        <div className="lg:col-span-2">
          <div className="bg-white/60 backdrop-blur-lg rounded-3xl p-6 border border-slate-200/40 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-light text-slate-800 flex items-center">
                <Clock className="h-5 w-5 text-[#FF8F8F] mr-2 animate-pulse" />
                Pending Results ({pendingReports.length})
              </h2>
              {pendingReports.length > 0 && (
                <button
                  onClick={() => navigate('/doctor/reports')}
                  className="text-sm text-[#FF8F8F] hover:text-[#FF8F8F]/80 font-medium transition-colors duration-300"
                >
                  View All →
                </button>
              )}
            </div>
            
            {pendingReports.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-[#B7A3E3] mx-auto mb-4" />
                <p className="text-slate-500">No pending reports to review</p>
                <p className="text-sm text-slate-400 mt-1">
                  All reports have been processed
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingReports.slice(0, 5).map((report, index) => (
                  <div 
                    key={report._id} 
                    className={`border border-slate-200/40 rounded-2xl p-4 hover:bg-white/40 backdrop-blur-sm transition-all duration-300 hover:shadow-lg transform hover:scale-105 delay-${index * 100}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-slate-800">
                        {report.patientName || 'Unknown Patient'}
                      </h3>
                      <span className="text-xs bg-[#FF8F8F]/10 text-[#FF8F8F] px-3 py-1 rounded-full backdrop-blur-sm">
                        Pending
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mb-2">
                      AI Result: <span className={
                        report.label === 'Normal' ? 'text-[#B7A3E3]' : 'text-[#FF8F8F]'
                      }>
                        {report.label || 'N/A'}
                      </span>
                    </p>
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-slate-500">
                        Created: {report.createdAt ? new Date(report.createdAt).toLocaleDateString() : 'N/A'}
                      </p>
                      <button
                        onClick={() => navigate('/doctor/reports')}
                        className="text-sm text-[#FF8F8F] hover:text-[#FF8F8F]/80 font-medium transition-colors duration-300"
                      >
                        Review →
                      </button>
                    </div>
                  </div>
                ))}
                
                {pendingReports.length > 5 && (
                  <div className="text-center pt-4">
                    <button
                      onClick={() => navigate('/doctor/reports')}
                      className="bg-gradient-to-r from-[#FF8F8F] to-[#B7A3E3] text-white px-6 py-3 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-medium shadow-lg"
                    >
                      View All Reports ({pendingReports.length})
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Report Modal */}
      <CreateReportModal
        isOpen={createReportModal}
        onClose={() => setCreateReportModal(false)}
        onReportCreated={handleReportCreated}
      />
    </div>
  );
};

export default DoctorDashboard;
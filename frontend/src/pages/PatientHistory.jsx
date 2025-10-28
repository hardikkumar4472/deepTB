// src/components/doctor/PatientHistory.jsx
import React, { useState, useEffect } from 'react';
import { patientsAPI } from '../../services/api';
import { 
  User, Mail, Phone, Calendar, FileText, CheckCircle, 
  XCircle, Clock, Download, ArrowLeft, Eye, BarChart3 
} from 'lucide-react';

const PatientHistory = ({ patientId, onBack }) => {
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (patientId) {
      fetchPatientHistory();
    }
  }, [patientId]);

  const fetchPatientHistory = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await patientsAPI.getHistory(patientId);
      
      if (response.data.success) {
        setHistory(response.data);
      } else {
        setError(response.data.error || 'Failed to fetch patient history');
      }
    } catch (error) {
      console.error('Error fetching patient history:', error);
      setError(error.response?.data?.error || 'Failed to load patient history');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending_doctor':
        return <Clock className="h-4 w-4 text-orange-500" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'free_generated':
        return <FileText className="h-4 w-4 text-blue-500" />;
      default:
        return <FileText className="h-4 w-4 text-slate-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending_doctor':
        return 'bg-orange-100 text-orange-800';
      case 'approved':
        return 'bg-emerald-100 text-emerald-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'free_generated':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const downloadReport = (report) => {
    if (report.pdfUrl) {
      window.open(report.pdfUrl, '_blank');
    } else {
      alert('PDF report not available for download');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 max-w-md mx-auto">
          <XCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading History</h3>
          <p className="text-red-600">{error}</p>
          <button
            onClick={onBack}
            className="mt-4 px-6 py-2 border border-slate-300 text-slate-700 rounded-full hover:border-slate-400 transition-all duration-200 font-medium"
          >
            <ArrowLeft className="h-4 w-4 inline mr-2" />
            Back to Patients
          </button>
        </div>
      </div>
    );
  }

  if (!history) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 text-slate-400 hover:text-slate-600 transition-colors duration-200"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div>
            <h1 className="text-3xl font-light text-slate-800">Patient History</h1>
            <p className="text-slate-600 mt-1">
              Complete medical history and reports for {history.patient.name}
            </p>
          </div>
        </div>
      </div>

      {/* Patient Information Card */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-slate-200/60 shadow-sm mb-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center">
            <User className="h-5 w-5 text-slate-400 mr-3" />
            <div>
              <p className="text-sm text-slate-600">Patient Name</p>
              <p className="font-medium text-slate-800">{history.patient.name}</p>
            </div>
          </div>
          <div className="flex items-center">
            <Mail className="h-5 w-5 text-slate-400 mr-3" />
            <div>
              <p className="text-sm text-slate-600">Email</p>
              <p className="font-medium text-slate-800">{history.patient.email}</p>
            </div>
          </div>
          <div className="flex items-center">
            <Phone className="h-5 w-5 text-slate-400 mr-3" />
            <div>
              <p className="text-sm text-slate-600">Phone</p>
              <p className="font-medium text-slate-800">{history.patient.phoneNumber}</p>
            </div>
          </div>
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-slate-400 mr-3" />
            <div>
              <p className="text-sm text-slate-600">Age / Gender</p>
              <p className="font-medium text-slate-800">
                {history.patient.age} / {history.patient.gender}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-4 border border-slate-200/60 shadow-sm text-center">
          <div className="text-2xl font-bold text-slate-800">{history.statistics.totalReports}</div>
          <div className="text-sm text-slate-600">Total Reports</div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-4 border border-slate-200/60 shadow-sm text-center">
          <div className="text-2xl font-bold text-emerald-600">{history.statistics.approved}</div>
          <div className="text-sm text-slate-600">Approved</div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-4 border border-slate-200/60 shadow-sm text-center">
          <div className="text-2xl font-bold text-orange-600">{history.statistics.pending}</div>
          <div className="text-sm text-slate-600">Pending</div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-4 border border-slate-200/60 shadow-sm text-center">
          <div className="text-2xl font-bold text-red-600">{history.statistics.rejected}</div>
          <div className="text-sm text-slate-600">Rejected</div>
        </div>
      </div>

      {/* Reports List */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-slate-200/60 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-light text-slate-800 flex items-center">
            <BarChart3 className="h-5 w-5 text-cyan-600 mr-2" />
            Medical Reports ({history.reports.length})
          </h2>
        </div>

        {history.reports.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-slate-800 mb-3">No Reports Found</h3>
            <p className="text-slate-600">This patient has no medical reports yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {history.reports.map((report) => (
              <div key={report._id} className="border border-slate-200/60 rounded-2xl p-6 hover:bg-slate-50/50 transition-all duration-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-4">
                      <h3 className="text-lg font-medium text-slate-800">
                        TB Detection Report
                      </h3>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                        {getStatusIcon(report.status)}
                        <span className="ml-2 capitalize">
                          {report.status.replace('_', ' ')}
                        </span>
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                      <div>
                        <span className="text-slate-500">AI Result:</span>
                        <p className={`font-medium ${
                          report.label === 'Normal' ? 'text-emerald-600' : 'text-red-600'
                        }`}>
                          {report.label}
                        </p>
                      </div>
                      <div>
                        <span className="text-slate-500">Confidence:</span>
                        <p className="font-medium">
                          {report.raw_prediction ? (report.raw_prediction * 100).toFixed(2) + '%' : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <span className="text-slate-500">Date:</span>
                        <p className="font-medium">{formatDate(report.createdAt)}</p>
                      </div>
                    </div>

                    {report.doctorNotes && (
                      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                        <p className="text-sm text-blue-800">
                          <strong>Doctor Notes:</strong> {report.doctorNotes}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col space-y-3 ml-6">
                    <button
                      onClick={() => window.open(report.xrayUrl, '_blank')}
                      className="bg-white text-slate-700 px-4 py-2 rounded-full border border-slate-300 hover:border-cyan-300 transition-all duration-200 font-medium text-sm flex items-center"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View X-ray
                    </button>
                    
                    {(report.status === 'approved' || report.status === 'rejected') && (
                      <button
                        onClick={() => downloadReport(report)}
                        className="bg-white text-slate-700 px-4 py-2 rounded-full border border-slate-300 hover:border-cyan-300 transition-all duration-200 font-medium text-sm flex items-center"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientHistory;
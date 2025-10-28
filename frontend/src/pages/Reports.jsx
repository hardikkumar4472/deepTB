// src/pages/Reports.jsx
import React, { useState, useEffect } from 'react';
import { reportsAPI, patientsAPI } from '../services/api';
import { FileText, Search, Clock, CheckCircle, XCircle, Eye, User, Mail, Phone, Calendar } from 'lucide-react';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [reviewModal, setReviewModal] = useState(false);
  const [patientDetailModal, setPatientDetailModal] = useState(false);
  const [reviewNotes, setReviewNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [patientLoading, setPatientLoading] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  useEffect(() => {
    filterReports();
  }, [reports, searchTerm, statusFilter]);

  const fetchReports = async () => {
    try {
      const response = await reportsAPI.getPending();
      setReports(response.data.reports || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPatientDetails = async (patientId) => {
    if (!patientId) return null;
    
    try {
      setPatientLoading(true);
      const response = await patientsAPI.getById(patientId);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching patient details:', error);
      return null;
    } finally {
      setPatientLoading(false);
    }
  };

  const filterReports = () => {
    let filtered = reports;

    if (searchTerm) {
      filtered = filtered.filter(report =>
        report.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.patientEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.patientId?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(report => report.status === statusFilter);
    }

    setFilteredReports(filtered);
  };

  const handleReview = async (report, approve) => {
    setSelectedReport(report);
    setReviewNotes(report.doctorNotes || '');
    
    if (approve === false) {
      // For reject, show modal for notes
      setReviewModal(true);
    } else {
      // For approve, submit directly
      await submitReview(report._id, true, report.doctorNotes || '');
    }
  };

  const submitReview = async (reportId, approve, notes) => {
    setActionLoading(true);
    try {
      await reportsAPI.review(reportId, {
        approve: approve,
        doctorNotes: notes
      });
      
      setReviewModal(false);
      fetchReports(); // Refresh the list
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const viewPatientDetails = async (report) => {
    setSelectedReport(report);
    try {
      const patientDetails = await fetchPatientDetails(report.patientId);
      setSelectedPatient(patientDetails);
      setPatientDetailModal(true);
    } catch (error) {
      console.error('Error fetching patient details:', error);
      alert('Failed to load patient details');
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
      default:
        return <Clock className="h-4 w-4 text-slate-500" />;
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

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-light text-slate-800">Pending Patient Reports</h1>
        <p className="text-slate-600 mt-3">
          Review and manage patient TB detection reports
        </p>
      </div>

      {/* Stats Overview */}
      {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-4 border border-slate-200/60 shadow-sm">
          <div className="text-2xl font-bold text-orange-600">
            {reports.filter(r => r.status === 'pending_doctor').length}
          </div>
          <div className="text-sm text-slate-600">Pending Review</div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-4 border border-slate-200/60 shadow-sm">
          <div className="text-2xl font-bold text-emerald-600">
            {reports.filter(r => r.status === 'approved').length}
          </div>
          <div className="text-sm text-slate-600">Approved</div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-4 border border-slate-200/60 shadow-sm">
          <div className="text-2xl font-bold text-red-600">
            {reports.filter(r => r.status === 'rejected').length}
          </div>
          <div className="text-sm text-slate-600">Rejected</div>
        </div>
      </div> */}

      {/* Filters */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-slate-200/60 shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by patient name, email, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-12 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 sm:w-48"
          >
            <option value="all">All Status</option>
            <option value="pending_doctor">Pending Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {filteredReports.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-slate-200/60 shadow-sm text-center">
            <FileText className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-slate-800 mb-3">
              No Reports Found
            </h3>
            <p className="text-slate-600">
              {reports.length === 0 
                ? "There are no reports to review at the moment."
                : "No reports match your search criteria."
              }
            </p>
          </div>
        ) : (
          filteredReports.map((report) => (
            <div key={report._id} className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-6 flex-1">
                  <img
                    src={report.xrayUrl}
                    alt="X-ray"
                    className="w-20 h-20 object-cover rounded-2xl border border-slate-200"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/80x80?text=X-ray';
                    }}
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-lg font-medium text-slate-800">
                        {report.patientName || 'Unknown Patient'}
                      </h3>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                        {getStatusIcon(report.status)}
                        <span className="ml-2 capitalize">
                          {report.status ? report.status.replace('_', ' ') : 'Unknown'}
                        </span>
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm mb-4">
                      <div>
                        <span className="text-slate-500">Patient ID:</span>
                        <p className="font-medium font-mono text-xs">{report.patientId?.substring(0, 8)}...</p>
                      </div>
                      <div>
                        <span className="text-slate-500">AI Result:</span>
                        <p className={`font-medium ${
                          report.label === 'Normal' ? 'text-emerald-600' : 'text-red-600'
                        }`}>
                          {report.label || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <span className="text-slate-500">Confidence:</span>
                        <p className="font-medium">
                          {report.raw_prediction ? (report.raw_prediction * 100).toFixed(2) + '%' : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <span className="text-slate-500">Submitted:</span>
                        <p className="font-medium">
                          {report.createdAt ? formatDate(report.createdAt) : 'N/A'}
                        </p>
                      </div>
                    </div>

                    {report.doctorNotes && (
                      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3">
                        <p className="text-sm text-blue-800">
                          <strong>Doctor Notes:</strong> {report.doctorNotes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col space-y-3 ml-6">
                  <button
                    onClick={() => viewPatientDetails(report)}
                    className="bg-white text-slate-700 px-4 py-2 rounded-full border border-slate-300 hover:border-cyan-300 transition-all duration-200 font-medium text-sm flex items-center"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Patient Info
                  </button>
                  
                  <button
                    onClick={() => window.open(report.xrayUrl, '_blank')}
                    className="bg-white text-slate-700 px-4 py-2 rounded-full border border-slate-300 hover:border-cyan-300 transition-all duration-200 font-medium text-sm flex items-center"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View X-ray
                  </button>
                  
                  {report.status === 'pending_doctor' && (
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleReview(report, true)}
                        disabled={actionLoading}
                        className="bg-emerald-600 text-white px-4 py-2 rounded-full hover:bg-emerald-700 transition-all duration-200 font-medium text-sm disabled:opacity-50 flex-1"
                      >
                        {actionLoading ? '...' : 'Approve'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Review Modal */}
      {reviewModal && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-slate-800 mb-4">
              Reject Report - {selectedReport.patientName}
            </h3>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Doctor Notes (Required for Rejection)
              </label>
              <textarea
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                rows="4"
                className="w-full px-4 py-3 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                placeholder="Explain why you are rejecting this report..."
                required
              />
            </div>

            <div className="flex space-x-3 justify-end">
              <button
                onClick={() => setReviewModal(false)}
                className="bg-white text-slate-700 px-6 py-2 rounded-full border border-slate-300 hover:border-cyan-300 transition-all duration-200 font-medium"
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                onClick={() => submitReview(selectedReport._id, false, reviewNotes)}
                disabled={actionLoading || !reviewNotes.trim()}
                className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition-all duration-200 font-medium disabled:opacity-50"
              >
                {actionLoading ? 'Submitting...' : 'Reject Report'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Patient Detail Modal */}
      {patientDetailModal && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-light text-slate-800">
                    Patient Details
                  </h2>
                  <p className="text-slate-600">Report for {selectedReport.patientName}</p>
                </div>
                <button
                  onClick={() => setPatientDetailModal(false)}
                  className="text-slate-400 hover:text-slate-600 transition-colors duration-200"
                >
                  <span className="text-2xl">×</span>
                </button>
              </div>

              {patientLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
                </div>
              ) : selectedPatient ? (
                <div className="space-y-6">
                  {/* Patient Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-50 rounded-2xl p-4">
                      <h3 className="font-medium text-slate-800 mb-3 flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        Personal Information
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Full Name:</span>
                          <span className="font-medium">{selectedPatient.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Email:</span>
                          <span className="font-medium">{selectedPatient.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Phone:</span>
                          <span className="font-medium">{selectedPatient.phoneNumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Age:</span>
                          <span className="font-medium">{selectedPatient.age}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Gender:</span>
                          <span className="font-medium capitalize">{selectedPatient.gender?.toLowerCase()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-4">
                      <h3 className="font-medium text-slate-800 mb-3 flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        Account Information
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Patient ID:</span>
                          <span className="font-medium font-mono text-xs">{selectedPatient._id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Registered:</span>
                          <span className="font-medium">{formatDate(selectedPatient.createdAt)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Last Updated:</span>
                          <span className="font-medium">{formatDate(selectedPatient.updatedAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Report Information */}
                  <div className="border-t border-slate-200 pt-6">
                    <h3 className="text-lg font-medium text-slate-800 mb-4">Current Report</h3>
                    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-slate-600">AI Result:</span>
                          <p className={`font-medium ${
                            selectedReport.label === 'Normal' ? 'text-emerald-600' : 'text-red-600'
                          }`}>
                            {selectedReport.label}
                          </p>
                        </div>
                        <div>
                          <span className="text-slate-600">Confidence:</span>
                          <p className="font-medium">
                            {selectedReport.raw_prediction ? (selectedReport.raw_prediction * 100).toFixed(2) + '%' : 'N/A'}
                          </p>
                        </div>
                        <div>
                          <span className="text-slate-600">Status:</span>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedReport.status)}`}>
                            {selectedReport.status.replace('_', ' ')}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-600">Submitted:</span>
                          <p className="font-medium">{formatDate(selectedReport.createdAt)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <User className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                  <p>Unable to load patient details</p>
                </div>
              )}

              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-slate-200">
                <button
                  onClick={() => setPatientDetailModal(false)}
                  className="px-6 py-2 border border-slate-300 text-slate-700 rounded-full hover:border-slate-400 transition-all duration-200 font-medium"
                >
                  Close
                </button>
                {selectedReport.status === 'pending_doctor' && (
                  <button
                    onClick={() => {
                      setPatientDetailModal(false);
                      handleReview(selectedReport, true);
                    }}
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all duration-200 font-medium"
                  >
                    Approve Report
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
import React, { useState, useEffect } from 'react';
import { patientsAPI, resultsAPI, reportsAPI } from '../../services/api';
import { X, Search, User, FileText, Mail, Calendar, CheckCircle, AlertCircle, Eye } from 'lucide-react';

const CreateReportModal = ({ isOpen, onClose, onReportCreated }) => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientResults, setPatientResults] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const [doctorNotes, setDoctorNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [imageModal, setImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchPatients();
    }
  }, [isOpen]);

  const fetchPatients = async () => {
    try {
      setSearchLoading(true);
      const response = await patientsAPI.getAll();
      
      if (response.data.success) {
        setPatients(response.data.data || []);
      } else {
        console.error('Failed to fetch patients:', response.data.message);
        setPatients([]);
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
      setPatients([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const fetchPatientResults = async (patientId) => {
    try {
      setLoading(true);
      console.log('Fetching results for patient:', patientId);
      
      const response = await resultsAPI.getPatientResults(patientId);
      console.log('Patient results response:', response.data);
      
      if (response.data.success) {
        setPatientResults(response.data.results || []);
      } else {
        console.error('Failed to fetch patient results:', response.data.error);
        setPatientResults([]);
      }
    } catch (error) {
      console.error('Error fetching patient results:', error);
      console.error('Error details:', error.response?.data);
      setPatientResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setSelectedResult(null);
    setDoctorNotes('');
    fetchPatientResults(patient._id);
  };

  const handleCreateReport = async () => {
    if (!selectedPatient) {
      alert('Please select a patient');
      return;
    }

    if (!selectedResult) {
      alert('Please select a test result');
      return;
    }

    try {
      setLoading(true);
      const response = await reportsAPI.create({
        patientId: selectedPatient._id,
        resultId: selectedResult._id,
        doctorNotes: doctorNotes.trim(),
        consultationPaid: true
      });

      if (response.data.success) {
        console.log('✅ Report created and result deleted:', response.data.deletedResultId);
        onReportCreated(response.data.report);
        onClose();
        alert('Report created successfully! Original test result has been deleted from database.');
      } else {
        alert('Failed to create report: ' + response.data.error);
      }
    } catch (error) {
      console.error('Error creating report:', error);
      alert('Failed to create report: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const viewImage = (imageUrl) => {
    setSelectedImage(imageUrl);
    setImageModal(true);
  };

  const filteredPatients = patients.filter(patient =>
    patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white/95 backdrop-blur-lg rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-200/60 shadow-xl">
        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-light text-slate-800">Create Medical Report</h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Patient Selection */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-slate-700 mb-4">1. Select Patient</h3>
            
            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search patients by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-slate-200/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 bg-white/50 backdrop-blur-sm"
              />
            </div>

            {/* Patients List */}
            <div className="max-h-48 overflow-y-auto border border-slate-200/60 rounded-2xl bg-white/50 backdrop-blur-sm">
              {searchLoading ? (
                <div className="p-6 text-center text-slate-500">
                  Loading patients...
                </div>
              ) : filteredPatients.length === 0 ? (
                <div className="p-6 text-center text-slate-500">
                  {patients.length === 0 ? 'No patients found in system' : 'No patients match your search'}
                </div>
              ) : (
                filteredPatients.map((patient) => (
                  <button
                    key={patient._id}
                    onClick={() => handlePatientSelect(patient)}
                    className={`w-full text-left p-4 border-b border-slate-200/30 last:border-b-0 hover:bg-slate-50/50 transition-all duration-200 ${
                      selectedPatient?._id === patient._id ? 'bg-cyan-50/50 border-cyan-200' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <User className="h-5 w-5 text-slate-400" />
                        <div>
                          <h4 className="font-medium text-slate-800">{patient.name}</h4>
                          <p className="text-sm text-slate-600">{patient.email}</p>
                        </div>
                      </div>
                      {selectedPatient?._id === patient._id && (
                        <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Test Results Selection */}
          {selectedPatient && (
            <div className="mb-8">
              <h3 className="text-lg font-medium text-slate-700 mb-4">2. Select Test Result</h3>
              
              {loading ? (
                <div className="text-center py-6 text-slate-500 border border-slate-200/60 rounded-2xl">
                  Loading test results...
                </div>
              ) : patientResults.length === 0 ? (
                <div className="text-center py-6 text-slate-500 border border-slate-200/60 rounded-2xl">
                  No test results found for this patient
                </div>
              ) : (
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {patientResults.map((result) => (
                    <button
                      key={result._id}
                      onClick={() => setSelectedResult(result)}
                      className={`w-full text-left p-4 border border-slate-200/60 rounded-2xl hover:bg-slate-50/50 transition-all duration-200 ${
                        selectedResult?._id === result._id ? 'bg-emerald-50/50 border-emerald-200' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          {/* X-ray Image Thumbnail */}
                          <div className="relative">
                            <img
                              src={result.imageUrl}
                              alt="X-ray"
                              className="w-16 h-16 object-cover rounded-xl border border-slate-200"
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/64x64?text=X-ray';
                              }}
                            />
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                viewImage(result.imageUrl);
                              }}
                              className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-all duration-200 rounded-xl flex items-center justify-center cursor-pointer"
                            >
                              <Eye className="h-4 w-4 text-white opacity-0 hover:opacity-100 transition-opacity duration-200" />
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex items-center space-x-3">
                              <span className={`font-medium ${
                                result.label === 'Normal' ? 'text-emerald-600' : 'text-red-600'
                              }`}>
                                {result.label}
                              </span>
                              <span className="text-sm text-slate-500">
                                ({(result.confidence * 100).toFixed(2)}% confidence)
                              </span>
                            </div>
                            <p className="text-sm text-slate-600">
                              {new Date(result.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        {selectedResult?._id === result._id && (
                          <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Doctor Notes */}
          {selectedPatient && selectedResult && (
            <div className="mb-8">
              <h3 className="text-lg font-medium text-slate-700 mb-4">3. Add Medical Notes</h3>
              <textarea
                value={doctorNotes}
                onChange={(e) => setDoctorNotes(e.target.value)}
                placeholder="Enter your clinical observations, recommendations, and any additional notes for the patient..."
                rows="4"
                className="w-full px-4 py-3 border border-slate-200/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 bg-white/50 backdrop-blur-sm resize-none"
              />
              <p className="text-sm text-slate-500 mt-2">
                These notes will be included in the patient's final report.
              </p>
            </div>
          )}

          {/* Selected Information Summary */}
          {(selectedPatient || selectedResult) && (
            <div className="mb-8 p-6 bg-slate-50/50 rounded-2xl border border-slate-200/60">
              <h3 className="font-medium text-slate-700 mb-4">Report Summary</h3>
              
              {selectedPatient && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-slate-600 mb-3">Patient Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-slate-400 mr-2" />
                      <span className="text-slate-700">{selectedPatient.name}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 text-slate-400 mr-2" />
                      <span className="text-slate-700">{selectedPatient.email}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-slate-400 mr-2" />
                      <span className="text-slate-700">Age: {selectedPatient.age}</span>
                    </div>
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-slate-400 mr-2" />
                      <span className="text-slate-700 capitalize">{selectedPatient.gender}</span>
                    </div>
                  </div>
                </div>
              )}

              {selectedResult && (
                <div>
                  <h4 className="text-sm font-medium text-slate-600 mb-3">Test Result</h4>
                  <div className="flex items-start space-x-4">
                    {/* X-ray Image Preview */}
                    <div className="flex-shrink-0">
                      <img
                        src={selectedResult.imageUrl}
                        alt="Selected X-ray"
                        className="w-20 h-20 object-cover rounded-xl border border-slate-200"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/80x80?text=X-ray';
                        }}
                      />
                      <span
                        onClick={() => viewImage(selectedResult.imageUrl)}
                        className="mt-2 text-xs text-cyan-600 hover:text-cyan-700 flex items-center cursor-pointer"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View Full Size
                      </span>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-6 text-sm mb-2">
                        <span className={`font-medium ${
                          selectedResult.label === 'Normal' ? 'text-emerald-600' : 'text-red-600'
                        }`}>
                          {selectedResult.label}
                        </span>
                        <span className="text-slate-600">
                          Confidence: {(selectedResult.confidence * 100).toFixed(2)}%
                        </span>
                        <span className="text-slate-600">
                          <Calendar className="h-4 w-4 text-slate-400 mr-1 inline" />
                          {new Date(selectedResult.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="mt-2 text-xs text-slate-500">
                        <AlertCircle className="h-3 w-3 inline mr-1" />
                        This test result will be deleted after report creation
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-6 py-3 border border-slate-300 text-slate-700 rounded-2xl hover:bg-slate-50 transition-all duration-200 font-medium"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleCreateReport}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl hover:shadow-lg transition-all duration-200 font-medium"
            >
              {loading ? 'Creating Report...' : 'Create Report'}
            </button>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {imageModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-slate-800">X-ray Image</h3>
              <button
                onClick={() => setImageModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6 flex items-center justify-center bg-black">
              <img
                src={selectedImage}
                alt="X-ray Full Size"
                className="max-w-full max-h-[70vh] object-contain"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/800x600?text=X-ray+Not+Found';
                }}
              />
            </div>
            <div className="p-6 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setImageModal(false)}
                className="px-6 py-2 border border-slate-300 text-slate-700 rounded-full hover:border-slate-400 transition-all duration-200 font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateReportModal;
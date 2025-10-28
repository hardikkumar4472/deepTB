// src/pages/PatientManagement.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { patientsAPI } from '../services/api'; // Add patientsAPI to your api service
import { Search, Filter, User, Mail, Phone, Calendar, FileText, Eye, Download } from 'lucide-react';

const PatientManagement = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientReports, setPatientReports] = useState([]);
  const [detailModal, setDetailModal] = useState(false);
  const [error, setError] = useState('');
  const [selectedPatientForHistory, setSelectedPatientForHistory] = useState(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    filterPatients();
  }, [patients, searchTerm]);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await patientsAPI.getAll();
      
      if (response.data.success) {
        setPatients(response.data.data);
        setFilteredPatients(response.data.data);
      } else {
        setError('Failed to fetch patients');
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
      setError('Error loading patients data');
    } finally {
      setLoading(false);
    }
  };
  const viewPatientHistory = (patient) => {
    setSelectedPatientForHistory(patient);
  };

  const filterPatients = () => {
    if (!searchTerm) {
      setFilteredPatients(patients);
      return;
    }

    const filtered = patients.filter(patient =>
      patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phoneNumber?.includes(searchTerm)
    );
    setFilteredPatients(filtered);
  };

  const viewPatientDetails = async (patient) => {
    setSelectedPatient(patient);
    try {
      // You can fetch patient-specific reports here if you have an endpoint
      // For now, we'll just show basic patient info
      setPatientReports([]); // Clear previous reports
      setDetailModal(true);
    } catch (error) {
      console.error('Error fetching patient details:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateAge = (dob) => {
    // If you have date of birth field, you can calculate age
    // For now, using the age field directly
    return dob;
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
        <h1 className="text-3xl font-light text-slate-800">Patient Management</h1>
        <p className="text-slate-600 mt-3">
          Manage and view patient records and information
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-slate-200/60 shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search patients by name, email, or phone number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-12 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-slate-600 text-sm">
              {filteredPatients.length} of {patients.length} patients
            </span>
          </div>
        </div>
      </div>

      {/* Patients List */}
      <div className="space-y-4">
        {filteredPatients.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-slate-200/60 shadow-sm text-center">
            <User className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-slate-800 mb-3">
              {patients.length === 0 ? "No Patients Found" : "No Matching Patients"}
            </h3>
            <p className="text-slate-600">
              {patients.length === 0 
                ? "There are no patients registered in the system."
                : "No patients match your search criteria."
              }
            </p>
          </div>
        ) : (
          filteredPatients.map((patient) => (
            <div key={patient._id} className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-6 flex-1">
                  <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-cyan-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-4">
                      <h3 className="text-xl font-medium text-slate-800">
                        {patient.name}
                      </h3>
                      <span className="text-sm bg-cyan-100 text-cyan-800 px-3 py-1 rounded-full">
                        Patient ID: {patient._id.substring(0, 8)}...
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm mb-4">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 text-slate-400 mr-3" />
                        <span className="text-slate-600">{patient.email}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 text-slate-400 mr-3" />
                        <span className="text-slate-600">{patient.phoneNumber}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-slate-400 mr-3" />
                        <span className="text-slate-600">Age: {patient.age}</span>
                      </div>
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-slate-400 mr-3" />
                        <span className="text-slate-600 capitalize">{patient.gender?.toLowerCase()}</span>
                      </div>
                    </div>
                    

                    {/* Additional Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600">
                      <div>
                        <span className="font-medium">Registered:</span> {formatDate(patient.createdAt)}
                      </div>
                      <div>
                        <span className="font-medium">Last Updated:</span> {formatDate(patient.updatedAt)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col space-y-3">
                  <button
                    onClick={() => viewPatientDetails(patient)}
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-full hover:shadow-lg transition-all duration-200 font-medium text-sm flex items-center"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Patient Detail Modal */}
      {detailModal && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-light text-slate-800">
                    {selectedPatient.name}
                  </h2>
                  <p className="text-slate-600">{selectedPatient.email}</p>
                </div>
                <button
                  onClick={() => setDetailModal(false)}
                  className="text-slate-400 hover:text-slate-600 transition-colors duration-200"
                >
                  <span className="text-2xl">×</span>
                </button>
              </div>
              {selectedPatientForHistory && (
              <PatientHistory
                patientId={selectedPatientForHistory._id}
                onBack={() => setSelectedPatientForHistory(null)}
            />
          )}

              {/* Patient Information */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-50 rounded-2xl p-4">
                    <h3 className="font-medium text-slate-800 mb-3">Personal Information</h3>
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
                    <h3 className="font-medium text-slate-800 mb-3">Account Information</h3>
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

                {/* Reports Section - Placeholder for future implementation */}
                {/* <div className="border-t border-slate-200 pt-6">
                  <h3 className="text-lg font-medium text-slate-800 mb-4">Medical Reports</h3>
                  <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-center">
                    <FileText className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                    <p className="text-blue-800 text-sm">
                      Patient report history will be displayed here when available.
                    </p>
                  </div>
                </div> */}
              </div>

              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-slate-200">
                <button
                  onClick={() => setDetailModal(false)}
                  className="px-6 py-2 border border-slate-300 text-slate-700 rounded-full hover:border-slate-400 transition-all duration-200 font-medium"
                >
                  Close
                </button>

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientManagement;
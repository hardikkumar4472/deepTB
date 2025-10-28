// src/pages/History.jsx
import React, { useState, useEffect } from 'react';
import { resultsAPI } from '../services/api';
import { Calendar, CheckCircle, AlertCircle, Download, Mail } from 'lucide-react';

const History = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    fetchHistory();
    setIsVisible(true);
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await resultsAPI.getHistory();
      setResults(response.data);
    } catch (err) {
      setError('Failed to load prediction history');
    } finally {
      setLoading(false);
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF8F8F]"></div>
      </div>
    );
  }

  return (
    <div className={`max-w-6xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-light text-slate-800">Prediction History</h1>
        <p className="text-slate-600 mt-3">
          View your previous TB detection analyses
        </p>
      </div>

      {error && (
        <div className="bg-[#FF8F8F]/10 border border-[#FF8F8F]/20 text-[#FF8F8F] px-4 py-3 rounded-2xl mb-6 backdrop-blur-sm">
          {error}
        </div>
      )}

      {results.length === 0 ? (
        <div className="bg-white/60 backdrop-blur-lg rounded-3xl p-8 border border-slate-200/40 shadow-lg text-center">
          <Calendar className="h-16 w-16 text-slate-400 mx-auto mb-4 animate-pulse" />
          <h3 className="text-xl font-medium text-slate-800 mb-3">No History Yet</h3>
          <p className="text-slate-600 mb-6">
            You haven't made any TB predictions yet.
          </p>
          <a
            href="/predict"
            className="bg-gradient-to-r from-[#FF8F8F] to-[#B7A3E3] text-white px-6 py-3 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-medium shadow-lg"
          >
            Make Your First Prediction
          </a>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-8">
            {results.map((result, index) => (
              <div 
                key={result._id} 
                className={`bg-white/60 backdrop-blur-lg rounded-3xl p-6 border border-slate-200/40 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-500 delay-${index * 100}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-6">
                    <img
                      src={result.imageUrl}
                      alt="X-ray"
                      className="w-20 h-20 object-cover rounded-2xl border border-slate-200 shadow-lg"
                    />
                    <div>
                      <div className="flex items-center space-x-3 mb-3">
                        {result.label === 'Normal' ? (
                          <CheckCircle className="h-6 w-6 text-[#B7A3E3] animate-pulse" />
                        ) : (
                          <AlertCircle className="h-6 w-6 text-[#FF8F8F] animate-pulse" />
                        )}
                        <span className={`text-lg font-medium ${
                          result.label === 'Normal' ? 'text-[#B7A3E3]' : 'text-[#FF8F8F]'
                        }`}>
                          {result.label}
                        </span>
                        <span className="text-slate-500">
                          ({(result.confidence * 100).toFixed(2)}% confidence)
                        </span>
                      </div>
                      <p className="text-slate-600 text-sm">
                        {formatDate(result.createdAt)}
                      </p>
                      <p className="text-slate-500 text-sm mt-2">
                        Raw prediction: {result.raw_prediction?.toFixed(6)}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => window.open(result.imageUrl, '_blank')}
                      className="bg-white/80 text-slate-700 px-4 py-2 rounded-full border border-slate-300 hover:border-[#FF8F8F] transition-all duration-300 font-medium text-sm flex items-center backdrop-blur-sm hover:shadow-lg transform hover:scale-105"
                    >
                      View Image
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Email Notification Note */}
          <div className="bg-[#C2E2FA]/10 border border-[#C2E2FA]/20 rounded-3xl p-6 backdrop-blur-sm">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <Mail className="h-6 w-6 text-[#C2E2FA] mt-1 animate-bounce" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-[#000000] mb-3">
                  Final Reports Delivery
                </h3>
                <p className="text-[#1b9afc] mb-4">
                  Your final medical reports will be sent to your registered email address 
                  within 72 hours after approval by our certified doctors.
                </p>
                <div className="mt-3 text-sm text-[#54abee] space-y-2">
                  <p>• Reports include detailed analysis and doctor's notes</p>
                  <p>• You'll receive a downloadable PDF with complete findings</p>
                  <p>• Check your spam folder if you don't see the email</p>
                  <p>• Contact support if you haven't received your report within 3 days</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default History;
// src/pages/Prediction.jsx
import React, { useState } from 'react';
import { tbAPI } from '../services/api';
import { Upload, X, CheckCircle, AlertCircle } from 'lucide-react';

const Prediction = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  React.useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleFileSelect = (file) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
      setError('');
    } else {
      setError('Please select a valid image file (JPEG, PNG, etc.)');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const removeFile = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select an image file');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      
      const response = await tbAPI.predict(formData);
      setResult(response.data);
      
    } catch (error) {
      if (error.response?.status === 429) {
        setError(error.response.data.error);
      } else {
        console.error('Prediction error:', error);
        setError(error.response?.data?.error || 'Failed to process X-ray. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`max-w-4xl mx-auto space-y-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      <div className="text-center">
        <h1 className="text-3xl font-light text-slate-800">TB Detection</h1>
        <p className="text-slate-600 mt-3">
          Upload a chest X-ray image for AI-powered Tuberculosis detection
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="bg-white/60 backdrop-blur-lg rounded-3xl p-6 border border-slate-200/40 shadow-lg hover:shadow-xl transition-all duration-500">
          <h2 className="text-xl font-light text-slate-800 mb-6">Upload X-ray Image</h2>
          
          {!selectedFile ? (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center hover:border-[#FF8F8F] transition-all duration-300 group"
            >
              <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4 group-hover:text-[#FF8F8F] transition-colors duration-300" />
              <p className="text-slate-600 mb-2 group-hover:text-slate-700 transition-colors duration-300">
                Drag and drop your chest X-ray image here
              </p>
              <p className="text-sm text-slate-500 mb-4">or</p>
              <label className="bg-gradient-to-r from-[#FF8F8F] to-[#B7A3E3] text-white px-6 py-3 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-medium cursor-pointer inline-block shadow-lg">
                Browse Files
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleFileSelect(e.target.files[0])}
                />
              </label>
              <p className="text-xs text-slate-500 mt-4">
                Supported formats: JPEG, PNG, WebP. Max size: 10MB
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="relative">
                <img
                  src={previewUrl}
                  alt="X-ray preview"
                  className="w-full h-64 object-contain rounded-2xl border border-slate-200 shadow-lg"
                />
                <button
                  onClick={removeFile}
                  className="absolute top-3 right-3 bg-[#FF8F8F] text-white p-2 rounded-full hover:bg-[#FF8F8F]/80 transition-all duration-300 shadow-lg transform hover:scale-110"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <p className="text-sm text-slate-600">
                Selected: {selectedFile.name}
              </p>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#FF8F8F] to-[#B7A3E3] text-white py-3 rounded-2xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-medium disabled:opacity-50 shadow-lg"
              >
                {loading ? 'Analyzing...' : 'Analyze X-ray'}
              </button>
            </div>
          )}

          {error && (
            <div className="mt-6 bg-[#FF8F8F]/10 border border-[#FF8F8F]/20 text-[#FF8F8F] px-4 py-3 rounded-2xl flex items-center backdrop-blur-sm">
              <AlertCircle className="h-5 w-5 mr-3" />
              {error}
            </div>
          )}
        </div>

        {/* Results Section */}
        <div className="bg-white/60 backdrop-blur-lg rounded-3xl p-6 border border-slate-200/40 shadow-lg hover:shadow-xl transition-all duration-500 delay-200">
          <h2 className="text-xl font-light text-slate-800 mb-6">Analysis Results</h2>
          
          {result ? (
            <div className="space-y-6">
              <div className={`p-6 rounded-2xl backdrop-blur-sm ${
                result.label === 'Normal' 
                  ? 'bg-[#B7A3E3]/10 border border-[#B7A3E3]/20' 
                  : 'bg-[#FF8F8F]/10 border border-[#FF8F8F]/20'
              }`}>
                <div className="flex items-center">
                  {result.label === 'Normal' ? (
                    <CheckCircle className="h-8 w-8 text-[#B7A3E3] mr-4 animate-pulse" />
                  ) : (
                    <AlertCircle className="h-8 w-8 text-[#FF8F8F] mr-4 animate-pulse" />
                  )}
                  <div>
                    <h3 className="text-lg font-medium">
                      {result.label === 'Normal' ? 'No TB Detected' : 'TB Detected'}
                    </h3>
                    <p className="text-slate-600">
                      Confidence: {(result.confidence * 100).toFixed(2)}%
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-slate-700 mb-4">Detailed Results</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-500">Prediction:</span>
                      <p className="font-medium">{result.label}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Confidence:</span>
                      <p className="font-medium">{(result.confidence * 100).toFixed(2)}%</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Raw Score:</span>
                      <p className="font-medium">{result.raw_prediction?.toFixed(6)}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Threshold:</span>
                      <p className="font-medium">{result.threshold_used}</p>
                    </div>
                  </div>
                </div>

                {result.imageUrl && (
                  <div>
                    <h4 className="font-medium text-slate-700 mb-4">Processed Image</h4>
                    <img
                      src={result.imageUrl}
                      alt="Processed X-ray"
                      className="w-full h-48 object-contain rounded-2xl border border-slate-200 shadow-lg"
                    />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4 animate-pulse" />
              <p className="text-slate-500">Upload an X-ray image to see analysis results</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Prediction;
import React, { useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const ResumeUpload = ({ onUpload, isLoading, error }) => {
  const { colors } = useTheme();
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleFile = (file) => {
    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a PDF or DOCX file only.');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB.');
      return;
    }

    onUpload(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="max-w-4xl mx-auto animate-scale-in">
      {/* Header */}
      <div className="text-center mb-8 animate-fade-in-up">
        <h2 className={`text-3xl font-bold bg-gradient-to-r ${colors.gradient} bg-clip-text text-transparent mb-4`}>
          Upload Your Resume
        </h2>
        <p className={`text-lg ${colors.textSecondary}`}>
          Please upload your resume to get started with the interview process.
        </p>
      </div>
      
      {/* Upload Area */}
      <div 
        className={`
          relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 cursor-pointer animate-fade-in-up transform hover:scale-[1.02]
          ${isLoading 
            ? `${colors.border} ${colors.bg} cursor-not-allowed opacity-75` 
            : `${colors.border} ${colors.bgSecondary} hover:border-blue-400 hover:shadow-lg ${colors.cardHover}`
          }
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={handleClick}
        style={{ animationDelay: '200ms' }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isLoading}
        />
        
        {isLoading ? (
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <p className={`${colors.textSecondary} font-medium`}>Processing your resume...</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-6xl mb-4">📄</div>
            <div>
              <h3 className={`text-xl font-semibold ${colors.text} mb-2`}>
                Drop your resume here or click to browse
              </h3>
              <p className={`${colors.textMuted} mb-6`}>
                Supports PDF and DOCX files (max 10MB)
              </p>
              <button className={`${colors.primary} text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200`}>
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Choose File
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="mt-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center gap-3">
          <span className="text-red-500 text-xl">⚠️</span>
          <span className="text-red-700 dark:text-red-400 font-medium">{error}</span>
        </div>
      )}
      
      {/* Information Card */}
      <div className={`mt-8 ${colors.card} rounded-xl p-6`}>
        <h4 className={`text-lg font-semibold ${colors.text} mb-4 flex items-center gap-2`}>
          <svg className={`w-5 h-5 ${colors.primaryText}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          What happens next?
        </h4>
        <ul className={`space-y-3 ${colors.textSecondary}`}>
          <li className="flex items-start gap-3">
            <span className={`flex-shrink-0 w-6 h-6 ${colors.primary} text-white rounded-full flex items-center justify-center text-sm font-medium`}>1</span>
            We'll process your resume and verify it's valid
          </li>
          <li className="flex items-start gap-3">
            <span className={`flex-shrink-0 w-6 h-6 ${colors.primary} text-white rounded-full flex items-center justify-center text-sm font-medium`}>2</span>
            You'll be asked to manually enter your name, email, and phone number
          </li>
          <li className="flex items-start gap-3">
            <span className={`flex-shrink-0 w-6 h-6 ${colors.primary} text-white rounded-full flex items-center justify-center text-sm font-medium`}>3</span>
            Then we'll start a 6-question technical interview
          </li>
          <li className="flex items-start gap-3">
            <span className={`flex-shrink-0 w-6 h-6 ${colors.primary} text-white rounded-full flex items-center justify-center text-sm font-medium`}>4</span>
            Each question has a time limit based on difficulty
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ResumeUpload;

import React, { useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import useInterviewStore from '../store/useInterviewStore';

const WelcomeBackModal = ({ onClose }) => {
  const { colors } = useTheme();
  const { getSessionInfo } = useInterviewStore();
  const sessionInfo = getSessionInfo();

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleContinue = () => {
    onClose(true);
  };

  const handleStartFresh = () => {
    onClose(false);
  };

  const progress = sessionInfo.answers.length;
  const total = sessionInfo.totalQuestions;
  const progressPercentage = total > 0 ? (progress / total) * 100 : 0;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className={`${colors.card} rounded-2xl shadow-2xl max-w-lg w-full p-8 border ${colors.border} animate-scale-in`}>
        <div className="text-center">
          {/* Icon with animation */}
          <div className={`mx-auto flex items-center justify-center w-20 h-20 ${colors.primary} rounded-full mb-6 shadow-lg animate-pulse`}>
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <h2 className={`text-3xl font-bold bg-gradient-to-r ${colors.gradient} bg-clip-text text-transparent mb-4`}>
            Welcome Back!
          </h2>
          
          <div className={`${colors.textSecondary} mb-6 space-y-4`}>
            <p className="text-lg">
              You have an unfinished interview session for{' '}
              <span className={`font-semibold ${colors.primaryText}`}>
                {sessionInfo.candidate?.name || 'Unknown Candidate'}
              </span>
            </p>
            
            {/* Progress indicator */}
            <div className={`${colors.accent} rounded-lg p-4 border`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Interview Progress</span>
                <span className="text-sm font-bold">{progress}/{total} questions</span>
              </div>
              <div className={`w-full ${colors.surface} rounded-full h-2`}>
                <div 
                  className={`${colors.primary} h-2 rounded-full transition-all duration-500`}
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
            
            <p>Would you like to continue where you left off or start fresh?</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              className={`flex-1 ${colors.primary} text-white px-6 py-3 rounded-lg font-medium transition-smooth hover-lift shadow-lg`}
              onClick={handleContinue}
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Continue Interview
              </span>
            </button>
            <button 
              className={`flex-1 ${colors.button} px-6 py-3 rounded-lg font-medium transition-smooth hover-lift border ${colors.border}`}
              onClick={handleStartFresh}
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Start Fresh
              </span>
            </button>
          </div>
          
          <div className={`mt-6 text-sm ${colors.textMuted} ${colors.accent} rounded-lg p-3 border`}>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Your progress is automatically saved</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeBackModal;

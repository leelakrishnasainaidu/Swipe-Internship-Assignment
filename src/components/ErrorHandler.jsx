import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const ErrorHandler = ({ error, onRetry, onDismiss }) => {
  const { colors } = useTheme();

  const getErrorIcon = (type) => {
    switch (type) {
      case 'file':
        return (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'network':
        return (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      default:
        return (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const getErrorMessage = (error) => {
    if (typeof error === 'string') return error;
    if (error?.message) return error.message;
    return 'An unexpected error occurred';
  };

  const getErrorTitle = (error) => {
    if (error?.type === 'file') return 'File Upload Error';
    if (error?.type === 'network') return 'Connection Error';
    if (error?.type === 'validation') return 'Validation Error';
    return 'Error';
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className={`${colors.card} rounded-2xl shadow-2xl max-w-md w-full p-6 border ${colors.border} animate-scale-in`}>
        <div className="text-center">
          {/* Error Icon */}
          <div className={`mx-auto flex items-center justify-center w-16 h-16 ${colors.danger} rounded-full mb-4 text-white`}>
            {getErrorIcon(error?.type)}
          </div>
          
          {/* Error Title */}
          <h3 className={`text-xl font-semibold ${colors.text} mb-2`}>
            {getErrorTitle(error)}
          </h3>
          
          {/* Error Message */}
          <p className={`${colors.textSecondary} mb-6 leading-relaxed`}>
            {getErrorMessage(error)}
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            {onRetry && (
              <button 
                className={`flex-1 ${colors.primary} text-white px-4 py-2 rounded-lg font-medium transition-smooth hover-lift`}
                onClick={onRetry}
              >
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Try Again
                </span>
              </button>
            )}
            <button 
              className={`flex-1 ${colors.button} px-4 py-2 rounded-lg font-medium transition-smooth hover-lift border ${colors.border}`}
              onClick={onDismiss}
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Error Toast Component for non-blocking errors
export const ErrorToast = ({ error, onDismiss }) => {
  const { colors } = useTheme();

  React.useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-down">
      <div className={`${colors.card} rounded-lg shadow-lg border ${colors.border} p-4 max-w-sm`}>
        <div className="flex items-start gap-3">
          <div className={`flex-shrink-0 w-6 h-6 ${colors.danger} rounded-full flex items-center justify-center text-white`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <div className="flex-1">
            <p className={`text-sm font-medium ${colors.text}`}>
              {error?.title || 'Error'}
            </p>
            <p className={`text-sm ${colors.textSecondary} mt-1`}>
              {typeof error === 'string' ? error : error?.message || 'Something went wrong'}
            </p>
          </div>
          <button 
            className={`flex-shrink-0 ${colors.textMuted} hover:${colors.text} transition-colors`}
            onClick={onDismiss}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

// Success Toast Component
export const SuccessToast = ({ message, onDismiss }) => {
  const { colors } = useTheme();

  React.useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-down">
      <div className={`${colors.card} rounded-lg shadow-lg border ${colors.border} p-4 max-w-sm`}>
        <div className="flex items-center gap-3">
          <div className={`flex-shrink-0 w-6 h-6 ${colors.success} rounded-full flex items-center justify-center text-white`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className={`text-sm font-medium ${colors.text}`}>
            {message}
          </p>
          <button 
            className={`flex-shrink-0 ${colors.textMuted} hover:${colors.text} transition-colors`}
            onClick={onDismiss}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorHandler;

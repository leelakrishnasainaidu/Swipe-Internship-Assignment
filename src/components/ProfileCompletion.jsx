import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const ProfileCompletion = ({ candidate, onComplete, onBack }) => {
  const { colors } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Initialize form with any existing candidate data
    if (candidate) {
      setFormData({
        name: candidate.name || '',
        email: candidate.email || '',
        phone: candidate.phone || ''
      });
    }
  }, [candidate]);

  const validateForm = () => {
    const newErrors = {};

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Validate phone
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phone.replace(/[\s\-\(\)]/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const completedCandidate = {
        ...candidate,
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim()
      };
      
      onComplete(completedCandidate);
    } catch (error) {
      console.error('Error completing profile:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-scale-in">
      {/* Header */}
      <div className="text-center mb-8 animate-fade-in-up">
        <h2 className={`text-3xl font-bold bg-gradient-to-r ${colors.gradient} bg-clip-text text-transparent mb-4`}>
          Complete Your Profile
        </h2>
        <p className={`text-lg ${colors.textSecondary}`}>
          Please provide your information to continue with the interview process.
        </p>
      </div>

      {/* Form Card */}
      <div className={`${colors.card} glass rounded-2xl p-8 shadow-2xl animate-fade-in-up`} style={{ animationDelay: '200ms' }}>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div className="space-y-2">
            <label className={`block text-sm font-semibold ${colors.text}`}>
              Full Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name 
                  ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                  : `${colors.input} ${colors.border} focus:border-blue-400`
              }`}
              placeholder="Enter your full name"
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <span>⚠️</span>
                {errors.name}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <label className={`block text-sm font-semibold ${colors.text}`}>
              Email Address *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email 
                  ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                  : `${colors.input} ${colors.border} focus:border-blue-400`
              }`}
              placeholder="Enter your email address"
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <span>⚠️</span>
                {errors.email}
              </p>
            )}
          </div>

          {/* Phone Field */}
          <div className="space-y-2">
            <label className={`block text-sm font-semibold ${colors.text}`}>
              Phone Number *
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.phone 
                  ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                  : `${colors.input} ${colors.border} focus:border-blue-400`
              }`}
              placeholder="Enter your phone number"
              disabled={isSubmitting}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <span>⚠️</span>
                {errors.phone}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={onBack}
              disabled={isSubmitting}
              className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${colors.button} ${colors.border} border hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </span>
            </button>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${colors.primary} text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 shadow-lg`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Start Interview
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Information Card */}
      <div className={`mt-8 ${colors.card} rounded-xl p-6 animate-fade-in-up`} style={{ animationDelay: '400ms' }}>
        <h4 className={`text-lg font-semibold ${colors.text} mb-4 flex items-center gap-2`}>
          <svg className={`w-5 h-5 ${colors.primaryText}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Interview Details
        </h4>
        <ul className={`space-y-3 ${colors.textSecondary}`}>
          <li className="flex items-start gap-3">
            <span className={`flex-shrink-0 w-6 h-6 ${colors.primary} text-white rounded-full flex items-center justify-center text-sm font-medium`}>6</span>
            Total questions covering different difficulty levels
          </li>
          <li className="flex items-start gap-3">
            <span className={`flex-shrink-0 w-6 h-6 ${colors.primary} text-white rounded-full flex items-center justify-center text-sm font-medium`}>⏱️</span>
            Time limits: Easy (20s), Medium (60s), Hard (120s)
          </li>
          <li className="flex items-start gap-3">
            <span className={`flex-shrink-0 w-6 h-6 ${colors.primary} text-white rounded-full flex items-center justify-center text-sm font-medium`}>🎯</span>
            Focus on Full Stack Development (React/Node.js)
          </li>
          <li className="flex items-start gap-3">
            <span className={`flex-shrink-0 w-6 h-6 ${colors.primary} text-white rounded-full flex items-center justify-center text-sm font-medium`}>📊</span>
            Instant feedback and scoring for each answer
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ProfileCompletion;

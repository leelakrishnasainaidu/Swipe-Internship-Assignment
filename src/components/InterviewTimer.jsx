import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const InterviewTimer = ({ timeRemaining, currentQuestion, totalQuestions, difficulty }) => {
  const { colors } = useTheme();
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    const totalTime = getDifficultyTime(difficulty);
    return ((totalTime - timeRemaining) / totalTime) * 100;
  };

  const getDifficultyTime = (diff) => {
    switch (diff) {
      case 'easy': return 20;
      case 'medium': return 60;
      case 'hard': return 120;
      default: return 60;
    }
  };

  const getTimerColorClass = () => {
    const percentage = (timeRemaining / getDifficultyTime(difficulty)) * 100;
    if (percentage > 50) return 'text-green-600';
    if (percentage > 25) return 'text-orange-500';
    return 'text-red-500';
  };

  const getProgressColorClass = () => {
    const percentage = (timeRemaining / getDifficultyTime(difficulty)) * 100;
    if (percentage > 50) return 'bg-green-500';
    if (percentage > 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getDifficultyBadgeClass = () => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getDifficultyColor = (diff) => {
    switch (diff) {
      case 'easy': return colors.success;
      case 'medium': return colors.warning;
      case 'hard': return colors.danger;
      default: return colors.primary;
    }
  };

  return (
    <div className={`${colors.card} rounded-2xl p-6 mb-6 ${colors.cardHover} transition-all duration-300`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className={`text-2xl font-bold ${colors.text}`}>
            Question {currentQuestion} of {totalQuestions}
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(difficulty)}`}>
            {difficulty.toUpperCase()}
          </div>
        </div>
        
        <div className={`text-3xl font-mono font-bold ${
          timeRemaining <= 10 ? 'text-red-600 animate-pulse' : colors.text
        }`}>
          {formatTime(timeRemaining)}
        </div>
      </div>
      
      <div className={`w-full ${colors.border} border rounded-full h-3 overflow-hidden ${colors.bg}`}>
        <div 
          className={`h-full transition-all duration-1000 ease-linear ${
            timeRemaining <= 10 ? colors.danger : colors.primary
          }`}
          style={{ width: `${getProgressPercentage()}%` }}
        />
      </div>
      
      {timeRemaining <= 10 && (
        <div className="mt-4 text-center">
          <span className="text-red-600 font-semibold animate-bounce">
            ⚠️ Time running out!
          </span>
        </div>
      )}
    </div>
  );
};

export default InterviewTimer;

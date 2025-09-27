import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const CandidateDetail = ({ candidate, onBack }) => {
  const { colors } = useTheme();
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString([], {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getScoreColorClass = (score) => {
    if (score >= 8) return 'text-green-600 dark:text-green-400';
    if (score >= 6) return 'text-orange-500 dark:text-orange-400';
    return 'text-red-500 dark:text-red-400';
  };

  const getDifficultyColorClass = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-orange-500';
      case 'hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const formatTimeUsed = (timeUsed, timeLimit) => {
    const minutes = Math.floor(timeUsed / 60);
    const seconds = timeUsed % 60;
    const totalMinutes = Math.floor(timeLimit / 60);
    const totalSeconds = timeLimit % 60;
    
    return `${minutes}:${seconds.toString().padStart(2, '0')} / ${totalMinutes}:${totalSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <button 
          className={`flex items-center gap-2 px-4 py-2 ${colors.button} rounded-lg transition-colors duration-200`}
          onClick={onBack}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to List
        </button>
        <h2 className={`text-3xl font-bold ${colors.text}`}>Candidate Details</h2>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className={`${colors.card} rounded-2xl p-6`}>
          <h3 className={`text-xl font-semibold ${colors.text} mb-6 pb-3 ${colors.border} border-b`}>
            Personal Information
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className={`text-sm font-medium ${colors.textMuted}`}>Name</label>
              <p className={`${colors.text} font-medium`}>{candidate.name || 'Not provided'}</p>
            </div>
            <div className="space-y-1">
              <label className={`text-sm font-medium ${colors.textMuted}`}>Email</label>
              <p className={colors.text}>{candidate.email || 'Not provided'}</p>
            </div>
            <div className="space-y-1">
              <label className={`text-sm font-medium ${colors.textMuted}`}>Phone</label>
              <p className={colors.text}>{candidate.phone || 'Not provided'}</p>
            </div>
            <div className="space-y-1">
              <label className={`text-sm font-medium ${colors.textMuted}`}>Resume</label>
              <p className={colors.text}>{candidate.resumeFile || 'Not provided'}</p>
            </div>
            <div className="space-y-1">
              <label className={`text-sm font-medium ${colors.textMuted}`}>Upload Date</label>
              <p className={colors.text}>{formatDate(candidate.uploadedAt)}</p>
            </div>
            {candidate.completedAt && (
              <div className="space-y-1">
                <label className={`text-sm font-medium ${colors.textMuted}`}>Completion Date</label>
                <p className={colors.text}>{formatDate(candidate.completedAt)}</p>
              </div>
            )}
          </div>
        </div>

        {candidate.completed && (
          <div className={`${colors.card} rounded-2xl p-6`}>
            <h3 className={`text-xl font-semibold ${colors.text} mb-6 pb-3 ${colors.border} border-b`}>
              Interview Results
            </h3>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className={`text-center p-4 ${colors.accent} rounded-xl`}>
                <div className={`text-3xl font-bold ${colors.primaryText} mb-1`}>
                  {candidate.score || 0}/60
                </div>
                <div className={`text-sm ${colors.textSecondary}`}>Total Score</div>
              </div>
              <div className={`text-center p-4 ${colors.accent} rounded-xl`}>
                <div className={`text-3xl font-bold ${colors.primaryText} mb-1`}>
                  {candidate.averageScore || 0}/10
                </div>
                <div className={`text-sm ${colors.textSecondary}`}>Average Score</div>
              </div>
            </div>
            
            {candidate.summary && (
              <div>
                <h4 className={`text-lg font-semibold ${colors.text} mb-3`}>AI Summary</h4>
                <div className={`${colors.surface} border-l-4 ${colors.primaryText.replace('text-', 'border-')} p-4 rounded-r-lg`}>
                  <p className={`${colors.textSecondary} leading-relaxed`}>{candidate.summary}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {candidate.answers && candidate.answers.length > 0 && (
        <div className={`${colors.card} rounded-2xl p-6`}>
          <h3 className={`text-xl font-semibold ${colors.text} mb-6 pb-3 ${colors.border} border-b`}>
            Interview Questions & Answers
          </h3>
          <div className="space-y-6">
            {candidate.answers.map((answer, index) => (
              <div key={answer.questionId || index} className={`${colors.border} border rounded-xl p-6 ${colors.surface}`}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className={`font-semibold ${colors.text}`}>Question {index + 1}</span>
                    <span 
                      className={`px-3 py-1 rounded-full text-white text-sm font-medium uppercase tracking-wide ${getDifficultyColorClass(answer.difficulty)}`}
                    >
                      {answer.difficulty}
                    </span>
                    <span className={`text-sm ${colors.textMuted}`}>
                      Time: {formatTimeUsed(answer.timeUsed || 0, 
                        answer.difficulty === 'easy' ? 20 : 
                        answer.difficulty === 'medium' ? 60 : 120)}
                    </span>
                  </div>
                  <div className={`text-xl font-bold ${getScoreColorClass(answer.score || 0)}`}>
                    {answer.score || 0}/10
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className={`${colors.card} border-l-4 ${colors.primaryText.replace('text-', 'border-')} p-4 rounded-r-lg`}>
                    <div className={`font-medium ${colors.text} mb-2`}>Question:</div>
                    <p className={`${colors.textSecondary} leading-relaxed`}>{answer.question}</p>
                  </div>
                  
                  <div className={`${colors.card} border-l-4 border-green-500 p-4 rounded-r-lg`}>
                    <div className={`font-medium ${colors.text} mb-2`}>Answer:</div>
                    <p className={`${colors.textSecondary} leading-relaxed`}>{answer.answer}</p>
                  </div>
                  
                  {answer.feedback && (
                    <div className={`${colors.surface} border-l-4 border-yellow-400 p-4 rounded-r-lg`}>
                      <div className={`font-medium ${colors.text} mb-2`}>Feedback:</div>
                      <p className={`${colors.textSecondary} leading-relaxed italic`}>{answer.feedback}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!candidate.completed && (
        <div className={`${colors.card} rounded-2xl p-8 text-center`}>
          <div className="text-6xl mb-4">⏳</div>
          <h3 className={`text-xl font-semibold ${colors.text} mb-2`}>Interview In Progress</h3>
          <p className={colors.textSecondary}>This candidate has not completed their interview yet.</p>
        </div>
      )}
    </div>
  );
};

export default CandidateDetail;

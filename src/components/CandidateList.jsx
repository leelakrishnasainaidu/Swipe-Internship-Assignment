import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const CandidateList = ({ candidates, onCandidateSelect }) => {
  const { colors } = useTheme();
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString([], {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getScoreColorClass = (score) => {
    if (score >= 48) return 'text-green-600 dark:text-green-400';
    if (score >= 36) return 'text-orange-500 dark:text-orange-400';
    return 'text-red-500 dark:text-red-400';
  };

  const getStatusBadge = (candidate) => {
    if (candidate.completed) {
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors.success} text-white shadow-sm`}>
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Completed
        </span>
      );
    }
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors.warning} text-white shadow-sm`}>
        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Pending
      </span>
    );
  };

  const getPerformanceLevel = (score) => {
    if (score >= 48) return 'Excellent';
    if (score >= 36) return 'Good';
    if (score >= 24) return 'Average';
    return 'Poor';
  };

  const getPerformanceBadgeClass = (score) => {
    if (score >= 48) return 'bg-gradient-to-r from-gray-800 via-slate-700 to-gray-600';
    if (score >= 36) return 'bg-gradient-to-r from-gray-700 via-slate-600 to-gray-500';
    return 'bg-gradient-to-r from-gray-600 via-slate-500 to-gray-400';
  };

  return (
    <div className={`${colors.card} rounded-2xl overflow-hidden ${colors.cardHover} transition-all duration-300`}>
      {/* Desktop Header */}
      <div className={`hidden lg:grid lg:grid-cols-7 gap-6 px-6 py-4 ${colors.bg} ${colors.border} border-b font-semibold ${colors.textSecondary} text-sm`}>
        <div className="min-w-0">Candidate</div>
        <div className="min-w-0">Contact</div>
        <div className="min-w-0">Status</div>
        <div className="min-w-0">Score</div>
        <div className="min-w-0">Performance</div>
        <div className="min-w-0">Date</div>
        <div className="min-w-0">Actions</div>
      </div>

      {/* Candidate Rows */}
      <div className={`${colors.border} divide-y max-h-[600px] overflow-y-auto`}>
        {candidates.map((candidate) => (
          <div key={candidate.id} className={`hover:bg-gray-100/30 dark:hover:bg-gray-700/30 transition-all duration-200`}>
            {/* Desktop Layout */}
            <div className="hidden lg:grid lg:grid-cols-7 gap-6 px-6 py-4 items-center">
              <div className="space-y-1 min-w-0">
                <div className={`font-semibold ${colors.text} truncate`}>{candidate.name || 'Unknown'}</div>
                <div className={`text-sm ${colors.textMuted} truncate`}>{candidate.resumeFile}</div>
              </div>
              
              <div className="space-y-1 min-w-0">
                <div className={`${colors.text} truncate`}>{candidate.email || 'N/A'}</div>
                <div className={`text-sm ${colors.textMuted} truncate`}>{candidate.phone || 'N/A'}</div>
              </div>
              
              <div>
                {getStatusBadge(candidate)}
              </div>
              
              <div>
                {candidate.completed ? (
                  <div className={`font-bold text-lg ${getScoreColorClass(candidate.score)}`}>
                    {candidate.score || 0}/60
                  </div>
                ) : (
                  <span className={colors.textMuted}>-</span>
                )}
              </div>
              
              <div>
                {candidate.completed ? (
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${getPerformanceBadgeClass(candidate.score || 0)}`}>
                    {getPerformanceLevel(candidate.score || 0)}
                  </span>
                ) : (
                  <span className={colors.textMuted}>-</span>
                )}
              </div>
              
              <div className={`text-sm ${colors.textMuted} min-w-0`}>
                <div className="truncate">{formatDate(candidate.completedAt || candidate.uploadedAt)}</div>
              </div>
              
              <div className="min-w-0">
                <button 
                  className={`${colors.primary} text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow-lg`}
                  onClick={() => onCandidateSelect(candidate)}
                >
                  View Details
                </button>
              </div>
            </div>

            {/* Mobile Layout */}
            <div className="lg:hidden p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className={`font-semibold ${colors.text}`}>{candidate.name || 'Unknown'}</h3>
                  <p className={`text-sm ${colors.textMuted}`}>{candidate.resumeFile}</p>
                </div>
                {getStatusBadge(candidate)}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <svg className={`w-4 h-4 ${colors.textMuted}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                  <span className={`text-sm ${colors.textSecondary}`}>{candidate.email || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className={`w-4 h-4 ${colors.textMuted}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className={`text-sm ${colors.textSecondary}`}>{candidate.phone || 'N/A'}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-4">
                  {candidate.completed ? (
                    <>
                      <div className={`font-bold ${getScoreColorClass(candidate.score)}`}>
                        {candidate.score || 0}/60
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${getPerformanceBadgeClass(candidate.score || 0)}`}>
                        {getPerformanceLevel(candidate.score || 0)}
                      </span>
                    </>
                  ) : (
                    <span className={colors.textMuted}>No score yet</span>
                  )}
                </div>
                
                <button 
                  className={`${colors.primary} text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200`}
                  onClick={() => onCandidateSelect(candidate)}
                >
                  View Details
                </button>
              </div>
              
              <div className={`text-xs ${colors.textMuted} pt-1`}>
                {formatDate(candidate.completedAt || candidate.uploadedAt)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CandidateList;

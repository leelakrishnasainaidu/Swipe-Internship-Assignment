import React, { useState } from 'react';
import useInterviewStore from '../store/useInterviewStore';
import CandidateList from './CandidateList';
import CandidateDetail from './CandidateDetail';
import { useTheme } from '../contexts/ThemeContext';

const InterviewerTab = () => {
  const { colors } = useTheme();
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('score'); // 'score', 'name', 'date'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc', 'desc'

  const { candidates, clearAllData } = useInterviewStore();

  // Filter and sort candidates
  const filteredAndSortedCandidates = candidates
    .filter(candidate => 
      candidate.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.email?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'score':
          aValue = a.score || 0;
          bValue = b.score || 0;
          break;
        case 'name':
          aValue = a.name || '';
          bValue = b.name || '';
          break;
        case 'date':
          aValue = new Date(a.completedAt || a.uploadedAt);
          bValue = new Date(b.completedAt || b.uploadedAt);
          break;
        default:
          return 0;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const handleCandidateSelect = (candidate) => {
    setSelectedCandidate(candidate);
  };

  const handleBackToList = () => {
    setSelectedCandidate(null);
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all candidate data? This action cannot be undone.')) {
      clearAllData();
      setSelectedCandidate(null);
    }
  };

  const getStats = () => {
    const completed = candidates.filter(c => c.completed);
    const totalScore = completed.reduce((sum, c) => sum + (c.score || 0), 0);
    const averageScore = completed.length > 0 ? (totalScore / completed.length).toFixed(1) : 0;
    
    return {
      total: candidates.length,
      completed: completed.length,
      pending: candidates.length - completed.length,
      averageScore
    };
  };

  const stats = getStats();

  if (selectedCandidate) {
    return (
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={handleBackToList}
            className={`flex items-center gap-2 ${colors.button} ${colors.textSecondary} px-4 py-2 rounded-lg transition-colors duration-200 ${colors.border} border hover:scale-105 transform`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>
        </div>
        
        {/* Candidate Detail */}
        <CandidateDetail 
          candidate={selectedCandidate}
          onBack={handleBackToList}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h2 className={`text-3xl font-bold bg-gradient-to-r ${colors.gradient} bg-clip-text text-transparent mb-8`}>Interviewer Dashboard</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className={`${colors.card} rounded-2xl p-6 text-center ${colors.cardHover} transition-all duration-300`}>
            <div className={`flex items-center justify-center w-12 h-12 ${colors.primary} rounded-xl mb-4 mx-auto shadow-lg`}>
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className={`text-4xl font-bold ${colors.primaryText} mb-2`}>{stats.total}</div>
            <div className={`text-sm ${colors.textSecondary} uppercase tracking-wide font-semibold`}>Total Candidates</div>
          </div>
          <div className={`${colors.card} rounded-2xl p-6 text-center ${colors.cardHover} transition-all duration-300`}>
            <div className={`flex items-center justify-center w-12 h-12 ${colors.success} rounded-xl mb-4 mx-auto shadow-lg`}>
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className={`text-4xl font-bold ${colors.primaryText} mb-2`}>{stats.completed}</div>
            <div className={`text-sm ${colors.textSecondary} uppercase tracking-wide font-semibold`}>Completed</div>
          </div>
          <div className={`${colors.card} rounded-2xl p-6 text-center ${colors.cardHover} transition-all duration-300`}>
            <div className={`flex items-center justify-center w-12 h-12 ${colors.warning} rounded-xl mb-4 mx-auto shadow-lg`}>
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className={`text-4xl font-bold ${colors.textSecondary} mb-2`}>{stats.pending}</div>
            <div className={`text-sm ${colors.textSecondary} uppercase tracking-wide font-semibold`}>Pending</div>
          </div>
          <div className={`${colors.card} rounded-2xl p-6 text-center ${colors.cardHover} transition-all duration-300`}>
            <div className={`flex items-center justify-center w-12 h-12 ${colors.primary} rounded-xl mb-4 mx-auto shadow-lg`}>
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className={`text-4xl font-bold ${colors.primaryText} mb-2`}>{stats.averageScore}</div>
            <div className={`text-sm ${colors.textSecondary} uppercase tracking-wide font-semibold`}>Avg Score</div>
          </div>
        </div>
      </div>

      <div className={`flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between ${colors.card} rounded-2xl p-6`}>
        <div className="flex-1 w-full lg:max-w-md">
          <div className="relative">
            <svg className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${colors.textMuted}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search candidates by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 ${colors.input} rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200`}
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className={`px-4 py-3 ${colors.input} rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200`}
          >
            <option value="score">Sort by Score</option>
            <option value="name">Sort by Name</option>
            <option value="date">Sort by Date</option>
          </select>
          
          <button 
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className={`p-3 ${colors.button} rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200`}
            title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
          >
            <svg className={`w-5 h-5 ${colors.textSecondary} transform transition-transform duration-200 ${sortOrder === 'desc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
            </svg>
          </button>

          <button 
            onClick={handleClearAll}
            disabled={candidates.length === 0}
            className={`px-6 py-3 ${colors.danger} text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg`}
          >
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Clear All Data
            </span>
          </button>
        </div>
      </div>

      {candidates.length === 0 ? (
        <div className={`${colors.card} rounded-2xl p-12 text-center`}>
          <div className="text-6xl mb-6">📋</div>
          <h3 className={`text-xl font-semibold ${colors.text} mb-2`}>No candidates yet</h3>
          <p className={colors.textSecondary}>Candidates will appear here after they complete their interviews.</p>
        </div>
      ) : (
        <CandidateList 
          candidates={filteredAndSortedCandidates}
          onCandidateSelect={handleCandidateSelect}
        />
      )}
    </div>
  );
};

export default InterviewerTab;

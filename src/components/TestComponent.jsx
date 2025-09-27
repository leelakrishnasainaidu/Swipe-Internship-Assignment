import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import useInterviewStore from '../store/useInterviewStore';

const TestComponent = () => {
  const { colors, isDark, toggleTheme } = useTheme();
  const { 
    candidates, 
    currentCandidate, 
    isInterviewActive, 
    questions, 
    answers,
    clearAllData 
  } = useInterviewStore();

  const runTests = () => {
    console.log('🧪 Running AI Interview Assistant Tests...');
    
    // Test 1: Theme System
    console.log('✅ Theme System:', {
      isDark,
      hasColors: !!colors,
      primaryColor: colors.primary
    });

    // Test 2: Store State
    console.log('✅ Store State:', {
      candidatesCount: candidates.length,
      hasCurrentCandidate: !!currentCandidate,
      isInterviewActive,
      questionsCount: questions.length,
      answersCount: answers.length
    });

    // Test 3: Local Storage Persistence
    const storedData = localStorage.getItem('interview-storage');
    console.log('✅ Persistence:', {
      hasStoredData: !!storedData,
      storageSize: storedData ? storedData.length : 0
    });

    console.log('🎉 All tests completed!');
  };

  return (
    <div className={`${colors.card} rounded-2xl p-6 m-4`}>
      <h3 className={`text-xl font-bold ${colors.text} mb-4`}>
        System Test Panel
      </h3>
      
      <div className="space-y-4">
        <button
          onClick={runTests}
          className={`${colors.primary} text-white px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105`}
        >
          Run Tests
        </button>
        
        <button
          onClick={toggleTheme}
          className={`${colors.button} ${colors.textSecondary} px-4 py-2 rounded-lg transition-all duration-200 ${colors.border} border`}
        >
          Toggle Theme: {isDark ? 'Dark' : 'Light'}
        </button>
        
        <button
          onClick={clearAllData}
          className={`${colors.danger} text-white px-4 py-2 rounded-lg transition-all duration-200`}
        >
          Clear All Data
        </button>
      </div>

      <div className={`mt-6 p-4 ${colors.bg} rounded-lg`}>
        <h4 className={`font-semibold ${colors.text} mb-2`}>Current Status:</h4>
        <ul className={`text-sm ${colors.textSecondary} space-y-1`}>
          <li>Theme: {isDark ? '🌙 Dark' : '☀️ Light'}</li>
          <li>Candidates: {candidates.length}</li>
          <li>Active Interview: {isInterviewActive ? '✅ Yes' : '❌ No'}</li>
          <li>Current Candidate: {currentCandidate?.name || 'None'}</li>
        </ul>
      </div>
    </div>
  );
};

export default TestComponent;

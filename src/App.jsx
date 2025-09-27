import { useState, useEffect } from 'react';
import IntervieweeTab from './components/IntervieweeTab';
import InterviewerTab from './components/InterviewerTab';
import WelcomeBackModal from './components/WelcomeBackModal';
import ThemeToggle from './components/ThemeToggle';
import useInterviewStore from './store/useInterviewStore';
import { useTheme } from './contexts/ThemeContext';

function App() {
  const [activeTab, setActiveTab] = useState('interviewee');
  const [showWelcomeBack, setShowWelcomeBack] = useState(false);
  const { colors, isDark } = useTheme();
  
  const { 
    isInterviewActive, 
    isPaused, 
    currentCandidate,
    resumeInterview,
    pauseInterview
  } = useInterviewStore();

  useEffect(() => {
    // Check if there's an unfinished session on app load
    const store = useInterviewStore.getState();
    if (store.hasActiveSession()) {
      setShowWelcomeBack(true);
      // Pause the timer when modal shows
      if (isInterviewActive) {
        pauseInterview();
      }
    }
  }, []);

  useEffect(() => {
    // Pause timer when welcome modal is shown
    if (showWelcomeBack && isInterviewActive) {
      pauseInterview();
    }
  }, [showWelcomeBack, isInterviewActive]);

  const handleWelcomeBackClose = (shouldResume) => {
    setShowWelcomeBack(false);
    const store = useInterviewStore.getState();
    
    if (shouldResume) {
      // Resume the interview
      store.resumeInterview();
      setActiveTab('interviewee');
    } else {
      // Start fresh - clear all interview data completely
      store.clearAllData();
      // Force complete refresh to ensure clean state
      window.location.reload();
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${colors.bg} transition-all duration-500`}>
      {/* Enhanced Professional Header */}
      <header className={`${colors.card} glass-strong ${colors.border} border-b shadow-2xl`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo and Title */}
            <div className="flex items-center animate-slide-right">
              <div className={`w-14 h-14 rounded-2xl ${colors.primary} flex items-center justify-center mr-4 shadow-2xl hover-glow`}>
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h1 className={`text-3xl font-bold bg-gradient-to-r ${colors.gradient} bg-clip-text text-transparent`}>
                  AI Interview Assistant
                </h1>
                <p className={`text-sm ${colors.textMuted} mt-1 font-medium`}>
                  Next-Generation Interview Platform
                </p>
              </div>
            </div>

            {/* Theme Toggle - Enhanced positioning */}
            <div className="fixed top-6 right-6 z-50 animate-slide-left">
              <ThemeToggle />
            </div>
          </div>

          {/* Enhanced Navigation Tabs */}
          <div className="flex items-center justify-center space-x-3 pb-6 animate-fade-in animate-stagger-2">
            <div className={`${colors.glass} glass rounded-2xl p-2 border ${colors.border} shadow-lg`}>
              <div className="flex space-x-1">
                <button
                  onClick={() => setActiveTab('interviewee')}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover-sharp ${
                    activeTab === 'interviewee'
                      ? `${colors.primary} text-white shadow-xl`
                      : `${colors.button} glass border ${colors.border} hover:bg-white/50`
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Interview Experience
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('interviewer')}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover-sharp ${
                    activeTab === 'interviewer'
                      ? `${colors.primary} text-white shadow-xl`
                      : `${colors.button} glass border ${colors.border} hover:bg-white/50`
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Analytics Dashboard
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'interviewee' ? (
          <IntervieweeTab />
        ) : (
          <InterviewerTab />
        )}
      </main>

          {/* Welcome Back Modal */}
          {showWelcomeBack && (
            <WelcomeBackModal 
              onClose={handleWelcomeBackClose}
            />
          )}
    </div>
  );
}

export default App;

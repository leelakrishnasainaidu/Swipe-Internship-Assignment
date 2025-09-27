import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useInterviewStore = create(
  persist(
    (set, get) => ({
      // Candidates data
      candidates: [],
      currentCandidate: null,
      
      // Interview state
      currentQuestion: 0,
      questions: [],
      answers: [],
      timeRemaining: 0,
      isInterviewActive: false,
      isPaused: false,
      
      // Actions
      addCandidate: (candidate) => set((state) => ({
        candidates: [...state.candidates, candidate]
      })),
      
      setCurrentCandidate: (candidate) => set({ currentCandidate: candidate }),
      
      startInterview: () => set({ isInterviewActive: true, isPaused: false }),
      
      pauseInterview: () => set({ isPaused: true }),
      
      resumeInterview: () => set({ isPaused: false }),
      
      endInterview: () => set({ 
        isInterviewActive: false, 
        isPaused: false,
        currentQuestion: 0,
        timeRemaining: 0
      }),
      
      nextQuestion: () => set((state) => ({
        currentQuestion: state.currentQuestion + 1
      })),
      
      setTimeRemaining: (time) => set({ timeRemaining: time }),
      
      addAnswer: (answer) => set((state) => ({
        answers: [...state.answers, answer]
      })),
      
      setQuestions: (questions) => set({ questions }),
      
      updateCandidateScore: (candidateId, score, summary) => set((state) => ({
        candidates: state.candidates.map(candidate =>
          candidate.id === candidateId
            ? { ...candidate, score, summary, completed: true }
            : candidate
        )
      })),
      
      // Reset functions
      resetInterview: () => set({
        currentQuestion: 0,
        questions: [],
        answers: [],
        timeRemaining: 0,
        isInterviewActive: false,
        isPaused: false
      }),

      // Session management
      hasActiveSession: () => {
        const state = get();
        return state.isInterviewActive && state.currentCandidate && state.questions.length > 0;
      },

      getSessionInfo: () => {
        const state = get();
        return {
          candidate: state.currentCandidate,
          currentQuestion: state.currentQuestion,
          totalQuestions: state.questions.length,
          answers: state.answers,
          isActive: state.isInterviewActive
        };
      },
      
      clearAllData: () => set({
        candidates: [],
        currentCandidate: null,
        currentQuestion: 0,
        questions: [],
        answers: [],
        timeRemaining: 0,
        isInterviewActive: false,
        isPaused: false
      })
    }),
    {
      name: 'interview-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        candidates: state.candidates,
        currentCandidate: state.currentCandidate,
        currentQuestion: state.currentQuestion,
        questions: state.questions,
        answers: state.answers,
        timeRemaining: state.timeRemaining,
        isInterviewActive: state.isInterviewActive,
        isPaused: state.isPaused
      })
    }
  )
);

export default useInterviewStore;

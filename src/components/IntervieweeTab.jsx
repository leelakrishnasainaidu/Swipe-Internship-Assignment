import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ResumeUpload from './ResumeUpload';
import ProfileCompletion from './ProfileCompletion';
import ChatInterface from './ChatInterface';
import InterviewTimer from './InterviewTimer';
import { parseResume, generateQuestions, scoreAnswer, generateSummary } from '../utils/resumeParser';
import useInterviewStore from '../store/useInterviewStore';
import { useTheme } from '../contexts/ThemeContext';

const IntervieweeTab = () => {
  const { colors } = useTheme();
  const [phase, setPhase] = useState('upload'); // 'upload', 'profile-completion', 'interview', 'completed'
  const [missingFields, setMissingFields] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    currentCandidate,
    setCurrentCandidate,
    questions,
    setQuestions,
    currentQuestion,
    nextQuestion,
    addAnswer,
    answers,
    isInterviewActive,
    startInterview,
    endInterview,
    timeRemaining,
    setTimeRemaining,
    addCandidate,
    updateCandidateScore,
    resetInterview,
    pauseInterview,
    resumeInterview,
    isPaused
  } = useInterviewStore();

  const timerRef = useRef(null);

  useEffect(() => {
    // Check if we need to restore interview state
    if (currentCandidate && isInterviewActive && questions.length > 0) {
      // Restore interview state
      if (currentQuestion < questions.length) {
        setPhase('interview');
        
        // Start timer for current question if not completed
        if (currentQuestion >= answers.length && timeRemaining > 0) {
          // Resume timer
          const currentQ = questions[currentQuestion];
          if (timeRemaining === 0) {
            setTimeRemaining(currentQ.timeLimit);
          }
        }
        
        // Restore chat messages for interview
        const interviewMessages = [{
          id: uuidv4(),
          type: 'bot',
          content: 'Welcome back! Continuing your interview...',
          timestamp: new Date()
        }];
        
        // Add previous questions and answers to chat
        for (let i = 0; i < Math.min(currentQuestion, answers.length); i++) {
          if (questions[i] && answers[i]) {
            interviewMessages.push({
              id: uuidv4(),
              type: 'bot',
              content: `Question ${i + 1} (${questions[i].difficulty.toUpperCase()}):\n\n${questions[i].question}`,
              timestamp: new Date(answers[i].timestamp || Date.now())
            });
            interviewMessages.push({
              id: uuidv4(),
              type: 'user',
              content: answers[i].answer,
              timestamp: new Date(answers[i].timestamp || Date.now())
            });
            if (answers[i].feedback) {
              interviewMessages.push({
                id: uuidv4(),
                type: 'bot',
                content: `Score: ${answers[i].score}/10\nFeedback: ${answers[i].feedback}`,
                timestamp: new Date(answers[i].timestamp || Date.now())
              });
            }
          }
        }
        
        // Add current question if not answered yet
        if (currentQuestion < questions.length && currentQuestion >= answers.length) {
          const currentQ = questions[currentQuestion];
          interviewMessages.push({
            id: uuidv4(),
            type: 'bot',
            content: `Question ${currentQuestion + 1} of ${questions.length} (${currentQ.difficulty.toUpperCase()}):\n\n${currentQ.question}\n\nYou have ${currentQ.timeLimit} seconds to answer.`,
            timestamp: new Date()
          });
          
          // Set timer for current question
          if (timeRemaining === 0) {
            setTimeRemaining(currentQ.timeLimit);
          }
        }
        
        setChatMessages(interviewMessages);
      } else {
        setPhase('completed');
      }
    } else if (currentCandidate && !isInterviewActive) {
      // Candidate exists but interview not active
      if (!currentCandidate.name || !currentCandidate.email || !currentCandidate.phone) {
        // Missing profile information - go to profile completion
        setPhase('profile-completion');
      } else {
        // All info collected, ready to start interview
        setPhase('upload');
      }
    } else {
      // No candidate - start with upload
      setPhase('upload');
    }
  }, [currentCandidate, isInterviewActive, questions, answers, currentQuestion, timeRemaining]);

  useEffect(() => {
    // Handle interview timer - only run if not paused
    if (isInterviewActive && !isPaused && timeRemaining > 0) {
      timerRef.current = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
    } else if (isInterviewActive && !isPaused && timeRemaining === 0) {
      handleTimeUp();
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isInterviewActive, isPaused, timeRemaining]);

  const addChatMessage = (type, content) => {
    const message = {
      id: uuidv4(),
      type,
      content,
      timestamp: new Date()
    };
    setChatMessages(prev => [...prev, message]);
  };

  const handleResumeUpload = async (file) => {
    setIsLoading(true);
    setError('');
    
    try {
      const extractedData = await parseResume(file);
      
      // Create candidate object with empty fields for manual input
      const candidate = {
        id: uuidv4(),
        name: '',
        email: '',
        phone: '',
        resumeFile: file.name,
        uploadedAt: new Date(),
        completed: false,
        score: 0,
        summary: ''
      };

      setCurrentCandidate(candidate);
      
      // Always go to profile completion for manual input
      setPhase('profile-completion');
      
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileCompletion = async (completedCandidate) => {
    setCurrentCandidate(completedCandidate);
    await startInterviewProcess(completedCandidate);
  };

  const handleBackToUpload = () => {
    setPhase('upload');
    setCurrentCandidate(null);
    setError('');
  };

  const startInterviewProcess = async () => {
    try {
      const interviewQuestions = await generateQuestions();
      setQuestions(interviewQuestions);
      setPhase('interview');
      startInterview();
      
      // Start with first question
      const firstQuestion = interviewQuestions[0];
      setTimeRemaining(firstQuestion.timeLimit);
      
      addChatMessage('bot', `Let's start with question 1 of 6 (${firstQuestion.difficulty.toUpperCase()}):\n\n${firstQuestion.question}\n\nYou have ${firstQuestion.timeLimit} seconds to answer.`);
    } catch (err) {
      setError('Failed to generate interview questions');
      addChatMessage('bot', 'Sorry, there was an error starting the interview. Please try again.');
    }
  };

  const handleInterviewAnswer = async (input) => {
    if (!input.trim()) return;

    // Add user message immediately
    addChatMessage('user', input);
    
    // Add a small delay to ensure the user message is rendered
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const currentQ = questions[currentQuestion];
    const answer = {
      questionId: currentQ.id,
      question: currentQ.question,
      answer: input.trim(),
      difficulty: currentQ.difficulty,
      timeUsed: currentQ.timeLimit - timeRemaining,
      timestamp: new Date()
    };
    
    addAnswer(answer);
    
    // Score the answer
    try {
      const scoring = await scoreAnswer(currentQ.question, input.trim(), currentQ.difficulty);
      answer.score = scoring.score;
      answer.feedback = scoring.feedback;
      
      addChatMessage('bot', `Answer recorded! ${scoring.feedback}`);
      
      // Move to next question or finish
      if (currentQuestion < questions.length - 1) {
        setTimeout(() => {
          nextQuestion();
          const nextQ = questions[currentQuestion + 1];
          setTimeRemaining(nextQ.timeLimit);
          
          addChatMessage('bot', `Question ${currentQuestion + 2} of 6 (${nextQ.difficulty.toUpperCase()}):\n\n${nextQ.question}\n\nYou have ${nextQ.timeLimit} seconds to answer.`);
        }, 2000);
      } else {
        // Interview completed
        await completeInterview();
      }
    } catch (err) {
      console.error('Error scoring answer:', err);
      addChatMessage('bot', 'Answer recorded! Moving to the next question...');
    }
  };

  const completeInterview = async () => {
    endInterview();
    setPhase('completed');
    
    try {
      const summary = await generateSummary(answers, answers.map(a => ({ score: a.score || 5 })));
      
      // Update candidate with final score
      const finalCandidate = {
        ...currentCandidate,
        score: summary.totalScore,
        averageScore: summary.averageScore,
        summary: summary.summary,
        completed: true,
        completedAt: new Date(),
        answers: answers
      };
      
      updateCandidateScore(currentCandidate.id, summary.totalScore, summary.summary);
      addCandidate(finalCandidate);
      
      // Create detailed results with right/wrong breakdown
    const rightAnswers = answers.filter(a => (a.score || 0) >= 6).length;
    const wrongAnswers = answers.length - rightAnswers;
    const accuracyPercentage = ((rightAnswers / answers.length) * 100).toFixed(1);
    
    const detailedResults = `Interview completed! 🎉\n\n📊 DETAILED RESULTS:\n\n✅ Correct Answers: ${rightAnswers}/${answers.length}\n❌ Incorrect Answers: ${wrongAnswers}/${answers.length}\n🎯 Accuracy: ${accuracyPercentage}%\n\n📈 SCORING BREAKDOWN:\n- Total Score: ${summary.totalScore}/60\n- Average Score: ${summary.averageScore}/10\n- Performance Level: ${summary.performance}\n\n💡 QUESTION-BY-QUESTION RESULTS:\n${answers.map((answer, index) => {
      const isCorrect = (answer.score || 0) >= 6;
      const icon = isCorrect ? '✅' : '❌';
      return `${icon} Q${index + 1} (${answer.difficulty.toUpperCase()}): ${answer.score || 0}/10`;
    }).join('\n')}\n\n🎓 AI FEEDBACK:\n${summary.summary}\n\nThank you for participating! 🚀`;
    
    addChatMessage('bot', detailedResults);
    } catch (err) {
      console.error('Error generating summary:', err);
      addChatMessage('bot', 'Interview completed! Thank you for participating. Your results are being processed.');
    }
  };

  const handleTimeUp = () => {
    if (phase === 'interview' && currentQuestion < questions.length) {
      addChatMessage('bot', '⏰ Time\'s up! Moving to the next question...');
      
      // Auto-submit empty answer
      const currentQ = questions[currentQuestion];
      const answer = {
        questionId: currentQ.id,
        question: currentQ.question,
        answer: '(No answer provided - time expired)',
        difficulty: currentQ.difficulty,
        timeUsed: currentQ.timeLimit,
        timestamp: new Date(),
        score: 0,
        feedback: 'No answer provided due to time limit.'
      };
      
      addAnswer(answer);
      
      if (currentQuestion < questions.length - 1) {
        setTimeout(() => {
          nextQuestion();
          const nextQ = questions[currentQuestion + 1];
          setTimeRemaining(nextQ.timeLimit);
          
          addChatMessage('bot', `Question ${currentQuestion + 2} of 6 (${nextQ.difficulty.toUpperCase()}):\n\n${nextQ.question}\n\nYou have ${nextQ.timeLimit} seconds to answer.`);
        }, 2000);
      } else {
        completeInterview();
      }
    }
  };

  const handleSubmit = async (input) => {
    if (phase === 'interview') {
      await handleInterviewAnswer(input);
    }
  };

  const handleReset = () => {
    resetInterview();
    setCurrentCandidate(null);
    setPhase('upload');
    setMissingFields([]);
    setChatMessages([{
      id: uuidv4(),
      type: 'bot',
      content: 'Welcome to the AI Interview Assistant! Please upload your resume to get started.',
      timestamp: new Date()
    }]);
    setError('');
  };

  return (
    <div className="w-full">
      {phase === 'upload' && (
        <ResumeUpload 
          onUpload={handleResumeUpload}
          isLoading={isLoading}
          error={error}
        />
      )}
      
      {phase === 'profile-completion' && (
        <ProfileCompletion 
          candidate={currentCandidate}
          onComplete={handleProfileCompletion}
          onBack={handleBackToUpload}
        />
      )}
      
      {(phase === 'interview' || phase === 'completed') && (
        <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-200px)]">
          {phase === 'interview' && (
            <InterviewTimer 
              timeRemaining={timeRemaining}
              currentQuestion={currentQuestion + 1}
              totalQuestions={questions.length}
              difficulty={questions[currentQuestion]?.difficulty}
            />
          )}
          
          <div className="flex-1 min-h-0">
            <ChatInterface 
              messages={chatMessages}
              onSubmit={handleSubmit}
              currentInput={currentInput}
              setCurrentInput={setCurrentInput}
              disabled={phase === 'completed' || isLoading}
              placeholder={
                phase === 'interview'
                  ? 'Type your answer here...'
                  : 'Interview completed'
              }
            />
          </div>
          
          {phase === 'completed' && (
            <div className="text-center py-6 animate-fade-in-up">
              <button 
                className={`${colors.primary} text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg animate-pulse-glow`}
                onClick={handleReset}
              >
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Start New Interview
                </span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default IntervieweeTab;

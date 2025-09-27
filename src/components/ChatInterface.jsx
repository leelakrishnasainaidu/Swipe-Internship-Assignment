import React, { useEffect, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const ChatInterface = ({ 
  messages, 
  onSubmit, 
  currentInput, 
  setCurrentInput, 
  disabled, 
  placeholder 
}) => {
  const { colors } = useTheme();
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    
    // Use requestAnimationFrame to ensure DOM is updated
    requestAnimationFrame(scrollToBottom);
  }, [messages]);

  useEffect(() => {
    // Focus input when not disabled
    if (!disabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [disabled]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentInput.trim() && !disabled) {
      const inputValue = currentInput.trim();
      // Clear input immediately to prevent double submission
      setCurrentInput('');
      onSubmit(inputValue);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatMessage = (content) => {
    // Simple formatting for line breaks
    return content.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < content.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <div className={`flex flex-col h-full ${colors.card} glass-strong rounded-3xl overflow-hidden border ${colors.border} shadow-2xl`}>
      <div className="flex-1 overflow-y-auto p-8 space-y-6" style={{ minHeight: '400px' }}>
        {messages.map((message, index) => (
          <div 
            key={message.id} 
            className={`flex ${message.type === 'bot' ? 'justify-start' : 'justify-end'}`}
            style={{ 
              opacity: 1,
              transform: 'translateY(0)',
              transition: 'all 0.3s ease-in-out'
            }}
          >
            <div className={`max-w-[80%] ${message.type === 'bot' ? 'order-2' : 'order-1'}`}>
              {message.type === 'bot' && (
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-8 h-8 ${colors.primary} rounded-full flex items-center justify-center shadow-lg`}>
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className={`text-sm font-medium ${colors.textSecondary}`}>AI Assistant</span>
                </div>
              )}
              
              <div className={`rounded-2xl px-6 py-4 ${
                message.type === 'bot' 
                  ? `${colors.glass} glass border ${colors.border} ${colors.text}` 
                  : `${colors.primary} text-white shadow-xl`
              } ${message.type === 'bot' ? 'rounded-bl-sm' : 'rounded-br-sm'}`} style={{ minHeight: '60px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div className="whitespace-pre-wrap leading-relaxed text-base">
                  {formatMessage(message.content)}
                </div>
                <div className={`text-xs mt-3 ${
                  message.type === 'bot' ? colors.textMuted : 'text-white/70'
                }`}>
                  {formatTimestamp(message.timestamp)}
                </div>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form className={`${colors.border} border-t ${colors.glass} glass p-6`} onSubmit={handleSubmit}>
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <textarea
              ref={inputRef}
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={placeholder || 'Type your message...'}
              disabled={disabled}
              rows="1"
              className={`w-full px-6 py-4 ${colors.input} glass rounded-2xl resize-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-gray-500/50 focus:border-gray-500 text-base`}
              style={{ 
                minHeight: '56px', 
                maxHeight: '140px'
              }}
            />
          </div>
          <button 
            type="submit" 
            disabled={disabled || !currentInput.trim()}
            className={`${colors.primary} text-white p-4 rounded-2xl transition-all duration-300 hover-glow disabled:opacity-50 disabled:cursor-not-allowed shadow-xl`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;

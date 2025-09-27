import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    // Check localStorage first, then system preference
    const saved = localStorage.getItem('theme');
    if (saved) {
      return saved === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    // Save to localStorage
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    // Update document class
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const theme = {
    isDark,
    toggleTheme,
    colors: {
      // Light mode colors - Professional & Sharp
      light: {
        bg: 'bg-gradient-to-br from-gray-50 via-slate-50 to-zinc-50',
        bgSecondary: 'bg-white/95 backdrop-blur-sm',
        text: 'text-gray-900',
        textSecondary: 'text-gray-600',
        textMuted: 'text-gray-500',
        border: 'border-gray-200/80',
        borderLight: 'border-gray-100/80',
        primary: 'bg-gradient-to-r from-gray-800 via-slate-700 to-gray-600 hover:from-gray-900 hover:via-slate-800 hover:to-gray-700 shadow-lg shadow-gray-500/25',
        primaryText: 'text-gray-700',
        success: 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg shadow-emerald-500/25',
        warning: 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg shadow-amber-500/25',
        danger: 'bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600 shadow-lg shadow-rose-500/25',
        card: 'bg-white/90 backdrop-blur-sm border-gray-200/60 shadow-xl shadow-gray-500/5',
        cardHover: 'hover:shadow-2xl hover:shadow-gray-500/10 hover:bg-white/95',
        input: 'bg-white/80 backdrop-blur-sm border-gray-200/60 text-gray-900 placeholder-gray-400 focus:border-gray-500 focus:ring-gray-500/20',
        button: 'bg-white/80 backdrop-blur-sm border-gray-200/60 text-gray-700 hover:bg-white/90 hover:border-gray-300/60',
        gradient: 'from-gray-800 via-slate-700 to-gray-600',
        accent: 'bg-gray-50/80 backdrop-blur-sm text-gray-700 border-gray-200/60',
        surface: 'bg-gray-100/60 backdrop-blur-sm',
        glass: 'bg-white/20 backdrop-blur-md border-white/30',
      },
      // Dark mode colors - Professional & Sharp
      dark: {
        bg: 'bg-gradient-to-br from-gray-900 via-slate-900 to-zinc-900',
        bgSecondary: 'bg-gray-800/95 backdrop-blur-sm',
        text: 'text-gray-100',
        textSecondary: 'text-gray-300',
        textMuted: 'text-gray-400',
        border: 'border-gray-700/80',
        borderLight: 'border-gray-600/80',
        primary: 'bg-gradient-to-r from-gray-600 via-slate-500 to-gray-400 hover:from-gray-700 hover:via-slate-600 hover:to-gray-500 shadow-lg shadow-gray-500/30',
        primaryText: 'text-gray-300',
        success: 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg shadow-emerald-500/30',
        warning: 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg shadow-amber-500/30',
        danger: 'bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600 shadow-lg shadow-rose-500/30',
        card: 'bg-gray-800/90 backdrop-blur-sm border-gray-700/60 shadow-2xl shadow-gray-900/20',
        cardHover: 'hover:shadow-2xl hover:shadow-gray-500/20 hover:bg-gray-800/95',
        input: 'bg-gray-700/80 backdrop-blur-sm border-gray-600/60 text-gray-100 placeholder-gray-400 focus:border-gray-400 focus:ring-gray-400/20',
        button: 'bg-gray-700/80 backdrop-blur-sm border-gray-600/60 text-gray-300 hover:bg-gray-700/90 hover:border-gray-500/60',
        gradient: 'from-gray-600 via-slate-500 to-gray-400',
        accent: 'bg-gray-800/40 backdrop-blur-sm text-gray-300 border-gray-600/60',
        surface: 'bg-gray-800/60 backdrop-blur-sm',
        glass: 'bg-gray-800/20 backdrop-blur-md border-gray-700/30',
      }
    }
  };

  // Get current theme colors
  const currentColors = isDark ? theme.colors.dark : theme.colors.light;

  return (
    <ThemeContext.Provider value={{ ...theme, colors: currentColors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;

import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme, isLoading } = useTheme();

  if (isLoading) {
    return (
      <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={toggleTheme}
        className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {theme === 'light' ? (
          <Sun className="w-5 h-5 text-yellow-500" />
        ) : (
          <Moon className="w-5 h-5 text-blue-400" />
        )}
      </button>
      
      {/* Theme dropdown */}
      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
        <button
          onClick={() => document.documentElement.classList.remove('dark')}
          className="flex items-center w-full px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          <Sun className="w-4 h-4 mr-3 text-yellow-500" />
          <span>Light Mode</span>
        </button>
        <button
          onClick={() => document.documentElement.classList.add('dark')}
          className="flex items-center w-full px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          <Moon className="w-4 h-4 mr-3 text-blue-400" />
          <span>Dark Mode</span>
        </button>
        <button
          onClick={() => {
            localStorage.removeItem('theme');
            window.location.reload();
          }}
          className="flex items-center w-full px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          <Monitor className="w-4 h-4 mr-3 text-gray-500" />
          <span>System Default</span>
        </button>
      </div>
    </div>
  );
};

export default ThemeToggle;
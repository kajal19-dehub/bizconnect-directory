import React from 'react';
import { Sun, Moon, Monitor, Check, Palette } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const ThemeSettings = () => {
  const { theme, toggleTheme } = useTheme();

  const themes = [
    {
      id: 'light',
      name: 'Light Mode',
      description: 'Bright theme for daytime use',
      icon: Sun,
      color: 'text-yellow-500'
    },
    {
      id: 'dark',
      name: 'Dark Mode',
      description: 'Dark theme for nighttime use',
      icon: Moon,
      color: 'text-blue-400'
    },
    {
      id: 'system',
      name: 'System Default',
      description: 'Follow your device settings',
      icon: Monitor,
      color: 'text-gray-500'
    }
  ];

  const handleThemeSelect = (themeId) => {
    if (themeId === 'system') {
      localStorage.removeItem('theme');
      window.location.reload();
    } else {
      const root = document.documentElement;
      if (themeId === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
      localStorage.setItem('theme', themeId);
      window.location.reload();
    }
  };

  const colorSchemes = [
    {
      id: 'blue',
      name: 'Blue',
      color: 'bg-blue-500',
      active: 'bg-blue-600'
    },
    {
      id: 'purple',
      name: 'Purple',
      color: 'bg-purple-500',
      active: 'bg-purple-600'
    },
    {
      id: 'green',
      name: 'Green',
      color: 'bg-green-500',
      active: 'bg-green-600'
    },
    {
      id: 'red',
      name: 'Red',
      color: 'bg-red-500',
      active: 'bg-red-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Palette className="text-blue-600 dark:text-blue-400 mr-3" size={28} />
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Theme Settings</h1>
              <p className="text-gray-600 dark:text-gray-400">Customize your browsing experience</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Theme Selection */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-gray-100">Color Theme</h2>
            
            <div className="space-y-4">
              {themes.map((themeOption) => {
                const Icon = themeOption.icon;
                return (
                  <button
                    key={themeOption.id}
                    onClick={() => handleThemeSelect(themeOption.id)}
                    className={`w-full flex items-center justify-between p-4 border rounded-xl transition-all ${
                      theme === themeOption.id
                        ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-gray-700'
                        : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`p-3 rounded-lg mr-4 ${themeOption.color} bg-opacity-10`}>
                        <Icon className={themeOption.color} size={20} />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-gray-900 dark:text-gray-100">{themeOption.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{themeOption.description}</p>
                      </div>
                    </div>
                    {theme === themeOption.id && (
                      <Check className="text-blue-600 dark:text-blue-400" size={20} />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Preview Section */}
            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
              <h3 className="font-bold mb-4 text-gray-900 dark:text-gray-100">Theme Preview</h3>
              <div className={`rounded-lg p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <div className="flex items-center mb-4">
                  <div className={`w-12 h-12 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
                  <div className="ml-4">
                    <div className={`h-4 w-32 rounded ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-400'}`}></div>
                    <div className={`h-3 w-24 rounded mt-2 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
                  </div>
                </div>
                <div className={`h-24 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-white border border-gray-200'}`}></div>
                <div className="flex mt-4 space-x-2">
                  <div className={`h-8 flex-1 rounded ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'}`}></div>
                  <div className={`h-8 w-20 rounded ${theme === 'dark' ? 'bg-blue-600' : 'bg-blue-500'}`}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Accent Colors */}
          <div className="space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-gray-100">Accent Color</h2>
              
              <div className="grid grid-cols-2 gap-4">
                {colorSchemes.map((color) => (
                  <button
                    key={color.id}
                    className={`relative p-4 rounded-lg border-2 transition-all ${
                      color.id === 'blue'
                        ? 'border-blue-500 dark:border-blue-400'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <div className={`w-full h-20 ${color.color} rounded-lg mb-3`}></div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{color.name}</p>
                    {color.id === 'blue' && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <Check className="text-white" size={14} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Additional Settings */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-gray-100">Display Settings</h2>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">Reduce Motion</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Minimize animations and transitions</p>
                  </div>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-700">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1" />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">High Contrast</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Increase color contrast for better readability</p>
                  </div>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-700">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1" />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">Dim Images</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Reduce brightness of images in dark mode</p>
                  </div>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                  </button>
                </div>
              </div>
            </div>

            {/* Reset Button */}
            <button
              onClick={() => {
                localStorage.removeItem('theme');
                window.location.reload();
              }}
              className="w-full py-3 border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
              Reset to Default Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeSettings;
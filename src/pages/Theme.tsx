import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { ChevronRight, Sun, Moon, Monitor, Check } from 'lucide-react';

export default function Theme() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const themeOptions = [
    { 
      value: 'light', 
      label: 'Light', 
      icon: Sun, 
      description: 'Clean and bright interface' 
    },
    { 
      value: 'dark', 
      label: 'Dark', 
      icon: Moon, 
      description: 'Easy on the eyes in low light' 
    },
    { 
      value: 'system', 
      label: 'System', 
      icon: Monitor, 
      description: 'Follows your device settings' 
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white">
        <div className="max-w-2xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <button 
              onClick={() => navigate('/profile')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronRight className="w-6 h-6 rotate-180" />
            </button>
            <h1 className="text-xl font-semibold">Theme</h1>
            <div className="w-10"></div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 mt-4">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {themeOptions.map((option, index) => (
            <button
              key={option.value}
              onClick={() => setTheme(option.value as 'light' | 'dark')}
              className="w-full flex items-center justify-between px-6 py-5 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <option.icon className="w-5 h-5 text-gray-700" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="font-medium text-gray-900">{option.label}</span>
                  <span className="text-sm text-gray-500">{option.description}</span>
                </div>
              </div>
              {theme === option.value && (
                <Check className="w-5 h-5 text-blue-500" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
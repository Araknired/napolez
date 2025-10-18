import type { FC } from 'react';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import { ChevronRight, Sun, Moon, Monitor, Check } from 'lucide-react';

import { useTheme } from '../context/ThemeContext';

// ============================================================================
// Types
// ============================================================================

type ThemePreference = 'light' | 'dark' | 'system';

interface ThemeOption {
  readonly value: ThemePreference;
  readonly label: string;
  readonly icon: LucideIcon;
  readonly description: string;
  readonly gradient: string;
}

interface ThemeItemProps {
  readonly option: ThemeOption;
  readonly isSelected: boolean;
  readonly onSelect: (value: ThemePreference) => void;
}

// ============================================================================
// Constants
// ============================================================================

const THEME_OPTIONS: readonly ThemeOption[] = [
  {
    value: 'light',
    label: 'Light',
    icon: Sun,
    description: 'Clean and bright interface',
    gradient: 'from-amber-400 via-yellow-400 to-orange-400',
  },
  {
    value: 'dark',
    label: 'Dark',
    icon: Moon,
    description: 'Easy on the eyes in low light',
    gradient: 'from-slate-700 via-gray-800 to-slate-900',
  },
  {
    value: 'system',
    label: 'System',
    icon: Monitor,
    description: 'Follows your device settings',
    gradient: 'from-blue-500 via-purple-500 to-pink-500',
  },
];

// ============================================================================
// Subcomponents
// ============================================================================

/**
 * ThemeItem - Individual theme option button
 */
const ThemeItem: FC<ThemeItemProps> = ({ option, isSelected, onSelect }) => {
  const Icon = option.icon;

  const handleClick = useCallback(() => {
    onSelect(option.value);
  }, [option.value, onSelect]);

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`group relative w-full flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 transition-all duration-300 border-b border-gray-100 last:border-b-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset overflow-hidden ${
        isSelected
          ? 'bg-gradient-to-r from-blue-50 to-purple-50'
          : 'hover:bg-gray-50'
      }`}
      aria-pressed={isSelected}
      aria-label={`Select ${option.label} theme`}
    >
      {isSelected && (
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 animate-pulse" />
      )}
      
      <div className="flex items-center gap-3 sm:gap-4 relative z-10">
        <div
          className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
            isSelected
              ? `bg-gradient-to-br ${option.gradient} shadow-lg`
              : 'bg-gray-100 group-hover:bg-gray-200'
          }`}
        >
          <Icon
            className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors ${
              isSelected ? 'text-white' : 'text-gray-700'
            }`}
            aria-hidden="true"
          />
        </div>
        <div className="flex flex-col items-start">
          <span
            className={`font-semibold text-sm sm:text-base transition-colors ${
              isSelected ? 'text-gray-900' : 'text-gray-800'
            }`}
          >
            {option.label}
          </span>
          <span className="text-xs sm:text-sm text-gray-500 mt-0.5">
            {option.description}
          </span>
        </div>
      </div>
      
      {isSelected && (
        <div className="relative z-10 flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 rounded-full shadow-lg flex-shrink-0">
          <Check
            className="w-4 h-4 sm:w-5 sm:h-5 text-white"
            strokeWidth={3}
            aria-label="Selected theme"
          />
        </div>
      )}
    </button>
  );
};

// ============================================================================
// Main Component
// ============================================================================

/**
 * Theme - Theme preference settings page
 */
const Theme: FC = () => {
  const navigate = useNavigate();
  const { preference, setPreference } = useTheme();

  const handleBackNavigation = useCallback(() => {
    navigate('/profile');
  }, [navigate]);

  const handleThemeSelect = useCallback(
    (selectedPreference: ThemePreference) => {
      setPreference(selectedPreference);
    },
    [setPreference]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 pb-20 lg:pb-8">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleBackNavigation}
              className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 hover:bg-gray-100 rounded-xl sm:rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:scale-105 active:scale-95"
              aria-label="Go back to profile"
            >
              <ChevronRight
                className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 rotate-180"
                aria-hidden="true"
              />
            </button>
            <div className="flex flex-col items-center">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                Theme Preference
              </h1>
              <p className="hidden sm:block text-xs sm:text-sm text-gray-500 mt-0.5">
                Choose your preferred color scheme
              </p>
            </div>
            <div className="w-10 sm:w-12" aria-hidden="true" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Info Card */}
        <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl sm:rounded-2xl border border-blue-100">
          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
            <span className="font-semibold text-gray-900">💡 Tip:</span> Your
            theme preference will be saved and applied across all your sessions.
            Choose <span className="font-medium">"System"</span> to automatically
            match your device's theme.
          </p>
        </div>

        {/* Theme Options */}
        <div
          className="bg-white rounded-xl sm:rounded-2xl shadow-lg shadow-gray-200/50 overflow-hidden border border-gray-100 hover:shadow-xl hover:shadow-gray-300/50 transition-shadow duration-300"
          role="group"
          aria-label="Theme options"
        >
          {THEME_OPTIONS.map((option, index) => (
            <div
              key={option.value}
              className="relative"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <ThemeItem
                option={option}
                isSelected={preference === option.value}
                onSelect={handleThemeSelect}
              />
            </div>
          ))}
        </div>

        {/* Additional Info for Desktop */}
        <div className="hidden lg:block mt-8 p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            About Theme Options
          </h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              <span className="font-medium text-gray-900">Light Mode:</span>{' '}
              Perfect for daytime use and well-lit environments.
            </p>
            <p>
              <span className="font-medium text-gray-900">Dark Mode:</span>{' '}
              Reduces eye strain in low-light conditions and saves battery on OLED screens.
            </p>
            <p>
              <span className="font-medium text-gray-900">System:</span>{' '}
              Automatically switches between light and dark based on your device settings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Theme;
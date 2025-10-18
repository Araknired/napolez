import type { FC } from 'react';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import { ChevronRight, Sun, Moon, Monitor, Check, Sparkles } from 'lucide-react';

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
  readonly bgGradient: string;
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
    label: 'Light Mode',
    icon: Sun,
    description: 'Clean and bright interface perfect for daytime',
    gradient: 'from-amber-400 via-yellow-400 to-orange-400',
    bgGradient: 'from-amber-50 via-yellow-50 to-orange-50',
  },
  {
    value: 'dark',
    label: 'Dark Mode',
    icon: Moon,
    description: 'Easy on the eyes and battery-friendly in low light',
    gradient: 'from-slate-700 via-gray-800 to-slate-900',
    bgGradient: 'from-slate-50 via-gray-50 to-slate-50',
  },
  {
    value: 'system',
    label: 'System Preference',
    icon: Monitor,
    description: 'Automatically matches your device settings',
    gradient: 'from-blue-500 via-purple-500 to-pink-500',
    bgGradient: 'from-blue-50 via-purple-50 to-pink-50',
  },
];

// ============================================================================
// Subcomponents
// ============================================================================

/**
 * ThemeItem - Individual theme option button with enhanced design
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
      className={`group relative w-full flex items-center justify-between px-6 sm:px-8 lg:px-10 py-6 sm:py-7 lg:py-8 transition-all duration-300 border-b border-gray-200 last:border-b-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset overflow-hidden ${
        isSelected
          ? `bg-gradient-to-br ${option.bgGradient} shadow-lg`
          : 'hover:bg-gray-50 hover:shadow-md'
      }`}
      aria-pressed={isSelected}
      aria-label={`Select ${option.label} theme`}
    >
      {isSelected && (
        <>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/8 to-purple-500/8 animate-pulse" />
          <div className="absolute -inset-px bg-gradient-to-r from-blue-400/20 via-transparent to-purple-400/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
        </>
      )}
      
      <div className="flex items-center gap-4 sm:gap-6 lg:gap-8 relative z-10 flex-1">
        <div
          className={`w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-2xl sm:rounded-3xl lg:rounded-3xl flex items-center justify-center flex-shrink-0 transition-all duration-300 transform ${
            isSelected
              ? `bg-gradient-to-br ${option.gradient} shadow-xl scale-100 ring-4 ring-white`
              : 'bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-gray-150 group-hover:to-gray-250 group-hover:scale-105 shadow-md'
          }`}
        >
          <Icon
            className={`w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 transition-all duration-300 ${
              isSelected ? 'text-white scale-100' : 'text-gray-600 group-hover:text-gray-700'
            }`}
            strokeWidth={2}
            aria-hidden="true"
          />
        </div>

        <div className="flex flex-col items-start justify-center flex-1">
          <span
            className={`font-bold text-base sm:text-lg lg:text-xl transition-colors duration-300 ${
              isSelected ? 'text-gray-900' : 'text-gray-800 group-hover:text-gray-900'
            }`}
          >
            {option.label}
          </span>
          <span className="text-sm sm:text-base lg:text-lg text-gray-600 mt-1 sm:mt-1.5 lg:mt-2 leading-snug">
            {option.description}
          </span>
        </div>
      </div>
      
      {isSelected && (
        <div className="relative z-10 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full shadow-xl flex-shrink-0 ring-4 ring-white transform scale-100 animate-pulse">
          <Check
            className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white"
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
 * Theme - Professional theme preference settings page
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 pb-24 sm:pb-20 lg:pb-8 lg:pt-24">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-40 lg:sticky lg:top-16 shadow-sm">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-12 py-6 sm:py-8 lg:py-8">
          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={handleBackNavigation}
              className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 hover:bg-gray-100 rounded-2xl sm:rounded-2xl lg:rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:scale-110 active:scale-95 flex-shrink-0"
              aria-label="Go back to profile"
            >
              <ChevronRight
                className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-gray-700 rotate-180"
                aria-hidden="true"
              />
            </button>

            <div className="flex flex-col items-center flex-1">
              <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-blue-500" />
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Theme Preference
                </h1>
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-blue-500" />
              </div>
              <p className="hidden sm:block text-sm sm:text-base lg:text-lg text-gray-600 font-medium">
                Customize your visual experience
              </p>
            </div>

            <div className="w-12 sm:w-14 lg:w-16" aria-hidden="true" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-12 py-8 sm:py-10 lg:py-16">
        {/* Premium Info Card */}
        <div className="mb-8 sm:mb-10 lg:mb-12 p-6 sm:p-8 lg:p-10 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-2xl sm:rounded-3xl lg:rounded-3xl border border-blue-400/30 shadow-xl">
          <div className="flex gap-4 sm:gap-5 lg:gap-6 items-start">
            <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-base sm:text-lg lg:text-xl text-white leading-relaxed font-medium">
                <span className="font-bold block mb-2 sm:mb-3">💡 Pro Tip:</span>
                Your theme preference is securely saved and will be applied across all your devices and sessions. Select <span className="font-bold text-blue-100">"System Preference"</span> to seamlessly adapt to your device's display settings.
              </p>
            </div>
          </div>
        </div>

        {/* Theme Options Container */}
        <div
          className="bg-white rounded-3xl lg:rounded-3xl shadow-2xl shadow-gray-300/40 overflow-hidden border border-gray-200 hover:shadow-2xl hover:shadow-gray-400/50 transition-all duration-500"
          role="group"
          aria-label="Theme options"
        >
          {THEME_OPTIONS.map((option, index) => (
            <div
              key={option.value}
              className="relative"
              style={{ 
                animationDelay: `${index * 100}ms`,
                animation: 'fadeIn 0.6s ease-out forwards'
              }}
            >
              <ThemeItem
                option={option}
                isSelected={preference === option.value}
                onSelect={handleThemeSelect}
              />
            </div>
          ))}
        </div>

        {/* Detailed Information Section */}
        <div className="hidden lg:block mt-12 p-10 bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-10 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
            <h3 className="text-2xl font-bold text-gray-900">
              Understanding Theme Options
            </h3>
          </div>
          
          <div className="grid grid-cols-3 gap-8">
            {THEME_OPTIONS.map((option) => (
              <div
                key={option.value}
                className="group p-6 rounded-2xl bg-white border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-lg"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${option.gradient} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  {(() => {
                    const Icon = option.icon;
                    return <Icon className="w-8 h-8 text-white" />;
                  })()}
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">
                  {option.label}
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  {option.value === 'light' && 'Optimized for daytime use with bright backgrounds and high contrast for maximum readability in well-lit environments.'}
                  {option.value === 'dark' && 'Reduces eye strain in low-light conditions and significantly extends battery life on OLED and modern display technologies.'}
                  {option.value === 'system' && 'Intelligently synchronizes with your device settings, providing a seamless experience that respects your device preferences.'}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Info Section */}
        <div className="lg:hidden mt-8 sm:mt-10 space-y-4">
          {THEME_OPTIONS.map((option) => (
            <div
              key={option.value}
              className="p-5 sm:p-6 rounded-2xl bg-white border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-3">
                {(() => {
                  const Icon = option.icon;
                  return (
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br ${option.gradient} rounded-xl flex items-center justify-center`}>
                      <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    </div>
                  );
                })()}
                <h4 className="text-base sm:text-lg font-bold text-gray-900">
                  {option.label}
                </h4>
              </div>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed pl-0 sm:pl-0">
                {option.value === 'light' && 'Perfect for daytime and bright environments with excellent readability.'}
                {option.value === 'dark' && 'Reduces eye strain and saves battery life in dark conditions.'}
                {option.value === 'system' && 'Automatically adapts to your device settings.'}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Theme;
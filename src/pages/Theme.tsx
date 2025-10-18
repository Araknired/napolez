import type { FC } from 'react';
import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import { ChevronRight, Sun, Moon, Monitor, Check, Sparkles, Zap, Shield } from 'lucide-react';

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
  readonly isDesktop?: boolean;
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

const THEME_DETAILS = [
  {
    value: 'light',
    title: 'Light Mode',
    icon: Sun,
    iconColor: 'from-amber-500 to-orange-500',
    description: 'Optimized for daytime use with bright backgrounds and high contrast for maximum readability in well-lit environments.',
    benefits: ['High visibility', 'Better readability', 'Day-friendly'],
  },
  {
    value: 'dark',
    title: 'Dark Mode',
    icon: Moon,
    iconColor: 'from-indigo-600 to-slate-800',
    description: 'Reduces eye strain in low-light conditions and significantly extends battery life on OLED and modern display technologies.',
    benefits: ['Less eye strain', 'Battery efficient', 'Night-friendly'],
  },
  {
    value: 'system',
    title: 'System Preference',
    icon: Monitor,
    iconColor: 'from-emerald-500 to-teal-600',
    description: 'Intelligently synchronizes with your device settings, providing a seamless experience that respects your device preferences.',
    benefits: ['Auto-switching', 'Adaptive', 'Smart sync'],
  },
];

// ============================================================================
// Subcomponents
// ============================================================================

/**
 * ThemeItem - Individual theme option button with enhanced design
 */
const ThemeItem: FC<ThemeItemProps> = ({ option, isSelected, onSelect, isDesktop = false }) => {
  const Icon = option.icon;

  const handleClick = useCallback(() => {
    onSelect(option.value);
  }, [option.value, onSelect]);

  if (isDesktop) {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`group relative w-full flex flex-col items-center justify-center gap-4 p-8 transition-all duration-300 rounded-2xl border-2 focus:outline-none overflow-hidden ${
          isSelected
            ? 'border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg shadow-gray-300/40'
            : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
        }`}
        aria-pressed={isSelected}
        aria-label={`Select ${option.label} theme`}
      >
        {isSelected && (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 animate-pulse rounded-2xl" />
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-400/30 via-transparent to-purple-400/30 rounded-2xl opacity-100 blur-md" />
          </>
        )}
        
        <div
          className={`w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-300 transform relative z-10 ${
            isSelected
              ? `bg-gradient-to-br ${option.gradient} shadow-xl scale-100 ring-4 ring-white`
              : 'bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-gray-150 group-hover:to-gray-250 group-hover:scale-105 shadow-md'
          }`}
        >
          <Icon
            className={`w-10 h-10 transition-all duration-300 ${
              isSelected ? 'text-white scale-100' : 'text-gray-600 group-hover:text-gray-700'
            }`}
            strokeWidth={2}
            aria-hidden="true"
          />
        </div>

        <div className="flex flex-col items-center justify-center gap-2 relative z-10">
          <span
            className={`font-bold text-lg transition-colors duration-300 text-center ${
              isSelected ? 'text-gray-900' : 'text-gray-800 group-hover:text-gray-900'
            }`}
          >
            {option.label}
          </span>
          <span className="text-sm text-gray-600 text-center leading-snug max-w-xs">
            {option.description}
          </span>
        </div>
        
        {isSelected && (
          <div className="relative z-10 flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full shadow-xl ring-4 ring-white transform scale-100">
            <Check
              className="w-6 h-6 text-white"
              strokeWidth={3}
              aria-label="Selected theme"
            />
          </div>
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`group relative w-full flex items-center justify-between px-6 sm:px-8 py-6 sm:py-7 transition-all duration-300 border-b border-gray-200 last:border-b-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset overflow-hidden ${
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
      
      <div className="flex items-center gap-4 sm:gap-6 relative z-10 flex-1">
        <div
          className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-300 transform ${
            isSelected
              ? `bg-gradient-to-br ${option.gradient} shadow-xl scale-100 ring-4 ring-white`
              : 'bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-gray-150 group-hover:to-gray-250 group-hover:scale-105 shadow-md'
          }`}
        >
          <Icon
            className={`w-7 h-7 sm:w-8 sm:h-8 transition-all duration-300 ${
              isSelected ? 'text-white scale-100' : 'text-gray-600 group-hover:text-gray-700'
            }`}
            strokeWidth={2}
            aria-hidden="true"
          />
        </div>

        <div className="flex flex-col items-start justify-center flex-1">
          <span
            className={`font-bold text-base sm:text-lg transition-colors duration-300 ${
              isSelected ? 'text-gray-900' : 'text-gray-800 group-hover:text-gray-900'
            }`}
          >
            {option.label}
          </span>
          <span className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-1.5 leading-snug">
            {option.description}
          </span>
        </div>
      </div>
      
      {isSelected && (
        <div className="relative z-10 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full shadow-xl flex-shrink-0 ring-4 ring-white transform scale-100 animate-pulse">
          <Check
            className="w-5 h-5 sm:w-6 sm:h-6 text-white"
            strokeWidth={3}
            aria-label="Selected theme"
          />
        </div>
      )}
    </button>
  );
};

/**
 * DesktopDetailCard - Professional detail card for desktop
 */
const DesktopDetailCard: FC<{ detail: typeof THEME_DETAILS[0] }> = ({ detail }) => {
  const IconComponent = detail.icon;
  const benefits = detail.value === 'light' 
    ? [{ icon: Sun, label: 'Visibility' }, { icon: Zap, label: 'Readable' }]
    : detail.value === 'dark'
    ? [{ icon: Shield, label: 'Strain Relief' }, { icon: Zap, label: 'Battery' }]
    : [{ icon: Monitor, label: 'Adaptive' }, { icon: Sparkles, label: 'Smart' }];

  return (
    <div className="group relative p-8 rounded-2xl bg-white border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-xl overflow-hidden h-full">
      {/* Background gradient effect */}
      <div className={`absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br ${detail.iconColor} opacity-5 rounded-full blur-3xl transition-all duration-300 group-hover:opacity-10`} />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className={`w-14 h-14 bg-gradient-to-br ${detail.iconColor} rounded-xl flex items-center justify-center shadow-lg transform transition-transform duration-300 group-hover:scale-110`}>
            <IconComponent className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">{detail.title}</h3>
        </div>

        {/* Description */}
        <p className="text-gray-600 leading-relaxed mb-8 text-sm">
          {detail.description}
        </p>

        {/* Benefits */}
        <div className="flex gap-3 flex-wrap">
          {benefits.map((benefit, idx) => {
            const BenefitIcon = benefit.icon;
            return (
              <div
                key={idx}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r ${
                  detail.value === 'light'
                    ? idx === 0 ? 'from-amber-100 to-yellow-100' : 'from-orange-100 to-red-100'
                    : detail.value === 'dark'
                    ? idx === 0 ? 'from-indigo-100 to-purple-100' : 'from-slate-100 to-gray-100'
                    : idx === 0 ? 'from-emerald-100 to-teal-100' : 'from-cyan-100 to-blue-100'
                }`}
              >
                <BenefitIcon className={`w-4 h-4 ${
                  detail.value === 'light'
                    ? idx === 0 ? 'text-amber-600' : 'text-orange-600'
                    : detail.value === 'dark'
                    ? idx === 0 ? 'text-indigo-600' : 'text-slate-600'
                    : idx === 0 ? 'text-emerald-600' : 'text-cyan-600'
                }`} />
                <span className={`text-xs font-semibold ${
                  detail.value === 'light'
                    ? idx === 0 ? 'text-amber-900' : 'text-orange-900'
                    : detail.value === 'dark'
                    ? idx === 0 ? 'text-indigo-900' : 'text-slate-900'
                    : idx === 0 ? 'text-emerald-900' : 'text-cyan-900'
                }`}>
                  {benefit.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/**
 * MobileDetailCard - Optimized detail card for mobile
 */
const MobileDetailCard: FC<{ detail: typeof THEME_DETAILS[0] }> = ({ detail }) => {
  const IconComponent = detail.icon;

  return (
    <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden relative">
      <div className={`absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br ${detail.iconColor} opacity-8 rounded-full blur-2xl`} />
      
      <div className="relative z-10 flex items-start gap-4">
        <div className={`w-12 h-12 bg-gradient-to-br ${detail.iconColor} rounded-lg flex items-center justify-center flex-shrink-0 shadow-md`}>
          <IconComponent className="w-6 h-6 text-white" />
        </div>
        
        <div className="flex-1">
          <h4 className="text-base font-bold text-gray-900 mb-2">{detail.title}</h4>
          <p className="text-sm text-gray-600 leading-relaxed">
            {detail.description}
          </p>
        </div>
      </div>
    </div>
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

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleBackNavigation = useCallback(() => {
    navigate('/profile');
  }, [navigate]);

  const handleThemeSelect = useCallback(
    (selectedPreference: ThemePreference) => {
      setPreference(selectedPreference);
    },
    [setPreference]
  );

  const currentDetail = THEME_DETAILS.find(d => d.value === preference);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 pb-24 sm:pb-20 lg:pb-8 lg:pt-24">
      {/* Header - Mobile and Tablet Only */}
      <div className="lg:hidden bg-white/90 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 py-6 sm:py-8">
          <div className="flex items-center">
            <button
              type="button"
              onClick={handleBackNavigation}
              className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 hover:bg-gray-100 rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:scale-110 active:scale-95 flex-shrink-0"
              aria-label="Go back to profile"
            >
              <ChevronRight
                className="w-6 h-6 sm:w-7 sm:h-7 text-gray-700 rotate-180"
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Back Button - Fixed Position */}
      <button
        type="button"
        onClick={handleBackNavigation}
        className="hidden lg:flex fixed top-32 left-8 items-center justify-center w-12 h-12 hover:bg-gray-100 rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:scale-110 active:scale-95 z-40"
        aria-label="Go back to profile"
      >
        <ChevronRight
          className="w-6 h-6 text-gray-700 rotate-180"
          aria-hidden="true"
        />
      </button>

      {/* Main Content - Mobile and Tablet */}
      <div className="lg:hidden max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Premium Info Card */}
        <div className="mb-8 sm:mb-10 p-6 sm:p-8 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-2xl sm:rounded-3xl border border-blue-400/30 shadow-xl">
          <div className="flex gap-4 sm:gap-5 items-start">
            <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-base sm:text-lg text-white leading-relaxed font-medium">
                <span className="font-bold block mb-2 sm:mb-3">💡 Pro Tip:</span>
                Your theme preference is securely saved and will be applied across all your devices and sessions. Select <span className="font-bold text-blue-100">"System Preference"</span> to seamlessly adapt to your device's display settings.
              </p>
            </div>
          </div>
        </div>

        {/* Theme Options Container */}
        <div
          className="bg-white rounded-3xl shadow-2xl shadow-gray-300/40 overflow-hidden border border-gray-200 hover:shadow-2xl hover:shadow-gray-400/50 transition-all duration-500 mb-8 sm:mb-10"
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

        {/* Mobile Information Section */}
        <div>
          <div className="mb-6 sm:mb-8 flex items-center gap-3">
            <div className="h-1 w-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Learn More</h2>
          </div>
          <div className="space-y-4 sm:space-y-5">
            {THEME_DETAILS.map((detail) => (
              <MobileDetailCard key={detail.value} detail={detail} />
            ))}
          </div>
        </div>
      </div>

      {/* Main Content - Desktop */}
      <div className="hidden lg:block max-w-7xl mx-auto px-8 pt-0 pb-12 h-[calc(100vh-100px)] flex items-center">
        <div className="grid grid-cols-2 gap-12">
          {/* Left Column - Theme Selection */}
          <div className="flex flex-col">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Your Theme</h2>
              <p className="text-gray-600">Choose how you want to experience our interface</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {THEME_OPTIONS.map((option, index) => (
                <div
                  key={option.value}
                  style={{ 
                    animationDelay: `${index * 100}ms`,
                    animation: 'fadeIn 0.6s ease-out forwards'
                  }}
                >
                  <ThemeItem
                    option={option}
                    isSelected={preference === option.value}
                    onSelect={handleThemeSelect}
                    isDesktop={true}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Information */}
          <div className="flex flex-col">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Theme Details</h2>
              <p className="text-gray-600">Information about the selected theme</p>
            </div>

            {currentDetail && (
              <div className="mb-8">
                <DesktopDetailCard detail={currentDetail} />
              </div>
            )}

            {/* All themes info below */}
            <div>
              <div className="mb-4 flex items-center gap-3">
                <div className="h-1 w-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
                <h3 className="text-lg font-bold text-gray-900">All Themes</h3>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {THEME_DETAILS.map((detail) => (
                  <div key={detail.value} className="p-4 rounded-lg bg-gray-50 border border-gray-200 hover:border-gray-300 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-8 h-8 bg-gradient-to-br ${detail.iconColor} rounded-lg flex items-center justify-center`}>
                        {(() => {
                          const Icon = detail.icon;
                          return <Icon className="w-4 h-4 text-white" />;
                        })()}
                      </div>
                      <h4 className="font-semibold text-gray-900 text-sm">{detail.title}</h4>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">{detail.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
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
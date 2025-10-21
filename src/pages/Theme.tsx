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
    description: 'Bright and clean interface for daylight.',
    gradient: 'from-amber-400 via-yellow-400 to-orange-400',
    bgGradient: 'from-slate-800 via-slate-900 to-gray-900',
  },
  {
    value: 'dark',
    label: 'Dark Mode',
    icon: Moon,
    description: 'Perfect for low light — reduces eye strain.',
    gradient: 'from-slate-600 via-gray-700 to-slate-900',
    bgGradient: 'from-slate-900 via-gray-950 to-black',
  },
  {
    value: 'system',
    label: 'System Preference',
    icon: Monitor,
    description: 'Automatically matches your OS setting.',
    gradient: 'from-blue-600 via-purple-600 to-pink-600',
    bgGradient: 'from-gray-900 via-slate-900 to-gray-950',
  },
];

const THEME_DETAILS = [
  {
    value: 'light',
    title: 'Light Mode',
    icon: Sun,
    iconColor: 'from-yellow-400 to-orange-500',
    description:
      'Optimized for daytime with bright tones and crisp contrast.',
    benefits: ['High visibility', 'Vibrant UI', 'Day-friendly'],
  },
  {
    value: 'dark',
    title: 'Dark Mode',
    icon: Moon,
    iconColor: 'from-indigo-600 to-slate-800',
    description:
      'Best for night use, reduces glare and saves battery life.',
    benefits: ['Less eye strain', 'Battery efficient', 'Night-friendly'],
  },
  {
    value: 'system',
    title: 'System Preference',
    icon: Monitor,
    iconColor: 'from-emerald-500 to-teal-600',
    description:
      'Adapts automatically to your system’s light or dark mode.',
    benefits: ['Adaptive', 'Auto-switching', 'Smart sync'],
  },
];

// ============================================================================
// Components
// ============================================================================

const ThemeItem: FC<ThemeItemProps> = ({ option, isSelected, onSelect, isDesktop = false }) => {
  const Icon = option.icon;
  const handleClick = useCallback(() => onSelect(option.value), [option.value, onSelect]);

  if (isDesktop) {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`group relative w-full flex flex-col items-center justify-center gap-4 p-8 transition-all duration-300 rounded-2xl border-2 focus:outline-none overflow-hidden ${
          isSelected
            ? 'border-slate-600 bg-gradient-to-br from-slate-800 to-slate-900 shadow-lg shadow-black/40'
            : 'border-slate-700 bg-slate-800 hover:border-slate-600 hover:shadow-lg hover:shadow-black/50'
        }`}
        aria-pressed={isSelected}
        aria-label={`Select ${option.label} theme`}
      >
        {isSelected && (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 animate-pulse rounded-2xl" />
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-400/20 via-transparent to-purple-400/20 rounded-2xl opacity-100 blur-lg" />
          </>
        )}

        <div
          className={`w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-300 transform relative z-10 ${
            isSelected
              ? `bg-gradient-to-br ${option.gradient} shadow-xl scale-105 ring-4 ring-slate-900`
              : 'bg-gradient-to-br from-slate-700 to-slate-800 group-hover:scale-105 shadow-md'
          }`}
        >
          <Icon
            className={`w-10 h-10 transition-all duration-300 ${
              isSelected ? 'text-white' : 'text-gray-300 group-hover:text-white'
            }`}
            strokeWidth={2}
          />
        </div>

        <div className="flex flex-col items-center justify-center gap-2 relative z-10">
          <span
            className={`font-bold text-lg transition-colors duration-300 text-center ${
              isSelected ? 'text-white' : 'text-gray-300 group-hover:text-white'
            }`}
          >
            {option.label}
          </span>
          <span className="text-sm text-gray-400 text-center leading-snug max-w-xs">
            {option.description}
          </span>
        </div>

        {isSelected && (
          <div className="relative z-10 flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full shadow-xl ring-4 ring-slate-900">
            <Check className="w-6 h-6 text-white" strokeWidth={3} />
          </div>
        )}
      </button>
    );
  }

  // Mobile/Tablet layout
  return (
    <button
      type="button"
      onClick={handleClick}
      className={`group relative w-full flex items-center justify-between px-6 sm:px-8 py-6 sm:py-7 transition-all duration-300 border-b border-slate-700 last:border-b-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset overflow-hidden ${
        isSelected
          ? `bg-gradient-to-br ${option.bgGradient} shadow-md shadow-black/40`
          : 'hover:bg-slate-800 hover:shadow-md'
      }`}
    >
      {isSelected && (
        <>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 animate-pulse" />
          <div className="absolute -inset-px bg-gradient-to-r from-blue-400/20 via-transparent to-purple-400/20 rounded-2xl opacity-50 group-hover:opacity-100 blur-lg" />
        </>
      )}

      <div className="flex items-center gap-4 sm:gap-6 relative z-10 flex-1">
        <div
          className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-300 transform ${
            isSelected
              ? `bg-gradient-to-br ${option.gradient} shadow-xl ring-4 ring-slate-900`
              : 'bg-gradient-to-br from-slate-700 to-slate-800 group-hover:scale-105 shadow-md'
          }`}
        >
          <Icon
            className={`w-7 h-7 sm:w-8 sm:h-8 transition-all duration-300 ${
              isSelected ? 'text-white' : 'text-gray-300 group-hover:text-white'
            }`}
            strokeWidth={2}
          />
        </div>

        <div className="flex flex-col items-start justify-center flex-1">
          <span
            className={`font-bold text-base sm:text-lg transition-colors duration-300 ${
              isSelected ? 'text-white' : 'text-gray-300 group-hover:text-white'
            }`}
          >
            {option.label}
          </span>
          <span className="text-sm sm:text-base text-gray-400 mt-1 sm:mt-1.5 leading-snug">
            {option.description}
          </span>
        </div>
      </div>

      {isSelected && (
        <div className="relative z-10 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600 to-purple-700 rounded-full shadow-xl ring-4 ring-slate-900 animate-pulse">
          <Check className="w-5 h-5 sm:w-6 sm:h-6 text-white" strokeWidth={3} />
        </div>
      )}
    </button>
  );
};

/**
 * DesktopDetailCard - Professional detail card for dark mode
 */
const DesktopDetailCard: FC<{ detail: typeof THEME_DETAILS[0] }> = ({ detail }) => {
  const IconComponent = detail.icon;
  const benefits =
    detail.value === 'light'
      ? [{ icon: Sun, label: 'Visibility' }, { icon: Zap, label: 'Readable' }]
      : detail.value === 'dark'
      ? [{ icon: Shield, label: 'Strain Relief' }, { icon: Zap, label: 'Battery' }]
      : [{ icon: Monitor, label: 'Adaptive' }, { icon: Sparkles, label: 'Smart' }];

  return (
    <div className="group relative p-8 rounded-2xl bg-slate-800 border border-slate-700 hover:border-slate-600 transition-all duration-300 hover:shadow-xl hover:shadow-black/40 overflow-hidden h-full">
      <div
        className={`absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br ${detail.iconColor} opacity-10 rounded-full blur-3xl transition-all duration-300 group-hover:opacity-20`}
      />
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-6">
          <div
            className={`w-14 h-14 bg-gradient-to-br ${detail.iconColor} rounded-xl flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110`}
          >
            <IconComponent className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white">{detail.title}</h3>
        </div>

        <p className="text-gray-400 leading-relaxed mb-8 text-sm">{detail.description}</p>

        <div className="flex gap-3 flex-wrap">
          {benefits.map((benefit, idx) => {
            const BenefitIcon = benefit.icon;
            return (
              <div
                key={idx}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r ${
                  detail.value === 'light'
                    ? idx === 0
                      ? 'from-yellow-900/40 to-orange-900/40'
                      : 'from-orange-800/40 to-red-900/40'
                    : detail.value === 'dark'
                    ? idx === 0
                      ? 'from-indigo-900/40 to-slate-900/40'
                      : 'from-gray-800/40 to-gray-900/40'
                    : idx === 0
                      ? 'from-emerald-900/40 to-teal-900/40'
                      : 'from-cyan-900/40 to-blue-900/40'
                }`}
              >
                <BenefitIcon
                  className={`w-4 h-4 ${
                    detail.value === 'light'
                      ? 'text-yellow-300'
                      : detail.value === 'dark'
                      ? 'text-indigo-300'
                      : 'text-emerald-300'
                  }`}
                />
                <span className="text-xs font-semibold text-gray-300">{benefit.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/**
 * MobileDetailCard - Optimized for dark mode
 */
const MobileDetailCard: FC<{ detail: typeof THEME_DETAILS[0] }> = ({ detail }) => {
  const IconComponent = detail.icon;

  return (
    <div className="p-5 rounded-2xl bg-slate-800 border border-slate-700 shadow-md hover:shadow-lg hover:shadow-black/40 transition-all duration-300 overflow-hidden relative">
      <div
        className={`absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br ${detail.iconColor} opacity-10 rounded-full blur-2xl`}
      />
      <div className="relative z-10 flex items-start gap-4">
        <div
          className={`w-12 h-12 bg-gradient-to-br ${detail.iconColor} rounded-lg flex items-center justify-center flex-shrink-0 shadow-md`}
        >
          <IconComponent className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h4 className="text-base font-bold text-white mb-2">{detail.title}</h4>
          <p className="text-sm text-gray-400 leading-relaxed">{detail.description}</p>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// Main Component (Dark Theme Layout)
// ============================================================================
const Theme: FC = () => {
  const navigate = useNavigate();
  const { preference, setPreference } = useTheme();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleBackNavigation = useCallback(() => navigate('/profile'), [navigate]);
  const handleThemeSelect = useCallback(
    (selectedPreference: ThemePreference) => setPreference(selectedPreference),
    [setPreference]
  );

  const currentDetail = THEME_DETAILS.find((d) => d.value === preference);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-gray-950 pb-24 sm:pb-20 lg:pb-8 lg:pt-24 text-white">
      {/* Header - Mobile */}
      <div className="lg:hidden bg-slate-900/90 backdrop-blur-xl border-b border-slate-800 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 py-6 sm:py-8">
          <div className="flex items-center">
            <button
              type="button"
              onClick={handleBackNavigation}
              className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 hover:bg-slate-800 rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Go back to profile"
            >
              <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7 text-gray-300 rotate-180" />
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Back Button */}
      <button
        type="button"
        onClick={handleBackNavigation}
        className="hidden lg:flex fixed top-32 left-8 items-center justify-center w-12 h-12 hover:bg-slate-800 rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 z-40"
      >
        <ChevronRight className="w-6 h-6 text-gray-300 rotate-180" />
      </button>

      {/* Mobile Content */}
      <div className="lg:hidden max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Info Card */}
        <div className="mb-8 sm:mb-10 p-6 sm:p-8 bg-gradient-to-br from-blue-700 via-purple-700 to-indigo-800 rounded-2xl sm:rounded-3xl border border-blue-500/20 shadow-xl">
          <div className="flex gap-4 sm:gap-5 items-start">
            <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-base sm:text-lg text-gray-200 leading-relaxed font-medium">
                <span className="font-bold block mb-2 sm:mb-3">💡 Pro Tip:</span>
                Your theme choice syncs securely across all devices. Select{" "}
                <span className="font-bold text-blue-200">"System Preference"</span> to auto-adapt to your OS mode.
              </p>
            </div>
          </div>
        </div>

        {/* Theme Options */}
        <div
          className="bg-slate-800 rounded-3xl shadow-2xl shadow-black/40 overflow-hidden border border-slate-700 hover:shadow-black/50 transition-all duration-500 mb-8 sm:mb-10"
        >
          {THEME_OPTIONS.map((option, index) => (
            <div
              key={option.value}
              className="relative"
              style={{
                animationDelay: `${index * 100}ms`,
                animation: 'fadeIn 0.6s ease-out forwards',
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

        {/* Learn More Section */}
        <div>
          <div className="mb-6 sm:mb-8 flex items-center gap-3">
            <div className="h-1 w-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
            <h2 className="text-lg sm:text-xl font-bold text-white">Learn More</h2>
          </div>
          <div className="space-y-4 sm:space-y-5">
            {THEME_DETAILS.map((detail) => (
              <MobileDetailCard key={detail.value} detail={detail} />
            ))}
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex max-w-7xl mx-auto px-8 pt-0 pb-12 h-[calc(100vh-100px)] items-center text-white">
        <div className="grid grid-cols-2 gap-12">
          {/* Left Column */}
          <div className="flex flex-col">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-2">Select Your Theme</h2>
              <p className="text-gray-400">Choose how you want to experience the interface</p>
            </div>
            <div className="grid grid-cols-1 gap-6">
              {THEME_OPTIONS.map((option, index) => (
                <div
                  key={option.value}
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: 'fadeIn 0.6s ease-out forwards',
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

          {/* Right Column */}
          <div className="flex flex-col">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-2">Theme Details</h2>
              <p className="text-gray-400">Information about your selected mode</p>
            </div>

            {currentDetail && (
              <div className="mb-8">
                <DesktopDetailCard detail={currentDetail} />
              </div>
            )}

            {/* All Themes */}
            <div>
              <div className="mb-4 flex items-center gap-3">
                <div className="h-1 w-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
                <h3 className="text-lg font-bold text-white">All Themes</h3>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {THEME_DETAILS.map((detail) => (
                  <div
                    key={detail.value}
                    className="p-4 rounded-lg bg-slate-800 border border-slate-700 hover:border-slate-600 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className={`w-8 h-8 bg-gradient-to-br ${detail.iconColor} rounded-lg flex items-center justify-center`}
                      >
                        {(() => {
                          const Icon = detail.icon;
                          return <Icon className="w-4 h-4 text-white" />;
                        })()}
                      </div>
                      <h4 className="font-semibold text-white text-sm">{detail.title}</h4>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">
                      {detail.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Theme;

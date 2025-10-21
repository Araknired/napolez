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
    description: 'Bright and clean interface for daytime.',
    gradient: 'from-amber-400 via-yellow-400 to-orange-400',
    bgGradient: 'from-amber-50 via-yellow-50 to-orange-50',
  },
  {
    value: 'dark',
    label: 'Dark Mode',
    icon: Moon,
    description: 'Perfect for low light — reduces eye strain.',
    gradient: 'from-slate-700 via-gray-800 to-slate-900',
    bgGradient: 'from-slate-900 via-gray-950 to-black',
  },
  {
    value: 'system',
    label: 'System Preference',
    icon: Monitor,
    description: 'Automatically matches your OS setting.',
    gradient: 'from-blue-600 via-purple-600 to-pink-600',
    bgGradient: 'from-blue-50 via-purple-50 to-pink-50',
  },
];

const THEME_DETAILS = [
  {
    value: 'light',
    title: 'Light Mode',
    icon: Sun,
    iconColor: 'from-yellow-400 to-orange-500',
    description: 'Optimized for daytime with bright tones and crisp contrast.',
    benefits: ['High visibility', 'Vibrant UI', 'Day-friendly'],
  },
  {
    value: 'dark',
    title: 'Dark Mode',
    icon: Moon,
    iconColor: 'from-indigo-600 to-slate-800',
    description: 'Best for night use, reduces glare and saves battery life.',
    benefits: ['Less eye strain', 'Battery efficient', 'Night-friendly'],
  },
  {
    value: 'system',
    title: 'System Preference',
    icon: Monitor,
    iconColor: 'from-emerald-500 to-teal-600',
    description: 'Adapts automatically to your system’s light or dark mode.',
    benefits: ['Adaptive', 'Auto-switching', 'Smart sync'],
  },
];

// ============================================================================
// Components
// ============================================================================
const ThemeItem: FC<ThemeItemProps> = ({ option, isSelected, onSelect, isDesktop = false }) => {
  const Icon = option.icon;
  const { theme } = useTheme();
  const handleClick = useCallback(() => onSelect(option.value), [option.value, onSelect]);

  const baseCard = theme === 'dark'
    ? 'bg-slate-800 border-slate-700 hover:border-slate-600'
    : 'bg-white border-gray-200 hover:border-gray-300';
  const selectedCard = theme === 'dark'
    ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-600 shadow-black/40'
    : 'bg-gradient-to-br from-gray-50 to-white border-gray-300 shadow-gray-300/40';

  const textPrimary = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const textSecondary = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';

  if (isDesktop) {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`group relative w-full flex flex-col items-center justify-center gap-4 p-8 transition-all duration-300 rounded-2xl border-2 focus:outline-none overflow-hidden ${
          isSelected ? selectedCard : baseCard
        }`}
        aria-pressed={isSelected}
      >
        {isSelected && (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 animate-pulse rounded-2xl" />
        )}

        <div
          className={`w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-300 transform relative z-10 ${
            isSelected
              ? `bg-gradient-to-br ${option.gradient} shadow-xl scale-105`
              : theme === 'dark'
              ? 'bg-slate-700 hover:bg-slate-600'
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          <Icon
            className={`w-10 h-10 transition-all duration-300 ${
              isSelected ? 'text-white' : theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}
            strokeWidth={2}
          />
        </div>

        <div className="flex flex-col items-center justify-center gap-2 relative z-10">
          <span className={`font-bold text-lg transition-colors duration-300 text-center ${textPrimary}`}>
            {option.label}
          </span>
          <span className={`text-sm ${textSecondary} text-center leading-snug max-w-xs`}>
            {option.description}
          </span>
        </div>

        {isSelected && (
          <div className="relative z-10 flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full shadow-xl">
            <Check className="w-6 h-6 text-white" strokeWidth={3} />
          </div>
        )}
      </button>
    );
  }

  // Mobile Layout
  return (
    <button
      type="button"
      onClick={handleClick}
      className={`group relative w-full flex items-center justify-between px-6 py-6 transition-all duration-300 border-b ${
        theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
      } last:border-b-0 overflow-hidden ${
        isSelected
          ? theme === 'dark'
            ? `bg-gradient-to-br ${option.bgGradient} shadow-black/40`
            : `bg-gradient-to-br ${option.bgGradient} shadow-md`
          : theme === 'dark'
          ? 'hover:bg-slate-800'
          : 'hover:bg-gray-50'
      }`}
    >
      <div className="flex items-center gap-4 flex-1">
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
            isSelected
              ? `bg-gradient-to-br ${option.gradient} shadow-xl`
              : theme === 'dark'
              ? 'bg-slate-700'
              : 'bg-gray-100'
          }`}
        >
          <Icon
            className={`w-7 h-7 transition-all duration-300 ${
              isSelected ? 'text-white' : theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}
            strokeWidth={2}
          />
        </div>

        <div className="flex flex-col items-start justify-center flex-1">
          <span className={`font-bold text-base ${textPrimary}`}>{option.label}</span>
          <span className={`text-sm ${textSecondary} mt-1 leading-snug`}>{option.description}</span>
        </div>
      </div>

      {isSelected && (
        <div className="relative z-10 flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-700 rounded-full shadow-xl animate-pulse">
          <Check className="w-5 h-5 text-white" strokeWidth={3} />
        </div>
      )}
    </button>
  );
};

// ============================================================================
// Desktop Detail Card + Mobile Detail Card
// ============================================================================
const DesktopDetailCard: FC<{ detail: typeof THEME_DETAILS[0] }> = ({ detail }) => {
  const { theme } = useTheme();
  const IconComponent = detail.icon;
  const benefits =
    detail.value === 'light'
      ? [{ icon: Sun, label: 'Visibility' }, { icon: Zap, label: 'Readable' }]
      : detail.value === 'dark'
      ? [{ icon: Shield, label: 'Strain Relief' }, { icon: Zap, label: 'Battery' }]
      : [{ icon: Monitor, label: 'Adaptive' }, { icon: Sparkles, label: 'Smart' }];

  return (
    <div
      className={`group relative p-8 rounded-2xl transition-all duration-300 overflow-hidden h-full border ${
        theme === 'dark'
          ? 'bg-slate-800 border-slate-700 hover:border-slate-600 shadow-black/40'
          : 'bg-white border-gray-200 hover:border-gray-300 shadow-gray-200'
      }`}
    >
      <div
        className={`absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br ${detail.iconColor} ${
          theme === 'dark' ? 'opacity-10' : 'opacity-20'
        } rounded-full blur-3xl`}
      />
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-6">
          <div className={`w-14 h-14 bg-gradient-to-br ${detail.iconColor} rounded-xl flex items-center justify-center shadow-lg`}>
            <IconComponent className="w-7 h-7 text-white" />
          </div>
          <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {detail.title}
          </h3>
        </div>

        <p className={`leading-relaxed mb-8 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          {detail.description}
        </p>

        <div className="flex gap-3 flex-wrap">
          {benefits.map((benefit, idx) => {
            const BenefitIcon = benefit.icon;
            return (
              <div
                key={idx}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r ${
                  theme === 'dark' ? 'from-slate-700/40 to-slate-800/40' : 'from-gray-100 to-gray-200'
                }`}
              >
                <BenefitIcon className="w-4 h-4 text-blue-400" />
                <span
                  className={`text-xs font-semibold ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
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

// ============================================================================
// Main Component
// ============================================================================
const Theme: FC = () => {
  const navigate = useNavigate();
  const { preference, setPreference, theme } = useTheme();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleBackNavigation = useCallback(() => navigate('/profile'), [navigate]);
  const handleThemeSelect = useCallback(
    (selectedPreference: ThemePreference) => setPreference(selectedPreference),
    [setPreference]
  );

  // const currentDetail = THEME_DETAILS.find((d) => d.value === preference); // ELIMINADO: Ya no se usa.

  return (
    <div
      className={`min-h-screen pb-24 sm:pb-20 lg:pb-8 lg:pt-24 ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-gray-950 text-white'
          : 'bg-gradient-to-br from-gray-50 via-white to-gray-50 text-gray-900'
      }`}
    >
      {/* Back Button */}
      <button
        type="button"
        onClick={handleBackNavigation}
        className={`fixed top-8 left-8 items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 z-40 ${
          theme === 'dark' ? 'hover:bg-slate-800' : 'hover:bg-gray-100'
        }`}
      >
        <ChevronRight
          className={`w-6 h-6 rotate-180 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}
        />
      </button>

      {/* Desktop / Mobile unified */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10 space-y-16">
        {/* Pro Tip Section */}
        <div
          className={`p-8 rounded-3xl border shadow-xl ${
            theme === 'dark'
              ? 'bg-gradient-to-br from-blue-700 via-purple-700 to-indigo-800 border-blue-500/20'
              : 'bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 border-blue-400/30'
          }`}
        >
          <div className="flex gap-6 items-start">
            <div className="flex-shrink-0 w-14 h-14 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-lg text-white leading-relaxed font-medium">
                <span className="font-bold block mb-2">💡 Pro Tip:</span>
                Your theme preference syncs across devices. Choose{' '}
                <span className="font-bold text-blue-100">System</span> to auto-adapt to your OS.
              </p>
            </div>
          </div>
        </div>

        {/* Theme Options & Learn More (Reemplazo de Theme Details) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Theme Options - Columna 1 */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Select Your Theme</h2>
            <p className={theme === 'dark' ? 'text-gray-400 mb-8' : 'text-gray-600 mb-8'}>
              Choose how you want to experience the interface.
            </p>

            <div className="grid gap-6">
              {THEME_OPTIONS.map((option, index) => (
                <div key={option.value} style={{ animationDelay: `${index * 100}ms`, animation: 'fadeIn 0.6s ease-out forwards' }}>
                  <ThemeItem
                    option={option}
                    isSelected={preference === option.value}
                    onSelect={handleThemeSelect}
                    isDesktop
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Learn More (Reubicado en Columna 2) */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Learn More</h2>
            <p className={theme === 'dark' ? 'text-gray-400 mb-8' : 'text-gray-600 mb-8'}>
              Information about each mode.
            </p>
            
            <div className="grid md:grid-cols-1 gap-6">
              {THEME_DETAILS.map((detail) => (
                <DesktopDetailCard key={detail.value} detail={detail} />
              ))}
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
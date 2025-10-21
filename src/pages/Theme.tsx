import type { FC } from 'react';
import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Sun, Moon, Check } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

type ThemePreference = 'light' | 'dark';

interface ThemeOption {
  value: ThemePreference;
  label: string;
  icon: any;
  description: string;
  gradient: string;
  bgGradient: string;
}

const THEME_OPTIONS: ThemeOption[] = [
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
];

const ThemeItem: FC<{
  option: ThemeOption;
  isSelected: boolean;
  onSelect: (v: ThemePreference) => void;
  isDesktop?: boolean;
}> = ({ option, isSelected, onSelect, isDesktop = false }) => {
  const { theme } = useTheme();
  const Icon = option.icon;
  const handleClick = useCallback(() => onSelect(option.value), [option.value, onSelect]);

  const baseCard =
    theme === 'dark'
      ? 'bg-slate-800 border-slate-700 hover:border-slate-600'
      : 'bg-white border-gray-200 hover:border-gray-300';
  const selectedCard =
    theme === 'dark'
      ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-600 shadow-black/40'
      : 'bg-gradient-to-br from-gray-50 to-white border-gray-300 shadow-gray-300/40';

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`group relative flex ${
        isDesktop ? 'flex-col p-8' : 'items-center justify-between px-6 py-6'
      } w-full rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
        isSelected ? selectedCard : baseCard
      }`}
      aria-pressed={isSelected}
    >
      <div
        className={`flex ${isDesktop ? 'flex-col items-center' : 'items-center gap-4 flex-1'}`}
      >
        <div
          className={`${
            isDesktop ? 'w-20 h-20' : 'w-14 h-14'
          } rounded-2xl flex items-center justify-center transition-all duration-300 ${
            isSelected ? `bg-gradient-to-br ${option.gradient}` : theme === 'dark' ? 'bg-slate-700' : 'bg-gray-100'
          }`}
        >
          <Icon
            className={`${
              isDesktop ? 'w-10 h-10' : 'w-7 h-7'
            } ${isSelected ? 'text-white' : theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
            strokeWidth={2}
          />
        </div>

        <div
          className={`flex flex-col ${isDesktop ? 'items-center mt-4' : 'items-start ml-2'} text-center`}
        >
          <span className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {option.label}
          </span>
          <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            {option.description}
          </span>
        </div>
      </div>

      {isSelected && (
        <div
          className={`absolute ${
            isDesktop ? 'bottom-4 right-4' : 'right-4 top-1/2 -translate-y-1/2'
          } flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-700 rounded-full shadow-xl`}
        >
          <Check className="w-5 h-5 text-white" strokeWidth={3} />
        </div>
      )}
    </button>
  );
};

const Theme: FC = () => {
  const navigate = useNavigate();
  const { preference, setPreference, theme } = useTheme();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleBack = useCallback(() => navigate('/profile'), [navigate]);
  const handleThemeSelect = useCallback((pref: ThemePreference) => setPreference(pref), [setPreference]);

  return (
    <div
      className={`min-h-screen pb-20 lg:pb-10 ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-gray-950 text-white'
          : 'bg-gradient-to-br from-gray-50 via-white to-gray-50 text-gray-900'
      }`}
    >
      {/* Header Mobile */}
      <div
        className={`lg:hidden sticky top-0 z-40 backdrop-blur-xl border-b ${
          theme === 'dark' ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-gray-200'
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 py-6">
          <button
            onClick={handleBack}
            className={`flex items-center justify-center w-12 h-12 rounded-2xl ${
              theme === 'dark' ? 'hover:bg-slate-800' : 'hover:bg-gray-100'
            }`}
          >
            <ChevronRight
              className={`w-6 h-6 rotate-180 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
            />
          </button>
        </div>
      </div>

      {/* Back Button Desktop */}
      <button
        onClick={handleBack}
        className={`hidden lg:flex fixed top-32 left-8 w-12 h-12 items-center justify-center rounded-2xl ${
          theme === 'dark' ? 'hover:bg-slate-800' : 'hover:bg-gray-100'
        }`}
      >
        <ChevronRight
          className={`w-6 h-6 rotate-180 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
        />
      </button>

      {/* Layout */}
      <div className="max-w-5xl mx-auto px-6 py-10 grid gap-8 lg:grid-cols-2 items-center">
        {THEME_OPTIONS.map((opt, i) => (
          <div
            key={opt.value}
            style={{
              animationDelay: `${i * 100}ms`,
              animation: 'fadeIn 0.6s ease-out forwards',
            }}
          >
            <ThemeItem
              option={opt}
              isSelected={preference === opt.value}
              onSelect={handleThemeSelect}
              isDesktop={true}
            />
          </div>
        ))}
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

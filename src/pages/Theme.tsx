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
  },
  {
    value: 'dark',
    label: 'Dark',
    icon: Moon,
    description: 'Easy on the eyes in low light',
  },
  {
    value: 'system',
    label: 'System',
    icon: Monitor,
    description: 'Follows your device settings',
  },
];

// ============================================================================
// Subcomponents
// ============================================================================

/**
 * ThemeItem - Individual theme option button
 *
 * Extracted for better testability and maintains memoization to prevent
 * unnecessary re-renders when parent updates.
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
      className="w-full flex items-center justify-between px-6 py-5 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
      aria-pressed={isSelected}
      aria-label={`Select ${option.label} theme`}
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-gray-700" aria-hidden="true" />
        </div>
        <div className="flex flex-col items-start">
          <span className="font-medium text-gray-900">{option.label}</span>
          <span className="text-sm text-gray-500">{option.description}</span>
        </div>
      </div>
      {isSelected && (
        <Check
          className="w-5 h-5 text-blue-500 flex-shrink-0"
          aria-label="Selected theme"
        />
      )}
    </button>
  );
};

// ============================================================================
// Main Component
// ============================================================================

/**
 * Theme - Theme preference settings page
 *
 * Provides a user interface for selecting light, dark, or system theme preference.
 * Integrates with ThemeContext for state management and follows WAI-ARIA standards
 * for accessibility.
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
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleBackNavigation}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Go back to profile"
            >
              <ChevronRight
                className="w-6 h-6 rotate-180"
                aria-hidden="true"
              />
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Theme</h1>
            <div className="w-10" aria-hidden="true" />
          </div>
        </div>
      </div>

      {/* Theme Options */}
      <div className="max-w-2xl mx-auto px-6 mt-4">
        <div
          className="bg-white rounded-2xl shadow-sm overflow-hidden"
          role="group"
          aria-label="Theme options"
        >
          {THEME_OPTIONS.map((option) => (
            <ThemeItem
              key={option.value}
              option={option}
              isSelected={preference === option.value}
              onSelect={handleThemeSelect}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Theme;
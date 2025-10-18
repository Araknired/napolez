import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';

// ============================================================================
// Types
// ============================================================================

type Theme = 'light' | 'dark';
type ThemePreference = 'light' | 'dark' | 'system';

interface ThemeContextType {
  readonly theme: Theme;
  readonly preference: ThemePreference;
  readonly toggleTheme: () => void;
  readonly setTheme: (theme: Theme) => void;
  readonly setPreference: (preference: ThemePreference) => void;
}

// ============================================================================
// Constants
// ============================================================================

const STORAGE_KEY = 'theme-preference';
const PREFERENCE_DEFAULT: ThemePreference = 'system';

// ============================================================================
// Utilities
// ============================================================================

/**
 * Get the system theme preference based on device settings
 */
function getSystemTheme(): Theme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

/**
 * Resolve the actual theme based on preference and system settings
 */
function resolveTheme(preference: ThemePreference): Theme {
  if (preference === 'system') {
    return getSystemTheme();
  }
  return preference;
}

/**
 * Apply theme to DOM and persist preference
 */
function applyTheme(theme: Theme): void {
  const root = window.document.documentElement;
  root.classList.remove('light', 'dark');
  root.classList.add(theme);
}

/**
 * Load saved theme preference from storage
 */
function loadPreference(): ThemePreference {
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as
      | ThemePreference
      | null;
    return saved && ['light', 'dark', 'system'].includes(saved)
      ? saved
      : PREFERENCE_DEFAULT;
  } catch {
    return PREFERENCE_DEFAULT;
  }
}

// ============================================================================
// Context
// ============================================================================

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { readonly children: ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>(() =>
    loadPreference()
  );
  const [theme, setThemeState] = useState<Theme>(() =>
    resolveTheme(loadPreference())
  );

  // Handle system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = () => {
      if (preference === 'system') {
        const newSystemTheme = mediaQuery.matches ? 'dark' : 'light';
        setThemeState(newSystemTheme);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [preference]);

  // Apply theme to DOM whenever it changes
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // Persist preference and update theme when preference changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, preference);
      const newTheme = resolveTheme(preference);
      setThemeState(newTheme);
    } catch {
      // Silently fail if localStorage is unavailable
    }
  }, [preference]);

  const toggleTheme = () => {
    setPreferenceState((prev) =>
      prev === 'system' ? 'light' : prev === 'light' ? 'dark' : 'system'
    );
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    setPreferenceState(newTheme);
  };

  const setPreference = (newPreference: ThemePreference) => {
    setPreferenceState(newPreference);
  };

  const value: ThemeContextType = {
    theme,
    preference,
    toggleTheme,
    setTheme,
    setPreference,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

/**
 * Hook to access theme context
 * @throws Error if used outside ThemeProvider
 */
export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
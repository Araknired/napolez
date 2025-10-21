import type { FC } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

// ============================================================================
// Simplified Theme Page (without visible theme toggle UI)
// ============================================================================

/**
 * Theme - Page showing theme details and behavior without visible selection buttons
 */
const Theme: FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme(); // ✅ sigue usando el ThemeContext

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleBackNavigation = () => {
    navigate('/profile');
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-700 ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black'
          : 'bg-gradient-to-br from-gray-50 via-white to-gray-50'
      } pb-24 sm:pb-20 lg:pb-8 lg:pt-24`}
    >
      {/* Header - Mobile and Tablet Only */}
      <div className="lg:hidden bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 py-6 sm:py-8">
          <div className="flex items-center">
            <button
              type="button"
              onClick={handleBackNavigation}
              className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:scale-110 active:scale-95 flex-shrink-0"
              aria-label="Go back to profile"
            >
              <ChevronRight
                className="w-6 h-6 sm:w-7 sm:h-7 text-gray-700 dark:text-gray-200 rotate-180"
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
        className="hidden lg:flex fixed top-32 left-8 items-center justify-center w-12 h-12 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:scale-110 active:scale-95 z-40"
        aria-label="Go back to profile"
      >
        <ChevronRight
          className="w-6 h-6 text-gray-700 dark:text-gray-200 rotate-180"
          aria-hidden="true"
        />
      </button>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 lg:px-12 py-12 lg:py-20 text-center">
        <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">
          Theme Settings
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto">
          The theme of the application automatically follows your preference set in the system or as configured elsewhere in the app. 
          Currently, your interface is displayed in <span className="font-semibold text-purple-500">{theme.toUpperCase()}</span> mode.
        </p>

        <div className="mt-12">
          <div className="rounded-3xl border border-gray-200 dark:border-gray-700 shadow-lg p-8 bg-white dark:bg-gray-800 transition-all duration-500">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              About Theme Behavior
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              This system intelligently applies your preferred color scheme across the application. 
              You can change it globally through your operating system settings or the app’s main theme control.
            </p>
            <ul className="space-y-3 text-gray-700 dark:text-gray-300">
              <li>• Light mode: clean and bright for daytime.</li>
              <li>• Dark mode: relaxing and energy efficient.</li>
              <li>• System preference: adapts automatically to your device.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Theme;

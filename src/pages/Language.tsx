import { useState, useCallback, useMemo } from 'react';
import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Check } from 'lucide-react';

interface Language {
  code: string;
  name: string;
  nativeName: string;
}

const SUPPORTED_LANGUAGES: readonly Language[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
] as const;

const DEFAULT_LANGUAGE = 'English';

/**
 * Header component with back navigation and title
 */
interface PageHeaderProps {
  onBack: () => void;
  title: string;
}

const PageHeader: FC<PageHeaderProps> = ({ onBack, title }) => (
  <div className="bg-white">
    <div className="max-w-2xl mx-auto px-6 py-6">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Go back"
        >
          <ChevronRight className="w-6 h-6 rotate-180" />
        </button>
        <h1 className="text-xl font-semibold">{title}</h1>
        <div className="w-10" aria-hidden="true" />
      </div>
    </div>
  </div>
);

/**
 * Individual language option button with selection indicator
 */
interface LanguageOptionProps {
  language: Language;
  isSelected: boolean;
  onSelect: (languageName: string) => void;
}

const LanguageOption: FC<LanguageOptionProps> = ({ language, isSelected, onSelect }) => {
  const handleClick = useCallback(() => {
    onSelect(language.name);
  }, [language.name, onSelect]);

  return (
    <button
      onClick={handleClick}
      className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
      aria-pressed={isSelected}
    >
      <div className="flex flex-col items-start">
        <span className="font-medium text-gray-900">{language.name}</span>
        <span className="text-sm text-gray-500">{language.nativeName}</span>
      </div>
      {isSelected && (
        <Check className="w-5 h-5 text-blue-500" aria-label="Selected" />
      )}
    </button>
  );
};

/**
 * Language list container component
 */
interface LanguageListProps {
  languages: readonly Language[];
  selectedLanguage: string;
  onLanguageSelect: (languageName: string) => void;
}

const LanguageList: FC<LanguageListProps> = ({ 
  languages, 
  selectedLanguage, 
  onLanguageSelect 
}) => (
  <div className="max-w-2xl mx-auto px-6 mt-4">
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      {languages.map((language) => (
        <LanguageOption
          key={language.code}
          language={language}
          isSelected={selectedLanguage === language.name}
          onSelect={onLanguageSelect}
        />
      ))}
    </div>
  </div>
);

/**
 * Language selection page component
 * Allows users to choose their preferred language from a list of supported options
 */
const Language: FC = () => {
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState<string>(DEFAULT_LANGUAGE);

  const handleBack = useCallback((): void => {
    navigate('/profile');
  }, [navigate]);

  const handleLanguageSelect = useCallback((languageName: string): void => {
    setSelectedLanguage(languageName);
    // TODO: Persist language selection to user preferences/context
  }, []);

  const languages = useMemo(() => SUPPORTED_LANGUAGES, []);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 md:pt-28 pb-20">
      <PageHeader onBack={handleBack} title="Language" />
      <LanguageList
        languages={languages}
        selectedLanguage={selectedLanguage}
        onLanguageSelect={handleLanguageSelect}
      />
    </div>
  );
};

export default Language;
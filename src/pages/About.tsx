import { Link } from 'react-router-dom';
import { FaGraduationCap, FaUniversity, FaLaptopCode } from 'react-icons/fa';
import { FaCode } from 'react-icons/fa6';
import { GiPlasticDuck } from 'react-icons/gi';
import { useState, useEffect } from 'react';
import type { FC } from 'react';
import type { IconType } from 'react-icons';
import { useTheme } from '../context/ThemeContext'; // ajusta la ruta si es necesario

// Constants
const LOADING_DURATION = 1500;
const CONTENT_FADE_DELAY = 100;
const RATING_VALUE = 4.9;
const REVIEW_COUNT = 54;
const STAR_COUNT = 5;

interface Organization {
  icon: IconType;
  name: string;
}

const ORGANIZATIONS: Organization[] = [
  { icon: GiPlasticDuck, name: 'CS50' },
  { icon: FaCode, name: 'SENA' },
  { icon: FaUniversity, name: 'University of Helsinki' },
  { icon: FaLaptopCode, name: 'edX' },
  { icon: FaGraduationCap, name: 'HarvardX' },
];

/**
 * Loading spinner
 */
const LoadingSpinner: FC = () => (
  <div className="fixed inset-0 bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center z-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
    <div className="relative w-32 h-32">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-32 h-32 border-8 border-purple-200 dark:border-gray-700 rounded-full" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-32 h-32 border-8 border-transparent border-t-purple-600 rounded-full animate-spin" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 text-transparent bg-clip-text animate-pulse">
          UX
        </div>
      </div>
    </div>
  </div>
);

const StarRating: FC = () => (
  <div className="flex items-center gap-3 pt-4">
    <div className="flex" role="img" aria-label={`${RATING_VALUE} out of 5 stars`}>
      {Array.from({ length: STAR_COUNT }, (_, index) => (
        <svg
          key={index}
          className="w-5 h-5 lg:w-6 lg:h-6 text-yellow-400 fill-current"
          viewBox="0 0 24 24"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
    <span className="font-semibold text-base lg:text-lg text-gray-900 dark:text-gray-100">{RATING_VALUE}</span>
    <span className="text-sm lg:text-base text-gray-500 dark:text-gray-400">({REVIEW_COUNT})</span>
  </div>
);

interface OrganizationLogoProps {
  organization: Organization;
  index: number;
  isVisible: boolean;
}

const OrganizationLogo: FC<OrganizationLogoProps> = ({ organization, index, isVisible }) => {
  const Icon = organization.icon;
  return (
    <div
      className="flex items-center gap-2 lg:gap-3 text-white transition-all duration-500"
      style={{
        transitionDelay: `${400 + index * 100}ms`,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
      }}
      aria-label={organization.name}
    >
      <Icon className="text-3xl lg:text-5xl" />
      <span className="text-lg lg:text-2xl font-semibold">{organization.name}</span>
    </div>
  );
};

interface HeroContentProps {
  isVisible: boolean;
}

const HeroContent: FC<HeroContentProps> = ({ isVisible }) => (
  <div
    className={`space-y-6 lg:space-y-8 order-2 lg:order-1 transition-all duration-700 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
    }`}
  >
    <h1 className="text-4xl sm:text-5xl lg:text-7xl xl:text-8xl font-bold leading-tight">
      <span className="bg-gradient-to-r from-purple-400 to-purple-600 text-transparent bg-clip-text">
        UX-NAPOLEZ
      </span>
      <br />
      <span className="text-black dark:text-white">Information</span>
    </h1>

    <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg lg:text-xl leading-relaxed max-w-2xl">
      This project demonstrates my skills in React, Vite, Tailwind CSS, and TypeScript.  
      Thanks to the organizations that contributed to my learning journey.
    </p>

    <Link
      to="/contact"
      className="inline-block bg-gradient-to-r from-purple-500 to-purple-600 text-white px-8 lg:px-10 py-3 lg:py-4 rounded-full font-medium text-sm lg:text-base hover:shadow-xl transition-all duration-300 hover:scale-105 text-center"
    >
      Contact Me
    </Link>

    <StarRating />

    <p className="text-sm lg:text-base text-gray-500 dark:text-gray-400">Trusted software reviewed!</p>
  </div>
);

interface HeroImageProps {
  isVisible: boolean;
}

const HeroImage: FC<HeroImageProps> = ({ isVisible }) => (
  <div
    className={`relative order-1 lg:order-2 transition-all duration-700 delay-200 ${
      isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
    }`}
  >
    <div className="absolute top-0 right-0 w-64 h-64 lg:w-96 lg:h-96 bg-purple-200 dark:bg-purple-900 rounded-full blur-3xl opacity-30" />
    <div className="absolute bottom-0 left-0 w-56 h-56 lg:w-80 lg:h-80 bg-blue-200 dark:bg-blue-900 rounded-full blur-3xl opacity-30" />
    <div className="relative">
      <img
        src="/images/about/robot.png"
        alt="AI Robot"
        className="w-full h-auto relative z-10 drop-shadow-2xl max-w-md lg:max-w-2xl mx-auto"
      />
      <div className="absolute top-4 sm:top-8 -left-2 sm:-left-4 z-20">
        <img
          src="/images/about/aboutlike.png"
          alt="Like icon"
          className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 drop-shadow-lg"
        />
      </div>
      <div className="absolute top-8 sm:top-12 -right-2 sm:right-0 bg-white dark:bg-gray-800 rounded-full p-2 sm:p-3 lg:p-4 shadow-xl z-20">
        <svg
          className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-purple-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      </div>
    </div>
  </div>
);

const OrganizationsBanner: FC<{ isVisible: boolean }> = ({ isVisible }) => (
  <div
    className={`mt-12 lg:mt-20 bg-black dark:bg-gray-900 rounded-2xl lg:rounded-3xl py-6 lg:py-10 px-4 lg:px-8 transition-all duration-700 delay-300 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
    }`}
  >
    <div className="flex flex-wrap justify-center lg:justify-around items-center gap-6 lg:gap-8">
      {ORGANIZATIONS.map((org, index) => (
        <OrganizationLogo key={org.name} organization={org} index={index} isVisible={isVisible} />
      ))}
    </div>
  </div>
);

const About: FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setLoading(false);
      setTimeout(() => setShowContent(true), CONTENT_FADE_DELAY);
    }, LOADING_DURATION);

    return () => clearTimeout(loadingTimer);
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <section
      className={`relative min-h-screen flex items-center overflow-hidden pt-20 lg:pt-0 transition-colors duration-700 ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black'
          : 'bg-gradient-to-br from-purple-50 via-white to-blue-50'
      }`}
    >
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-12 lg:py-20 w-full">
        <button
          onClick={toggleTheme}
          className="absolute top-6 right-6 bg-purple-500 text-white px-4 py-2 rounded-full text-sm hover:bg-purple-600 transition-all"
        >
          Toggle {theme === 'dark' ? 'Light' : 'Dark'} Mode
        </button>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <HeroContent isVisible={showContent} />
          <HeroImage isVisible={showContent} />
        </div>

        <OrganizationsBanner isVisible={showContent} />
      </div>
    </section>
  );
};

export default About;

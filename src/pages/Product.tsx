import { useState, useMemo } from 'react';
import type { FC, ReactElement } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { useMenu } from '../context/MenuContext';
import PepsiSection from '../components/product/PepsiSection';
import CocaColaSection from '../components/product/CocaColaSection';
import RedBullSection from '../components/product/RedBullSection';

/**
 * Section configuration type definition
 */
interface ProductSection {
  readonly id: string;
  readonly component: ReactElement;
}

/**
 * Navigation button props
 */
interface NavigationButtonProps {
  readonly onClick: () => void;
  readonly disabled: boolean;
  readonly direction: 'up' | 'down';
}

/**
 * Reusable navigation button component
 */
const NavigationButton: FC<NavigationButtonProps> = ({
  onClick,
  disabled,
  direction,
}) => {
  const Icon = direction === 'up' ? ChevronUp : ChevronDown;
  const ariaLabel = `${direction === 'up' ? 'Previous' : 'Next'} product section`;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="bg-white opacity-50 md:opacity-100 p-4 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.6)] hover:opacity-70 md:hover:opacity-100 hover:shadow-[0_12px_40px_rgb(0,0,0,0.8)] hover:scale-110 active:scale-95 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
      aria-label={ariaLabel}
    >
      <Icon className="w-7 h-7 text-[#0a0d1f]" />
    </button>
  );
};

/**
 * Product page component with vertical section navigation
 */
const Product: FC = () => {
  const [currentSectionIndex, setCurrentSectionIndex] = useState<number>(0);
  const { isMenuOpen } = useMenu();

  // Memoize sections array to prevent unnecessary re-renders
  const sections: readonly ProductSection[] = useMemo(
    () => [
      { id: 'pepsi', component: <PepsiSection /> },
      { id: 'cocacola', component: <CocaColaSection /> },
      { id: 'redbull', component: <RedBullSection /> },
    ],
    []
  );

  const navigateToSection = (direction: 'next' | 'prev'): void => {
    setCurrentSectionIndex((prevIndex) => {
      if (direction === 'next' && prevIndex < sections.length - 1) {
        return prevIndex + 1;
      }
      if (direction === 'prev' && prevIndex > 0) {
        return prevIndex - 1;
      }
      return prevIndex;
    });
  };

  const isFirstSection = currentSectionIndex === 0;
  const isLastSection = currentSectionIndex === sections.length - 1;

  const navigationContainerClasses = `fixed right-4 bottom-40 md:right-12 md:bottom-32 flex flex-col gap-3 z-50 transition-all duration-300 ${
    isMenuOpen
      ? 'lg:flex opacity-0 invisible lg:opacity-100 lg:visible'
      : 'flex opacity-100 visible'
  }`;

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Navigation Controls */}
      <nav className={navigationContainerClasses} aria-label="Product section navigation">
        <NavigationButton
          onClick={() => navigateToSection('prev')}
          disabled={isFirstSection}
          direction="up"
        />
        <NavigationButton
          onClick={() => navigateToSection('next')}
          disabled={isLastSection}
          direction="down"
        />
      </nav>

      {/* Current Section Display */}
      <main className="h-screen w-full">
        {sections[currentSectionIndex].component}
      </main>
    </div>
  );
};

export default Product;
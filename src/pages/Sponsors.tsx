import { useState, useEffect, useCallback, useMemo } from 'react';
import type { FC } from 'react';
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useMenu } from '../context/MenuContext';

// ============================================================================
// Types & Constants
// ============================================================================

type CarouselType = 'redbull' | 'plasma' | 'energy';

interface CarouselSection {
  readonly id: string;
  readonly type: CarouselType;
}

interface CarouselConfig {
  readonly images: readonly string[];
  readonly altPrefix: string;
}

interface ImagePositionRule {
  readonly pattern: string;
  readonly className: string;
}

interface NavigationButtonProps {
  readonly onClick: () => void;
  readonly icon: LucideIcon;
  readonly label: string;
  readonly disabled?: boolean;
  readonly className?: string;
}

const CAROUSEL_CONFIGS: Record<CarouselType, CarouselConfig> = {
  redbull: {
    images: [
      '/images/red-bull/red-bull-post.jpg',
      '/images/red-bull/red-bull-rb20.jpg',
      '/images/red-bull/red-bull-lata.png',
    ],
    altPrefix: 'Red Bull',
  },
  plasma: {
    images: [
      '/images/plasma-shock/plasma-shock-post-blue.png',
      '/images/plasma-shock/plasma-shock-post-orange.png',
      '/images/plasma-shock/plasma-shock-post-fresamora.png',
      '/images/plasma-shock/plasma-shock-post-lemon.png',
    ],
    altPrefix: 'Plasma Shock',
  },
  energy: {
    images: [
      '/images/energy-drnk/energy-drink-score.png',
      '/images/energy-drnk/energy-drink-original.png',
      '/images/energy-drnk/energy-drink.png',
      '/images/energy-crem.png',
    ],
    altPrefix: 'Energy Drink',
  },
} as const;

const IMAGE_POSITION_RULES: readonly ImagePositionRule[] = [
  { pattern: 'red-bull-post.jpg', className: 'object-right object-cover' },
  { pattern: 'red-bull-lata.png', className: 'object-[60%_center] object-cover' },
  { pattern: 'energy-drink-score.png', className: 'object-[70%_center] object-cover' },
  { pattern: 'energy-drink-original.png', className: 'object-[90%_center] object-cover' },
  { pattern: 'energy-drink.png', className: 'object-left object-cover' },
  { pattern: 'energy-crem.png', className: 'object-left object-cover' },
] as const;

const SECTIONS: readonly CarouselSection[] = [
  { id: 'redbull', type: 'redbull' },
  { id: 'plasma', type: 'plasma' },
  { id: 'energy', type: 'energy' },
] as const;

const AUTO_PLAY_INTERVAL_MS = 5000;
const TRANSITION_DURATION_MS = 1200;

const BASE_BUTTON_CLASSES =
  'bg-white/20 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.6)] hover:bg-white/40 hover:shadow-[0_12px_40px_rgb(0,0,0,0.8)] active:scale-95 transition-all duration-300';

const DISABLED_BUTTON_CLASSES =
  'disabled:opacity-20 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-white/20';

// ============================================================================
// Custom Hooks
// ============================================================================

/**
 * Manages carousel autoplay with pause/resume functionality
 */
function useCarouselAutoplay(
  isActive: boolean,
  imageCount: number,
  isPaused: boolean,
  onNext: () => void
): void {
  useEffect(() => {
    if (!isActive || isPaused || imageCount === 0) return;

    const intervalId = setInterval(onNext, AUTO_PLAY_INTERVAL_MS);
    return () => clearInterval(intervalId);
  }, [isActive, isPaused, imageCount, onNext]);
}

/**
 * Manages image index state for a carousel
 */
function useCarouselIndex(imageCount: number) {
  const [index, setIndex] = useState(0);

  const next = useCallback(() => {
    setIndex((prev) => (prev + 1) % imageCount);
  }, [imageCount]);

  const previous = useCallback(() => {
    setIndex((prev) => (prev - 1 + imageCount) % imageCount);
  }, [imageCount]);

  const reset = useCallback(() => {
    setIndex(0);
  }, []);

  return { index, next, previous, reset };
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Determines the CSS class for image positioning based on file path
 */
function getImagePositionClass(imagePath: string): string {
  const rule = IMAGE_POSITION_RULES.find((r) => imagePath.includes(r.pattern));
  return rule?.className ?? 'object-cover';
}

/**
 * Calculates image transition state based on current and active indices
 */
function getImageTransitionClass(
  currentIndex: number,
  activeIndex: number,
  totalImages: number
): string {
  const isActive = currentIndex === activeIndex;
  const isPrevious =
    currentIndex === (activeIndex - 1 + totalImages) % totalImages;

  if (isActive) {
    return 'opacity-100 scale-100 blur-none translate-x-0 z-10';
  }
  if (isPrevious) {
    return 'opacity-0 scale-105 blur-[40px] -translate-x-full z-0';
  }
  return 'opacity-0 scale-95 blur-[40px] translate-x-full z-0';
}

// ============================================================================
// Components
// ============================================================================

/**
 * Navigation button with consistent styling and accessibility
 */
const NavigationButton: FC<NavigationButtonProps> = ({
  onClick,
  icon: Icon,
  label,
  disabled = false,
  className = '',
}) => {
  const buttonClasses = `${BASE_BUTTON_CLASSES} ${
    disabled ? DISABLED_BUTTON_CLASSES : ''
  } ${className}`;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={buttonClasses}
      aria-label={label}
      type="button"
    >
      <Icon className="w-8 h-8 text-white md:w-8 md:h-8" />
    </button>
  );
};

/**
 * Mobile navigation control panel
 */
const MobileControls: FC<{
  onPrevImage: () => void;
  onNextImage: () => void;
  onPrevSection: () => void;
  onNextSection: () => void;
  onToggleAutoPlay: () => void;
  isAutoPlayPaused: boolean;
  isFirstSection: boolean;
  isLastSection: boolean;
  isMenuOpen: boolean;
}> = ({
  onPrevImage,
  onNextImage,
  onPrevSection,
  onNextSection,
  onToggleAutoPlay,
  isAutoPlayPaused,
  isFirstSection,
  isLastSection,
  isMenuOpen,
}) => {
  const visibilityClasses = isMenuOpen
    ? 'opacity-0 invisible'
    : 'opacity-100 visible';

  return (
    <div
      className={`md:hidden fixed left-4 right-4 bottom-8 flex items-center justify-between gap-3 z-50 transition-all duration-300 ${visibilityClasses}`}
    >
      <div className="flex gap-3">
        <NavigationButton
          onClick={onPrevImage}
          icon={ChevronLeft}
          label="Previous image"
          className="p-4 hover:scale-110"
        />
        <NavigationButton
          onClick={onNextImage}
          icon={ChevronRight}
          label="Next image"
          className="p-4 hover:scale-110"
        />
      </div>

      <div className="flex gap-3">
        <NavigationButton
          onClick={onToggleAutoPlay}
          icon={isAutoPlayPaused ? Play : Pause}
          label={isAutoPlayPaused ? 'Resume autoplay' : 'Pause autoplay'}
          className="p-4 hover:scale-110"
        />
        <NavigationButton
          onClick={onPrevSection}
          icon={ChevronUp}
          label="Previous section"
          disabled={isFirstSection}
          className="p-4 hover:scale-110"
        />
        <NavigationButton
          onClick={onNextSection}
          icon={ChevronDown}
          label="Next section"
          disabled={isLastSection}
          className="p-4 hover:scale-110"
        />
      </div>
    </div>
  );
};

/**
 * Desktop navigation control panel with circular layout
 */
const DesktopControls: FC<{
  onPrevImage: () => void;
  onNextImage: () => void;
  onPrevSection: () => void;
  onNextSection: () => void;
  onToggleAutoPlay: () => void;
  isAutoPlayPaused: boolean;
  isFirstSection: boolean;
  isLastSection: boolean;
  isMenuOpen: boolean;
}> = ({
  onPrevImage,
  onNextImage,
  onPrevSection,
  onNextSection,
  onToggleAutoPlay,
  isAutoPlayPaused,
  isFirstSection,
  isLastSection,
  isMenuOpen,
}) => {
  const navigationVisibilityClasses = isMenuOpen
    ? 'lg:block opacity-0 invisible lg:opacity-100 lg:visible'
    : 'block opacity-100 visible';

  const autoPlayVisibilityClasses = isMenuOpen
    ? 'opacity-0 invisible'
    : 'opacity-100 visible';

  return (
    <>
      {/* Circular navigation layout */}
      <div
        className={`hidden md:block fixed right-12 bottom-32 z-50 transition-all duration-300 ${navigationVisibilityClasses}`}
      >
        <div className="relative w-52 h-52">
          <NavigationButton
            onClick={onPrevSection}
            icon={ChevronUp}
            label="Previous section"
            disabled={isFirstSection}
            className="absolute top-0 left-1/2 -translate-x-1/2 p-5"
          />
          <NavigationButton
            onClick={onNextSection}
            icon={ChevronDown}
            label="Next section"
            disabled={isLastSection}
            className="absolute bottom-0 left-1/2 -translate-x-1/2 p-5"
          />
          <NavigationButton
            onClick={onPrevImage}
            icon={ChevronLeft}
            label="Previous image"
            className="absolute top-1/2 left-0 -translate-y-1/2 p-5"
          />
          <NavigationButton
            onClick={onNextImage}
            icon={ChevronRight}
            label="Next image"
            className="absolute top-1/2 right-0 -translate-y-1/2 p-5"
          />
        </div>
      </div>

      {/* Autoplay toggle */}
      <div
        className={`hidden md:block fixed right-12 bottom-16 z-50 transition-all duration-300 ${autoPlayVisibilityClasses}`}
      >
        <NavigationButton
          onClick={onToggleAutoPlay}
          icon={isAutoPlayPaused ? Play : Pause}
          label={isAutoPlayPaused ? 'Resume autoplay' : 'Pause autoplay'}
          className="p-5"
        />
      </div>
    </>
  );
};

/**
 * Image carousel with smooth transitions
 */
const Carousel: FC<{
  images: readonly string[];
  activeIndex: number;
  altPrefix: string;
}> = ({ images, activeIndex, altPrefix }) => {
  return (
    <div className="relative w-full h-full overflow-hidden">
      {images.map((imagePath, index) => {
        const positionClass = getImagePositionClass(imagePath);
        const transitionClass = getImageTransitionClass(
          index,
          activeIndex,
          images.length
        );

        return (
          <img
            key={imagePath}
            src={imagePath}
            alt={`${altPrefix} ${index + 1}`}
            className={`absolute inset-0 w-full h-full transition-all duration-[${TRANSITION_DURATION_MS}ms] ease-in-out ${positionClass} ${transitionClass}`}
          />
        );
      })}
    </div>
  );
};

// ============================================================================
// Main Component
// ============================================================================

const Sponsors: FC = () => {
  const { isMenuOpen } = useMenu();
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [isAutoPlayPaused, setIsAutoPlayPaused] = useState(false);

  const currentSection = SECTIONS[currentSectionIndex];
  const currentConfig = CAROUSEL_CONFIGS[currentSection.type];

  // Carousel state management for each section
  const redbullCarousel = useCarouselIndex(CAROUSEL_CONFIGS.redbull.images.length);
  const plasmaCarousel = useCarouselIndex(CAROUSEL_CONFIGS.plasma.images.length);
  const energyCarousel = useCarouselIndex(CAROUSEL_CONFIGS.energy.images.length);

  // Map carousel controls based on current section
  const carouselControls = useMemo(() => {
    const controlsMap = {
      redbull: redbullCarousel,
      plasma: plasmaCarousel,
      energy: energyCarousel,
    };
    return controlsMap[currentSection.type];
  }, [currentSection.type, redbullCarousel, plasmaCarousel, energyCarousel]);

  // Reset carousel index when section changes
  useEffect(() => {
    redbullCarousel.reset();
    plasmaCarousel.reset();
    energyCarousel.reset();
  }, [currentSectionIndex]); // Intentionally depend only on index

  // Autoplay for current carousel
  useCarouselAutoplay(
    true,
    currentConfig.images.length,
    isAutoPlayPaused,
    carouselControls.next
  );

  // Section navigation
  const navigateToNextSection = useCallback(() => {
    setCurrentSectionIndex((prev) =>
      Math.min(prev + 1, SECTIONS.length - 1)
    );
  }, []);

  const navigateToPrevSection = useCallback(() => {
    setCurrentSectionIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const toggleAutoPlay = useCallback(() => {
    setIsAutoPlayPaused((prev) => !prev);
  }, []);

  const isFirstSection = currentSectionIndex === 0;
  const isLastSection = currentSectionIndex === SECTIONS.length - 1;

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Mobile Controls */}
      <MobileControls
        onPrevImage={carouselControls.previous}
        onNextImage={carouselControls.next}
        onPrevSection={navigateToPrevSection}
        onNextSection={navigateToNextSection}
        onToggleAutoPlay={toggleAutoPlay}
        isAutoPlayPaused={isAutoPlayPaused}
        isFirstSection={isFirstSection}
        isLastSection={isLastSection}
        isMenuOpen={isMenuOpen}
      />

      {/* Desktop Controls */}
      <DesktopControls
        onPrevImage={carouselControls.previous}
        onNextImage={carouselControls.next}
        onPrevSection={navigateToPrevSection}
        onNextSection={navigateToNextSection}
        onToggleAutoPlay={toggleAutoPlay}
        isAutoPlayPaused={isAutoPlayPaused}
        isFirstSection={isFirstSection}
        isLastSection={isLastSection}
        isMenuOpen={isMenuOpen}
      />

      {/* Carousel Content */}
      <div className="h-screen w-full bg-black">
        <div
          key={currentSectionIndex}
          className="relative w-full h-full overflow-hidden animate-fadeIn"
        >
          <Carousel
            images={currentConfig.images}
            activeIndex={carouselControls.index}
            altPrefix={currentConfig.altPrefix}
          />
        </div>
      </div>

      {/* Styles */}
      <style>{`
        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateX(-50%) scale(1.05);
            filter: blur(30px);
          }
          50% {
            opacity: 0.5;
            filter: blur(15px);
          }
          100% {
            opacity: 1;
            transform: translateX(0) scale(1);
            filter: blur(0px);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 1s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .blur-none {
          filter: blur(0px);
        }

        img {
          will-change: transform, opacity, filter;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }

        @media (max-width: 768px) {
          button {
            -webkit-tap-highlight-color: transparent;
            touch-action: manipulation;
          }
        }
      `}</style>
    </div>
  );
};

export default Sponsors;
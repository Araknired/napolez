import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { useMenu } from '../contexts/MenuContext';

/**
 * Sponsors Component - Responsive Simple
 * 
 * Versión responsive tradicional:
 * - Mobile: Stack vertical, padding reducido, botones adaptados
 * - Desktop: Diseño original completo
 * - Navigation buttons hide when mobile menu is open
 */
const Sponsors = () => {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [redbullImageIndex, setRedbullImageIndex] = useState(0);
  const [plasmaImageIndex, setPlasmaImageIndex] = useState(0);
  const [energyImageIndex, setEnergyImageIndex] = useState(0);
  const [isAutoPlayPaused, setIsAutoPlayPaused] = useState(false);
  
  /**
   * Get menu state from context
   * Used to hide navigation buttons when mobile menu is open
   */
  const { isMenuOpen } = useMenu();

  // ============================================================================
  // DATA CONFIGURATION
  // ============================================================================
  
  const redbullImages = [
    'src/assets/images/red-bull/red-bull-post.jpg',
    'src/assets/images/red-bull/red-bull-rb20.jpg',
    'src/assets/images/red-bull/red-bull-lata.png'
  ];

  const plasmaImages = [
    'src/assets/images/plasma-shock/plasma-shock-post-blue.png',
    'src/assets/images/plasma-shock/plasma-shock-post-orange.png',
    'src/assets/images/plasma-shock/plasma-shock-post-fresamora.png',
    'src/assets/images/plasma-shock/plasma-shock-post-lemon.png'
  ];

  const energyImages = [
    'src/assets/images/energy-drnk/energy-drink-score.png',
    'src/assets/images/energy-drnk/energy-drink-original.png',
    'src/assets/images/energy-drnk/energy-drink.png',
    'src/assets/images/energy-drnk/energy-crem.png'
  ];

  const sections = [
    { 
      id: 'redbull', 
      isCarousel: true, 
      carouselType: 'redbull' as const
    },
    { 
      id: 'plasma', 
      isCarousel: true, 
      carouselType: 'plasma' as const
    },
    { 
      id: 'energy', 
      isCarousel: true, 
      carouselType: 'energy' as const
    },
  ];

  // ============================================================================
  // CAROUSEL AUTO-ROTATION EFFECTS
  // ============================================================================
  
  useEffect(() => {
    if (currentSectionIndex === 0 && !isAutoPlayPaused) {
      const interval = setInterval(() => {
        setRedbullImageIndex((prevIndex) => (prevIndex + 1) % redbullImages.length);
      }, 5000);
      return () => clearInterval(interval);
    } else {
      setRedbullImageIndex(0);
    }
  }, [currentSectionIndex, redbullImages.length, isAutoPlayPaused]);

  useEffect(() => {
    if (currentSectionIndex === 1 && !isAutoPlayPaused) {
      const interval = setInterval(() => {
        setPlasmaImageIndex((prevIndex) => (prevIndex + 1) % plasmaImages.length);
      }, 5000);
      return () => clearInterval(interval);
    } else {
      setPlasmaImageIndex(0);
    }
  }, [currentSectionIndex, plasmaImages.length, isAutoPlayPaused]);

  useEffect(() => {
    if (currentSectionIndex === 2 && !isAutoPlayPaused) {
      const interval = setInterval(() => {
        setEnergyImageIndex((prevIndex) => (prevIndex + 1) % energyImages.length);
      }, 5000);
      return () => clearInterval(interval);
    } else {
      setEnergyImageIndex(0);
    }
  }, [currentSectionIndex, energyImages.length, isAutoPlayPaused]);

  // ============================================================================
  // NAVIGATION HANDLERS
  // ============================================================================
  
  const scrollToNext = () => {
    if (currentSectionIndex < sections.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
    }
  };

  const scrollToPrev = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
    }
  };

  // Navegación horizontal (imágenes del carrusel)
  const goToNextImage = () => {
    if (currentSectionIndex === 0) {
      setRedbullImageIndex((prevIndex) => (prevIndex + 1) % redbullImages.length);
    } else if (currentSectionIndex === 1) {
      setPlasmaImageIndex((prevIndex) => (prevIndex + 1) % plasmaImages.length);
    } else if (currentSectionIndex === 2) {
      setEnergyImageIndex((prevIndex) => (prevIndex + 1) % energyImages.length);
    }
  };

  const goToPrevImage = () => {
    if (currentSectionIndex === 0) {
      setRedbullImageIndex((prevIndex) => (prevIndex - 1 + redbullImages.length) % redbullImages.length);
    } else if (currentSectionIndex === 1) {
      setPlasmaImageIndex((prevIndex) => (prevIndex - 1 + plasmaImages.length) % plasmaImages.length);
    } else if (currentSectionIndex === 2) {
      setEnergyImageIndex((prevIndex) => (prevIndex - 1 + energyImages.length) % energyImages.length);
    }
  };

  const toggleAutoPlay = () => {
    setIsAutoPlayPaused(!isAutoPlayPaused);
  };

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================
  
  const renderCarousel = (
    images: string[], 
    activeIndex: number, 
    altPrefix: string
  ) => {
    return (
      <div className="relative w-full h-full overflow-hidden">
        {images.map((img, idx) => {
          const isActive = idx === activeIndex;
          const isPrev = idx === (activeIndex - 1 + images.length) % images.length;
          
          // Detectar imágenes específicas para posicionamiento
          const isRedBullPost = img.includes('red-bull-post.jpg');
          const isRedBullLata = img.includes('red-bull-lata.png');
          const isEnergyScore = img.includes('energy-drink-score.png');
          const isEnergyOriginal = img.includes('energy-drink-original.png');
          const isEnergyDrink = img.includes('energy-drink.png') && !img.includes('energy-drink-score.png') && !img.includes('energy-drink-original.png');
          const isEnergyCrem = img.includes('energy-crem.png');
          
          // Determinar la clase de posicionamiento
          let positionClass = 'object-cover';
          if (isRedBullPost) {
            positionClass = 'object-right object-cover';
          } else if (isRedBullLata) {
            positionClass = 'object-[60%_center] object-cover';
          } else if (isEnergyScore) {
            positionClass = 'object-[70%_center] object-cover';
          } else if (isEnergyOriginal) {
            positionClass = 'object-[90%_center] object-cover';
          } else if (isEnergyDrink) {
            positionClass = 'object-left object-cover';
          } else if (isEnergyCrem) {
            positionClass = 'object-left object-cover';
          }
          
          return (
            <img 
              key={idx}
              src={img}
              alt={`${altPrefix} ${idx + 1}`}
              className={`absolute inset-0 w-full h-full transition-all duration-[1200ms] ease-in-out ${positionClass} ${
                isActive 
                  ? 'opacity-100 scale-100 blur-none translate-x-0 z-10' 
                  : isPrev
                  ? 'opacity-0 scale-105 blur-[40px] -translate-x-full z-0'
                  : 'opacity-0 scale-95 blur-[40px] translate-x-full z-0'
              }`}
            />
          );
        })}
      </div>
    );
  };

  // ============================================================================
  // MAIN RENDER
  // ============================================================================
  
  return (
    <div className="relative h-screen overflow-hidden">
      {/* Play/Pause Button - Desktop only: Bottom Right, below Down button */}
      <div className={`hidden md:block fixed right-12 bottom-16 z-50 transition-all duration-300 ${
        isMenuOpen ? 'opacity-0 invisible' : 'opacity-100 visible'
      }`}>
        <button
          onClick={toggleAutoPlay}
          className="bg-white/20 p-5 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.6)] hover:bg-white/40 hover:shadow-[0_12px_40px_rgb(0,0,0,0.8)] active:scale-95 transition-all duration-300"
          aria-label={isAutoPlayPaused ? "Resume autoplay" : "Pause autoplay"}
        >
          {isAutoPlayPaused ? (
            <Play className="w-8 h-8 text-white" />
          ) : (
            <Pause className="w-8 h-8 text-white" />
          )}
        </button>
      </div>

      {/* Navigation Controls */}
      {/* Mobile: Horizontal line at bottom with Play/Pause on left */}
      {/* Desktop: Xbox D-pad style (cross formation) */}
      
      {/* MOBILE VERSION - Horizontal line with Play/Pause */}
      <div className={`md:hidden fixed left-4 right-4 bottom-8 flex items-center justify-between gap-3 z-50 transition-all duration-300 ${
        isMenuOpen ? 'opacity-0 invisible' : 'opacity-100 visible'
      }`}>
        {/* Left side: Horizontal Navigation (Left/Right) */}
        <div className="flex gap-3">
          <button
            onClick={goToPrevImage}
            className="bg-white/20 p-4 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.6)] hover:bg-white/40 hover:shadow-[0_12px_40px_rgb(0,0,0,0.8)] hover:scale-110 active:scale-95 transition-all duration-300"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          
          <button
            onClick={goToNextImage}
            className="bg-white/20 p-4 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.6)] hover:bg-white/40 hover:shadow-[0_12px_40px_rgb(0,0,0,0.8)] hover:scale-110 active:scale-95 transition-all duration-300"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Right side: Play/Pause + Vertical Navigation (Up/Down) */}
        <div className="flex gap-3">
          {/* Play/Pause Button for Mobile */}
          <button
            onClick={toggleAutoPlay}
            className="bg-white/20 p-4 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.6)] hover:bg-white/40 hover:shadow-[0_12px_40px_rgb(0,0,0,0.8)] hover:scale-110 active:scale-95 transition-all duration-300"
            aria-label={isAutoPlayPaused ? "Resume autoplay" : "Pause autoplay"}
          >
            {isAutoPlayPaused ? (
              <Play className="w-6 h-6 text-white" />
            ) : (
              <Pause className="w-6 h-6 text-white" />
            )}
          </button>
          
          <button
            onClick={scrollToPrev}
            disabled={currentSectionIndex === 0}
            className="bg-white/20 p-4 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.6)] hover:bg-white/40 hover:shadow-[0_12px_40px_rgb(0,0,0,0.8)] hover:scale-110 active:scale-95 transition-all duration-300 disabled:opacity-20 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-white/20"
            aria-label="Previous section"
          >
            <ChevronUp className="w-6 h-6 text-white" />
          </button>
          
          <button
            onClick={scrollToNext}
            disabled={currentSectionIndex === sections.length - 1}
            className="bg-white/20 p-4 rounded-xl shadow-[0_8px_40px_rgb(0,0,0,0.8)] hover:bg-white/40 hover:shadow-[0_12px_40px_rgb(0,0,0,0.8)] hover:scale-110 active:scale-95 transition-all duration-300 disabled:opacity-20 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-white/20"
            aria-label="Next section"
          >
            <ChevronDown className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      {/* DESKTOP VERSION - Xbox D-pad style (cross formation) */}
      <div className={`hidden md:block fixed right-12 bottom-32 z-50 transition-all duration-300 ${
        isMenuOpen ? 'lg:block opacity-0 invisible lg:opacity-100 lg:visible' : 'block opacity-100 visible'
      }`}>
        <div className="relative w-52 h-52">
          {/* Center point reference */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2"></div>
          
          {/* UP Button - Top center */}
          <button
            onClick={scrollToPrev}
            disabled={currentSectionIndex === 0}
            className="absolute top-0 left-1/2 -translate-x-1/2 bg-white/20 p-5 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.6)] hover:bg-white/40 hover:shadow-[0_12px_40px_rgb(0,0,0,0.8)] active:scale-95 transition-all duration-300 disabled:opacity-20 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-white/20"
            aria-label="Previous section"
          >
            <ChevronUp className="w-8 h-8 text-white" />
          </button>
          
          {/* DOWN Button - Bottom center */}
          <button
            onClick={scrollToNext}
            disabled={currentSectionIndex === sections.length - 1}
            className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-white/20 p-5 rounded-xl shadow-[0_8px_40px_rgb(0,0,0,0.8)] hover:bg-white/40 hover:shadow-[0_12px_40px_rgb(0,0,0,0.8)] active:scale-95 transition-all duration-300 disabled:opacity-20 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-white/20"
            aria-label="Next section"
          >
            <ChevronDown className="w-8 h-8 text-white" />
          </button>
          
          {/* LEFT Button - Middle left */}
          <button
            onClick={goToPrevImage}
            className="absolute top-1/2 left-0 -translate-y-1/2 bg-white/20 p-5 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.6)] hover:bg-white/40 hover:shadow-[0_12px_40px_rgb(0,0,0,0.8)] active:scale-95 transition-all duration-300"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-8 h-8 text-white" />
          </button>
          
          {/* RIGHT Button - Middle right */}
          <button
            onClick={goToNextImage}
            className="absolute top-1/2 right-0 -translate-y-1/2 bg-white/20 p-5 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.6)] hover:bg-white/40 hover:shadow-[0_12px_40px_rgb(0,0,0,0.8)] active:scale-95 transition-all duration-300"
            aria-label="Next image"
          >
            <ChevronRight className="w-8 h-8 text-white" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="h-screen w-full bg-black">
        <div 
          key={currentSectionIndex} 
          className="relative w-full h-full overflow-hidden animate-fadeIn"
        >
          {sections[currentSectionIndex].carouselType === 'redbull' && (
            renderCarousel(redbullImages, redbullImageIndex, 'Red Bull')
          )}
          {sections[currentSectionIndex].carouselType === 'plasma' && (
            renderCarousel(plasmaImages, plasmaImageIndex, 'Plasma Shock')
          )}
          {sections[currentSectionIndex].carouselType === 'energy' && (
            renderCarousel(energyImages, energyImageIndex, 'Energy Drink')
          )}
        </div>
      </div>

      {/* Custom CSS Animations */}
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

        /* Responsive adjustments */
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
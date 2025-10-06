import { ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * CocaColaSection Component
 * 
 * A full-screen promotional section for Coca-Cola featuring:
 * - "Happy New Year" themed design with Santa Claus
 * - Animated elements with staggered entrance effects
 * - Interactive call-to-action button
 * - Large watermark logo background
 * - Floating decorative bubbles
 * - Continuous snowfall animation
 */
const CocaColaSection = () => {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  
  /**
   * Array of snowflake objects with random properties
   */
  const [snowflakes, setSnowflakes] = useState<Array<{
    id: number;
    left: number;
    animationDuration: number;
    opacity: number;
    size: number;
  }>>([]);

  // ============================================================================
  // EFFECTS
  // ============================================================================
  
  /**
   * Generate snowflakes on component mount
   */
  useEffect(() => {
    const flakes = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      animationDuration: 10 + Math.random() * 20,
      opacity: 0.3 + Math.random() * 0.7,
      size: 2 + Math.random() * 4
    }));
    setSnowflakes(flakes);
  }, []);

  // ============================================================================
  // CONSTANTS
  // ============================================================================
  
  /**
   * External link to Coca-Cola official website
   */
  const COCA_COLA_WEBSITE = "https://www.coca-cola.com";

  /**
   * Subtitle text for the promotional banner
   */
  const SUBTITLE_TEXT = "New Concept Masuta Alex";

  /**
   * Call-to-action button text
   */
  const CTA_BUTTON_TEXT = "Buy Coca-Cola";

  // ============================================================================
  // IMAGE PATHS
  // ============================================================================
  
  /**
   * Asset paths for all images used in the component
   */
  const ASSETS = {
    watermark: "/src/assets/images/coca-cola/cocacola-watermark.png",
    logo: "/src/assets/images/coca-cola/cocacola-logo.png",
    smallCan: "/src/assets/images/coca-cola/cocacola-can-small.png",
    santaClaus: "/src/assets/images/coca-cola/santa-claus.png"
  };

  // ============================================================================
  // ANIMATION DELAYS (in seconds)
  // ============================================================================
  
  /**
   * Staggered animation delays for sequential element appearances
   */
  const ANIMATION_DELAYS = {
    logo: '0.8s',
    title: '1.1s',
    subtitle: '1.4s',
    button: '1.7s',
    santa: '2s',
    bubble1: '2.3s',
    bubble2: '2.5s',
    bubble3: '2.7s'
  };

  // ============================================================================
  // MAIN RENDER
  // ============================================================================
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 relative overflow-hidden pt-24">
      
      {/* Snowfall Animation Container */}
      <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
        {snowflakes.map((flake) => (
          <div
            key={flake.id}
            className="absolute bg-white rounded-full"
            style={{
              left: `${flake.left}%`,
              width: `${flake.size}px`,
              height: `${flake.size}px`,
              opacity: flake.opacity,
              animation: `snowfall ${flake.animationDuration}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      {/* Background Watermark Logo - Low Opacity */}
      <div className="absolute inset-0 flex items-center justify-end opacity-[0.15] pointer-events-none z-0 animate-fadeInSlow translate-x-24 md:translate-x-0 md:justify-center">
        <img
          src={ASSETS.watermark}
          alt="Coca-Cola Background"
          className="w-full h-full object-contain scale-[3.5] md:scale-[1.5]"
        />
      </div>

      {/* Header Brand Logo - Top Left Corner */}
      <div 
        className="absolute top-24 md:top-32 left-8 md:left-12 lg:left-16 z-20" 
        style={{ 
          animation: "slideInLeftScale 1.2s ease-out forwards", 
          animationDelay: ANIMATION_DELAYS.logo, 
          opacity: 0 
        }}
      >
        <a 
          href={COCA_COLA_WEBSITE} 
          target="_blank" 
          rel="noopener noreferrer"
          aria-label="Visit Coca-Cola official website"
        >
          <img
            src={ASSETS.logo}
            alt="Coca-Cola"
            className="h-4 md:h-6 object-contain cursor-pointer"
          />
        </a>
      </div>
     
      {/* Main Text Content - Left Side */}
      <div className="absolute top-40 lg:top-52 left-12 md:left-16 lg:left-20 w-full lg:w-[42%] z-15">
        <div className="space-y-4 md:space-y-6 pr-8">
          
          {/* Main Title - Large Typography */}
          <h1 
            className="font-black text-7xl sm:text-7xl md:text-8xl lg:text-[110px] xl:text-[130px] leading-[0.82] tracking-tighter" 
            style={{ 
              color: '#9b9b9b', 
              animation: "slideInLeftScale 1.2s ease-out forwards", 
              animationDelay: ANIMATION_DELAYS.title, 
              opacity: 0 
            }}
          >
            HAPPY<br />
            NEW<br />
            YEAR
          </h1>

          {/* Subtitle Section */}
          <div 
            className="flex items-center gap-4 md:gap-6" 
            style={{ 
              animation: "slideInLeftScale 1.2s ease-out forwards", 
              animationDelay: ANIMATION_DELAYS.subtitle, 
              opacity: 0 
            }}
          >
            <div className="flex-1">
              <p 
                className="text-sm md:text-base lg:text-lg font-semibold tracking-wide uppercase" 
                style={{ color: '#9b9b9b' }}
              >
                {SUBTITLE_TEXT}
              </p>
            </div>
          </div>

          {/* Call-to-Action Button with Small Can Decoration */}
          <div 
            className="flex items-center gap-6" 
            style={{ 
              animation: "slideInLeftScale 1.2s ease-out forwards", 
              animationDelay: ANIMATION_DELAYS.button, 
              opacity: 0 
            }}
          >
            {/* Primary CTA Button */}
            <button 
              className="group bg-[#E51D2A] hover:bg-[#c4161f] text-white px-8 md:px-10 lg:px-12 py-3 md:py-4 rounded-lg font-bold text-sm md:text-base lg:text-lg transition-all duration-300 shadow-2xl uppercase tracking-wider flex items-center gap-2 hover:shadow-[0_0_40px_rgba(229,29,42,0.7)] hover:scale-105 active:scale-95 relative overflow-hidden"
              aria-label="Purchase Coca-Cola products"
            >
              {/* Button hover overlay effect */}
              <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
              <ShoppingCart className="w-4 h-4 lg:w-5 lg:h-5" />
              <span>{CTA_BUTTON_TEXT}</span>
            </button>
            
            {/* Decorative Small Can Image with Animation */}
            <div className="flex-shrink-0 relative -ml-16 animate-canFloat">
              <img
                src={ASSETS.smallCan}
                alt="Coca-Cola Can"
                className="w-20 h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 object-contain drop-shadow-xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Santa Claus Hero Image - Bottom Right Corner */}
      <div 
        className="absolute bottom-0 right-0 z-10" 
        style={{ 
          animation: "slideInRightFade 1.2s ease-out forwards", 
          animationDelay: ANIMATION_DELAYS.santa, 
          opacity: 0 
        }}
      >
        <img
          src={ASSETS.santaClaus}
          alt="Santa Claus with Coca-Cola"
          className="max-h-[950px] w-auto object-contain drop-shadow-2xl scale-[1.18] md:scale-100 md:max-h-[675px] lg:max-h-[765px] xl:max-h-[855px]"
          style={{
            transformOrigin: "bottom right",
            filter: "drop-shadow(0 30px 60px rgba(0, 0, 0, 0.6)) drop-shadow(0 10px 30px rgba(0, 0, 0, 0.4))"
          }}
        />
      </div>

      {/* Glowing Background Behind Santa */}
      <div className="absolute bottom-0 right-0 w-1/2 h-3/4 bg-gradient-to-r from-red-100/30 via-transparent to-transparent blur-3xl z-5 pointer-events-none"></div>

      {/* Decorative Floating Bubbles */}
      <div
        className="absolute top-36 right-24 w-3 h-3 bg-red-200 rounded-full opacity-30 z-5"
        style={{ 
          animation: "float 5s ease-in-out infinite, slideInRightFade 1.2s ease-out forwards", 
          animationDelay: ANIMATION_DELAYS.bubble1, 
          opacity: 0 
        }}
      ></div>
      <div
        className="absolute bottom-48 left-32 w-4 h-4 bg-red-300 rounded-full opacity-25 z-5"
        style={{ 
          animation: "float 6s ease-in-out infinite, slideInRightFade 1.2s ease-out forwards", 
          animationDelay: ANIMATION_DELAYS.bubble2, 
          opacity: 0 
        }}
      ></div>
      <div
        className="absolute top-1/2 right-1/3 w-2 h-2 bg-red-400 rounded-full opacity-35 z-5"
        style={{ 
          animation: "float 7s ease-in-out infinite, slideInRightFade 1.2s ease-out forwards", 
          animationDelay: ANIMATION_DELAYS.bubble3, 
          opacity: 0 
        }}
      ></div>

      {/* Custom CSS Animations */}
      <style>{`
        /**
         * Snowfall animation
         * Creates continuous falling snow effect
         */
        @keyframes snowfall {
          0% {
            transform: translateY(-10vh) translateX(0);
          }
          100% {
            transform: translateY(110vh) translateX(100px);
          }
        }

        /**
         * Float animation for decorative elements
         * Creates a gentle up-and-down floating motion
         */
        @keyframes floatStraight {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        /**
         * Slow fade-in animation
         * Used for the background watermark
         */
        @keyframes fadeInSlow {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 0.15;
          }
        }

        /**
         * Fade in with downward bounce animation
         * Creates a bouncy entrance from above
         */
        @keyframes fadeInDownBounce {
          0% {
            opacity: 0;
            transform: translateY(-60px) scale(0.8);
          }
          60% {
            transform: translateY(10px) scale(1.05);
          }
          80% {
            transform: translateY(-5px) scale(0.98);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        /**
         * Slide in from left with scale animation
         * Used for main text content entrances
         */
        @keyframes slideInLeftScale {
          0% {
            opacity: 0;
            transform: translateX(-100px) scale(0.85);
          }
          70% {
            transform: translateX(10px) scale(1.02);
          }
          100% {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }

        /**
         * Slide in from right with fade animation
         * Used for right-aligned content entrances
         */
        @keyframes slideInRightFade {
          0% {
            opacity: 0;
            transform: translateX(150px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        /**
         * Pop-in animation with scale effect
         * Creates a dramatic scaling entrance
         */
        @keyframes popIn {
          0% {
            opacity: 0;
            transform: scale(0);
          }
          50% {
            transform: scale(1.3);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        /**
         * Can float animation
         * Creates a subtle floating and rotating effect for the small can
         */
        @keyframes canFloat {
          0%, 100% {
            transform: translateY(0px) rotate(-3deg);
          }
          25% {
            transform: translateY(-8px) rotate(0deg);
          }
          50% {
            transform: translateY(-12px) rotate(3deg);
          }
          75% {
            transform: translateY(-8px) rotate(0deg);
          }
        }

        /* Animation utility classes */
        .animate-fadeInSlow {
          animation: fadeInSlow 1.5s ease-out forwards;
          opacity: 0;
        }

        .animate-fadeInDownBounce {
          animation: fadeInDownBounce 1s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          opacity: 0;
        }

        .animate-slideInLeftScale {
          animation: slideInLeftScale 1s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          opacity: 0;
        }

        .animate-slideInRightFade {
          animation: slideInRightFade 1.2s ease-out forwards;
          opacity: 0;
        }

        .animate-popIn {
          animation: popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          opacity: 0;
        }

        .animate-canFloat {
          animation: canFloat 4s ease-in-out infinite;
          animation-delay: 1.7s;
        }
      `}</style>
    </div>
  );
};

export default CocaColaSection;
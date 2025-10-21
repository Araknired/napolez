import { ShoppingCart } from "lucide-react";
import type { CocaColaAssets, AnimationDelays, CocaColaContent } from '../../../types/cocacola.types';
import { BUBBLE_POSITIONS } from '../../../data/cocacola';

interface CocaColaGridProps {
  assets: CocaColaAssets;
  animationDelays: AnimationDelays;
  content: CocaColaContent;
  onBuyClick: () => void;
  loading?: boolean;
}

const CocaColaGrid = ({ assets, animationDelays, content, onBuyClick, loading = false }: CocaColaGridProps) => {
  return (
    <>
      <div className="absolute inset-0 flex items-center justify-end opacity-[0.15] pointer-events-none z-0 animate-fadeInSlow translate-x-24 md:translate-x-0 md:justify-center">
        <img
          src={assets.watermark}
          alt="Coca-Cola Background"
          className="w-full h-full object-contain scale-[3.5] md:scale-[1.5]"
        />
      </div>

      <div 
        className="absolute top-24 md:top-32 left-8 md:left-12 lg:left-16 z-20" 
        style={{ 
          animation: "slideInLeftScale 1.2s ease-out forwards", 
          animationDelay: animationDelays.logo, 
          opacity: 0 
        }}
      >
        <a 
          href={content.websiteUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          aria-label="Visit Coca-Cola official website"
        >
          <img
            src={assets.logo}
            alt="Coca-Cola"
            className="h-4 md:h-6 object-contain cursor-pointer"
          />
        </a>
      </div>
     
      <div className="absolute top-40 lg:top-52 left-12 md:left-16 lg:left-20 w-full lg:w-[42%] z-15">
        <div className="space-y-4 md:space-y-6 pr-8">
          
          <h1 
            className="font-black text-7xl sm:text-7xl md:text-8xl lg:text-[110px] xl:text-[130px] leading-[0.82] tracking-tighter" 
            style={{ 
              color: '#9b9b9b', 
              animation: "slideInLeftScale 1.2s ease-out forwards", 
              animationDelay: animationDelays.title, 
              opacity: 0 
            }}
          >
            {content.mainTitle.map((word, index) => (
              <span key={index}>
                {word}
                {index < content.mainTitle.length - 1 && <br />}
              </span>
            ))}
          </h1>

          <div 
            className="flex items-center gap-4 md:gap-6" 
            style={{ 
              animation: "slideInLeftScale 1.2s ease-out forwards", 
              animationDelay: animationDelays.subtitle, 
              opacity: 0 
            }}
          >
            <div className="flex-1">
              <p 
                className="text-sm md:text-base lg:text-lg font-semibold tracking-wide uppercase" 
                style={{ color: '#9b9b9b' }}
              >
                {content.subtitle}
              </p>
            </div>
          </div>

          <div 
            className="flex items-center gap-6" 
            style={{ 
              animation: "slideInLeftScale 1.2s ease-out forwards", 
              animationDelay: animationDelays.button, 
              opacity: 0 
            }}
          >
            <button 
              onClick={onBuyClick}
              disabled={loading}
              className="group bg-[#E51D2A] hover:bg-[#c4161f] text-white px-8 md:px-10 lg:px-12 py-3 md:py-4 rounded-lg font-bold text-sm md:text-base lg:text-lg transition-all duration-300 shadow-2xl uppercase tracking-wider flex items-center gap-2 hover:shadow-[0_0_40px_rgba(229,29,42,0.7)] hover:scale-105 active:scale-95 relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Purchase Coca-Cola products"
            >
              <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
              <ShoppingCart className="w-4 h-4 lg:w-5 lg:h-5" />
              <span>{loading ? 'Loading...' : content.ctaButtonText}</span>
            </button>
            
            <div className="flex-shrink-0 relative -ml-16 animate-canFloat">
              <img
                src={assets.smallCan}
                alt="Coca-Cola Can"
                className="w-20 h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 object-contain drop-shadow-xl"
              />
            </div>
          </div>
        </div>
      </div>

      <div 
        className="absolute bottom-0 right-0 z-10" 
        style={{ 
          animation: "slideInRightFade 1.2s ease-out forwards", 
          animationDelay: animationDelays.santa, 
          opacity: 0 
        }}
      >
        <img
          src={assets.santaClaus}
          alt="Santa Claus with Coca-Cola"
          className="max-h-[950px] w-auto object-contain drop-shadow-2xl scale-[1.18] md:scale-100 md:max-h-[675px] lg:max-h-[765px] xl:max-h-[855px]"
          style={{
            transformOrigin: "bottom right",
            filter: "drop-shadow(0 30px 60px rgba(0, 0, 0, 0.6)) drop-shadow(0 10px 30px rgba(0, 0, 0, 0.4))"
          }}
        />
      </div>

      <div className="absolute bottom-0 right-0 w-1/2 h-3/4 bg-gradient-to-r from-red-100/30 via-transparent to-transparent blur-3xl z-5 pointer-events-none"></div>

      {BUBBLE_POSITIONS.map((bubble, index) => (
        <div
          key={index}
          className={`absolute ${bubble.size} ${bubble.color} rounded-full ${bubble.opacity} z-5`}
          style={{ 
            top: bubble.top,
            bottom: bubble.bottom,
            left: bubble.left,
            right: bubble.right,
            animation: `float ${bubble.duration} ease-in-out infinite, slideInRightFade 1.2s ease-out forwards`, 
            animationDelay: index === 0 ? animationDelays.bubble1 : index === 1 ? animationDelays.bubble2 : animationDelays.bubble3, 
            opacity: 0 
          }}
        ></div>
      ))}
    </>
  );
};

export default CocaColaGrid;
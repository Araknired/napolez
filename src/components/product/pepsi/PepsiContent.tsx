import { ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Product } from '../../../types/pepsi.types';

interface PepsiContentProps {
  totalReviews: number;
  activeProduct: Product;
  onNext: () => void;
  onPrev: () => void;
}

const PepsiContent = ({ totalReviews, activeProduct, onNext, onPrev }: PepsiContentProps) => {
  return (
    <div className="w-full md:w-[42%] space-y-6 md:space-y-10 md:-mt-8 order-2 md:order-1 pb-8 md:pb-0 -mt-8">
      <div 
        className="flex items-center justify-start md:justify-start gap-2 md:gap-3 text-white/90 text-base md:text-lg animate-slide-left" 
        style={{animationDelay: '0.2s'}}
      >
        <div className="bg-[#FF0000] px-3 md:px-5 py-2 md:py-2.5 rounded-lg flex items-center gap-2">
          <span className="text-xl md:text-2xl">⭐</span>
          <span className="font-bold text-lg md:text-xl">{totalReviews}</span>
        </div>
        <span className="text-base md:text-xl">People tried it</span>
      </div>

      <h1 
        className="font-rammetto text-[80px] sm:text-[120px] md:text-[180px] lg:text-[220px] leading-[0.8] text-white tracking-wide text-left md:text-left md:-ml-2 animate-scale-in" 
        style={{animationDelay: '0.4s'}}
      >
        PEPSI
      </h1>

      <div 
        className="border-l-[4px] md:border-l-[6px] border-[#FF0000] pl-4 md:pl-8 -mt-2 md:-mt-4 animate-slide-left pr-4" 
        style={{animationDelay: '0.6s'}}
      >
        <p className="text-white/90 text-base md:text-xl leading-relaxed max-w-[85%] md:max-w-lg">
          Enjoy the best drink of all time, sponsored by the biggest crack and weed consumers in this country.
        </p>
      </div>

      <div 
        className="flex justify-center md:justify-start gap-4 pt-2 md:pt-4 animate-fade-up" 
        style={{animationDelay: '0.8s'}}
      >
        <button 
          className="bg-[#FF0000]/80 backdrop-blur-md border-2 border-white/30 hover:bg-[#FF0000] hover:shadow-[0_0_30px_rgba(255,0,0,0.8),0_0_60px_rgba(255,0,0,0.5)] hover:border-red-400 hover:scale-105 active:scale-95 text-white px-8 md:px-12 py-3 md:py-4 rounded-full flex items-center gap-2 md:gap-3 font-bold text-lg md:text-xl transition-all duration-300 shadow-xl"
          aria-label="Order Pepsi for delivery"
        >
          <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
          Delivery
        </button>
      </div>

      <div 
        className="md:flex items-center justify-center gap-3 md:gap-6 pt-4 md:pt-6 -mt-8 md:mt-0 animate-fade-up hidden" 
        style={{animationDelay: '1s'}}
      >
        <button 
          onClick={onPrev}
          className="bg-white/10 backdrop-blur-md border-2 border-white/20 hover:bg-white/20 hover:scale-110 active:scale-95 p-3 md:p-5 rounded-full transition-all duration-300 shadow-xl hover:shadow-2xl"
          aria-label="Previous product variant"
        >
          <ChevronLeft className="w-6 h-6 md:w-8 md:h-8 text-white" />
        </button>
        
        <div className="bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-2xl md:rounded-3xl px-6 md:px-12 py-4 md:py-6 flex items-center gap-3 md:gap-6 min-w-[220px] md:min-w-[280px] shadow-2xl transition-all duration-300">
          <img 
            key={`small-${activeProduct.name}`}
            src={activeProduct.image} 
            alt={activeProduct.name}
            className="h-20 md:h-28 object-contain animate-[fadeIn_0.5s_ease-in-out]"
          />
          <div>
            <p className="text-white/60 text-xs md:text-sm uppercase tracking-wider font-semibold">VERSION</p>
            <p className="text-white font-bold text-lg md:text-2xl mt-1">{activeProduct.name}</p>
          </div>
        </div>

        <button 
          onClick={onNext}
          className="bg-white/10 backdrop-blur-md border-2 border-white/20 hover:bg-white/20 hover:scale-110 active:scale-95 p-3 md:p-5 rounded-full transition-all duration-300 shadow-xl hover:shadow-2xl"
          aria-label="Next product variant"
        >
          <ChevronRight className="w-6 h-6 md:w-8 md:h-8 text-white" />
        </button>
      </div>
    </div>
  );
};

export default PepsiContent;
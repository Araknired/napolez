import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Product } from '../../../types/pepsi.types';

interface PepsiHeroProps {
  activeProduct: Product;
  onNext: () => void;
  onPrev: () => void;
}

const PepsiHero = ({ activeProduct, onNext, onPrev }: PepsiHeroProps) => {
  return (
    <div className="w-full md:w-[58%] flex items-center justify-center relative h-[50vh] md:h-full order-1 md:order-2 mt-16 md:mt-0">
      <div 
        className="absolute inset-0 flex items-center justify-center md:justify-end overflow-visible md:-right-40 animate-logo-rotate" 
        style={{animationDelay: '0.3s'}}
      >
        <img 
          src="/src/assets/images/pepsi/pepsi-logo.png"
          alt="PEPSI Background"
          className="w-[600px] md:w-[1500%] h-auto object-contain opacity-80 md:opacity-100"
        />
      </div>
      
      <img 
        key={activeProduct.name}
        src={activeProduct.imageLarge}
        alt={activeProduct.name}
        className="relative h-[350px] md:h-[900px] object-contain z-10 md:-mr-32 animate-slide-right"
        style={{
          animationDelay: '0.7s',
          filter: 'drop-shadow(0 15px 30px rgba(0, 0, 0, 0.8)) drop-shadow(0 8px 15px rgba(0, 0, 0, 0.6))'
        }}
      />

      <div className="md:hidden absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 z-20">
        <button 
          onClick={onPrev}
          className="bg-white/10 backdrop-blur-md border-2 border-white/20 hover:bg-white/20 hover:scale-110 active:scale-95 p-3 rounded-full transition-all duration-300 shadow-xl"
          aria-label="Previous product variant"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        
        <button 
          onClick={onNext}
          className="bg-white/10 backdrop-blur-md border-2 border-white/20 hover:bg-white/20 hover:scale-110 active:scale-95 p-3 rounded-full transition-all duration-300 shadow-xl"
          aria-label="Next product variant"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      </div>
    </div>
  );
};

export default PepsiHero;
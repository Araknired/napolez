import { ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface Product {
  name: string;
  image: string;
  imageLarge: string;
}

const PepsiSection = () => {
  const [currentProduct, setCurrentProduct] = useState<number>(0);

  const products: Product[] = [
    { 
      name: 'PEPSI ZERO', 
      image: '/src/assets/images/pepsi/pepsi-zero-can.png',
      imageLarge: '/src/assets/images/pepsi/pepsi-zero-can-60.png'
    },
    { 
      name: 'PEPSI', 
      image: '/src/assets/images/pepsi/pepsi-can.png',
      imageLarge: '/src/assets/images/pepsi/pepsi-can-60.png'
    },
    { 
      name: 'PEPSI LIGHT', 
      image: '/src/assets/images/pepsi/pepsi-light.png',
      imageLarge: '/src/assets/images/pepsi/pepsi-light-60.png'
    },
    { 
      name: 'PEPSI MAX', 
      image: '/src/assets/images/pepsi/pepsi-max.png',
      imageLarge: '/src/assets/images/pepsi/pepsi-max-45.png'
    },
  ];

  const nextProduct = (): void => {
    setCurrentProduct((prev) => (prev + 1) % products.length);
  };

  const prevProduct = (): void => {
    setCurrentProduct((prev) => (prev - 1 + products.length) % products.length);
  };

  const activeProduct = products[currentProduct];
  const TOTAL_REVIEWS = 9999;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#2a2f4a] relative overflow-hidden">
      <style>{`
        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: scale(0.8) translateY(30px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes slideInLeft {
          0% {
            opacity: 0;
            transform: translateX(-100px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          0% {
            opacity: 0;
            transform: translateX(100px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes scaleIn {
          0% {
            opacity: 0;
            transform: scale(0.5);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(50px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes logoRotate {
          0% {
            opacity: 0;
            transform: rotate(-180deg) scale(0.3);
          }
          100% {
            opacity: 1;
            transform: rotate(0deg) scale(1);
          }
        }

        .animate-slide-left {
          animation: slideInLeft 1s ease-out forwards;
          opacity: 0;
        }

        .animate-slide-right {
          animation: slideInRight 1s ease-out forwards;
          opacity: 0;
        }

        .animate-scale-in {
          animation: scaleIn 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-fade-up {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-logo-rotate {
          animation: logoRotate 1.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
      
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-purple-900/30 to-red-900/40"></div>
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-40 right-40 w-[500px] h-[500px] bg-red-500/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 right-1/4 w-[600px] h-[600px] bg-gradient-radial from-blue-400/20 via-transparent to-transparent blur-2xl"></div>
        <div className="absolute top-0 left-1/4 w-1 h-full bg-gradient-to-b from-transparent via-blue-400/40 to-transparent"></div>
        <div className="absolute top-0 right-1/3 w-1 h-full bg-gradient-to-b from-transparent via-red-400/40 to-transparent"></div>
        <div className="absolute top-1/4 left-1/2 w-2 h-2 bg-white rounded-full animate-ping"></div>
        <div className="absolute top-3/4 left-1/4 w-2 h-2 bg-blue-300 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-red-300 rounded-full animate-ping" style={{animationDelay: '1.5s'}}></div>
      </div>
      
      <div className="relative z-10 px-6 md:px-16 md:pt-16 flex flex-col md:flex-row items-center justify-between min-h-screen -mt-24 md:mt-0">
        
        <div className="w-full md:w-[42%] space-y-6 md:space-y-10 md:-mt-8 order-2 md:order-1 pb-8 md:pb-0">
          
          <div 
            className="flex items-center justify-start md:justify-start gap-2 md:gap-3 text-white/90 text-base md:text-lg animate-slide-left" 
            style={{animationDelay: '0.2s'}}
          >
            <div className="bg-[#FF0000] px-3 md:px-5 py-2 md:py-2.5 rounded-lg flex items-center gap-2">
              <span className="text-xl md:text-2xl">⭐</span>
              <span className="font-bold text-lg md:text-xl">{TOTAL_REVIEWS}</span>
            </div>
            <span className="text-base md:text-xl">People tested it</span>
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
              Enjoy the best beverage of all time, brought to you by the biggest enthusiasts in the country.
            </p>
          </div>

          <div 
            className="flex justify-center md:justify-start gap-4 -mt-4 md:pt-4 animate-fade-up" 
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
              onClick={prevProduct}
              className="bg-white/10 backdrop-blur-md border-2 border-white/20 hover:bg-white/20 hover:scale-110 active:scale-95 p-3 md:p-5 rounded-full transition-all duration-300 shadow-xl hover:shadow-2xl"
              aria-label="Previous product variant"
            >
              <ChevronLeft className="w-6 h-6 md:w-8 md:h-8 text-white" />
            </button>
            
            <div className="bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-2xl md:rounded-3xl px-6 md:px-12 py-4 md:py-6 flex items-center gap-3 md:gap-6 min-w-[220px] md:min-w-[280px] shadow-2xl transition-all duration-300">
              <img 
                key={`small-${currentProduct}`}
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
              onClick={nextProduct}
              className="bg-white/10 backdrop-blur-md border-2 border-white/20 hover:bg-white/20 hover:scale-110 active:scale-95 p-3 md:p-5 rounded-full transition-all duration-300 shadow-xl hover:shadow-2xl"
              aria-label="Next product variant"
            >
              <ChevronRight className="w-6 h-6 md:w-8 md:h-8 text-white" />
            </button>
          </div>
        </div>

        <div className="w-full md:w-[58%] flex items-center justify-center relative h-[50vh] md:h-full order-1 md:order-2 mt-12 md:mt-0">
          
          <div 
            className="absolute inset-0 flex items-center justify-center md:justify-end overflow-visible md:-right-40 animate-logo-rotate mt-12 md:mt-0" 
            style={{animationDelay: '0.3s'}}
          >
            <img 
              src="/src/assets/images/pepsi/pepsi-logo.png"
              alt="PEPSI Background"
              className="w-[600px] md:w-[1500%] h-auto object-contain opacity-80 md:opacity-100"
            />
          </div>
          
          <img 
            key={currentProduct}
            src={activeProduct.imageLarge}
            alt={activeProduct.name}
            className="relative h-[350px] md:h-[900px] object-contain z-10 md:-mr-32 animate-slide-right mt-12 md:mt-0"
            style={{
              animationDelay: '0.7s',
              filter: 'drop-shadow(0 15px 30px rgba(0, 0, 0, 0.8)) drop-shadow(0 8px 15px rgba(0, 0, 0, 0.6))'
            }}
          />

          <div className="md:hidden absolute inset-x-0 top-1/2 flex justify-between px-4 z-20 mt-6">
            <button 
              onClick={prevProduct}
              className="bg-white/10 backdrop-blur-md border-2 border-white/20 hover:bg-white/20 hover:scale-110 active:scale-95 p-3 rounded-full transition-all duration-300 shadow-xl"
              aria-label="Previous product variant"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            
            <button 
              onClick={nextProduct}
              className="bg-white/10 backdrop-blur-md border-2 border-white/20 hover:bg-white/20 hover:scale-110 active:scale-95 p-3 rounded-full transition-all duration-300 shadow-xl"
              aria-label="Next product variant"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PepsiSection;
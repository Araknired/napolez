import { useState } from 'react';
import { products, TOTAL_REVIEWS } from '../../data/pepsi';
import PepsiContent from './pepsi/PepsiContent';
import PepsiHero from './pepsi/PepsiHero';

const PepsiSection = () => {
  const [currentProduct, setCurrentProduct] = useState<number>(0);

  const nextProduct = (): void => {
    setCurrentProduct((prev) => (prev + 1) % products.length);
  };

  const prevProduct = (): void => {
    setCurrentProduct((prev) => (prev - 1 + products.length) % products.length);
  };

  const activeProduct = products[currentProduct];

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
      
      <div className="relative z-10 px-6 md:px-16 md:pt-16 flex flex-col md:flex-row items-center justify-between min-h-screen">
        <PepsiContent 
          totalReviews={TOTAL_REVIEWS}
          activeProduct={activeProduct}
          onNext={nextProduct}
          onPrev={prevProduct}
        />
        
        <PepsiHero 
          activeProduct={activeProduct}
          onNext={nextProduct}
          onPrev={prevProduct}
        />
      </div>
    </div>
  );
};

export default PepsiSection;
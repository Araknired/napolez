import { X, Zap, Star, ChevronRight } from 'lucide-react';
import type { CanData, WaterDrop } from '../../../types/redbull.types';

interface RedBullModalProps {
  can: CanData;
  onClose: () => void;
  isClosing: boolean;
  onBuyClick: () => void;
  loading?: boolean;
}

const generateWaterDrops = (count: number): WaterDrop[] => {
  const drops = [];
  for (let i = 0; i < count; i++) {
    const size = Math.random() * 15 + 3;
    const top = Math.random() * 100;
    const left = Math.random() * 100;
    const opacity = Math.random() * 0.4 + 0.3;
    const blur = Math.random() * 1 + 0.5;
    
    drops.push({
      id: i,
      size,
      top,
      left,
      opacity,
      blur
    });
  }
  return drops;
};

const RedBullModal = ({ can, onClose, isClosing, onBuyClick, loading = false }: RedBullModalProps) => {
  const waterDrops = generateWaterDrops(80);

  const handleBuyNow = () => {
    onClose(); // Cerrar el modal de detalles
    onBuyClick(); // Abrir el flujo de compra
  };

  return (
    <div 
      className={`fixed inset-0 flex items-end md:items-center justify-center z-[60] ${
        isClosing ? 'animate-[fadeOut_0.3s_ease-out_forwards]' : 'animate-[fadeIn_0.3s_ease-out]'
      }`}
      onClick={onClose}
      style={{ 
        backdropFilter: 'blur(20px)',
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        paddingTop: '0'
      }}
    >
      <div 
        className={`bg-white rounded-t-3xl md:rounded-3xl shadow-2xl w-full md:w-[750px] md:h-[650px] flex flex-col md:flex-row overflow-hidden relative transform ${
          isClosing 
            ? 'animate-[scaleOut_0.3s_ease-out_forwards]' 
            : 'animate-[scaleIn_0.3s_ease-out]'
        }`}
        onClick={(e) => e.stopPropagation()}
        style={{
          maxHeight: 'calc(100vh - 64px)',
          height: 'auto'
        }}
      >
        <div className="md:hidden flex justify-center pt-3 pb-2 bg-white rounded-t-3xl">
          <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-all duration-200 z-50 shadow-lg active:scale-95"
        >
          <X size={20} />
        </button>

        <div className={`hidden md:flex md:w-[42%] bg-gradient-to-br ${can.color} relative items-center justify-center p-8 overflow-hidden`}>
          <div 
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at center, ${can.glowColor} 0%, transparent 70%)`,
              filter: 'blur(30px)'
            }}
          />

          <div className="absolute inset-0 pointer-events-none">
            {waterDrops.map((drop) => (
              <div
                key={drop.id}
                className="absolute rounded-full"
                style={{
                  width: `${drop.size}px`,
                  height: `${drop.size}px`,
                  top: `${drop.top}%`,
                  left: `${drop.left}%`,
                  background: `radial-gradient(circle at 30% 30%, 
                    rgba(255, 255, 255, ${drop.opacity * 1.2}) 0%, 
                    rgba(255, 255, 255, ${drop.opacity * 0.6}) 40%, 
                    rgba(255, 255, 255, ${drop.opacity * 0.2}) 70%, 
                    transparent 100%)`,
                  boxShadow: `
                    inset -1px -1px 2px rgba(0, 0, 0, 0.1),
                    inset 1px 1px 2px rgba(255, 255, 255, 0.5),
                    0 2px 4px rgba(0, 0, 0, 0.1)
                  `,
                  backdropFilter: `blur(${drop.blur}px)`,
                  border: '0.5px solid rgba(255, 255, 255, 0.3)',
                  animation: `waterDrop ${3 + Math.random() * 2}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 2}s`
                }}
              />
            ))}
          </div>
          
          <div className="relative flex items-center justify-center z-10">
            <img
              src={can.image}
              alt={can.name}
              className="w-80 h-auto object-contain"
              style={{
                filter: 'drop-shadow(0 20px 40px rgba(0, 0, 0, 0.5))',
                animation: 'zoomIn 0.5s ease-out'
              }}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto md:w-[58%]">
          <div className={`md:hidden bg-gradient-to-br ${can.color} px-6 pt-6 pb-4 relative overflow-hidden`}>
            <div 
              className="absolute inset-0"
              style={{
                background: `radial-gradient(circle at center, ${can.glowColor} 0%, transparent 70%)`,
                filter: 'blur(30px)'
              }}
            />

            <div className="absolute inset-0 pointer-events-none">
              {waterDrops.map((drop) => (
                <div
                  key={drop.id}
                  className="absolute rounded-full"
                  style={{
                    width: `${drop.size}px`,
                    height: `${drop.size}px`,
                    top: `${drop.top}%`,
                    left: `${drop.left}%`,
                    background: `radial-gradient(circle at 30% 30%, 
                      rgba(255, 255, 255, ${drop.opacity * 1.2}) 0%, 
                      rgba(255, 255, 255, ${drop.opacity * 0.6}) 40%, 
                      rgba(255, 255, 255, ${drop.opacity * 0.2}) 70%, 
                      transparent 100%)`,
                    boxShadow: `
                      inset -1px -1px 2px rgba(0, 0, 0, 0.1),
                      inset 1px 1px 2px rgba(255, 255, 255, 0.5),
                      0 2px 4px rgba(0, 0, 0, 0.1)
                    `,
                    backdropFilter: `blur(${drop.blur}px)`,
                    border: '0.5px solid rgba(255, 255, 255, 0.3)',
                    animation: `waterDrop ${3 + Math.random() * 2}s ease-in-out infinite`,
                    animationDelay: `${Math.random() * 2}s`
                  }}
                />
              ))}
            </div>
            
            <div className="relative flex items-center justify-center mb-4 z-10">
              <img
                src={can.image}
                alt={can.name}
                className="w-56 h-auto object-contain"
                style={{
                  filter: 'drop-shadow(0 20px 40px rgba(0, 0, 0, 0.5))',
                  animation: 'zoomIn 0.5s ease-out'
                }}
              />
            </div>

            {can.energy && (
              <div className="mt-4 bg-black/40 backdrop-blur-md rounded-xl p-4 border border-white/20 relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white text-base font-bold">Energy Level</span>
                  <span className="text-white text-xl font-black">{can.energy}%</span>
                </div>
                <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-yellow-400 to-red-500 transition-all duration-1000"
                    style={{ width: `${can.energy}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 bg-white md:h-full md:overflow-y-auto md:flex md:flex-col">
            <div className="flex items-start justify-between mb-3 pr-12">
              <h2 className="text-2xl font-bold text-gray-800 leading-tight pr-2">
                {can.name}
              </h2>
              {can.badge && (
                <span className={`px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r ${can.color} text-white shadow-lg flex-shrink-0`}>
                  {can.badge}
                </span>
              )}
            </div>
            
            <p className="text-gray-600 text-base mb-4 leading-relaxed">
              {can.description}
            </p>

            {can.energy && (
              <div className="hidden md:block mb-5 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-4 border border-yellow-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-800 text-sm font-bold">Energy Level</span>
                  <span className="text-gray-900 text-xl font-black">{can.energy}%</span>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-yellow-400 to-red-500 transition-all duration-1000"
                    style={{ width: `${can.energy}%` }}
                  ></div>
                </div>
              </div>
            )}

            <div className="space-y-3 mb-5">
              <h3 className="text-base font-bold text-gray-800 mb-3">
                Features:
              </h3>
              {can.features.map((feature, idx) => (
                <div 
                  key={idx}
                  className="flex items-center bg-gray-50 rounded-xl p-3 border border-gray-100 opacity-0"
                  style={{ 
                    animation: `slideInRight 0.4s ease-out ${idx * 0.1}s forwards`
                  }}
                >
                  <div className={`w-2.5 h-2.5 rounded-full bg-gradient-to-r ${can.color} mr-3 flex-shrink-0`}></div>
                  <span className="text-gray-700 text-sm font-medium">{feature}</span>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 mb-5 border border-blue-100">
              <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" />
                <div>
                  <h4 className="text-gray-800 font-bold text-sm mb-1">Maximum Energy!</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Unique formula with premium ingredients for a long-lasting and effective energy boost.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3 pb-2 md:mt-auto">
              <button
                onClick={handleBuyNow}
                disabled={loading}
                className={`w-full bg-gradient-to-r ${can.color} text-white font-bold py-4 px-4 rounded-xl shadow-lg transition-all duration-300 active:scale-95 hover:shadow-xl text-base flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <Zap className="w-5 h-5" fill="currentColor" />
                {loading ? 'Loading...' : 'Buy Now'}
                <ChevronRight className="w-5 h-5" />
              </button>
              
              <button
                className="w-full bg-gray-100 text-gray-800 font-semibold py-3.5 px-4 rounded-xl transition-all duration-300 active:scale-95 hover:bg-gray-200 text-base flex items-center justify-center gap-2"
              >
                <Star className="w-5 h-5" />
                Add to Favorites
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fadeOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }

        @keyframes scaleIn {
          0% {
            transform: scale(0.9);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes scaleOut {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(0.9);
            opacity: 0;
          }
        }

        @keyframes zoomIn {
          0% {
            transform: scale(0.8);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes slideInRight {
          0% {
            transform: translateX(-20px);
            opacity: 0;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes waterDrop {
          0%, 100% {
            transform: translateY(0) scale(1);
            opacity: 0.6;
          }
          50% {
            transform: translateY(3px) scale(1.05);
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  );
};

export default RedBullModal;
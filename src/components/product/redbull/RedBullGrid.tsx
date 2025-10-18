import { Star, Zap } from 'lucide-react';
import type { CanData } from '../../../types/redbull.types';

interface RedBullGridProps {
  cans: CanData[];
  onSelect: (can: CanData) => void;
}

const RedBullGrid = ({ cans, onSelect }: RedBullGridProps) => {
  return (
    <div className="md:hidden min-h-screen bg-black">
      <div className="h-screen overflow-y-auto pt-20 pb-8">
        <div className="px-4">
          <div className="flex justify-center mb-4 animate-[fadeIn_0.8s_ease-out]">
            <div className="relative">
              <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-blue-600 via-red-600 to-yellow-500 p-1 rounded-xl shadow-2xl">
                <div className="bg-white rounded-lg p-2">
                  <img 
                    src="/images/red-bull/red-bull-logo.png" 
                    alt="Red Bull Logo"
                    className="w-32 h-auto"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="text-center py-4 mb-4">
            <h1 className="text-4xl font-black text-white mb-2 tracking-tight leading-tight animate-[slideIn_0.6s_ease-out]">
              WIIINGS<br/>FOR EVERY<br/>TASTE.
            </h1>
            <div className="flex justify-center gap-2 mt-3">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pb-4">
            {cans.map((can, index) => (
              <div
                key={can.id}
                onClick={() => onSelect(can)}
                className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer transform transition-all duration-300 active:scale-95 opacity-0"
                style={{
                  animation: `fadeInZoom 0.5s ease-out ${0.2 + index * 0.08}s forwards`,
                  boxShadow: `0 10px 30px ${can.glowColor}, 0 5px 15px rgba(0, 0, 0, 0.8)`
                }}
              >
                {can.badge && (
                  <div className="absolute top-2 right-2 bg-gradient-to-r from-red-600 to-pink-600 text-white text-xs px-2 py-1 rounded-full z-20 shadow-lg flex items-center gap-1">
                    <Star className="w-3 h-3" fill="currentColor" />
                    {can.badge}
                  </div>
                )}

                <div className={`absolute inset-0 bg-gradient-to-br ${can.color}`}>
                  <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/20 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/30 to-transparent"></div>
                </div>

                <div className="relative h-full flex items-center justify-center p-4">
                  <img
                    src={can.image}
                    alt={can.name}
                    className="w-full h-full object-contain drop-shadow-2xl"
                    style={{
                      filter: 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.6))'
                    }}
                  />
                </div>

                {can.energy && (
                  <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-yellow-400" fill="currentColor" />
                    <span className="text-white text-xs font-bold">{can.energy}%</span>
                  </div>
                )}

                <div className="absolute bottom-2 left-2 right-2">
                  <div className="bg-black/80 backdrop-blur-md rounded-lg p-2 shadow-lg border border-white/10">
                    <h3 className="text-white font-bold text-sm leading-tight">
                      {can.name}
                    </h3>
                    <p className="text-white/70 text-xs mt-0.5">
                      {can.features[0]}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RedBullGrid;
import { useState } from 'react';
import type { CanData } from '../../types/redbull.types';
import { cansData } from '../../data/redbull';
import RedBullGrid from './redbull/RedBullGrid';
import RedBullModal from './redbull/RedBullModal';

const RedBullSection = () => {
  const [selectedCan, setSelectedCan] = useState<CanData | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  const handleCanClick = (can: CanData) => {
    setIsClosing(false);
    setSelectedCan(can);
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setSelectedCan(null);
      setIsClosing(false);
    }, 300);
  };

  return (
    <section className="min-h-screen relative overflow-hidden bg-black">
      <div
        className="absolute inset-0 bg-cover animate-[fadeInSharp_1.5s_ease-out_forwards] hidden md:block"
        style={{
          backgroundImage: "url('/images/red-bull/RedBullSection.png')",
          backgroundPosition: 'center calc(50% - 80px)'
        }}
      />
     
      <div className="absolute top-[23%] left-[35%] right-0 justify-start items-center -space-x-6 px-8 z-10 hidden md:flex">
        {cansData.map((can, index) => (
          <img
            key={can.id}
            src={can.image}
            alt={can.name}
            onClick={() => handleCanClick(can)}
            className={`${can.className} object-contain hover:scale-110 transition-transform duration-300 drop-shadow-2xl cursor-pointer opacity-0 scale-80`}
            style={{
              animation: `fadeInZoom 0.6s ease-out ${1.5 + index * 0.15}s forwards`
            }}
          />
        ))}
      </div>

      <RedBullGrid cans={cansData} onSelect={handleCanClick} />

      {selectedCan && (
        <RedBullModal 
          can={selectedCan} 
          onClose={handleClose} 
          isClosing={isClosing} 
        />
      )}

      <style>{`
        @keyframes fadeInSharp {
          0% {
            filter: blur(20px);
            opacity: 0;
          }
          100% {
            filter: blur(0px);
            opacity: 1;
          }
        }

        @keyframes fadeInZoom {
          0% {
            opacity: 0;
            transform: scale(0.8) translateY(20px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideIn {
          0% {
            transform: scale(0.95) translateY(20px);
            opacity: 0;
          }
          100% {
            transform: scale(1) translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </section>
  );
};

export default RedBullSection;
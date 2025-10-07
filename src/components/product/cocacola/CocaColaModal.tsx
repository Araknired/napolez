import { useEffect, useState } from 'react';
import type { Snowflake } from '../../../types/cocacola.types';

interface CocaColaModalProps {
  snowflakeCount: number;
}

const CocaColaModal = ({ snowflakeCount }: CocaColaModalProps) => {
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);

  useEffect(() => {
    const flakes = Array.from({ length: snowflakeCount }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      animationDuration: 10 + Math.random() * 20,
      opacity: 0.3 + Math.random() * 0.7,
      size: 2 + Math.random() * 4
    }));
    setSnowflakes(flakes);
  }, [snowflakeCount]);

  return (
    <>
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

      <style>{`
        @keyframes snowfall {
          0% {
            transform: translateY(-10vh) translateX(0);
          }
          100% {
            transform: translateY(110vh) translateX(100px);
          }
        }

        @keyframes floatStraight {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes fadeInSlow {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 0.15;
          }
        }

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
    </>
  );
};

export default CocaColaModal;
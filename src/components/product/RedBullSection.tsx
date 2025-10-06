import { useState } from 'react';
import { X, Zap, Star, ChevronRight } from 'lucide-react';

interface CanData {
  id: number;
  image: string;
  name: string;
  description: string;
  features: string[];
  color: string;
  className: string;
  glowColor: string;
  energy?: number;
  badge?: string;
}

const RedBullSection = () => {
  const [selectedCan, setSelectedCan] = useState<CanData | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  const cansData: CanData[] = [
    {
      id: 1,
      image: '/src/assets/images/red-bull/red-bull-melocoton.png',
      name: 'Red Bull Melocotón',
      description: 'Refrescante sabor a melocotón con el impulso de energía que necesitas.',
      features: ['250ml', 'Cafeína: 80mg', 'Sabor frutal', 'Edición especial'],
      color: 'from-pink-500 to-orange-400',
      glowColor: 'rgba(251, 146, 60, 0.4)',
      className: 'w-38 h-50 translate-y-2',
      energy: 85,
      badge: 'Nuevo'
    },
    {
      id: 2,
      image: '/src/assets/images/red-bull/red-bull.png',
      name: 'Red Bull Original',
      description: 'La bebida energética original que te da alas.',
      features: ['250ml', 'Cafeína: 80mg', 'Taurina: 1000mg', 'Sabor clásico'],
      color: 'from-blue-600 to-blue-400',
      glowColor: 'rgba(59, 130, 246, 0.4)',
      className: 'w-36 h-48',
      energy: 90,
      badge: 'Clásico'
    },
    {
      id: 3,
      image: '/src/assets/images/red-bull/red-bull-blue.png',
      name: 'Red Bull Blue Edition',
      description: 'Energía con un toque refrescante de arándano.',
      features: ['250ml', 'Cafeína: 80mg', 'Sabor arándano', 'Edición azul'],
      color: 'from-blue-400 to-cyan-300',
      glowColor: 'rgba(34, 211, 238, 0.4)',
      className: 'w-38 h-50',
      energy: 80,
      badge: 'Popular'
    },
    {
      id: 4,
      image: '/src/assets/images/red-bull/red-blue-white.png',
      name: 'Red Bull White Edition',
      description: 'Sabor coco-açaí con toda la energía Red Bull.',
      features: ['250ml', 'Cafeína: 80mg', 'Sabor coco-açaí', 'Edición blanca'],
      color: 'from-gray-200 to-blue-200',
      glowColor: 'rgba(191, 219, 254, 0.5)',
      className: 'w-36 h-48',
      energy: 75
    },
    {
      id: 5,
      image: '/src/assets/images/red-bull/red-bull-sugarfree.png',
      name: 'Red Bull Sugar Free',
      description: 'Toda la energía, sin azúcar.',
      features: ['250ml', 'Cafeína: 80mg', '0 azúcar', 'Sabor original'],
      color: 'from-slate-500 to-slate-300',
      glowColor: 'rgba(148, 163, 184, 0.4)',
      className: 'w-36 h-48',
      energy: 85,
      badge: 'Saludable'
    },
    {
      id: 6,
      image: '/src/assets/images/red-bull/red-bull-cola.png',
      name: 'Red Bull Cola',
      description: 'La combinación perfecta de cola y energía natural.',
      features: ['250ml', 'Cafeína natural', 'Sin sabores artificiales', 'Cola única'],
      color: 'from-amber-800 to-amber-600',
      glowColor: 'rgba(217, 119, 6, 0.4)',
      className: 'w-36 h-48',
      energy: 70
    },
    {
      id: 7,
      image: '/src/assets/images/red-bull/red-bull-apricot.png',
      name: 'Red Bull Apricot',
      description: 'Energía con el delicioso sabor del albaricoque.',
      features: ['250ml', 'Cafeína: 80mg', 'Sabor albaricoque', 'Edición especial'],
      color: 'from-orange-400 to-yellow-300',
      glowColor: 'rgba(251, 191, 36, 0.4)',
      className: 'w-36 h-48',
      energy: 80
    },
    {
      id: 8,
      image: '/src/assets/images/red-bull/red-bull-botella.png',
      name: 'Red Bull Botella',
      description: 'Red Bull en formato botella para mayor comodidad.',
      features: ['355ml', 'Cafeína: 114mg', 'Formato botella', 'Más cantidad'],
      color: 'from-blue-500 to-indigo-400',
      glowColor: 'rgba(99, 102, 241, 0.4)',
      className: 'w-36 h-48',
      energy: 95,
      badge: 'XL'
    },
    {
      id: 9,
      image: '/src/assets/images/red-bull/red-bull-red.png',
      name: 'Red Bull Red Edition',
      description: 'Explosión de sabor sandía con máxima energía.',
      features: ['250ml', 'Cafeína: 80mg', 'Sabor sandía', 'Edición roja'],
      color: 'from-red-600 to-pink-500',
      glowColor: 'rgba(239, 68, 68, 0.4)',
      className: 'w-40 h-52',
      energy: 88,
      badge: 'Intenso'
    },
    {
      id: 10,
      image: '/src/assets/images/red-bull/red-bull-taurine.png',
      name: 'Red Bull Taurine',
      description: 'Fórmula con extra de taurina para máximo rendimiento.',
      features: ['250ml', 'Cafeína: 80mg', 'Taurina extra', 'Alto rendimiento'],
      color: 'from-purple-600 to-purple-400',
      glowColor: 'rgba(168, 85, 247, 0.4)',
      className: 'w-36 h-48',
      energy: 92,
      badge: 'Pro'
    }
  ];

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
      {/* Background image - Solo desktop */}
      <div
        className="absolute inset-0 bg-cover animate-[fadeInSharp_1.5s_ease-out_forwards] hidden md:block"
        style={{
          backgroundImage: "url('/src/assets/images/red-bull/RedBullSection.png')",
          backgroundPosition: 'center calc(50% - 80px)'
        }}
      />
     
      {/* Individual cans with staggered animation - Solo desktop */}
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

      {/* Versión móvil MEJORADA Y LIGERA */}
      <div className="md:hidden min-h-screen bg-black">
        <div className="h-screen overflow-y-auto pt-20 pb-8">
          <div className="px-4">
            {/* Logo Red Bull - Solo móvil */}
            <div className="flex justify-center mb-4 animate-[fadeIn_0.8s_ease-out]">
              <div className="relative">
                <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-blue-600 via-red-600 to-yellow-500 p-1 rounded-xl shadow-2xl">
                  <div className="bg-white rounded-lg p-2">
                    <img 
                      src="/src/assets/images/red-bull/red-bull-logo.png" 
                      alt="Red Bull Logo"
                      className="w-32 h-auto"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Header móvil mejorado */}
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

            {/* Grid de latas mejorado - LIGERO */}
            <div className="grid grid-cols-2 gap-3 pb-4">
              {cansData.map((can, index) => (
                <div
                  key={can.id}
                  onClick={() => handleCanClick(can)}
                  className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer transform transition-all duration-300 active:scale-95 opacity-0"
                  style={{
                    animation: `fadeInZoom 0.5s ease-out ${0.2 + index * 0.08}s forwards`,
                    boxShadow: `0 10px 30px ${can.glowColor}, 0 5px 15px rgba(0, 0, 0, 0.8)`
                  }}
                >
                  {/* Badge mejorado */}
                  {can.badge && (
                    <div className="absolute top-2 right-2 bg-gradient-to-r from-red-600 to-pink-600 text-white text-xs px-2 py-1 rounded-full z-20 shadow-lg flex items-center gap-1">
                      <Star className="w-3 h-3" fill="currentColor" />
                      {can.badge}
                    </div>
                  )}

                  {/* Fondo de color mejorado */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${can.color}`}>
                    {/* Reflejo superior */}
                    <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/20 to-transparent"></div>
                    
                    {/* Sombra inferior */}
                    <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/30 to-transparent"></div>
                  </div>

                  {/* Imagen de la lata */}
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

                  {/* Energy indicator - Nuevo */}
                  {can.energy && (
                    <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1">
                      <Zap className="w-3 h-3 text-yellow-400" fill="currentColor" />
                      <span className="text-white text-xs font-bold">{can.energy}%</span>
                    </div>
                  )}

                  {/* Texto mejorado */}
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

      {/* Modal mejorado para MÓVIL */}
      {selectedCan && (
        <div 
          className={`fixed inset-0 flex items-end md:items-center justify-center z-50 ${
            isClosing ? 'animate-[fadeOut_0.3s_ease-out_forwards]' : 'animate-[fadeIn_0.3s_ease-out]'
          }`}
          onClick={handleClose}
          style={{ 
            backdropFilter: 'blur(20px)',
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            paddingTop: '0'
          }}
        >
          {/* Modal content optimizado */}
          <div 
            className={`bg-white rounded-t-3xl md:rounded-2xl shadow-2xl w-full md:max-w-md flex flex-col overflow-hidden relative transform ${
              isClosing ? 'animate-[slideOutDown_0.3s_ease-out_forwards]' : 'animate-[slideInUp_0.4s_ease-out]'
            }`}
            onClick={(e) => e.stopPropagation()}
            style={{
              maxHeight: 'calc(100vh - 64px)', // 64px es la altura típica del navbar
              height: 'auto'
            }}
          >
            {/* Handle bar para móvil */}
            <div className="md:hidden flex justify-center pt-3 pb-2 bg-white rounded-t-3xl">
              <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
            </div>

            {/* Botón cerrar */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-all duration-200 z-50 shadow-lg active:scale-95"
            >
              <X size={20} />
            </button>

            {/* Contenedor con scroll */}
            <div className="overflow-y-auto flex-1">
              {/* Imagen y info */}
              <div className={`bg-gradient-to-br ${selectedCan.color} px-6 pt-8 pb-6 relative`}>
                {/* Glow effect */}
                <div 
                  className="absolute inset-0"
                  style={{
                    background: `radial-gradient(circle at center, ${selectedCan.glowColor} 0%, transparent 70%)`,
                    filter: 'blur(30px)'
                  }}
                />
                
                <div className="relative flex items-center justify-center mb-4">
                  <img
                    src={selectedCan.image}
                    alt={selectedCan.name}
                    className="w-56 h-auto object-contain"
                    style={{
                      filter: 'drop-shadow(0 20px 40px rgba(0, 0, 0, 0.5))',
                      animation: 'zoomIn 0.5s ease-out'
                    }}
                  />
                </div>

                {/* Energy bar */}
                {selectedCan.energy && (
                  <div className="mt-4 bg-black/40 backdrop-blur-md rounded-xl p-4 border border-white/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white text-base font-bold">Nivel de Energía</span>
                      <span className="text-white text-xl font-black">{selectedCan.energy}%</span>
                    </div>
                    <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-yellow-400 to-red-500 transition-all duration-1000"
                        style={{ width: `${selectedCan.energy}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Información */}
              <div className="p-6 bg-white">
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-800 leading-tight pr-2">
                    {selectedCan.name}
                  </h2>
                  {selectedCan.badge && (
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r ${selectedCan.color} text-white shadow-lg flex-shrink-0`}>
                      {selectedCan.badge}
                    </span>
                  )}
                </div>
                
                <p className="text-gray-600 text-base mb-6 leading-relaxed">
                  {selectedCan.description}
                </p>

                {/* Features */}
                <div className="space-y-3 mb-6">
                  <h3 className="text-base font-bold text-gray-800 mb-3">
                    Características:
                  </h3>
                  {selectedCan.features.map((feature, idx) => (
                    <div 
                      key={idx}
                      className="flex items-center bg-gray-50 rounded-xl p-4 border border-gray-100 opacity-0"
                      style={{ 
                        animation: `slideInRight 0.4s ease-out ${idx * 0.1}s forwards`
                      }}
                    >
                      <div className={`w-2.5 h-2.5 rounded-full bg-gradient-to-r ${selectedCan.color} mr-3 flex-shrink-0`}></div>
                      <span className="text-gray-700 text-base font-medium">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Información adicional */}
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 mb-6 border border-blue-100">
                  <div className="flex items-start gap-3">
                    <Zap className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" />
                    <div>
                      <h4 className="text-gray-800 font-bold text-sm mb-1">¡Máxima Energía!</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        Fórmula única con ingredientes premium para un impulso de energía duradero y efectivo.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Botones */}
                <div className="space-y-3 pb-2">
                  <button
                    className={`w-full bg-gradient-to-r ${selectedCan.color} text-white font-bold py-4 px-4 rounded-xl shadow-lg transition-all duration-300 active:scale-95 text-base flex items-center justify-center gap-2`}
                  >
                    <Zap className="w-5 h-5" fill="currentColor" />
                    Comprar Ahora
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  
                  <button
                    className="w-full bg-gray-100 text-gray-800 font-semibold py-3.5 px-4 rounded-xl transition-all duration-300 active:scale-95 text-base flex items-center justify-center gap-2"
                  >
                    <Star className="w-5 h-5" />
                    Agregar a Favoritos
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
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

        @keyframes fadeOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
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

        @keyframes slideOut {
          0% {
            transform: scale(1) translateY(0);
            opacity: 1;
          }
          100% {
            transform: scale(0.95) translateY(20px);
            opacity: 0;
          }
        }

        @keyframes slideInUp {
          0% {
            transform: translateY(100%);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes slideOutDown {
          0% {
            transform: translateY(0);
            opacity: 1;
          }
          100% {
            transform: translateY(100%);
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
      `}</style>
    </section>
  );
};

export default RedBullSection;
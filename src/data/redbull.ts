import type { CanData } from '../types/redbull.types';

export const cansData: CanData[] = [
  {
    id: 1,
    image: '/src/assets/images/red-bull/red-bull-melocoton.png',
    name: 'Red Bull Peach',
    description: 'Refreshing peach flavor with the energy boost you need.',
    features: ['250ml', 'Caffeine: 80mg', 'Fruity flavor', 'Special edition'],
    color: 'from-pink-500 to-orange-400',
    glowColor: 'rgba(251, 146, 60, 0.4)',
    className: 'w-38 h-45 translate-y-2',
    energy: 85,
    badge: 'New'
  },
  {
    id: 2,
    image: '/src/assets/images/red-bull/red-bull.png',
    name: 'Red Bull Original',
    description: 'The original energy drink that gives you wings.',
    features: ['250ml', 'Caffeine: 80mg', 'Taurine: 1000mg', 'Classic flavor'],
    color: 'from-blue-600 to-blue-400',
    glowColor: 'rgba(59, 130, 246, 0.4)',
    className: 'w-36 h-48',
    energy: 90,
    badge: 'Classic'
  },
  {
    id: 3,
    image: '/src/assets/images/red-bull/red-bull-blue.png',
    name: 'Red Bull Blue Edition',
    description: 'Energy with a refreshing blueberry twist.',
    features: ['250ml', 'Caffeine: 80mg', 'Blueberry flavor', 'Blue edition'],
    color: 'from-blue-400 to-cyan-300',
    glowColor: 'rgba(34, 211, 238, 0.4)',
    className: 'w-38 h-51',
    energy: 80,
    badge: 'Popular'
  },
  {
    id: 4,
    image: '/src/assets/images/red-bull/red-blue-white.png',
    name: 'Red Bull White Edition',
    description: 'Coconut-acai flavor with all the Red Bull energy.',
    features: ['250ml', 'Caffeine: 80mg', 'Coconut-acai flavor', 'White edition'],
    color: 'from-gray-200 to-blue-200',
    glowColor: 'rgba(191, 219, 254, 0.5)',
    className: 'w-36 h-48',
    energy: 75
  },
  {
    id: 5,
    image: '/src/assets/images/red-bull/red-bull-sugarfree.png',
    name: 'Red Bull Sugar Free',
    description: 'All the energy, zero sugar.',
    features: ['250ml', 'Caffeine: 80mg', '0 sugar', 'Original flavor'],
    color: 'from-slate-500 to-slate-300',
    glowColor: 'rgba(148, 163, 184, 0.4)',
    className: 'w-36 h-48',
    energy: 85,
    badge: 'Healthy'
  },
  {
    id: 6,
    image: '/src/assets/images/red-bull/red-bull-cola.png',
    name: 'Red Bull Cola',
    description: 'The perfect combination of cola and natural energy.',
    features: ['250ml', 'Natural caffeine', 'No artificial flavors', 'Unique cola'],
    color: 'from-amber-800 to-amber-600',
    glowColor: 'rgba(217, 119, 6, 0.4)',
    className: 'w-36 h-48',
    energy: 70
  },
  {
    id: 7,
    image: '/src/assets/images/red-bull/red-bull-apricot.png',
    name: 'Red Bull Apricot',
    description: 'Energy with the delicious taste of apricot.',
    features: ['250ml', 'Caffeine: 80mg', 'Apricot flavor', 'Special edition'],
    color: 'from-orange-400 to-yellow-300',
    glowColor: 'rgba(251, 191, 36, 0.4)',
    className: 'w-36 h-48',
    energy: 80
  },
  {
    id: 8,
    image: '/src/assets/images/red-bull/red-bull-botella.png',
    name: 'Red Bull Bottle',
    description: 'Red Bull in bottle format for greater convenience.',
    features: ['355ml', 'Caffeine: 114mg', 'Bottle format', 'More quantity'],
    color: 'from-blue-500 to-indigo-400',
    glowColor: 'rgba(99, 102, 241, 0.4)',
    className: 'w-36 h-49',
    energy: 95,
    badge: 'XL'
  },
  {
    id: 9,
    image: '/src/assets/images/red-bull/red-bull-red.png',
    name: 'Red Bull Red Edition',
    description: 'Watermelon flavor explosion with maximum energy.',
    features: ['250ml', 'Caffeine: 80mg', 'Watermelon flavor', 'Red edition'],
    color: 'from-red-600 to-pink-500',
    glowColor: 'rgba(239, 68, 68, 0.4)',
    className: 'w-40 h-50',
    energy: 88,
    badge: 'Intense'
  },
  {
    id: 10,
    image: '/src/assets/images/red-bull/red-bull-taurine.png',
    name: 'Red Bull Taurine',
    description: 'Formula with extra taurine for maximum performance.',
    features: ['250ml', 'Caffeine: 80mg', 'Extra taurine', 'High performance'],
    color: 'from-purple-600 to-purple-400',
    glowColor: 'rgba(168, 85, 247, 0.4)',
    className: 'w-36 h-48',
    energy: 92,
    badge: 'Pro'
  }
];
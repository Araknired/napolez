import type { CocaColaConfig } from '../types/cocacola.types';

export const COCA_COLA_CONFIG: CocaColaConfig = {
  assets: {
    watermark: "/images/coca-cola/cocacola-watermark.png",
    logo: "/images/coca-cola/cocacola-logo.png",
    smallCan: "/images/coca-cola/cocacola-can-small.png",
    santaClaus: "/images/coca-cola/santa-claus.png"
  },
  
  animationDelays: {
    logo: '0.8s',
    title: '1.1s',
    subtitle: '1.4s',
    button: '1.7s',
    santa: '2s',
    bubble1: '2.3s',
    bubble2: '2.5s',
    bubble3: '2.7s'
  },
  
  content: {
    mainTitle: ['HAPPY', 'NEW', 'YEAR'],
    subtitle: 'New Concept Masuta Alex',
    ctaButtonText: 'Buy Coca-Cola',
    websiteUrl: 'https://www.coca-cola.com'
  },
  
  snowflakeCount: 50
};

export const BUBBLE_POSITIONS = [
  { top: '9rem', right: '6rem', size: 'w-3 h-3', color: 'bg-red-200', opacity: 'opacity-30', duration: '5s' },
  { bottom: '12rem', left: '8rem', size: 'w-4 h-4', color: 'bg-red-300', opacity: 'opacity-25', duration: '6s' },
  { top: '50%', right: '33%', size: 'w-2 h-2', color: 'bg-red-400', opacity: 'opacity-35', duration: '7s' }
];
import type { Product } from '../types/pepsi.types';

export const products: Product[] = [
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

export const TOTAL_REVIEWS = 9999;
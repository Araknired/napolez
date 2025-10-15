export type Category = 
  | 'Donuts' 
  | 'Burger' 
  | 'Ice' 
  | 'Potato' 
  | 'Pizza' 
  | 'Fuchka' 
  | 'Hot dog' 
  | 'Chicken' 
  | 'Tacos' 
  | 'Drinks' 
  | 'Coffee' 
  | 'Pasta' 
  | 'Snacks' 
  | 'Energy Drinks' 
  | 'Desserts' 
  | 'Sushi';

export interface CategoryItem {
  id: Category;
  name: string;
  emoji: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  rating: number;
  image: string;
  color: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export type PaymentMethod = 'paypal' | 'visa' | 'mastercard' | 'american';

export type TabType = 'popular' | 'recent';
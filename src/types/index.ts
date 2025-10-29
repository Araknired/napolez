export type Category = 'Donuts' | 'Burger' | 'Ice' | 'Potato' | 'Pizza' | 'Fuchka' | 'Hot dog' | 'Chicken' | 'Tacos' | 'Drinks' | 'Coffee' | 'Pasta' | 'Snacks' | 'Energy Drinks' | 'Desserts' | 'Sushi';

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  rating: number;
  image: string;
  category: Category;  // ✅ AGREGADO - Campo que faltaba
  color: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface CategoryItem {
  id: Category;
  name: string;
  emoji: string;
}
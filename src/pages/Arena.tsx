import React, { useState } from 'react';
import { Search, SlidersHorizontal, Star, Heart, ShoppingCart, Plus, Minus, Trash2, ChevronDown } from 'lucide-react';

type Category = 'Donuts' | 'Burger' | 'Ice' | 'Potato' | 'Pizza' | 'Fuchka' | 'Hot dog' | 'Chicken' | 'Tacos' | 'Drinks' | 'Coffee' | 'Pasta' | 'Snacks' | 'Energy Drinks' | 'Desserts' | 'Sushi';

interface CategoryItem {
  id: Category;
  name: string;
  emoji: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  rating: number;
  image: string;
  color: string;
}

interface CartItem extends Product {
  quantity: number;
}

type PaymentMethod = 'paypal' | 'visa' | 'mastercard' | 'american';
type TabType = 'popular' | 'recent';

const FoodOrderApp: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category>('Burger');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('mastercard');
  const [activeTab, setActiveTab] = useState<TabType>('popular');
  const [showAllCategories, setShowAllCategories] = useState(false);

  const categories: CategoryItem[] = [
    { id: 'Donuts', name: 'Donuts', emoji: '/src/assets/arena/media/donut/donut.png' },
    { id: 'Burger', name: 'Burger', emoji: '/src/assets/arena/media/burger/burger.png' },
    { id: 'Ice', name: 'Ice', emoji: '/src/assets/arena/media/ice/ice.png' },
    { id: 'Potato', name: 'Potato', emoji: '/src/assets/arena/media/potato/potato.png' },
    { id: 'Pizza', name: 'Pizza', emoji: '/src/assets/arena/media/pizza/pizza.png' },
    { id: 'Fuchka', name: 'Fuchka', emoji: '/src/assets/arena/media/fuchka/fuchka.png' },
    { id: 'Hot dog', name: 'Hot dog', emoji: '/src/assets/arena/media/hotdog/hotdog.png' },
    { id: 'Chicken', name: 'Chicken', emoji: '/src/assets/arena/media/chicken/chicken.png' },
    { id: 'Tacos', name: 'Tacos', emoji: '/src/assets/arena/media/tacos/tacos.png' },
    { id: 'Drinks', name: 'Drinks', emoji: '/src/assets/arena/media/drinks/drinks.png' },
    { id: 'Coffee', name: 'Coffee', emoji: '/src/assets/arena/media/coffee/coffee.png' },
    { id: 'Pasta', name: 'Pasta', emoji: '/src/assets/arena/media/pasta/pasta.png' },
    { id: 'Snacks', name: 'Snacks', emoji: '/src/assets/arena/media/snacks/snacks.png' },
    { id: 'Energy Drinks', name: 'Energy Drinks', emoji: '/src/assets/arena/media/energy/energy.png' },
    { id: 'Desserts', name: 'Desserts', emoji: '/src/assets/arena/media/desserts/desserts.png' },
    { id: 'Sushi', name: 'Sushi', emoji: '/src/assets/arena/media/sushi/sushi.png' }
  ];

  const products: Record<Category, Product[]> = {
    Burger: [
      { id: 'b1', name: 'Vegetable Burger', price: 25, originalPrice: 28.30, rating: 2.5, image: '/src/assets/arena/media/burger/burger-1.png', color: '#FFF4E6' },
      { id: 'b2', name: 'Meat Burger', price: 28, originalPrice: 30.50, rating: 2.5, image: '/src/assets/arena/media/burger/burger-2.png', color: '#FFE8E8' },
      { id: 'b3', name: 'Cheese Burger', price: 32, originalPrice: 35.00, rating: 2.5, image: '/src/assets/arena/media/burger/burger-3.png', color: '#FFF9E6' },
      { id: 'b4', name: 'Classic Burger', price: 30, originalPrice: 33.00, rating: 2.5, image: '/src/assets/arena/media/burger/burger-4.png', color: '#F0FFE6' },
      { id: 'b5', name: 'Bean Burger', price: 15, originalPrice: 18.30, rating: 2.5, image: '/src/assets/arena/media/burger/burger-5.png', color: '#FFE6F0' },
      { id: 'b6', name: 'Wild Salmon Burger', price: 40, originalPrice: 45.00, rating: 2.5, image: '/src/assets/arena/media/burger/burger-6.png', color: '#E6F7FF' },
      { id: 'b7', name: 'Bacon Burger', price: 35, originalPrice: 38.50, rating: 2.5, image: '/src/assets/arena/media/burger/burger-7.png', color: '#FFF4E6' },
      { id: 'b8', name: 'Double Burger', price: 45, originalPrice: 50.00, rating: 2.5, image: '/src/assets/arena/media/burger/burger-8.png', color: '#FFE8E8' },
      { id: 'b9', name: 'BBQ Burger', price: 38, originalPrice: 42.00, rating: 2.5, image: '/src/assets/arena/media/burger/burger-9.png', color: '#FFF9E6' },
      { id: 'b10', name: 'Spicy Burger', price: 33, originalPrice: 36.50, rating: 2.5, image: '/src/assets/arena/media/burger/burger-10.png', color: '#F0FFE6' },
      { id: 'b11', name: 'Mushroom Burger', price: 29, originalPrice: 32.00, rating: 2.5, image: '/src/assets/arena/media/burger/burger-11.png', color: '#FFE6F0' },
      { id: 'b12', name: 'Chicken Burger', price: 31, originalPrice: 34.50, rating: 2.5, image: '/src/assets/arena/media/burger/burger-12.png', color: '#E6F7FF' },
      { id: 'b13', name: 'Fish Burger', price: 36, originalPrice: 40.00, rating: 2.5, image: '/src/assets/arena/media/burger/burger-13.png', color: '#FFF4E6' },
      { id: 'b14', name: 'Turkey Burger', price: 34, originalPrice: 37.50, rating: 2.5, image: '/src/assets/arena/media/burger/burger-14.png', color: '#FFE8E8' },
      { id: 'b15', name: 'Hawaiian Burger', price: 37, originalPrice: 41.00, rating: 2.5, image: '/src/assets/arena/media/burger/burger-15.png', color: '#FFF9E6' },
      { id: 'b16', name: 'Deluxe Burger', price: 42, originalPrice: 46.50, rating: 2.5, image: '/src/assets/arena/media/burger/burger-16.png', color: '#F0FFE6' }
    ],
    Donuts: [
      { id: 'd1', name: 'Chocolate Donut', price: 8, originalPrice: 10.50, rating: 2.5, image: '/src/assets/arena/media/donut/donut-1.png', color: '#FFF4E6' },
      { id: 'd2', name: 'Strawberry Donut', price: 9, originalPrice: 11.00, rating: 2.5, image: '/src/assets/arena/media/donut/donut-2.png', color: '#FFE8E8' },
      { id: 'd3', name: 'Vanilla Donut', price: 7, originalPrice: 9.50, rating: 2.5, image: '/src/assets/arena/media/donut/donut-3.png', color: '#FFF9E6' },
      { id: 'd4', name: 'Glazed Donut', price: 6, originalPrice: 8.50, rating: 2.5, image: '/src/assets/arena/media/donut/donut-4.png', color: '#F0FFE6' },
      { id: 'd5', name: 'Sprinkles Donut', price: 10, originalPrice: 12.00, rating: 2.5, image: '/src/assets/arena/media/donut/donut-5.png', color: '#FFE6F0' },
      { id: 'd6', name: 'Caramel Donut', price: 11, originalPrice: 13.50, rating: 2.5, image: '/src/assets/arena/media/donut/donut-6.png', color: '#E6F7FF' },
      { id: 'd7', name: 'Maple Donut', price: 9, originalPrice: 11.50, rating: 2.5, image: '/src/assets/arena/media/donut/donut-7.png', color: '#FFF4E6' },
      { id: 'd8', name: 'Boston Cream Donut', price: 12, originalPrice: 14.00, rating: 2.5, image: '/src/assets/arena/media/donut/donut-8.png', color: '#FFE8E8' },
      { id: 'd9', name: 'Jelly Donut', price: 8, originalPrice: 10.00, rating: 2.5, image: '/src/assets/arena/media/donut/donut-9.png', color: '#FFF9E6' },
      { id: 'd10', name: 'Powdered Donut', price: 7, originalPrice: 9.00, rating: 2.5, image: '/src/assets/arena/media/donut/donut-10.png', color: '#F0FFE6' },
      { id: 'd11', name: 'Cinnamon Donut', price: 9, originalPrice: 11.00, rating: 2.5, image: '/src/assets/arena/media/donut/donut-11.png', color: '#FFE6F0' },
      { id: 'd12', name: 'Blueberry Donut', price: 10, originalPrice: 12.50, rating: 2.5, image: '/src/assets/arena/media/donut/donut-12.png', color: '#E6F7FF' },
      { id: 'd13', name: 'Red Velvet Donut', price: 11, originalPrice: 13.00, rating: 2.5, image: '/src/assets/arena/media/donut/donut-13.png', color: '#FFF4E6' },
      { id: 'd14', name: 'Coconut Donut', price: 10, originalPrice: 12.00, rating: 2.5, image: '/src/assets/arena/media/donut/donut-14.png', color: '#FFE8E8' },
      { id: 'd15', name: 'Lemon Donut', price: 9, originalPrice: 11.50, rating: 2.5, image: '/src/assets/arena/media/donut/donut-15.png', color: '#FFF9E6' },
      { id: 'd16', name: 'Peanut Butter Donut', price: 12, originalPrice: 14.50, rating: 2.5, image: '/src/assets/arena/media/donut/donut-16.png', color: '#F0FFE6' }
    ],
    Ice: [
      { id: 'i1', name: 'Vanilla Ice Cream', price: 12, originalPrice: 15.00, rating: 2.5, image: '/src/assets/arena/media/ice/ice-cream-1.png', color: '#FFF4E6' },
      { id: 'i2', name: 'Chocolate Ice Cream', price: 13, originalPrice: 16.00, rating: 2.5, image: '/src/assets/arena/media/ice/ice-cream-2.png', color: '#FFE8E8' },
      { id: 'i3', name: 'Strawberry Ice Cream', price: 14, originalPrice: 17.00, rating: 2.5, image: '/src/assets/arena/media/ice/ice-cream-3.png', color: '#FFF9E6' },
      { id: 'i4', name: 'Mint Ice Cream', price: 15, originalPrice: 18.00, rating: 2.5, image: '/src/assets/arena/media/ice/ice-cream-4.png', color: '#F0FFE6' },
      { id: 'i5', name: 'Cookies Ice Cream', price: 16, originalPrice: 19.00, rating: 2.5, image: '/src/assets/arena/media/ice/ice-cream-5.png', color: '#FFE6F0' },
      { id: 'i6', name: 'Caramel Ice Cream', price: 17, originalPrice: 20.00, rating: 2.5, image: '/src/assets/arena/media/ice/ice-cream-6.png', color: '#E6F7FF' },
      { id: 'i7', name: 'Mango Ice Cream', price: 15, originalPrice: 18.50, rating: 2.5, image: '/src/assets/arena/media/ice/ice-cream-7.png', color: '#FFF4E6' },
      { id: 'i8', name: 'Pistachio Ice Cream', price: 18, originalPrice: 21.00, rating: 2.5, image: '/src/assets/arena/media/ice/ice-cream-8.png', color: '#FFE8E8' },
      { id: 'i9', name: 'Rocky Road Ice Cream', price: 16, originalPrice: 19.50, rating: 2.5, image: '/src/assets/arena/media/ice/ice-cream-9.png', color: '#FFF9E6' },
      { id: 'i10', name: 'Neapolitan Ice Cream', price: 14, originalPrice: 17.50, rating: 2.5, image: '/src/assets/arena/media/ice/ice-cream-10.png', color: '#F0FFE6' },
      { id: 'i11', name: 'Coffee Ice Cream', price: 15, originalPrice: 18.00, rating: 2.5, image: '/src/assets/arena/media/ice/ice-cream-11.png', color: '#FFE6F0' },
      { id: 'i12', name: 'Butter Pecan Ice Cream', price: 17, originalPrice: 20.50, rating: 2.5, image: '/src/assets/arena/media/ice/ice-cream-12.png', color: '#E6F7FF' },
      { id: 'i13', name: 'Cherry Ice Cream', price: 16, originalPrice: 19.00, rating: 2.5, image: '/src/assets/arena/media/ice/ice-cream-13.png', color: '#FFF4E6' },
      { id: 'i14', name: 'Banana Ice Cream', price: 13, originalPrice: 16.50, rating: 2.5, image: '/src/assets/arena/media/ice/ice-cream-14.png', color: '#FFE8E8' },
      { id: 'i15', name: 'Coconut Ice Cream', price: 15, originalPrice: 18.50, rating: 2.5, image: '/src/assets/arena/media/ice/ice-cream-15.png', color: '#FFF9E6' },
      { id: 'i16', name: 'Oreo Ice Cream', price: 18, originalPrice: 21.50, rating: 2.5, image: '/src/assets/arena/media/ice/ice-cream-16.png', color: '#F0FFE6' }
    ],
    Potato: [
      { id: 'p1', name: 'French Fries', price: 5, originalPrice: 7.00, rating: 2.5, image: '/src/assets/arena/media/potato/potato-1.png', color: '#FFF4E6' },
      { id: 'p2', name: 'Potato Wedges', price: 6, originalPrice: 8.00, rating: 2.5, image: '/src/assets/arena/media/potato/potato-2.png', color: '#FFE8E8' },
      { id: 'p3', name: 'Mashed Potato', price: 7, originalPrice: 9.00, rating: 2.5, image: '/src/assets/arena/media/potato/potato-3.png', color: '#FFF9E6' },
      { id: 'p4', name: 'Baked Potato', price: 8, originalPrice: 10.00, rating: 2.5, image: '/src/assets/arena/media/potato/potato-4.png', color: '#F0FFE6' },
      { id: 'p5', name: 'Hash Browns', price: 6, originalPrice: 8.50, rating: 2.5, image: '/src/assets/arena/media/potato/potato-5.png', color: '#FFE6F0' },
      { id: 'p6', name: 'Potato Chips', price: 4, originalPrice: 6.00, rating: 2.5, image: '/src/assets/arena/media/potato/potato-6.png', color: '#E6F7FF' },
      { id: 'p7', name: 'Curly Fries', price: 7, originalPrice: 9.50, rating: 2.5, image: '/src/assets/arena/media/potato/potato-7.png', color: '#FFF4E6' },
      { id: 'p8', name: 'Sweet Potato Fries', price: 8, originalPrice: 10.50, rating: 2.5, image: '/src/assets/arena/media/potato/potato-8.png', color: '#FFE8E8' },
      { id: 'p9', name: 'Tater Tots', price: 6, originalPrice: 8.00, rating: 2.5, image: '/src/assets/arena/media/potato/potato-9.png', color: '#FFF9E6' },
      { id: 'p10', name: 'Loaded Potato', price: 10, originalPrice: 12.50, rating: 2.5, image: '/src/assets/arena/media/potato/potato-10.png', color: '#F0FFE6' },
      { id: 'p11', name: 'Potato Skins', price: 9, originalPrice: 11.00, rating: 2.5, image: '/src/assets/arena/media/potato/potato-11.png', color: '#FFE6F0' },
      { id: 'p12', name: 'Waffle Fries', price: 7, originalPrice: 9.00, rating: 2.5, image: '/src/assets/arena/media/potato/potato-12.png', color: '#E6F7FF' },
      { id: 'p13', name: 'Potato Croquettes', price: 8, originalPrice: 10.00, rating: 2.5, image: '/src/assets/arena/media/potato/potato-13.png', color: '#FFF4E6' },
      { id: 'p14', name: 'Steak Fries', price: 7, originalPrice: 9.50, rating: 2.5, image: '/src/assets/arena/media/potato/potato-14.png', color: '#FFE8E8' },
      { id: 'p15', name: 'Potato Salad', price: 6, originalPrice: 8.50, rating: 2.5, image: '/src/assets/arena/media/potato/potato-15.png', color: '#FFF9E6' },
      { id: 'p16', name: 'Hasselback Potato', price: 9, originalPrice: 11.50, rating: 2.5, image: '/src/assets/arena/media/potato/potato-16.png', color: '#F0FFE6' }
    ],
    Pizza: [
      { id: 'pz1', name: 'Pepperoni Pizza', price: 35, originalPrice: 40.00, rating: 2.5, image: '/src/assets/arena/media/pizza/pizza-1.png', color: '#FFF4E6' },
      { id: 'pz2', name: 'Margherita Pizza', price: 30, originalPrice: 35.00, rating: 2.5, image: '/src/assets/arena/media/pizza/pizza-2.png', color: '#FFE8E8' },
      { id: 'pz3', name: 'Hawaiian Pizza', price: 32, originalPrice: 37.00, rating: 2.5, image: '/src/assets/arena/media/pizza/pizza-3.png', color: '#FFF9E6' },
      { id: 'pz4', name: 'Veggie Pizza', price: 28, originalPrice: 33.00, rating: 2.5, image: '/src/assets/arena/media/pizza/pizza-4.png', color: '#F0FFE6' },
      { id: 'pz5', name: 'BBQ Chicken Pizza', price: 38, originalPrice: 43.00, rating: 2.5, image: '/src/assets/arena/media/pizza/pizza-5.png', color: '#FFE6F0' },
      { id: 'pz6', name: 'Four Cheese Pizza', price: 40, originalPrice: 45.00, rating: 2.5, image: '/src/assets/arena/media/pizza/pizza-6.png', color: '#E6F7FF' },
      { id: 'pz7', name: 'Meat Lovers Pizza', price: 42, originalPrice: 47.00, rating: 2.5, image: '/src/assets/arena/media/pizza/pizza-7.png', color: '#FFF4E6' },
      { id: 'pz8', name: 'Supreme Pizza', price: 45, originalPrice: 50.00, rating: 2.5, image: '/src/assets/arena/media/pizza/pizza-8.png', color: '#FFE8E8' },
      { id: 'pz9', name: 'Buffalo Chicken Pizza', price: 39, originalPrice: 44.00, rating: 2.5, image: '/src/assets/arena/media/pizza/pizza-9.png', color: '#FFF9E6' },
      { id: 'pz10', name: 'Mexican Pizza', price: 36, originalPrice: 41.00, rating: 2.5, image: '/src/assets/arena/media/pizza/pizza-10.png', color: '#F0FFE6' },
      { id: 'pz11', name: 'White Pizza', price: 34, originalPrice: 39.00, rating: 2.5, image: '/src/assets/arena/media/pizza/pizza-11.png', color: '#FFE6F0' },
      { id: 'pz12', name: 'Seafood Pizza', price: 48, originalPrice: 53.00, rating: 2.5, image: '/src/assets/arena/media/pizza/pizza-12.png', color: '#E6F7FF' },
      { id: 'pz13', name: 'Mushroom Pizza', price: 31, originalPrice: 36.00, rating: 2.5, image: '/src/assets/arena/media/pizza/pizza-13.png', color: '#FFF4E6' },
      { id: 'pz14', name: 'Bacon Ranch Pizza', price: 41, originalPrice: 46.00, rating: 2.5, image: '/src/assets/arena/media/pizza/pizza-14.png', color: '#FFE8E8' },
      { id: 'pz15', name: 'Pesto Pizza', price: 37, originalPrice: 42.00, rating: 2.5, image: '/src/assets/arena/media/pizza/pizza-15.png', color: '#FFF9E6' },
      { id: 'pz16', name: 'Greek Pizza', price: 35, originalPrice: 40.00, rating: 2.5, image: '/src/assets/arena/media/pizza/pizza-16.png', color: '#F0FFE6' }
    ],
    Fuchka: [
      { id: 'f1', name: 'Panipuri', price: 10, originalPrice: 12.50, rating: 2.5, image: '/src/assets/arena/media/fuchka/fuchka-1.png', color: '#FFF4E6' },
      { id: 'f2', name: 'Dahi Puri', price: 11, originalPrice: 13.50, rating: 2.5, image: '/src/assets/arena/media/fuchka/fuchka-2.png', color: '#FFE8E8' },
      { id: 'f3', name: 'Sev Puri', price: 12, originalPrice: 14.50, rating: 2.5, image: '/src/assets/arena/media/fuchka/fuchka-3.png', color: '#FFF9E6' },
      { id: 'f4', name: 'Papdi Chaat', price: 13, originalPrice: 15.50, rating: 2.5, image: '/src/assets/arena/media/fuchka/fuchka-4.png', color: '#F0FFE6' },
      { id: 'f5', name: 'Bhel Puri', price: 9, originalPrice: 11.50, rating: 2.5, image: '/src/assets/arena/media/fuchka/fuchka-5.png', color: '#FFE6F0' },
      { id: 'f6', name: 'Masala Puri', price: 14, originalPrice: 16.50, rating: 2.5, image: '/src/assets/arena/media/fuchka/fuchka-6.png', color: '#E6F7FF' },
      { id: 'f7', name: 'Aloo Tikki Chaat', price: 12, originalPrice: 14.00, rating: 2.5, image: '/src/assets/arena/media/fuchka/fuchka-7.png', color: '#FFF4E6' },
      { id: 'f8', name: 'Samosa Chaat', price: 15, originalPrice: 17.50, rating: 2.5, image: '/src/assets/arena/media/fuchka/fuchka-8.png', color: '#FFE8E8' },
      { id: 'f9', name: 'Dahi Bhalla', price: 13, originalPrice: 15.00, rating: 2.5, image: '/src/assets/arena/media/fuchka/fuchka-9.png', color: '#FFF9E6' },
      { id: 'f10', name: 'Ragda Pattice', price: 14, originalPrice: 16.00, rating: 2.5, image: '/src/assets/arena/media/fuchka/fuchka-10.png', color: '#F0FFE6' },
      { id: 'f11', name: 'Pav Bhaji', price: 16, originalPrice: 18.50, rating: 2.5, image: '/src/assets/arena/media/fuchka/fuchka-11.png', color: '#FFE6F0' },
      { id: 'f12', name: 'Vada Pav', price: 10, originalPrice: 12.00, rating: 2.5, image: '/src/assets/arena/media/fuchka/fuchka-12.png', color: '#E6F7FF' },
      { id: 'f13', name: 'Chole Bhature', price: 17, originalPrice: 19.50, rating: 2.5, image: '/src/assets/arena/media/fuchka/fuchka-13.png', color: '#FFF4E6' },
      { id: 'f14', name: 'Pani Puri Special', price: 15, originalPrice: 17.00, rating: 2.5, image: '/src/assets/arena/media/fuchka/fuchka-14.png', color: '#FFE8E8' },
      { id: 'f15', name: 'Raj Kachori', price: 18, originalPrice: 20.50, rating: 2.5, image: '/src/assets/arena/media/fuchka/fuchka-15.png', color: '#FFF9E6' },
      { id: 'f16', name: 'Chaat Platter', price: 20, originalPrice: 23.00, rating: 2.5, image: '/src/assets/arena/media/fuchka/fuchka-16.png', color: '#F0FFE6' }
    ],
    'Hot dog': [
      { id: 'h1', name: 'Classic Hot Dog', price: 8, originalPrice: 10.00, rating: 2.5, image: '/src/assets/arena/media/hotdog/hotdog-1.png', color: '#FFF4E6' },
      { id: 'h2', name: 'Chili Hot Dog', price: 10, originalPrice: 12.00, rating: 2.5, image: '/src/assets/arena/media/hotdog/hotdog-2.png', color: '#FFE8E8' },
      { id: 'h3', name: 'Cheese Hot Dog', price: 9, originalPrice: 11.00, rating: 2.5, image: '/src/assets/arena/media/hotdog/hotdog-3.png', color: '#FFF9E6' },
      { id: 'h4', name: 'Veggie Hot Dog', price: 7, originalPrice: 9.00, rating: 2.5, image: '/src/assets/arena/media/hotdog/hotdog-4.png', color: '#F0FFE6' },
      { id: 'h5', name: 'Jumbo Hot Dog', price: 12, originalPrice: 14.00, rating: 2.5, image: '/src/assets/arena/media/hotdog/hotdog-5.png', color: '#FFE6F0' },
      { id: 'h6', name: 'Gourmet Hot Dog', price: 15, originalPrice: 17.00, rating: 2.5, image: '/src/assets/arena/media/hotdog/hotdog-6.png', color: '#E6F7FF' },
      { id: 'h7', name: 'Chicago Hot Dog', price: 11, originalPrice: 13.50, rating: 2.5, image: '/src/assets/arena/media/hotdog/hotdog-7.png', color: '#FFF4E6' },
      { id: 'h8', name: 'New York Hot Dog', price: 10, originalPrice: 12.50, rating: 2.5, image: '/src/assets/arena/media/hotdog/hotdog-8.png', color: '#FFE8E8' },
      { id: 'h9', name: 'Corn Dog', price: 8, originalPrice: 10.50, rating: 2.5, image: '/src/assets/arena/media/hotdog/hotdog-9.png', color: '#FFF9E6' },
      { id: 'h10', name: 'Bacon Wrapped Hot Dog', price: 13, originalPrice: 15.50, rating: 2.5, image: '/src/assets/arena/media/hotdog/hotdog-10.png', color: '#F0FFE6' },
      { id: 'h11', name: 'Foot Long Hot Dog', price: 14, originalPrice: 16.00, rating: 2.5, image: '/src/assets/arena/media/hotdog/hotdog-11.png', color: '#FFE6F0' },
      { id: 'h12', name: 'Spicy Hot Dog', price: 10, originalPrice: 12.00, rating: 2.5, image: '/src/assets/arena/media/hotdog/hotdog-12.png', color: '#E6F7FF' },
      { id: 'h13', name: 'BBQ Hot Dog', price: 11, originalPrice: 13.00, rating: 2.5, image: '/src/assets/arena/media/hotdog/hotdog-13.png', color: '#FFF4E6' },
      { id: 'h14', name: 'Chili Cheese Hot Dog', price: 12, originalPrice: 14.50, rating: 2.5, image: '/src/assets/arena/media/hotdog/hotdog-14.png', color: '#FFE8E8' },
      { id: 'h15', name: 'Buffalo Hot Dog', price: 11, originalPrice: 13.50, rating: 2.5, image: '/src/assets/arena/media/hotdog/hotdog-15.png', color: '#FFF9E6' },
      { id: 'h16', name: 'Pretzel Hot Dog', price: 13, originalPrice: 15.00, rating: 2.5, image: '/src/assets/arena/media/hotdog/hotdog-16.png', color: '#F0FFE6' }
    ],
    Chicken: [
      { id: 'c1', name: 'Fried Chicken', price: 18, originalPrice: 22.00, rating: 2.5, image: '/src/assets/arena/media/chicken/chicken-1.png', color: '#FFF4E6' },
      { id: 'c2', name: 'Grilled Chicken', price: 20, originalPrice: 24.00, rating: 2.5, image: '/src/assets/arena/media/chicken/chicken-2.png', color: '#FFE8E8' },
      { id: 'c3', name: 'Spicy Chicken', price: 19, originalPrice: 23.00, rating: 2.5, image: '/src/assets/arena/media/chicken/chicken-3.png', color: '#FFF9E6' },
      { id: 'c4', name: 'Crispy Chicken', price: 21, originalPrice: 25.00, rating: 2.5, image: '/src/assets/arena/media/chicken/chicken-4.png', color: '#F0FFE6' },
      { id: 'c5', name: 'Honey Chicken', price: 22, originalPrice: 26.00, rating: 2.5, image: '/src/assets/arena/media/chicken/chicken-5.png', color: '#FFE6F0' },
      { id: 'c6', name: 'BBQ Chicken', price: 23, originalPrice: 27.00, rating: 2.5, image: '/src/assets/arena/media/chicken/chicken-6.png', color: '#E6F7FF' },
      { id: 'c7', name: 'Buffalo Chicken', price: 20, originalPrice: 24.50, rating: 2.5, image: '/src/assets/arena/media/chicken/chicken-7.png', color: '#FFF4E6' },
      { id: 'c8', name: 'Teriyaki Chicken', price: 21, originalPrice: 25.50, rating: 2.5, image: '/src/assets/arena/media/chicken/chicken-8.png', color: '#FFE8E8' },
      { id: 'c9', name: 'Lemon Chicken', price: 19, originalPrice: 23.50, rating: 2.5, image: '/src/assets/arena/media/chicken/chicken-9.png', color: '#FFF9E6' },
      { id: 'c10', name: 'Garlic Chicken', price: 20, originalPrice: 24.00, rating: 2.5, image: '/src/assets/arena/media/chicken/chicken-10.png', color: '#F0FFE6' },
      { id: 'c11', name: 'Chicken Wings', price: 18, originalPrice: 22.50, rating: 2.5, image: '/src/assets/arena/media/chicken/chicken-11.png', color: '#FFE6F0' },
      { id: 'c12', name: 'Chicken Tenders', price: 17, originalPrice: 21.00, rating: 2.5, image: '/src/assets/arena/media/chicken/chicken-12.png', color: '#E6F7FF' },
      { id: 'c13', name: 'Chicken Nuggets', price: 15, originalPrice: 19.00, rating: 2.5, image: '/src/assets/arena/media/chicken/chicken-13.png', color: '#FFF4E6' },
      { id: 'c14', name: 'Chicken Popcorn', price: 16, originalPrice: 20.00, rating: 2.5, image: '/src/assets/arena/media/chicken/chicken-14.png', color: '#FFE8E8' },
      { id: 'c15', name: 'Rotisserie Chicken', price: 24, originalPrice: 28.00, rating: 2.5, image: '/src/assets/arena/media/chicken/chicken-15.png', color: '#FFF9E6' },
      { id: 'c16', name: 'Chicken Katsu', price: 22, originalPrice: 26.50, rating: 2.5, image: '/src/assets/arena/media/chicken/chicken-16.png', color: '#F0FFE6' }
    ],
    Tacos: [
      { id: 't1', name: 'Beef Tacos', price: 14, originalPrice: 17.00, rating: 2.5, image: '/src/assets/arena/media/tacos/tacos-1.png', color: '#FFF4E6' },
      { id: 't2', name: 'Chicken Tacos', price: 13, originalPrice: 16.00, rating: 2.5, image: '/src/assets/arena/media/tacos/tacos-2.png', color: '#FFE8E8' },
      { id: 't3', name: 'Fish Tacos', price: 16, originalPrice: 19.00, rating: 2.5, image: '/src/assets/arena/media/tacos/tacos-3.png', color: '#FFF9E6' },
      { id: 't4', name: 'Shrimp Tacos', price: 18, originalPrice: 21.00, rating: 2.5, image: '/src/assets/arena/media/tacos/tacos-4.png', color: '#F0FFE6' },
      { id: 't5', name: 'Veggie Tacos', price: 12, originalPrice: 15.00, rating: 2.5, image: '/src/assets/arena/media/tacos/tacos-5.png', color: '#FFE6F0' },
      { id: 't6', name: 'Pork Tacos', price: 15, originalPrice: 18.00, rating: 2.5, image: '/src/assets/arena/media/tacos/tacos-6.png', color: '#E6F7FF' },
      { id: 't7', name: 'Carnitas Tacos', price: 17, originalPrice: 20.00, rating: 2.5, image: '/src/assets/arena/media/tacos/tacos-7.png', color: '#FFF4E6' },
      { id: 't8', name: 'Al Pastor Tacos', price: 16, originalPrice: 19.00, rating: 2.5, image: '/src/assets/arena/media/tacos/tacos-8.png', color: '#FFE8E8' },
      { id: 't9', name: 'Barbacoa Tacos', price: 18, originalPrice: 21.50, rating: 2.5, image: '/src/assets/arena/media/tacos/tacos-9.png', color: '#FFF9E6' },
      { id: 't10', name: 'Carne Asada Tacos', price: 19, originalPrice: 22.50, rating: 2.5, image: '/src/assets/arena/media/tacos/tacos-10.png', color: '#F0FFE6' },
      { id: 't11', name: 'Chorizo Tacos', price: 15, originalPrice: 18.50, rating: 2.5, image: '/src/assets/arena/media/tacos/tacos-11.png', color: '#FFE6F0' },
      { id: 't12', name: 'Birria Tacos', price: 20, originalPrice: 24.00, rating: 2.5, image: '/src/assets/arena/media/tacos/tacos-12.png', color: '#E6F7FF' },
      { id: 't13', name: 'Lengua Tacos', price: 17, originalPrice: 20.50, rating: 2.5, image: '/src/assets/arena/media/tacos/tacos-13.png', color: '#FFF4E6' },
      { id: 't14', name: 'Breakfast Tacos', price: 11, originalPrice: 14.00, rating: 2.5, image: '/src/assets/arena/media/tacos/tacos-14.png', color: '#FFE8E8' },
      { id: 't15', name: 'Street Tacos', price: 13, originalPrice: 16.50, rating: 2.5, image: '/src/assets/arena/media/tacos/tacos-15.png', color: '#FFF9E6' },
      { id: 't16', name: 'Taco Platter', price: 22, originalPrice: 26.00, rating: 2.5, image: '/src/assets/arena/media/tacos/tacos-16.png', color: '#F0FFE6' }
    ],
    Drinks: [
      { id: 'dr1', name: 'Cola', price: 3, originalPrice: 5.00, rating: 2.5, image: '/src/assets/arena/media/drinks/drink-1.png', color: '#FFF4E6' },
      { id: 'dr2', name: 'Orange Juice', price: 4, originalPrice: 6.00, rating: 2.5, image: '/src/assets/arena/media/drinks/drink-2.png', color: '#FFE8E8' },
      { id: 'dr3', name: 'Lemonade', price: 4, originalPrice: 6.00, rating: 2.5, image: '/src/assets/arena/media/drinks/drink-3.png', color: '#FFF9E6' },
      { id: 'dr4', name: 'Iced Tea', price: 3, originalPrice: 5.50, rating: 2.5, image: '/src/assets/arena/media/drinks/drink-4.png', color: '#F0FFE6' },
      { id: 'dr5', name: 'Mineral Water', price: 2, originalPrice: 4.00, rating: 2.5, image: '/src/assets/arena/media/drinks/drink-5.png', color: '#FFE6F0' },
      { id: 'dr6', name: 'Smoothie', price: 6, originalPrice: 8.50, rating: 2.5, image: '/src/assets/arena/media/drinks/drink-6.png', color: '#E6F7FF' },
      { id: 'dr7', name: 'Milkshake', price: 7, originalPrice: 9.50, rating: 2.5, image: '/src/assets/arena/media/drinks/drink-7.png', color: '#FFF4E6' },
      { id: 'dr8', name: 'Hot Chocolate', price: 5, originalPrice: 7.00, rating: 2.5, image: '/src/assets/arena/media/drinks/drink-8.png', color: '#FFE8E8' },
      { id: 'dr9', name: 'Apple Juice', price: 4, originalPrice: 6.50, rating: 2.5, image: '/src/assets/arena/media/drinks/drink-9.png', color: '#FFF9E6' },
      { id: 'dr10', name: 'Grape Juice', price: 4, originalPrice: 6.50, rating: 2.5, image: '/src/assets/arena/media/drinks/drink-10.png', color: '#F0FFE6' },
      { id: 'dr11', name: 'Cranberry Juice', price: 5, originalPrice: 7.00, rating: 2.5, image: '/src/assets/arena/media/drinks/drink-11.png', color: '#FFE6F0' },
      { id: 'dr12', name: 'Pineapple Juice', price: 5, originalPrice: 7.50, rating: 2.5, image: '/src/assets/arena/media/drinks/drink-12.png', color: '#E6F7FF' },
      { id: 'dr13', name: 'Mango Juice', price: 5, originalPrice: 7.50, rating: 2.5, image: '/src/assets/arena/media/drinks/drink-13.png', color: '#FFF4E6' },
      { id: 'dr14', name: 'Sparkling Water', price: 3, originalPrice: 5.00, rating: 2.5, image: '/src/assets/arena/media/drinks/drink-14.png', color: '#FFE8E8' },
      { id: 'dr15', name: 'Lime Soda', price: 4, originalPrice: 6.00, rating: 2.5, image: '/src/assets/arena/media/drinks/drink-15.png', color: '#FFF9E6' },
      { id: 'dr16', name: 'Fresh Coconut Water', price: 6, originalPrice: 8.00, rating: 2.5, image: '/src/assets/arena/media/drinks/drink-16.png', color: '#F0FFE6' }
    ],
    Coffee: [
      { id: 'cf1', name: 'Espresso', price: 4, originalPrice: 6.00, rating: 2.5, image: '/src/assets/arena/media/coffee/coffee-1.png', color: '#FFF4E6' },
      { id: 'cf2', name: 'Cappuccino', price: 5, originalPrice: 7.00, rating: 2.5, image: '/src/assets/arena/media/coffee/coffee-2.png', color: '#FFE8E8' },
      { id: 'cf3', name: 'Latte', price: 5, originalPrice: 7.50, rating: 2.5, image: '/src/assets/arena/media/coffee/coffee-3.png', color: '#FFF9E6' },
      { id: 'cf4', name: 'Americano', price: 4, originalPrice: 6.50, rating: 2.5, image: '/src/assets/arena/media/coffee/coffee-4.png', color: '#F0FFE6' },
      { id: 'cf5', name: 'Mocha', price: 6, originalPrice: 8.00, rating: 2.5, image: '/src/assets/arena/media/coffee/coffee-5.png', color: '#FFE6F0' },
      { id: 'cf6', name: 'Macchiato', price: 5, originalPrice: 7.00, rating: 2.5, image: '/src/assets/arena/media/coffee/coffee-6.png', color: '#E6F7FF' },
      { id: 'cf7', name: 'Flat White', price: 5, originalPrice: 7.50, rating: 2.5, image: '/src/assets/arena/media/coffee/coffee-7.png', color: '#FFF4E6' },
      { id: 'cf8', name: 'Caramel Latte', price: 6, originalPrice: 8.50, rating: 2.5, image: '/src/assets/arena/media/coffee/coffee-8.png', color: '#FFE8E8' },
      { id: 'cf9', name: 'Iced Coffee', price: 5, originalPrice: 7.00, rating: 2.5, image: '/src/assets/arena/media/coffee/coffee-9.png', color: '#FFF9E6' },
      { id: 'cf10', name: 'Cold Brew', price: 6, originalPrice: 8.00, rating: 2.5, image: '/src/assets/arena/media/coffee/coffee-10.png', color: '#F0FFE6' },
      { id: 'cf11', name: 'Frappuccino', price: 7, originalPrice: 9.50, rating: 2.5, image: '/src/assets/arena/media/coffee/coffee-11.png', color: '#FFE6F0' },
      { id: 'cf12', name: 'Turkish Coffee', price: 5, originalPrice: 7.50, rating: 2.5, image: '/src/assets/arena/media/coffee/coffee-12.png', color: '#E6F7FF' },
      { id: 'cf13', name: 'Irish Coffee', price: 8, originalPrice: 10.50, rating: 2.5, image: '/src/assets/arena/media/coffee/coffee-13.png', color: '#FFF4E6' },
      { id: 'cf14', name: 'Vanilla Latte', price: 6, originalPrice: 8.50, rating: 2.5, image: '/src/assets/arena/media/coffee/coffee-14.png', color: '#FFE8E8' },
      { id: 'cf15', name: 'Hazelnut Coffee', price: 6, originalPrice: 8.00, rating: 2.5, image: '/src/assets/arena/media/coffee/coffee-15.png', color: '#FFF9E6' },
      { id: 'cf16', name: 'Affogato', price: 7, originalPrice: 9.00, rating: 2.5, image: '/src/assets/arena/media/coffee/coffee-16.png', color: '#F0FFE6' }
    ],
    Pasta: [
      { id: 'pa1', name: 'Spaghetti Carbonara', price: 22, originalPrice: 26.00, rating: 2.5, image: '/src/assets/arena/media/pasta/pasta-1.png', color: '#FFF4E6' },
      { id: 'pa2', name: 'Fettuccine Alfredo', price: 24, originalPrice: 28.00, rating: 2.5, image: '/src/assets/arena/media/pasta/pasta-2.png', color: '#FFE8E8' },
      { id: 'pa3', name: 'Penne Arrabiata', price: 20, originalPrice: 24.00, rating: 2.5, image: '/src/assets/arena/media/pasta/pasta-3.png', color: '#FFF9E6' },
      { id: 'pa4', name: 'Lasagna', price: 26, originalPrice: 30.00, rating: 2.5, image: '/src/assets/arena/media/pasta/pasta-4.png', color: '#F0FFE6' },
      { id: 'pa5', name: 'Mac and Cheese', price: 18, originalPrice: 22.00, rating: 2.5, image: '/src/assets/arena/media/pasta/pasta-5.png', color: '#FFE6F0' },
      { id: 'pa6', name: 'Spaghetti Bolognese', price: 23, originalPrice: 27.00, rating: 2.5, image: '/src/assets/arena/media/pasta/pasta-6.png', color: '#E6F7FF' },
      { id: 'pa7', name: 'Pesto Pasta', price: 21, originalPrice: 25.00, rating: 2.5, image: '/src/assets/arena/media/pasta/pasta-7.png', color: '#FFF4E6' },
      { id: 'pa8', name: 'Ravioli', price: 25, originalPrice: 29.00, rating: 2.5, image: '/src/assets/arena/media/pasta/pasta-8.png', color: '#FFE8E8' },
      { id: 'pa9', name: 'Linguine Seafood', price: 28, originalPrice: 32.00, rating: 2.5, image: '/src/assets/arena/media/pasta/pasta-9.png', color: '#FFF9E6' },
      { id: 'pa10', name: 'Tortellini', price: 24, originalPrice: 28.50, rating: 2.5, image: '/src/assets/arena/media/pasta/pasta-10.png', color: '#F0FFE6' },
      { id: 'pa11', name: 'Rigatoni', price: 22, originalPrice: 26.50, rating: 2.5, image: '/src/assets/arena/media/pasta/pasta-11.png', color: '#FFE6F0' },
      { id: 'pa12', name: 'Aglio e Olio', price: 19, originalPrice: 23.00, rating: 2.5, image: '/src/assets/arena/media/pasta/pasta-12.png', color: '#E6F7FF' },
      { id: 'pa13', name: 'Pasta Primavera', price: 21, originalPrice: 25.50, rating: 2.5, image: '/src/assets/arena/media/pasta/pasta-13.png', color: '#FFF4E6' },
      { id: 'pa14', name: 'Cacio e Pepe', price: 20, originalPrice: 24.50, rating: 2.5, image: '/src/assets/arena/media/pasta/pasta-14.png', color: '#FFE8E8' },
      { id: 'pa15', name: 'Gnocchi', price: 23, originalPrice: 27.50, rating: 2.5, image: '/src/assets/arena/media/pasta/pasta-15.png', color: '#FFF9E6' },
      { id: 'pa16', name: 'Pasta Amatriciana', price: 24, originalPrice: 28.50, rating: 2.5, image: '/src/assets/arena/media/pasta/pasta-16.png', color: '#F0FFE6' }
    ],
    Snacks: [
      { id: 'sn1', name: 'Nachos', price: 8, originalPrice: 11.00, rating: 2.5, image: '/src/assets/arena/media/snacks/snack-1.png', color: '#FFF4E6' },
      { id: 'sn2', name: 'Onion Rings', price: 7, originalPrice: 10.00, rating: 2.5, image: '/src/assets/arena/media/snacks/snack-2.png', color: '#FFE8E8' },
      { id: 'sn3', name: 'Mozzarella Sticks', price: 9, originalPrice: 12.00, rating: 2.5, image: '/src/assets/arena/media/snacks/snack-3.png', color: '#FFF9E6' },
      { id: 'sn4', name: 'Chicken Wings', price: 12, originalPrice: 15.00, rating: 2.5, image: '/src/assets/arena/media/snacks/snack-4.png', color: '#F0FFE6' },
      { id: 'sn5', name: 'Spring Rolls', price: 8, originalPrice: 11.50, rating: 2.5, image: '/src/assets/arena/media/snacks/snack-5.png', color: '#FFE6F0' },
      { id: 'sn6', name: 'Popcorn', price: 5, originalPrice: 7.50, rating: 2.5, image: '/src/assets/arena/media/snacks/snack-6.png', color: '#E6F7FF' },
      { id: 'sn7', name: 'Pretzels', price: 6, originalPrice: 8.50, rating: 2.5, image: '/src/assets/arena/media/snacks/snack-7.png', color: '#FFF4E6' },
      { id: 'sn8', name: 'Jalapeño Poppers', price: 10, originalPrice: 13.00, rating: 2.5, image: '/src/assets/arena/media/snacks/snack-8.png', color: '#FFE8E8' },
      { id: 'sn9', name: 'Buffalo Wings', price: 13, originalPrice: 16.00, rating: 2.5, image: '/src/assets/arena/media/snacks/snack-9.png', color: '#FFF9E6' },
      { id: 'sn10', name: 'Quesadillas', price: 11, originalPrice: 14.50, rating: 2.5, image: '/src/assets/arena/media/snacks/snack-10.png', color: '#F0FFE6' },
      { id: 'sn11', name: 'Chips and Salsa', price: 6, originalPrice: 9.00, rating: 2.5, image: '/src/assets/arena/media/snacks/snack-11.png', color: '#FFE6F0' },
      { id: 'sn12', name: 'Guacamole and Chips', price: 9, originalPrice: 12.50, rating: 2.5, image: '/src/assets/arena/media/snacks/snack-12.png', color: '#E6F7FF' },
      { id: 'sn13', name: 'Calamari', price: 14, originalPrice: 17.50, rating: 2.5, image: '/src/assets/arena/media/snacks/snack-13.png', color: '#FFF4E6' },
      { id: 'sn14', name: 'Edamame', price: 7, originalPrice: 10.00, rating: 2.5, image: '/src/assets/arena/media/snacks/snack-14.png', color: '#FFE8E8' },
      { id: 'sn15', name: 'Loaded Fries', price: 10, originalPrice: 13.50, rating: 2.5, image: '/src/assets/arena/media/snacks/snack-15.png', color: '#FFF9E6' },
      { id: 'sn16', name: 'Samosas', price: 8, originalPrice: 11.00, rating: 2.5, image: '/src/assets/arena/media/snacks/snack-16.png', color: '#F0FFE6' }
    ],
    'Energy Drinks': [
      { id: 'en1', name: 'Red Bull', price: 5, originalPrice: 7.00, rating: 2.5, image: '/src/assets/arena/media/energy/energy-1.png', color: '#FFF4E6' },
      { id: 'en2', name: 'Monster Energy', price: 5, originalPrice: 7.50, rating: 2.5, image: '/src/assets/arena/media/energy/energy-2.png', color: '#FFE8E8' },
      { id: 'en3', name: 'Rockstar', price: 5, originalPrice: 7.00, rating: 2.5, image: '/src/assets/arena/media/energy/energy-3.png', color: '#FFF9E6' },
      { id: 'en4', name: 'Bang Energy', price: 6, originalPrice: 8.00, rating: 2.5, image: '/src/assets/arena/media/energy/energy-4.png', color: '#F0FFE6' },
      { id: 'en5', name: 'Celsius', price: 6, originalPrice: 8.50, rating: 2.5, image: '/src/assets/arena/media/energy/energy-5.png', color: '#FFE6F0' },
      { id: 'en6', name: 'NOS Energy', price: 5, originalPrice: 7.50, rating: 2.5, image: '/src/assets/arena/media/energy/energy-6.png', color: '#E6F7FF' },
      { id: 'en7', name: 'Full Throttle', price: 5, originalPrice: 7.00, rating: 2.5, image: '/src/assets/arena/media/energy/energy-7.png', color: '#FFF4E6' },
      { id: 'en8', name: 'Amp Energy', price: 5, originalPrice: 7.50, rating: 2.5, image: '/src/assets/arena/media/energy/energy-8.png', color: '#FFE8E8' },
      { id: 'en9', name: '5-hour Energy', price: 4, originalPrice: 6.00, rating: 2.5, image: '/src/assets/arena/media/energy/energy-9.png', color: '#FFF9E6' },
      { id: 'en10', name: 'Reign Energy', price: 6, originalPrice: 8.00, rating: 2.5, image: '/src/assets/arena/media/energy/energy-10.png', color: '#F0FFE6' },
      {id: 'en11', name: 'Prime Energy', price: 6, originalPrice: 8.50, rating: 2.5, image: '/src/assets/arena/media/energy/energy-11.png', color: '#FFE6F0' },
      { id: 'en12', name: 'Gfuel', price: 7, originalPrice: 9.00, rating: 2.5, image: '/src/assets/arena/media/energy/energy-12.png', color: '#E6F7FF' },
      { id: 'en13', name: 'C4 Energy', price: 6, originalPrice: 8.00, rating: 2.5, image: '/src/assets/arena/media/energy/energy-13.png', color: '#FFF4E6' },
      { id: 'en14', name: 'Xyience', price: 5, originalPrice: 7.50, rating: 2.5, image: '/src/assets/arena/media/energy/energy-14.png', color: '#FFE8E8' },
      { id: 'en15', name: 'Guru Energy', price: 6, originalPrice: 8.50, rating: 2.5, image: '/src/assets/arena/media/energy/energy-15.png', color: '#FFF9E6' },
      { id: 'en16', name: 'Zevia Energy', price: 5, originalPrice: 7.00, rating: 2.5, image: '/src/assets/arena/media/energy/energy-16.png', color: '#F0FFE6' }
    ],
    Desserts: [
      { id: 'ds1', name: 'Chocolate Cake', price: 12, originalPrice: 15.00, rating: 2.5, image: '/src/assets/arena/media/desserts/dessert-1.png', color: '#FFF4E6' },
      { id: 'ds2', name: 'Cheesecake', price: 14, originalPrice: 17.00, rating: 2.5, image: '/src/assets/arena/media/desserts/dessert-2.png', color: '#FFE8E8' },
      { id: 'ds3', name: 'Tiramisu', price: 13, originalPrice: 16.00, rating: 2.5, image: '/src/assets/arena/media/desserts/dessert-3.png', color: '#FFF9E6' },
      { id: 'ds4', name: 'Brownie', price: 10, originalPrice: 13.00, rating: 2.5, image: '/src/assets/arena/media/desserts/dessert-4.png', color: '#F0FFE6' },
      { id: 'ds5', name: 'Apple Pie', price: 11, originalPrice: 14.00, rating: 2.5, image: '/src/assets/arena/media/desserts/dessert-5.png', color: '#FFE6F0' },
      { id: 'ds6', name: 'Panna Cotta', price: 12, originalPrice: 15.50, rating: 2.5, image: '/src/assets/arena/media/desserts/dessert-6.png', color: '#E6F7FF' },
      { id: 'ds7', name: 'Crème Brûlée', price: 15, originalPrice: 18.00, rating: 2.5, image: '/src/assets/arena/media/desserts/dessert-7.png', color: '#FFF4E6' },
      { id: 'ds8', name: 'Macarons', price: 16, originalPrice: 19.00, rating: 2.5, image: '/src/assets/arena/media/desserts/dessert-8.png', color: '#FFE8E8' },
      { id: 'ds9', name: 'Cupcakes', price: 9, originalPrice: 12.00, rating: 2.5, image: '/src/assets/arena/media/desserts/dessert-9.png', color: '#FFF9E6' },
      { id: 'ds10', name: 'Churros', price: 8, originalPrice: 11.00, rating: 2.5, image: '/src/assets/arena/media/desserts/dessert-10.png', color: '#F0FFE6' },
      { id: 'ds11', name: 'Flan', price: 10, originalPrice: 13.50, rating: 2.5, image: '/src/assets/arena/media/desserts/dessert-11.png', color: '#FFE6F0' },
      { id: 'ds12', name: 'Pavlova', price: 13, originalPrice: 16.50, rating: 2.5, image: '/src/assets/arena/media/desserts/dessert-12.png', color: '#E6F7FF' },
      { id: 'ds13', name: 'Gelato', price: 11, originalPrice: 14.50, rating: 2.5, image: '/src/assets/arena/media/desserts/dessert-13.png', color: '#FFF4E6' },
      { id: 'ds14', name: 'Baklava', price: 12, originalPrice: 15.00, rating: 2.5, image: '/src/assets/arena/media/desserts/dessert-14.png', color: '#FFE8E8' },
      { id: 'ds15', name: 'Mousse', price: 11, originalPrice: 14.00, rating: 2.5, image: '/src/assets/arena/media/desserts/dessert-15.png', color: '#FFF9E6' },
      { id: 'ds16', name: 'Tres Leches', price: 13, originalPrice: 16.00, rating: 2.5, image: '/src/assets/arena/media/desserts/dessert-16.png', color: '#F0FFE6' }
    ],
    Sushi: [
      { id: 'su1', name: 'California Roll', price: 18, originalPrice: 22.00, rating: 2.5, image: '/src/assets/arena/media/sushi/sushi-1.png', color: '#FFF4E6' },
      { id: 'su2', name: 'Spicy Tuna Roll', price: 20, originalPrice: 24.00, rating: 2.5, image: '/src/assets/arena/media/sushi/sushi-2.png', color: '#FFE8E8' },
      { id: 'su3', name: 'Dragon Roll', price: 24, originalPrice: 28.00, rating: 2.5, image: '/src/assets/arena/media/sushi/sushi-3.png', color: '#FFF9E6' },
      { id: 'su4', name: 'Rainbow Roll', price: 25, originalPrice: 29.00, rating: 2.5, image: '/src/assets/arena/media/sushi/sushi-4.png', color: '#F0FFE6' },
      { id: 'su5', name: 'Philadelphia Roll', price: 19, originalPrice: 23.00, rating: 2.5, image: '/src/assets/arena/media/sushi/sushi-5.png', color: '#FFE6F0' },
      { id: 'su6', name: 'Salmon Nigiri', price: 16, originalPrice: 20.00, rating: 2.5, image: '/src/assets/arena/media/sushi/sushi-6.png', color: '#E6F7FF' },
      { id: 'su7', name: 'Tuna Nigiri', price: 17, originalPrice: 21.00, rating: 2.5, image: '/src/assets/arena/media/sushi/sushi-7.png', color: '#FFF4E6' },
      { id: 'su8', name: 'Eel Roll', price: 22, originalPrice: 26.00, rating: 2.5, image: '/src/assets/arena/media/sushi/sushi-8.png', color: '#FFE8E8' },
      { id: 'su9', name: 'Shrimp Tempura Roll', price: 21, originalPrice: 25.00, rating: 2.5, image: '/src/assets/arena/media/sushi/sushi-9.png', color: '#FFF9E6' },
      { id: 'su10', name: 'Vegetable Roll', price: 15, originalPrice: 19.00, rating: 2.5, image: '/src/assets/arena/media/sushi/sushi-10.png', color: '#F0FFE6' },
      { id: 'su11', name: 'Spider Roll', price: 23, originalPrice: 27.00, rating: 2.5, image: '/src/assets/arena/media/sushi/sushi-11.png', color: '#FFE6F0' },
      { id: 'su12', name: 'Salmon Sashimi', price: 20, originalPrice: 24.50, rating: 2.5, image: '/src/assets/arena/media/sushi/sushi-12.png', color: '#E6F7FF' },
      { id: 'su13', name: 'Tuna Sashimi', price: 21, originalPrice: 25.50, rating: 2.5, image: '/src/assets/arena/media/sushi/sushi-13.png', color: '#FFF4E6' },
      { id: 'su14', name: 'Yellowtail Roll', price: 22, originalPrice: 26.50, rating: 2.5, image: '/src/assets/arena/media/sushi/sushi-14.png', color: '#FFE8E8' },
      { id: 'su15', name: 'Boston Roll', price: 19, originalPrice: 23.50, rating: 2.5, image: '/src/assets/arena/media/sushi/sushi-15.png', color: '#FFF9E6' },
      { id: 'su16', name: 'Sushi Platter', price: 45, originalPrice: 52.00, rating: 2.5, image: '/src/assets/arena/media/sushi/sushi-16.png', color: '#F0FFE6' }
    ]
  };

  const addToCart = (product: Product): void => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => 
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (id: string, delta: number): void => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (id: string): void => {
    setCart(cart.filter(item => item.id !== id));
  };

  const subTotal: number = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax: number = 6;
  const total: number = subTotal - tax;

  const currentProducts: Product[] = products[selectedCategory];

  const visibleCategories = showAllCategories ? categories : categories.slice(0, 8);
  const desktopVisibleCategories = categories.slice(0, 8);
  const desktopSecondRowCategories = categories.slice(8);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden pt-0 xl:pt-20 lg:pt-24">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-[1600px] mx-auto p-4 xl:p-6 lg:p-8">
            <div className="flex gap-4 mb-6 xl:mb-8">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search food"
                  className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <button className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl flex items-center gap-2 hover:shadow-lg transition-all">
                <SlidersHorizontal size={20} />
                <span className="hidden sm:inline">Filter</span>
              </button>
            </div>

            <div className="mb-6 xl:mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 xl:mb-6">Explore Categories</h2>
              
              <div className="hidden xl:block">
                <div className="grid grid-cols-8 gap-3 mb-3">
                  {desktopVisibleCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`p-4 rounded-2xl border-2 transition-all flex items-center gap-3 ${
                        selectedCategory === category.id
                          ? 'border-orange-400 bg-orange-50 shadow-md'
                          : 'border-gray-200 bg-white hover:border-orange-200 hover:shadow-sm'
                      }`}
                    >
                      <img src={category.emoji} alt={category.name} className="w-10 h-10 object-contain flex-shrink-0" />
                      <span className="text-sm font-medium text-gray-700">{category.name}</span>
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-8 gap-3">
                  {desktopSecondRowCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`p-4 rounded-2xl border-2 transition-all flex items-center gap-3 ${
                        selectedCategory === category.id
                          ? 'border-orange-400 bg-orange-50 shadow-md'
                          : 'border-gray-200 bg-white hover:border-orange-200 hover:shadow-sm'
                      }`}
                    >
                      <img src={category.emoji} alt={category.name} className="w-10 h-10 object-contain flex-shrink-0" />
                      <span className="text-sm font-medium text-gray-700">{category.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="xl:hidden">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {visibleCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`p-4 rounded-2xl border-2 transition-all flex items-center gap-3 ${
                        selectedCategory === category.id
                          ? 'border-orange-400 bg-orange-50 shadow-md'
                          : 'border-gray-200 bg-white hover:border-orange-200 hover:shadow-sm'
                      }`}
                    >
                      <img src={category.emoji} alt={category.name} className="w-10 h-10 object-contain flex-shrink-0" />
                      <span className="text-sm font-medium text-gray-700">{category.name}</span>
                    </button>
                  ))}
                </div>
                
                {categories.length > 8 && (
                  <div className="mt-4 flex justify-center">
                    <button
                      onClick={() => setShowAllCategories(!showAllCategories)}
                      className="px-6 py-3 bg-white border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:border-orange-400 hover:bg-orange-50 transition-all flex items-center gap-2"
                    >
                      {showAllCategories ? 'Show Less' : 'Show More'}
                      <ChevronDown 
                        size={20} 
                        className={`transition-transform ${showAllCategories ? 'rotate-180' : ''}`}
                      />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-8 mb-4 xl:mb-6 border-b border-gray-200">
              <button 
                onClick={() => setActiveTab('popular')}
                className={`pb-3 font-semibold transition-all ${
                  activeTab === 'popular' 
                    ? 'text-gray-900 border-b-2 border-orange-500' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                Popular
              </button>
              <button 
                onClick={() => setActiveTab('recent')}
                className={`pb-3 font-semibold transition-all ${
                  activeTab === 'recent' 
                    ? 'text-gray-900 border-b-2 border-orange-500' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                Recent
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5 pb-8">
              {currentProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-xl transition-all hover:-translate-y-1">
                  <div className="relative mb-4">
                    <button className="absolute top-2 left-2 w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center z-10 hover:scale-110 transition-transform">
                      <Heart size={16} className="text-white" strokeWidth={2.5} fill="white" />
                    </button>
                    
                    <div className="h-48 flex items-center justify-center rounded-xl overflow-hidden bg-gray-100">
                      <img src={product.image} alt={product.name} className="w-40 h-40 object-contain" />
                    </div>
                  </div>
                  
                  <h3 className="font-bold text-gray-900 mb-3 text-lg leading-tight">{product.name}</h3>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-orange-500 font-bold text-2xl">${product.price}</span>
                    <span className="text-gray-400 text-sm line-through">${product.originalPrice.toFixed(2)}</span>
                    <div className="flex items-center gap-1 ml-auto">
                      <Star size={15} className="fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-gray-500 font-medium">{product.rating}K+</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <button className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all">
                      Wishlist
                    </button>
                    <button
                      onClick={() => addToCart(product)}
                      className="flex-1 px-4 py-2.5 bg-orange-500 text-white rounded-lg text-sm font-semibold hover:bg-orange-600 transition-all"
                    >
                      Order Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="hidden xl:block w-96 bg-white border-l border-gray-100 overflow-y-auto shadow-sm">
        <div className="p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Invoice</h3>
          
          <div className="space-y-3 mb-8 min-h-[200px]">
            {cart.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart size={32} className="text-gray-300" />
                </div>
                <p className="text-gray-400 text-sm">No items in cart</p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="flex items-center gap-4 bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-all">
                  <div className="w-16 h-16 flex items-center justify-center rounded-xl overflow-hidden flex-shrink-0" style={{ backgroundColor: item.color }}>
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 text-sm truncate mb-1">{item.name}</h4>
                    <p className="text-orange-500 font-bold text-base">${item.price}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => updateQuantity(item.id, -1)} 
                      className="w-8 h-8 bg-white border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-all"
                    >
                      <Minus size={14} className="text-gray-600" />
                    </button>
                    <span className="font-bold w-8 text-center text-sm">{item.quantity}</span>
                    <button 
                      onClick={() => addToCart(item)} 
                      className="w-8 h-8 bg-orange-500 text-white rounded-lg flex items-center justify-center hover:bg-orange-600 transition-all"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <button 
                    onClick={() => removeFromCart(item.id)} 
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="border-t border-gray-100 pt-6 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Payment Summary</h3>
            
            <div className="space-y-4 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Sub Total</span>
                <span className="font-bold text-gray-900 text-lg">${subTotal}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Tax</span>
                <span className="font-bold text-gray-900 text-lg">-${tax}</span>
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <span className="font-bold text-gray-900 text-base">Total Payment</span>
                <span className="font-bold text-gray-900 text-2xl">${total}</span>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Payment Method</h3>
            
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setSelectedPayment('visa')}
                className={`p-4 rounded-2xl border-2 transition-all ${
                  selectedPayment === 'visa'
                    ? 'border-blue-800 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <img src="/src/assets/arena/media/payments/visa.png" alt="Visa" className="w-12 h-8 object-contain rounded-lg" />
                  <span className="text-sm font-semibold text-gray-900">VISA</span>
                </div>
              </button>

              <button
                onClick={() => setSelectedPayment('mastercard')}
                className={`p-4 rounded-2xl border-2 transition-all ${
                  selectedPayment === 'mastercard'
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <img src="/src/assets/arena/media/payments/mastercard.png" alt="Mastercard" className="w-12 h-8 object-contain rounded-lg" />
                  <span className="text-sm font-semibold text-gray-900">Mastercard</span>
                </div>
              </button>

              <button
                onClick={() => setSelectedPayment('american')}
                className={`p-4 rounded-2xl border-2 transition-all ${
                  selectedPayment === 'american'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <img src="/src/assets/arena/media/payments/american.png" alt="American Express" className="w-12 h-8 object-contain rounded-lg" />
                  <span className="text-sm font-semibold text-gray-900">American</span>
                </div>
              </button>
              
              <button
                onClick={() => setSelectedPayment('paypal')}
                className={`p-4 rounded-2xl border-2 transition-all ${
                  selectedPayment === 'paypal'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <img src="/src/assets/arena/media/payments/paypal.png" alt="PayPal" className="w-12 h-8 object-contain rounded-lg" />
                  <span className="text-sm font-semibold text-gray-900">PayPal</span>
                </div>
              </button>
            </div>
          </div>

          <button className="w-full py-4 bg-orange-500 text-white rounded-xl font-bold text-base hover:bg-orange-600 transition-all">
            Place An Order Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodOrderApp;
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  SlidersHorizontal, 
  Star, 
  Heart, 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  ChevronDown, 
  CheckCircle, 
  X, 
  CreditCard 
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { products as initialProducts } from '@/data/products';
import { useTheme } from '@/context/ThemeContext';
import type { Category, Product, CartItem } from '@/types';

// ==================== Types ====================
interface PaymentCard {
  id: string;
  card_number: string;
  card_holder: string;
  expiry_date: string;
  card_type: string;
}

interface CategoryItem {
  id: Category;
  name: string;
  emoji: string;
}

interface ToastState {
  visible: boolean;
  product: Product | null;
}

// Tipo extendido para productos con categoría
interface ProductWithCategory extends Product {
  category: Category;
}

// ==================== Constants ====================
const CATEGORIES: CategoryItem[] = [
  { id: 'Donuts', name: 'Donuts', emoji: '/images/arena/media/donut/donut.png' },
  { id: 'Burger', name: 'Burger', emoji: '/images/arena/media/burger/burger.png' },
  { id: 'Ice', name: 'Ice', emoji: '/images/arena/media/ice/ice.png' },
  { id: 'Potato', name: 'Potato', emoji: '/images/arena/media/potato/potato.png' },
  { id: 'Pizza', name: 'Pizza', emoji: '/images/arena/media/pizza/pizza.png' },
  { id: 'Fuchka', name: 'Fuchka', emoji: '/images/arena/media/fuchka/fuchka.png' },
  { id: 'Hot dog', name: 'Hot dog', emoji: '/images/arena/media/hotdog/hotdog.png' },
  { id: 'Chicken', name: 'Chicken', emoji: '/images/arena/media/chicken/chicken.png' },
  { id: 'Tacos', name: 'Tacos', emoji: '/images/arena/media/tacos/tacos.png' },
  { id: 'Drinks', name: 'Drinks', emoji: '/images/arena/media/drinks/drinks.png' },
  { id: 'Coffee', name: 'Coffee', emoji: '/images/arena/media/coffee/coffee.png' },
  { id: 'Pasta', name: 'Pasta', emoji: '/images/arena/media/pasta/pasta.png' },
  { id: 'Snacks', name: 'Snacks', emoji: '/images/arena/media/snacks/snacks.png' },
  { id: 'Energy Drinks', name: 'Energy Drinks', emoji: '/images/arena/media/energy/energy.png' },
  { id: 'Desserts', name: 'Desserts', emoji: '/images/arena/media/desserts/desserts.png' },
  { id: 'Sushi', name: 'Sushi', emoji: '/images/arena/media/sushi/sushi.png' }
];

const TAX_AMOUNT = 6;
const TOAST_DURATION = 3000;
const MOBILE_CATEGORIES_LIMIT = 8;

// ==================== Utility Functions ====================
const calculateCartTotals = (cart: CartItem[]) => {
  const subTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subTotal - TAX_AMOUNT;
  return { subTotal, tax: TAX_AMOUNT, total };
};

const getLastFourDigits = (cardNumber: string): string => cardNumber.slice(-4);

// Función para aplanar productos iniciales
const flattenInitialProducts = (): ProductWithCategory[] => {
  const flat: ProductWithCategory[] = [];
  Object.entries(initialProducts).forEach(([category, items]) => {
    items.forEach(item => {
      flat.push({ ...item, category: category as Category });
    });
  });
  return flat;
};

// Función para cargar productos desde localStorage
const loadProductsFromStorage = (): Record<Category, Product[]> => {
  try {
    const savedProducts = localStorage.getItem('arena-products');
    if (savedProducts) {
      const flatProducts: ProductWithCategory[] = JSON.parse(savedProducts);
      
      // Convertir array plano a objeto agrupado por categoría
      const grouped: Record<string, Product[]> = {};
      flatProducts.forEach(product => {
        if (!grouped[product.category]) {
          grouped[product.category] = [];
        }
        // Remover la propiedad category del producto individual
        const { category, ...productWithoutCategory } = product;
        grouped[product.category].push(productWithoutCategory);
      });
      
      return grouped as Record<Category, Product[]>;
    }
  } catch (error) {
    console.error('Error loading products from localStorage:', error);
  }
  
  // Si no hay productos guardados, inicializar localStorage
  const initialFlat = flattenInitialProducts();
  localStorage.setItem('arena-products', JSON.stringify(initialFlat));
  return initialProducts;
};

// ==================== Sub-Components ====================

/** Loading spinner component */
const LoadingSpinner: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <div className={`flex h-screen items-center justify-center ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Loading...</p>
      </div>
    </div>
  );
};

/** Toast notification for added items */
interface ToastNotificationProps {
  product: Product;
  onClose: () => void;
}

const ToastNotification: React.FC<ToastNotificationProps> = ({ product, onClose }) => {
  const { theme } = useTheme();
  
  return (
    <div className="xl:hidden fixed top-4 left-4 right-4 z-50 animate-in slide-in-from-top duration-300">
      <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-2xl border-2 border-green-500 p-4 flex items-center gap-4`}>
        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
          <CheckCircle size={24} className="text-green-500" />
        </div>
        <div className="flex-1 min-w-0">
          <p className={`font-bold text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Added to cart!</p>
          <p className={`text-xs truncate ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{product.name}</p>
        </div>
        <button 
          onClick={onClose}
          className={`p-2 rounded-lg transition-all ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
        >
          <X size={18} className="text-gray-400" />
        </button>
      </div>
    </div>
  );
};

/** Search and filter header */
const SearchHeader: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <div className="flex gap-4 mb-6 xl:mb-8">
      <div className="flex-1 relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search food"
          className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
            theme === 'dark' 
              ? 'bg-gray-800 border-gray-700 text-white' 
              : 'bg-white border-gray-200'
          }`}
        />
      </div>
      <button className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl flex items-center gap-2 hover:shadow-lg transition-all">
        <SlidersHorizontal size={20} />
        <span className="hidden sm:inline">Filter</span>
      </button>
    </div>
  );
};

/** Category button component */
interface CategoryButtonProps {
  category: CategoryItem;
  isSelected: boolean;
  onClick: () => void;
}

const CategoryButton: React.FC<CategoryButtonProps> = ({ category, isSelected, onClick }) => {
  const { theme } = useTheme();
  
  return (
    <button
      onClick={onClick}
      className={`p-4 rounded-2xl border-2 transition-all flex items-center gap-3 ${
        isSelected
          ? 'border-orange-400 bg-orange-50 shadow-md'
          : theme === 'dark'
          ? 'border-gray-700 bg-gray-800 hover:border-orange-200 hover:shadow-sm'
          : 'border-gray-200 bg-white hover:border-orange-200 hover:shadow-sm'
      }`}
    >
      <img src={category.emoji} alt={category.name} className="w-10 h-10 object-contain flex-shrink-0" />
      <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>{category.name}</span>
    </button>
  );
};

/** Categories section with responsive grid */
interface CategoriesSectionProps {
  selectedCategory: Category;
  onSelectCategory: (category: Category) => void;
  showAll: boolean;
  onToggleShowAll: () => void;
}

const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  selectedCategory,
  onSelectCategory,
  showAll,
  onToggleShowAll
}) => {
  const { theme } = useTheme();
  const visibleCategories = showAll ? CATEGORIES : CATEGORIES.slice(0, MOBILE_CATEGORIES_LIMIT);
  const desktopFirstRow = CATEGORIES.slice(0, 8);
  const desktopSecondRow = CATEGORIES.slice(8);

  return (
    <div className="mb-6 xl:mb-8">
      <h2 className={`text-xl font-bold mb-4 xl:mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Explore Categories</h2>
      
      {/* Desktop layout (2 rows of 8) */}
      <div className="hidden xl:block">
        <div className="grid grid-cols-8 gap-3 mb-3">
          {desktopFirstRow.map((category) => (
            <CategoryButton
              key={category.id}
              category={category}
              isSelected={selectedCategory === category.id}
              onClick={() => onSelectCategory(category.id)}
            />
          ))}
        </div>
        <div className="grid grid-cols-8 gap-3">
          {desktopSecondRow.map((category) => (
            <CategoryButton
              key={category.id}
              category={category}
              isSelected={selectedCategory === category.id}
              onClick={() => onSelectCategory(category.id)}
            />
          ))}
        </div>
      </div>

      {/* Mobile/Tablet layout */}
      <div className="xl:hidden">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {visibleCategories.map((category) => (
            <CategoryButton
              key={category.id}
              category={category}
              isSelected={selectedCategory === category.id}
              onClick={() => onSelectCategory(category.id)}
            />
          ))}
        </div>
        
        {CATEGORIES.length > MOBILE_CATEGORIES_LIMIT && (
          <div className="mt-4 flex justify-center">
            <button
              onClick={onToggleShowAll}
              className={`px-6 py-3 border-2 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                theme === 'dark'
                  ? 'bg-gray-800 border-gray-700 text-gray-200 hover:border-orange-400 hover:bg-orange-50 hover:text-gray-700'
                  : 'bg-white border-gray-200 text-gray-700 hover:border-orange-400 hover:bg-orange-50'
              }`}
            >
              {showAll ? 'Show Less' : 'Show More'}
              <ChevronDown 
                size={20} 
                className={`transition-transform ${showAll ? 'rotate-180' : ''}`}
              />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

/** Tab navigation */
interface TabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Tabs: React.FC<TabsProps> = ({ activeTab, onTabChange }) => {
  const { theme } = useTheme();
  
  return (
    <div className={`flex gap-8 mb-4 xl:mb-6 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
      {['popular', 'recent'].map((tab) => (
        <button 
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`pb-3 font-semibold transition-all capitalize ${
            activeTab === tab 
              ? theme === 'dark'
                ? 'text-white border-b-2 border-orange-500'
                : 'text-gray-900 border-b-2 border-orange-500'
              : theme === 'dark'
              ? 'text-gray-400 hover:text-gray-300'
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

/** Product card */
interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const { theme } = useTheme();
  
  return (
    <div className={`rounded-2xl shadow-sm border p-6 transition-all hover:shadow-xl hover:-translate-y-1 ${
      theme === 'dark' 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
    }`}>
      <div className="relative mb-4">
        <button className="absolute top-2 left-2 w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center z-10 hover:scale-110 transition-transform">
          <Heart size={16} className="text-white" strokeWidth={2.5} fill="white" />
        </button>
        
        <div className={`h-48 flex items-center justify-center rounded-xl overflow-hidden ${
          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
        }`}>
          <img src={product.image} alt={product.name} className="w-40 h-40 object-contain" />
        </div>
      </div>
      
      <h3 className={`font-bold mb-3 text-lg leading-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
        {product.name}
      </h3>
      
      <div className="flex items-center gap-2 mb-4">
        <span className="text-orange-500 font-bold text-2xl">${product.price}</span>
        <span className="text-gray-400 text-sm line-through">${product.originalPrice.toFixed(2)}</span>
        <div className="flex items-center gap-1 ml-auto">
          <Star size={15} className="fill-yellow-400 text-yellow-400" />
          <span className="text-sm text-gray-500 font-medium">{product.rating}K+</span>
        </div>
      </div>
      
      <div className="flex gap-3">
        <button className={`flex-1 px-4 py-2.5 border rounded-lg text-sm font-semibold transition-all ${
          theme === 'dark'
            ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
        }`}>
          Wishlist
        </button>
        <button
          onClick={() => onAddToCart(product)}
          className="flex-1 px-4 py-2.5 bg-orange-500 text-white rounded-lg text-sm font-semibold hover:bg-orange-600 transition-all"
        >
          Order Now
        </button>
      </div>
    </div>
  );
};

/** Products grid */
interface ProductsGridProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

const ProductsGrid: React.FC<ProductsGridProps> = ({ products, onAddToCart }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5 pb-24 lg:pb-8">
    {products.map((product) => (
      <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
    ))}
  </div>
);

/** Cart item component */
interface CartItemComponentProps {
  item: CartItem;
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onAdd: (product: Product) => void;
}

const CartItemComponent: React.FC<CartItemComponentProps> = ({ 
  item, 
  onUpdateQuantity, 
  onRemove,
  onAdd 
}) => {
  const { theme } = useTheme();
  
  return (
    <div className={`rounded-xl p-4 transition-all border ${
      theme === 'dark'
        ? 'bg-gray-700 border-gray-600 hover:shadow-sm'
        : 'bg-white border-gray-100 hover:shadow-sm'
    }`}>
      <div className="flex items-start gap-3 mb-3">
        <div className="w-14 h-14 flex items-center justify-center rounded-lg overflow-hidden flex-shrink-0 bg-orange-50">
          <img src={item.image} alt={item.name} className="w-12 h-12 object-contain" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className={`font-semibold text-sm mb-1 leading-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {item.name}
          </h4>
          <p className="text-orange-500 font-bold text-base">${item.price}</p>
        </div>

        <button 
          onClick={() => onRemove(item.id)} 
          className={`p-1 rounded-md transition-all flex-shrink-0 ${
            theme === 'dark'
              ? 'text-gray-400 hover:text-red-400 hover:bg-red-900/30'
              : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
          }`}
        >
          <Trash2 size={15} />
        </button>
      </div>

      <div className={`flex items-center justify-between rounded-lg p-2 ${
        theme === 'dark' ? 'bg-gray-600' : 'bg-gray-50'
      }`}>
        <button 
          onClick={() => onUpdateQuantity(item.id, -1)} 
          className={`w-7 h-7 rounded-md flex items-center justify-center transition-all shadow-sm border ${
            theme === 'dark'
              ? 'bg-gray-700 border-gray-500 hover:bg-gray-600'
              : 'bg-white border-gray-200 hover:bg-gray-100'
          }`}
        >
          <Minus size={14} className={theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} strokeWidth={2.5} />
        </button>
        <span className={`font-semibold text-sm px-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          {item.quantity}
        </span>
        <button 
          onClick={() => onAdd(item)} 
          className="w-7 h-7 bg-orange-500 rounded-md flex items-center justify-center hover:bg-orange-600 transition-all shadow-sm"
        >
          <Plus size={14} className="text-white" strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
};

/** Empty state component */
interface EmptyStateProps {
  icon: React.ReactNode;
  message: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, message }) => {
  const { theme } = useTheme();
  
  return (
    <div className="text-center py-16">
      <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
        theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
      }`}>
        {icon}
      </div>
      <p className="text-gray-400 text-sm">{message}</p>
    </div>
  );
};

/** Payment card option */
interface PaymentCardOptionProps {
  card: PaymentCard;
  isSelected: boolean;
  onSelect: (cardId: string) => void;
}

const PaymentCardOption: React.FC<PaymentCardOptionProps> = ({ card, isSelected, onSelect }) => {
  const { theme } = useTheme();
  
  return (
    <label
      htmlFor={`card-${card.id}`}
      className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all ${
        isSelected
          ? 'border-orange-500 bg-orange-50'
          : theme === 'dark'
          ? 'border-gray-700 bg-gray-700 hover:border-gray-600'
          : 'border-gray-200 bg-white hover:border-gray-300'
      }`}
    >
      <input
        type="radio"
        id={`card-${card.id}`}
        name="payment"
        value={card.id}
        checked={isSelected}
        onChange={(e) => onSelect(e.target.value)}
        className="sr-only"
      />
      <div className="flex items-center gap-3">
        <img 
          src="/images/payment/tarjeta.png"
          alt="Card" 
          className="w-12 h-8 object-cover rounded"
        />
        <div>
          <div className={`text-sm font-semibold ${isSelected || theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
            {card.card_type} ····{getLastFourDigits(card.card_number)}
          </div>
          <div className="text-xs text-gray-500">
            Exp {card.expiry_date}
          </div>
        </div>
      </div>
      {isSelected && (
        <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
    </label>
  );
};

/** Invoice sidebar */
interface InvoiceSidebarProps {
  cart: CartItem[];
  paymentCards: PaymentCard[];
  selectedPayment: string;
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onAddToCart: (product: Product) => void;
  onSelectPayment: (cardId: string) => void;
  onAddPaymentMethod: () => void;
  onPlaceOrder: () => void;
}

const InvoiceSidebar: React.FC<InvoiceSidebarProps> = ({
  cart,
  paymentCards,
  selectedPayment,
  onUpdateQuantity,
  onRemoveItem,
  onAddToCart,
  onSelectPayment,
  onAddPaymentMethod,
  onPlaceOrder
}) => {
  const { theme } = useTheme();
  const { subTotal, tax, total } = calculateCartTotals(cart);

  return (
    <div className={`hidden xl:block w-96 border-l overflow-y-auto shadow-sm ${
      theme === 'dark' 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-100'
    }`}>
      <div className="p-8">
        <h3 className={`text-2xl font-bold mb-8 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Invoice</h3>
        
        {/* Cart Items */}
        <div className="space-y-3 mb-8 min-h-[200px]">
          {cart.length === 0 ? (
            <EmptyState 
              icon={<ShoppingCart size={32} className="text-gray-300" />}
              message="No items in cart"
            />
          ) : (
            cart.map((item) => (
              <CartItemComponent
                key={item.id}
                item={item}
                onUpdateQuantity={onUpdateQuantity}
                onRemove={onRemoveItem}
                onAdd={onAddToCart}
              />
            ))
          )}
        </div>

        {/* Payment Summary */}
        <div className={`border-t pt-6 mb-8 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-100'}`}>
          <h3 className={`text-xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Payment Summary</h3>
          
          <div className="space-y-4 mb-4">
            <div className="flex justify-between items-center">
              <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Sub Total</span>
              <span className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>${subTotal}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Tax</span>
              <span className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>-${tax}</span>
            </div>
            
            <div className={`flex justify-between items-center pt-4 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-100'}`}>
              <span className={`font-bold text-base ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Total Payment</span>
              <span className={`font-bold text-2xl ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>${total}</span>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="mb-8">
          <h3 className={`text-xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Payment Method</h3>
          
          {paymentCards.length > 0 ? (
            <div className="space-y-3 mb-4">
              {paymentCards.map((card) => (
                <PaymentCardOption
                  key={card.id}
                  card={card}
                  isSelected={selectedPayment === card.id}
                  onSelect={onSelectPayment}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<CreditCard size={28} className="text-gray-300" />}
              message="No payment methods added yet"
            />
          )}

          <button 
            onClick={onAddPaymentMethod}
            className={`w-full py-3 border-2 border-dashed rounded-xl text-orange-500 hover:text-orange-600 hover:border-orange-500 transition-colors text-sm font-semibold flex items-center justify-center gap-2 ${
              theme === 'dark' ? 'border-gray-600' : 'border-gray-300'
            }`}
          >
            <span className="text-xl">+</span>
            ADD PAYMENT METHOD
          </button>
        </div>

        <button 
          onClick={onPlaceOrder}
          disabled={cart.length === 0 || paymentCards.length === 0}
          className="w-full py-4 bg-orange-500 text-white rounded-xl font-bold text-base hover:bg-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {cart.length === 0 
            ? 'Add Items to Cart' 
            : paymentCards.length === 0 
            ? 'Add Payment Method First' 
            : 'Place An Order Now'}
        </button>
      </div>
    </div>
  );
};

// ==================== Main Component ====================

/**
 * Arena - Food ordering interface with cart management and payment integration
 * Now reads products from localStorage to reflect admin changes
 */
const Arena: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  
  // State management
  const [selectedCategory, setSelectedCategory] = useState<Category>('Burger');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentCards, setPaymentCards] = useState<PaymentCard[]>([]);
  const [selectedPayment, setSelectedPayment] = useState('');
  const [activeTab, setActiveTab] = useState('popular');
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [isLoadingCart, setIsLoadingCart] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState>({ visible: false, product: null });
  const [products, setProducts] = useState<Record<Category, Product[]>>({} as Record<Category, Product[]>);

  // Initial data load
  useEffect(() => {
    loadUserAndCart();
    loadProducts();
    
    // Escuchar cambios en localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'arena-products') {
        loadProducts();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Toast auto-hide
  useEffect(() => {
    if (toast.visible) {
      const timer = setTimeout(() => {
        setToast({ visible: false, product: null });
      }, TOAST_DURATION);
      return () => clearTimeout(timer);
    }
  }, [toast.visible]);

  /**
   * Load products from localStorage
   */
  const loadProducts = () => {
    const loadedProducts = loadProductsFromStorage();
    setProducts(loadedProducts);
  };

  /**
   * Load user data, cart, and payment cards from Supabase
   */
  const loadUserAndCart = async (): Promise<void> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setIsLoadingCart(false);
        return;
      }

      setUserId(user.id);
      
      // Load cart
      const { data: cartData, error: cartError } = await supabase
        .from('carts')
        .select('items')
        .eq('user_id', user.id)
        .single();

      if (cartError && cartError.code !== 'PGRST116') {
        console.error('Error loading cart:', cartError);
      } else if (cartData) {
        setCart(cartData.items || []);
      }

      // Load payment cards
      const { data: cardsData, error: cardsError } = await supabase
        .from('payment_cards')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (cardsData && !cardsError) {
        setPaymentCards(cardsData);
        if (cardsData.length > 0) {
          setSelectedPayment(cardsData[0].id);
        }
      }
    } catch (error) {
      console.error('Error in loadUserAndCart:', error);
    } finally {
      setIsLoadingCart(false);
    }
  };

  /**
   * Persist cart to Supabase
   */
  const saveCartToSupabase = useCallback(async (updatedCart: CartItem[]): Promise<void> => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('carts')
        .upsert({
          user_id: userId,
          items: updatedCart
        }, {
          onConflict: 'user_id'
        });

      if (error) {
        console.error('Error saving cart:', error);
      }
    } catch (error) {
      console.error('Error in saveCartToSupabase:', error);
    }
  }, [userId]);

  /**
   * Add product to cart or increment quantity
   */
  const handleAddToCart = useCallback((product: Product): void => {
    const existing = cart.find(item => item.id === product.id);
    let updatedCart: CartItem[];
    
    if (existing) {
      updatedCart = cart.map(item => 
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      updatedCart = [...cart, { ...product, quantity: 1 }];
    }
    
    setCart(updatedCart);
    saveCartToSupabase(updatedCart);
    
    // Show toast on mobile
    if (window.innerWidth < 1280) {
      setToast({ visible: true, product });
    }
  }, [cart, saveCartToSupabase]);

  /**
   * Update item quantity in cart
   */
  const handleUpdateQuantity = useCallback((id: string, delta: number): void => {
    const updatedCart = cart
      .map(item => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : item;
        }
        return item;
      })
      .filter(item => item.quantity > 0);
    
    setCart(updatedCart);
    saveCartToSupabase(updatedCart);
  }, [cart, saveCartToSupabase]);

  /**
   * Remove item from cart
   */
  const handleRemoveFromCart = useCallback((id: string): void => {
    const updatedCart = cart.filter(item => item.id !== id);
    setCart(updatedCart);
    saveCartToSupabase(updatedCart);
  }, [cart, saveCartToSupabase]);

  /**
   * Navigate to payment method page
   */
  const handleAddPaymentMethod = (): void => {
    navigate('/payment', { state: { from: '/arena' } });
  };

  /**
   * Navigate to package/delivery page
   */
  const handlePlaceOrder = (): void => {
    if (cart.length === 0) {
      alert('Your cart is empty');
      return;
    }
    if (!selectedPayment) {
      alert('Please select a payment method');
      return;
    }
    navigate('/package');
  };

  /**
   * Close toast notification
   */
  const handleCloseToast = (): void => {
    setToast({ visible: false, product: null });
  };

  // Loading state
  if (isLoadingCart) {
    return <LoadingSpinner />;
  }

  const currentProducts = products[selectedCategory] || [];

  return (
    <div className={`flex h-screen overflow-hidden pt-0 xl:pt-20 lg:pt-24 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Toast Notification */}
      {toast.visible && toast.product && (
        <ToastNotification product={toast.product} onClose={handleCloseToast} />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-[1600px] mx-auto p-4 xl:p-6 lg:p-8">
            <SearchHeader />
            
            <CategoriesSection
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              showAll={showAllCategories}
              onToggleShowAll={() => setShowAllCategories(!showAllCategories)}
            />

            <Tabs activeTab={activeTab} onTabChange={setActiveTab} />

            <ProductsGrid products={currentProducts} onAddToCart={handleAddToCart} />
          </div>
        </div>
      </div>

      {/* Invoice Sidebar */}
      <InvoiceSidebar
        cart={cart}
        paymentCards={paymentCards}
        selectedPayment={selectedPayment}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onAddToCart={handleAddToCart}
        onSelectPayment={setSelectedPayment}
        onAddPaymentMethod={handleAddPaymentMethod}
        onPlaceOrder={handlePlaceOrder}
      />
    </div>
  );
};

export default Arena;
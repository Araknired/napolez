import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Minus, Trash2, ShoppingCart, CreditCard } from 'lucide-react';
import type { CartItem } from '../types';
import { supabase } from '../lib/supabase';
import { useTheme } from '../context/ThemeContext'; // IMPORTANTE: Agregado para el Modo Oscuro

// Types
interface PaymentCard {
  id: string;
  card_number: string;
  card_holder: string;
  expiry_date: string;
  card_type: string;
}

interface CartSummary {
  subtotal: number;
  discount: number;
  total: number;
}

// Constants
const DISCOUNT_AMOUNT = 6;
const SUPABASE_NOT_FOUND_CODE = 'PGRST116';

// Utility Functions
const calculateCartSummary = (cart: CartItem[]): CartSummary => {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = DISCOUNT_AMOUNT;
  const total = subtotal - discount;

  return { subtotal, discount, total };
};

const getLastFourDigits = (cardNumber: string): string => cardNumber.slice(-4);

// Custom Hooks
const useCart = (userId: string | null) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const saveCart = async (updatedCart: CartItem[]): Promise<void> => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('carts')
        .upsert({ user_id: userId, items: updatedCart }, { onConflict: 'user_id' });

      if (error) console.error('Error saving cart:', error);
    } catch (error) {
      console.error('Error in saveCart:', error);
    }
  };

  const updateQuantity = (id: string, delta: number): void => {
    const updatedCart = cart
      .map((item) =>
        item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
      )
      .filter((item) => item.quantity > 0);

    setCart(updatedCart);
    saveCart(updatedCart);
  };

  const incrementItem = (item: CartItem): void => {
    const updatedCart = cart.map((cartItem) =>
      cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
    );

    setCart(updatedCart);
    saveCart(updatedCart);
  };

  const removeItem = (id: string): void => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
    saveCart(updatedCart);
  };

  return { cart, setCart, updateQuantity, incrementItem, removeItem };
};

// Component: Loading Spinner
const LoadingSpinner: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className={`flex h-screen items-center justify-center ${theme === 'dark' ? 'bg-slate-900' : 'bg-gray-50'}`}>
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Loading cart...</p>
      </div>
    </div>
  );
};

// Component: Empty Cart State
const EmptyCart: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className={`text-center py-20 rounded-2xl ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'}`}>
      <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${theme === 'dark' ? 'bg-slate-700' : 'bg-gray-100'}`}>
        <ShoppingCart size={40} className="text-gray-300" />
      </div>
      <p className="text-gray-400 text-lg font-medium">Your cart is empty</p>
      <p className="text-gray-500 text-sm mt-2">Add products to get started</p>
    </div>
  );
};

// Component: Cart Item
interface CartItemProps {
  item: CartItem;
  onRemove: (id: string) => void;
  onDecrement: (id: string) => void;
  onIncrement: (item: CartItem) => void;
}

const CartItemCard: React.FC<CartItemProps> = ({ item, onRemove, onDecrement, onIncrement }) => {
  const { theme } = useTheme();
  const baseClasses = theme === 'dark' 
    ? 'bg-slate-800 border-slate-700 shadow-xl shadow-black/30' 
    : 'bg-white border-gray-100 shadow-sm';
  const textPrimary = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const quantityButtonClasses = theme === 'dark' 
    ? 'bg-slate-700 border-slate-600 hover:bg-slate-600' 
    : 'bg-gray-100 border-gray-200 hover:bg-gray-200';
  const minusIconClasses = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';

  return (
    <div className={`flex items-center gap-4 rounded-2xl p-4 border ${baseClasses}`}>
      <div className={`w-20 h-20 flex items-center justify-center rounded-xl overflow-hidden flex-shrink-0 ${theme === 'dark' ? 'bg-slate-700' : 'bg-gray-50'}`}>
        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
      </div>

      <div className="flex-1 min-w-0">
        <h4 className={`font-bold text-base mb-1 ${textPrimary}`}>{item.name}</h4>
        <p className="text-orange-500 font-bold text-lg">${item.price}</p>
      </div>

      <div className="flex flex-col items-end gap-3">
        <button
          onClick={() => onRemove(item.id)}
          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
          aria-label="Remove item"
        >
          <Trash2 size={18} />
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onDecrement(item.id)}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${quantityButtonClasses}`}
            aria-label="Decrease quantity"
          >
            <Minus size={14} className={minusIconClasses} />
          </button>
          <span className={`font-bold w-8 text-center text-sm ${textPrimary}`}>{item.quantity}</span>
          <button
            onClick={() => onIncrement(item)}
            className="w-8 h-8 bg-orange-500 text-white rounded-lg flex items-center justify-center hover:bg-orange-600 transition-all"
            aria-label="Increase quantity"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Component: Payment Summary
interface PaymentSummaryProps {
  summary: CartSummary;
}

const PaymentSummary: React.FC<PaymentSummaryProps> = ({ summary }) => {
  const { theme } = useTheme();
  const baseClasses = theme === 'dark' 
    ? 'bg-slate-800 border-slate-700 shadow-xl shadow-black/30' 
    : 'bg-white border-gray-100 shadow-sm';
  const textPrimary = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const textSecondary = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
  const divider = theme === 'dark' ? 'border-slate-700' : 'border-gray-100';

  return (
    <div className={`rounded-2xl p-6 mb-6 border ${baseClasses}`}>
      <h3 className={`text-xl font-bold mb-6 ${textPrimary}`}>Payment Summary</h3>

      <div className="space-y-4 mb-4">
        <div className="flex justify-between items-center">
          <span className={textSecondary}>Subtotal</span>
          <span className={`font-bold text-lg ${textPrimary}`}>${summary.subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className={textSecondary}>Discount</span>
          <span className="font-bold text-green-600 text-lg">-${summary.discount.toFixed(2)}</span>
        </div>

        <div className={`flex justify-between items-center pt-4 border-t ${divider}`}>
          <span className={`font-bold text-lg ${textPrimary}`}>Total</span>
          <span className="font-bold text-orange-500 text-2xl">${summary.total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

// Component: Empty Payment Methods State
const EmptyPaymentMethods: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className="text-center py-8 mb-4">
      <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${theme === 'dark' ? 'bg-slate-700' : 'bg-gray-100'}`}>
        <CreditCard size={28} className="text-gray-300" />
      </div>
      <p className="text-gray-400 text-sm">No payment methods added yet</p>
    </div>
  );
};

// Component: Payment Card Option
interface PaymentCardOptionProps {
  card: PaymentCard;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const PaymentCardOption: React.FC<PaymentCardOptionProps> = ({ card, isSelected, onSelect }) => {
  const { theme } = useTheme();
  const defaultClasses = theme === 'dark' 
    ? 'border-slate-700 bg-slate-800 hover:border-slate-600' 
    : 'border-gray-200 bg-white hover:border-gray-300';
  const textPrimary = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const textSecondary = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';

  return (
    <label
      htmlFor={`card-${card.id}`}
      className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all ${
        isSelected
          ? 'border-orange-500 bg-orange-50'
          : defaultClasses
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
        <img src="/images/payment/tarjeta.png" alt="Card" className="w-12 h-8 object-cover rounded" />
        <div>
          <div className={`text-sm font-semibold ${textPrimary}`}>
            {card.card_type} ····{getLastFourDigits(card.card_number)}
          </div>
          <div className={`text-xs ${textSecondary}`}>Exp {card.expiry_date}</div>
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

// Component: Payment Method Section
interface PaymentMethodSectionProps {
  paymentCards: PaymentCard[];
  selectedPayment: string;
  onSelectPayment: (id: string) => void;
  onAddPaymentMethod: () => void;
}

const PaymentMethodSection: React.FC<PaymentMethodSectionProps> = ({
  paymentCards,
  selectedPayment,
  onSelectPayment,
  onAddPaymentMethod,
}) => {
  const { theme } = useTheme();
  const baseClasses = theme === 'dark' 
    ? 'bg-slate-800 border-slate-700 shadow-xl shadow-black/30' 
    : 'bg-white border-gray-100 shadow-sm';
  const textPrimary = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const buttonBorderClasses = theme === 'dark' ? 'border-slate-600 hover:border-orange-500' : 'border-gray-300';

  return (
    <div className={`rounded-2xl p-6 mb-6 border ${baseClasses}`}>
      <h3 className={`text-xl font-bold mb-6 ${textPrimary}`}>Payment Method</h3>

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
        <EmptyPaymentMethods />
      )}

      <button
        onClick={onAddPaymentMethod}
        className={`w-full py-3 border-2 border-dashed rounded-xl text-orange-500 hover:text-orange-600 hover:border-orange-500 transition-colors text-sm font-semibold flex items-center justify-center gap-2 ${buttonBorderClasses}`}
      >
        <span className="text-xl">+</span>
        ADD PAYMENT METHOD
      </button>
    </div>
  );
};

// Main Component
const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme(); // Usar el tema
  const [userId, setUserId] = useState<string | null>(null);
  const [paymentCards, setPaymentCards] = useState<PaymentCard[]>([]);
  const [selectedPayment, setSelectedPayment] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const { cart, setCart, updateQuantity, incrementItem, removeItem } = useCart(userId);

  useEffect(() => {
    loadUserAndCart();
  }, []);

  const loadUserAndCart = async (): Promise<void> => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setIsLoading(false);
        return;
      }

      setUserId(user.id);

      await Promise.all([loadCart(user.id), loadPaymentCards(user.id)]);
    } catch (error) {
      console.error('Error in loadUserAndCart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCart = async (uid: string): Promise<void> => {
    const { data, error } = await supabase
      .from('carts')
      .select('items')
      .eq('user_id', uid)
      .single();

    if (error && error.code !== SUPABASE_NOT_FOUND_CODE) {
      console.error('Error loading cart:', error);
      return;
    }

    if (data) {
      setCart(data.items || []);
    }
  };

  const loadPaymentCards = async (uid: string): Promise<void> => {
    const { data, error } = await supabase
      .from('payment_cards')
      .select('*')
      .eq('user_id', uid)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading payment cards:', error);
      return;
    }

    if (data) {
      setPaymentCards(data);
      if (data.length > 0) {
        setSelectedPayment(data[0].id);
      }
    }
  };

  const handleAddPaymentMethod = (): void => {
    navigate('/payment', { state: { from: '/cart' } });
  };

  const handlePlaceOrder = (): void => {
    if (cart.length === 0) {
      alert('Your cart is empty');
      return;
    }
    if (!selectedPayment) {
      alert('Please select a payment method');
      return;
    }
    
    // Navigate to Package page with payment info
    navigate('/package', { 
      state: { 
        selectedPaymentId: selectedPayment,
        fromCart: true 
      } 
    });
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const summary = calculateCartSummary(cart);
  const hasPaymentMethods = paymentCards.length > 0;
  const canPlaceOrder = cart.length > 0 && hasPaymentMethods;

  const containerClasses = theme === 'dark'
    ? 'bg-slate-900 text-white'
    : 'bg-gray-50 text-gray-900';

  return (
    <div className={`min-h-screen pb-24 lg:pb-8 ${containerClasses}`}>
      <div className="max-w-2xl mx-auto p-4 pt-6 lg:pt-24">
        <h1 className={`text-3xl font-bold mb-8 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>My Cart</h1>

        <div className="space-y-3 mb-8">
          {cart.length === 0 ? (
            <EmptyCart />
          ) : (
            cart.map((item) => (
              <CartItemCard
                key={item.id}
                item={item}
                onRemove={removeItem}
                onDecrement={(id) => updateQuantity(id, -1)}
                onIncrement={incrementItem}
              />
            ))
          )}
        </div>

        {cart.length > 0 && (
          <>
            <PaymentSummary summary={summary} />

            <PaymentMethodSection
              paymentCards={paymentCards}
              selectedPayment={selectedPayment}
              onSelectPayment={setSelectedPayment}
              onAddPaymentMethod={handleAddPaymentMethod}
            />

            <button
              onClick={handlePlaceOrder}
              disabled={!canPlaceOrder}
              className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold text-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {!hasPaymentMethods 
                ? 'Add Payment Method First' 
                : 'Proceed to Checkout'}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
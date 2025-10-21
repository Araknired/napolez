import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaMapMarkerAlt, 
  FaUser, 
  FaPhone, 
  FaHome, 
  FaCheckCircle, 
  FaTimes,
  FaShoppingBag,
  FaClock
} from 'react-icons/fa';
import { supabase } from '@/lib/supabase';
import type { CartItem } from '@/types';
import { useTheme } from '../context/ThemeContext'; // 1. IMPORTAR useTheme

// ==================== Types ====================
interface DeliveryForm {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
  instructions: string;
}

interface OrderSummary {
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
}

// ==================== Constants ====================
const DISCOUNT_AMOUNT = 6;
const ESTIMATED_DELIVERY_TIME = '25-35 minutes';

const INITIAL_FORM_STATE: DeliveryForm = {
  fullName: '',
  phone: '',
  address: '',
  city: '',
  zipCode: '',
  instructions: ''
};

// ==================== Utility Functions ====================
const calculateOrderSummary = (cart: CartItem[]): OrderSummary => {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = DISCOUNT_AMOUNT;
  const total = subtotal - discount;

  return { items: cart, subtotal, discount, total };
};

const generateOrderNumber = (): string => {
  return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
};

// ==================== Sub-Components ====================

/** Loading Spinner */
const LoadingSpinner: React.FC = () => {
  const { theme } = useTheme();
  return (
    <div className={`flex h-screen items-center justify-center ${theme === 'dark' ? 'bg-slate-900' : 'bg-gray-50'}`}>
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Loading...</p>
      </div>
    </div>
  );
}

/** Input Field Component */
interface InputFieldProps {
  icon: React.ReactNode;
  label: string;
  name: keyof DeliveryForm;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  type?: string;
  placeholder: string;
  required?: boolean;
  isTextArea?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  icon,
  label,
  name,
  value,
  onChange,
  type = 'text',
  placeholder,
  required = true,
  isTextArea = false
}) => {
  const { theme } = useTheme();
  const inputClasses = theme === 'dark' 
    ? 'bg-slate-700 border-slate-600 text-white' 
    : 'bg-white border-gray-200';
  const labelClasses = theme === 'dark' ? 'text-gray-300' : 'text-gray-700';
  const iconClasses = theme === 'dark' ? 'text-gray-500' : 'text-gray-400';

  return (
    <div className="mb-4">
      <label className={`block text-sm font-semibold mb-2 ${labelClasses}`}>
        {label} {required && <span className="text-orange-500">*</span>}
      </label>
      <div className="relative">
        <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${iconClasses}`}>
          {icon}
        </div>
        {isTextArea ? (
          <textarea
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={3}
            className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none ${inputClasses}`}
          />
        ) : (
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${inputClasses}`}
          />
        )}
      </div>
    </div>
  );
}

/** Order Summary Card */
interface OrderSummaryCardProps {
  summary: OrderSummary;
}

const OrderSummaryCard: React.FC<OrderSummaryCardProps> = ({ summary }) => {
  const { theme } = useTheme();
  const baseClasses = theme === 'dark' 
    ? 'bg-slate-800 border-slate-700 shadow-xl shadow-black/30' 
    : 'bg-white border-gray-100 shadow-sm';
  const textPrimary = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const textSecondary = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
  const dividerClasses = theme === 'dark' ? 'border-slate-700' : 'border-gray-100';

  return (
    <div className={`rounded-2xl p-6 mb-6 shadow-sm border ${baseClasses}`}>
      <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${textPrimary}`}>
        <FaShoppingBag className="text-orange-500" />
        Order Summary
      </h3>

      {/* Items count */}
      <div className={`mb-4 pb-4 border-b ${dividerClasses}`}>
        <p className={`text-sm ${textSecondary}`}>
          {summary.items.length} {summary.items.length === 1 ? 'item' : 'items'} in your order
        </p>
      </div>

      {/* Price breakdown */}
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className={textSecondary}>Subtotal</span>
          <span className={`font-semibold ${textPrimary}`}>${summary.subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className={textSecondary}>Discount</span>
          <span className="font-semibold text-green-600">-${summary.discount.toFixed(2)}</span>
        </div>
        <div className={`flex justify-between items-center pt-3 border-t ${dividerClasses}`}>
          <span className={`font-bold ${textPrimary}`}>Total</span>
          <span className="font-bold text-orange-500 text-xl">${summary.total.toFixed(2)}</span>
        </div>
      </div>

      {/* Delivery estimate */}
      <div className={`mt-4 pt-4 border-t ${dividerClasses} flex items-center gap-2 text-sm ${textSecondary}`}>
        <FaClock className="text-orange-500" />
        <span>Estimated delivery: <strong>{ESTIMATED_DELIVERY_TIME}</strong></span>
      </div>
    </div>
  );
}

/** Success Modal */
interface SuccessModalProps {
  isOpen: boolean;
  orderNumber: string;
  onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, orderNumber, onClose }) => {
  const { theme } = useTheme();

  if (!isOpen) return null;

  const modalBodyClasses = theme === 'dark' ? 'bg-slate-800 shadow-black/50' : 'bg-white';
  const overlayClasses = theme === 'dark' ? 'bg-slate-900 bg-opacity-80' : 'bg-white bg-opacity-80';
  const textPrimary = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const textSecondary = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
  const detailsBoxClasses = theme === 'dark' ? 'bg-slate-700' : 'bg-gray-50';
  const closeButtonClasses = theme === 'dark' ? 'text-gray-500 hover:bg-slate-700 hover:text-gray-300' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600';
  const secondaryButtonClasses = theme === 'dark' ? 'border-2 border-slate-700 text-gray-300 rounded-xl font-semibold hover:bg-slate-700' : 'border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50';

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in duration-300 ${overlayClasses}`}>
      <div className={`relative rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in duration-300 ${modalBodyClasses}`}>
        {/* Close button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-full transition-all ${closeButtonClasses}`}
        >
          <FaTimes className="w-5 h-5" />
        </button>

        {/* Success icon */}
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${theme === 'dark' ? 'bg-green-700/30' : 'bg-green-100'}`}>
          <FaCheckCircle className="text-green-500 text-5xl" />
        </div>

        {/* Success message */}
        <h2 className={`text-2xl font-bold text-center mb-3 ${textPrimary}`}>
          Order Placed Successfully!
        </h2>
        <p className={`text-center mb-6 ${textSecondary}`}>
          Your order has been confirmed and will be delivered soon.
        </p>

        {/* Order details */}
        <div className={`rounded-xl p-4 mb-6 ${detailsBoxClasses}`}>
          <div className="flex justify-between items-center mb-3">
            <span className={`text-sm ${textSecondary}`}>Order Number</span>
            <span className={`font-mono font-bold text-sm ${textPrimary}`}>{orderNumber}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className={`text-sm ${textSecondary}`}>Estimated Delivery</span>
            <span className="font-semibold text-orange-500 text-sm">{ESTIMATED_DELIVERY_TIME}</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="space-y-3">
          <button
            onClick={onClose}
            className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold hover:shadow-lg transition-all"
          >
            Continue Shopping
          </button>
          <button
            onClick={onClose}
            className={`w-full py-3 rounded-xl font-semibold hover:shadow-lg transition-all ${secondaryButtonClasses}`}
          >
            Track Order
          </button>
        </div>
      </div>
    </div>
  );
};

// ==================== Main Component ====================

const Package: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme(); // 2. USAR useTheme
  
  const [formData, setFormData] = useState<DeliveryForm>(INITIAL_FORM_STATE);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  // Load user and cart data
  useEffect(() => {
    loadUserAndCart();
  }, []);

  const loadUserAndCart = async (): Promise<void> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        navigate('/login');
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
        
        // Redirect if cart is empty
        if (!cartData.items || cartData.items.length === 0) {
          navigate('/arena');
        }
      }
    } catch (error) {
      console.error('Error in loadUserAndCart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const clearCart = async (): Promise<void> => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('carts')
        .update({ items: [] })
        .eq('user_id', userId);

      if (error) {
        console.error('Error clearing cart:', error);
      }
    } catch (error) {
      console.error('Error in clearCart:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Generate order number
      const newOrderNumber = generateOrderNumber();
      setOrderNumber(newOrderNumber);

      // Clear the cart
      await clearCart();

      // Show success modal
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error placing order:', error);
      alert('There was an error placing your order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = (): void => {
    setShowSuccessModal(false);
    navigate('/arena');
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const summary = calculateOrderSummary(cart);

  const containerClasses = theme === 'dark'
    ? 'bg-slate-900 text-white'
    : 'bg-gray-50 text-gray-900';
  
  const textPrimary = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const textSecondary = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
  const cardClasses = theme === 'dark' 
    ? 'bg-slate-800 border-slate-700 shadow-xl shadow-black/30' 
    : 'bg-white border-gray-100 shadow-sm';
  const backButtonClasses = theme === 'dark' 
    ? 'border-slate-700 text-gray-300 hover:bg-slate-700' 
    : 'border-gray-200 text-gray-700 hover:bg-gray-50';

  return (
    <>
      <div className={`min-h-screen pb-24 lg:pb-8 ${containerClasses}`}>
        <div className="max-w-4xl mx-auto p-4 pt-6 lg:pt-24">
          {/* Header */}
          <div className="mb-8">
            <h1 className={`text-3xl font-bold mb-2 ${textPrimary}`}>Delivery Information</h1>
            <p className={textSecondary}>Please provide your delivery address to complete the order</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Delivery Form */}
            <div className="lg:col-span-2">
              <div className={`rounded-2xl p-6 shadow-sm border ${cardClasses}`}>
                <h2 className={`text-xl font-bold mb-6 flex items-center gap-2 ${textPrimary}`}>
                  <FaMapMarkerAlt className="text-orange-500" />
                  Delivery Address
                </h2>

                <form onSubmit={handleSubmit}>
                  <InputField
                    icon={<FaUser />}
                    label="Full Name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                  />

                  <InputField
                    icon={<FaPhone />}
                    label="Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                  />

                  <InputField
                    icon={<FaHome />}
                    label="Street Address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="123 Main Street, Apt 4B"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputField
                      icon={<FaMapMarkerAlt />}
                      label="City"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="New York"
                    />

                    <InputField
                      icon={<FaMapMarkerAlt />}
                      label="ZIP Code"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      placeholder="10001"
                    />
                  </div>

                  <InputField
                    icon={<FaHome />}
                    label="Delivery Instructions"
                    name="instructions"
                    value={formData.instructions}
                    onChange={handleInputChange}
                    placeholder="Ring the doorbell twice, leave at door..."
                    required={false}
                    isTextArea={true}
                  />

                  {/* Submit Button */}
                  <div className="mt-6 flex gap-3">
                    <button
                      type="button"
                      onClick={() => navigate(-1)}
                      className={`flex-1 py-3 border-2 rounded-xl font-semibold transition-all ${backButtonClasses}`}
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <FaCheckCircle />
                          Place Order
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-24">
                <OrderSummaryCard summary={summary} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        orderNumber={orderNumber}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default Package;
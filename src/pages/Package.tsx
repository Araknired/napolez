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
const LoadingSpinner: React.FC = () => (
  <div className="flex h-screen items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

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
}) => (
  <div className="mb-4">
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      {label} {required && <span className="text-orange-500">*</span>}
    </label>
    <div className="relative">
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
        {icon}
      </div>
      {isTextArea ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={3}
          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      )}
    </div>
  </div>
);

/** Order Summary Card */
interface OrderSummaryCardProps {
  summary: OrderSummary;
}

const OrderSummaryCard: React.FC<OrderSummaryCardProps> = ({ summary }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
      <FaShoppingBag className="text-orange-500" />
      Order Summary
    </h3>

    {/* Items count */}
    <div className="mb-4 pb-4 border-b border-gray-100">
      <p className="text-sm text-gray-600">
        {summary.items.length} {summary.items.length === 1 ? 'item' : 'items'} in your order
      </p>
    </div>

    {/* Price breakdown */}
    <div className="space-y-3">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Subtotal</span>
        <span className="font-semibold text-gray-900">${summary.subtotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Discount</span>
        <span className="font-semibold text-green-600">-${summary.discount.toFixed(2)}</span>
      </div>
      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
        <span className="font-bold text-gray-900">Total</span>
        <span className="font-bold text-orange-500 text-xl">${summary.total.toFixed(2)}</span>
      </div>
    </div>

    {/* Delivery estimate */}
    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2 text-sm text-gray-600">
      <FaClock className="text-orange-500" />
      <span>Estimated delivery: <strong>{ESTIMATED_DELIVERY_TIME}</strong></span>
    </div>
  </div>
);

/** Success Modal */
interface SuccessModalProps {
  isOpen: boolean;
  orderNumber: string;
  onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, orderNumber, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white bg-opacity-80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in duration-300">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-all"
        >
          <FaTimes className="text-gray-400 hover:text-gray-600" />
        </button>

        {/* Success icon */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FaCheckCircle className="text-green-500 text-5xl" />
        </div>

        {/* Success message */}
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-3">
          Order Placed Successfully!
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Your order has been confirmed and will be delivered soon.
        </p>

        {/* Order details */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-gray-600">Order Number</span>
            <span className="font-mono font-bold text-gray-900 text-sm">{orderNumber}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Estimated Delivery</span>
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
            className="w-full py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
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

  return (
    <>
      <div className="min-h-screen bg-gray-50 pb-24 lg:pb-8">
        <div className="max-w-4xl mx-auto p-4 pt-6 lg:pt-24">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Delivery Information</h1>
            <p className="text-gray-600">Please provide your delivery address to complete the order</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Delivery Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
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
                      className="flex-1 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
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
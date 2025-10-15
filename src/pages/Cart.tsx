import React, { useState, useEffect } from 'react';
import { Plus, Minus, Trash2, ShoppingCart, CreditCard } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import type { CartItem } from '../types';
import tarjetaImg from '../assets/images/payment/tarjeta.png';

interface PaymentCard {
  id: string;
  card_number: string;
  card_holder: string;
  expiry_date: string;
  card_type: string;
}

const Cart: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentCards, setPaymentCards] = useState<PaymentCard[]>([]);
  const [selectedPayment, setSelectedPayment] = useState('');
  const [isLoadingCart, setIsLoadingCart] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadUserAndCart();
  }, []);

  const loadUserAndCart = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setUserId(user.id);
        
        // Cargar carrito
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

        // Cargar tarjetas de pago
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
      }
    } catch (error) {
      console.error('Error in loadUserAndCart:', error);
    } finally {
      setIsLoadingCart(false);
    }
  };

  const saveCartToSupabase = async (updatedCart: CartItem[]) => {
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
  };

  const updateQuantity = (id: string, delta: number): void => {
    const updatedCart = cart.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }).filter(item => item.quantity > 0);
    
    setCart(updatedCart);
    saveCartToSupabase(updatedCart);
  };

  const addToCart = (item: CartItem): void => {
    const updatedCart = cart.map(cartItem => 
      cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
    );
    
    setCart(updatedCart);
    saveCartToSupabase(updatedCart);
  };

  const removeFromCart = (id: string): void => {
    const updatedCart = cart.filter(item => item.id !== id);
    setCart(updatedCart);
    saveCartToSupabase(updatedCart);
  };

  const getLastFourDigits = (cardNumber: string) => {
    return cardNumber.slice(-4);
  };

  const handleAddPaymentMethod = () => {
    navigate('/payment', { state: { from: '/cart' } });
  };

  const subTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = 6;
  const total = subTotal - tax;

  if (isLoadingCart) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="max-w-2xl mx-auto p-4 pt-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Cart</h1>
        
        <div className="space-y-3 mb-8">
          {cart.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingCart size={40} className="text-gray-300" />
              </div>
              <p className="text-gray-400 text-lg font-medium">Your cart is empty</p>
              <p className="text-gray-300 text-sm mt-2">Add products to get started</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="w-20 h-20 flex items-center justify-center rounded-xl overflow-hidden flex-shrink-0 bg-gray-50">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-900 text-base mb-1">{item.name}</h4>
                  <p className="text-orange-500 font-bold text-lg">${item.price}</p>
                </div>

                <div className="flex flex-col items-end gap-3">
                  <button 
                    onClick={() => removeFromCart(item.id)} 
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                  
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => updateQuantity(item.id, -1)} 
                      className="w-8 h-8 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-all"
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
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <>
            <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Payment Summary</h3>
              
              <div className="space-y-4 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-bold text-gray-900 text-lg">${subTotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Discount</span>
                  <span className="font-bold text-green-600 text-lg">-${tax.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <span className="font-bold text-gray-900 text-lg">Total</span>
                  <span className="font-bold text-orange-500 text-2xl">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Payment Method</h3>
              
              {paymentCards.length > 0 ? (
                <div className="space-y-3 mb-4">
                  {paymentCards.map((card) => (
                    <label
                      key={card.id}
                      htmlFor={`card-${card.id}`}
                      className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        selectedPayment === card.id
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        id={`card-${card.id}`}
                        name="payment"
                        value={card.id}
                        checked={selectedPayment === card.id}
                        onChange={(e) => setSelectedPayment(e.target.value)}
                        className="sr-only"
                      />
                      <div className="flex items-center gap-3">
                        <img 
                          src={tarjetaImg} 
                          alt="Card" 
                          className="w-12 h-8 object-cover rounded"
                        />
                        <div>
                          <div className="text-sm font-semibold text-gray-900">
                            {card.card_type} ····{getLastFourDigits(card.card_number)}
                          </div>
                          <div className="text-xs text-gray-500">
                            Exp {card.expiry_date}
                          </div>
                        </div>
                      </div>
                      {selectedPayment === card.id && (
                        <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </label>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 mb-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CreditCard size={28} className="text-gray-300" />
                  </div>
                  <p className="text-gray-400 text-sm">No payment methods added yet</p>
                </div>
              )}

              <button 
                onClick={handleAddPaymentMethod}
                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-orange-500 hover:text-orange-600 hover:border-orange-500 transition-colors text-sm font-semibold flex items-center justify-center gap-2"
              >
                <span className="text-xl">+</span>
                ADD PAYMENT METHOD
              </button>
            </div>

            <button 
              disabled={paymentCards.length === 0}
              className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold text-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {paymentCards.length === 0 ? 'Add Payment Method First' : 'Place Order'}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
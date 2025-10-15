import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, Star, Heart, ShoppingCart, Plus, Minus, Trash2, ChevronDown, CheckCircle, X, CreditCard } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { products } from '../data/products';
import type { Category, Product, CartItem } from '../types';
import tarjetaImg from '../assets/images/payment/tarjeta.png';

interface PaymentCard {
  id: string;
  card_number: string;
  card_holder: string;
  expiry_date: string;
  card_type: string;
}

const FoodOrderApp: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category>('Burger');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentCards, setPaymentCards] = useState<PaymentCard[]>([]);
  const [selectedPayment, setSelectedPayment] = useState('');
  const [activeTab, setActiveTab] = useState('popular');
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [isLoadingCart, setIsLoadingCart] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastProduct, setToastProduct] = useState<Product | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadUserAndCart();
  }, []);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
        setToastProduct(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

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

  const addToCart = (product: Product): void => {
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
    
    if (window.innerWidth < 1280) {
      setToastProduct(product);
      setShowToast(true);
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

  const removeFromCart = (id: string): void => {
    const updatedCart = cart.filter(item => item.id !== id);
    setCart(updatedCart);
    saveCartToSupabase(updatedCart);
  };

  const getLastFourDigits = (cardNumber: string) => {
    return cardNumber.slice(-4);
  };

  const handleAddPaymentMethod = () => {
    navigate('/payment', { state: { from: '/arena' } });
  };

  const categories = [
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

  const subTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = 6;
  const total = subTotal - tax;

  const currentProducts = products[selectedCategory];
  const visibleCategories = showAllCategories ? categories : categories.slice(0, 8);
  const desktopVisibleCategories = categories.slice(0, 8);
  const desktopSecondRowCategories = categories.slice(8);

  if (isLoadingCart) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden pt-0 xl:pt-20 lg:pt-24">
      {showToast && toastProduct && (
        <div className="xl:hidden fixed top-4 left-4 right-4 z-50 animate-in slide-in-from-top duration-300">
          <div className="bg-white rounded-2xl shadow-2xl border-2 border-green-500 p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <CheckCircle size={24} className="text-green-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-900 text-sm">Added to cart!</p>
              <p className="text-gray-600 text-xs truncate">{toastProduct.name}</p>
            </div>
            <button 
              onClick={() => setShowToast(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-all"
            >
              <X size={18} className="text-gray-400" />
            </button>
          </div>
        </div>
      )}

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
                      onClick={() => setSelectedCategory(category.id as Category)}
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
                      onClick={() => setSelectedCategory(category.id as Category)}
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
                      onClick={() => setSelectedCategory(category.id as Category)}
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
                <div key={item.id} className="bg-white rounded-xl p-4 hover:shadow-sm transition-all border border-gray-100">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-14 h-14 flex items-center justify-center rounded-lg overflow-hidden flex-shrink-0 bg-orange-50">
                      <img src={item.image} alt={item.name} className="w-12 h-12 object-contain" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-sm mb-1 leading-tight">{item.name}</h4>
                      <p className="text-orange-500 font-bold text-base">${item.price}</p>
                    </div>

                    <button 
                      onClick={() => removeFromCart(item.id)} 
                      className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all flex-shrink-0"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between bg-gray-50 rounded-lg p-2">
                    <button 
                      onClick={() => updateQuantity(item.id, -1)} 
                      className="w-7 h-7 bg-white rounded-md flex items-center justify-center hover:bg-gray-100 transition-all shadow-sm border border-gray-200"
                    >
                      <Minus size={14} className="text-gray-700" strokeWidth={2.5} />
                    </button>
                    <span className="font-semibold text-gray-900 text-sm px-4">{item.quantity}</span>
                    <button 
                      onClick={() => addToCart(item)} 
                      className="w-7 h-7 bg-orange-500 rounded-md flex items-center justify-center hover:bg-orange-600 transition-all shadow-sm"
                    >
                      <Plus size={14} className="text-white" strokeWidth={2.5} />
                    </button>
                  </div>
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
            className="w-full py-4 bg-orange-500 text-white rounded-xl font-bold text-base hover:bg-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {paymentCards.length === 0 ? 'Add Payment Method First' : 'Place An Order Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodOrderApp;
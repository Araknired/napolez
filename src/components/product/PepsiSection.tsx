import { ShoppingCart, ChevronLeft, ChevronRight, X, CreditCard, Check, Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useTheme } from '@/context/ThemeContext';

interface Product {
  name: string;
  image: string;
  imageLarge: string;
}

interface PaymentCard {
  id: string;
  card_number: string;
  card_holder: string;
  expiry_date: string;
  card_type: string;
}

const PepsiSection = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [currentProduct, setCurrentProduct] = useState<number>(0);
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [showAddressModal, setShowAddressModal] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [paymentCards, setPaymentCards] = useState<PaymentCard[]>([]);
  const [selectedCard, setSelectedCard] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [addressData, setAddressData] = useState({
    name: '',
    address: '',
    city: '',
    country: '',
    zipCode: ''
  });

  const products: Product[] = [
    { name: 'PEPSI ZERO', image: '/images/pepsi/pepsi-zero-can.png', imageLarge: '/images/pepsi/pepsi-zero-can-60.png' },
    { name: 'PEPSI', image: '/images/pepsi/pepsi-can.png', imageLarge: '/images/pepsi/pepsi-can-60.png' },
    { name: 'PEPSI LIGHT', image: '/images/pepsi/pepsi-light.png', imageLarge: '/images/pepsi/pepsi-light-60.png' },
    { name: 'PEPSI MAX', image: '/images/pepsi/pepsi-max.png', imageLarge: '/images/pepsi/pepsi-max-45.png' },
  ];

  // Estilos dinámicos basados en el tema
  const isDark = theme === 'dark';
  
  const bgGradient = isDark 
    ? 'bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#2a2f4a]'
    : 'bg-gradient-to-br from-gray-50 via-white to-gray-100';
    
  const modalBg = isDark
    ? 'bg-gradient-to-br from-[#1a1f3a] to-[#2a2f4a]'
    : 'bg-gradient-to-br from-white to-gray-50';
    
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-white/90' : 'text-gray-700';
  const textMuted = isDark ? 'text-white/60' : 'text-gray-500';
  
  const inputBg = isDark ? 'bg-white/10' : 'bg-white';
  const inputBorder = isDark ? 'border-white/20' : 'border-gray-300';
  const inputText = isDark ? 'text-white' : 'text-gray-900';
  const inputPlaceholder = isDark ? 'placeholder-white/40' : 'placeholder-gray-400';
  
  const cardBg = isDark ? 'bg-white/5' : 'bg-gray-50';
  const cardBorder = isDark ? 'border-white/10' : 'border-gray-200';
  const cardHoverBorder = isDark ? 'hover:border-white/30' : 'hover:border-gray-400';
  
  const selectedCardBg = isDark ? 'bg-[#FF0000]/20' : 'bg-red-50';
  const selectedCardBorder = isDark ? 'border-[#FF0000]' : 'border-red-500';

  useEffect(() => {
    loadUserAndCards();
  }, []);

  const loadUserAndCards = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);
      
      const { data: cardsData } = await supabase
        .from('payment_cards')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (cardsData) {
        setPaymentCards(cardsData);
        if (cardsData.length > 0) setSelectedCard(cardsData[0].id);
      }
    } catch (error) {
      console.error('Error loading user and cards:', error);
    }
  };

  const handleDeliveryClick = async () => {
    if (!userId) {
      alert('Please log in to continue');
      navigate('/login');
      return;
    }

    setLoading(true);
    const { data: cardsData, error } = await supabase
      .from('payment_cards')
      .select('*')
      .eq('user_id', userId);
    setLoading(false);

    if (error) {
      alert('Error loading payment methods');
      return;
    }

    if (!cardsData || cardsData.length === 0) {
      navigate('/payment', { state: { from: '/pepsi' } });
      return;
    }

    setPaymentCards(cardsData);
    setSelectedCard(cardsData[0].id);
    setShowPaymentModal(true);
  };

  const handleCheckout = () => {
    if (!selectedCard) {
      alert('Please select a payment method');
      return;
    }
    setShowPaymentModal(false);
    setShowAddressModal(true);
  };

  const handleConfirmOrder = () => {
    if (!addressData.name || !addressData.address || !addressData.city || !addressData.country) {
      alert('Please fill in all required fields');
      return;
    }
    setShowAddressModal(false);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setAddressData({ name: '', address: '', city: '', country: '', zipCode: '' });
    }, 3000);
  };

  const nextProduct = () => setCurrentProduct((prev) => (prev + 1) % products.length);
  const prevProduct = () => setCurrentProduct((prev) => (prev - 1 + products.length) % products.length);
  const getLastFourDigits = (cardNumber: string) => cardNumber.slice(-4);

  const activeProduct = products[currentProduct];
  const TOTAL_REVIEWS = 9999;

  return (
    <div className={`min-h-screen ${bgGradient} relative overflow-hidden`}>
      <style>{`
        @keyframes slideInLeft { 0% { opacity: 0; transform: translateX(-100px); } 100% { opacity: 1; transform: translateX(0); } }
        @keyframes slideInRight { 0% { opacity: 0; transform: translateX(100px); } 100% { opacity: 1; transform: translateX(0); } }
        @keyframes scaleIn { 0% { opacity: 0; transform: scale(0.5); } 100% { opacity: 1; transform: scale(1); } }
        @keyframes fadeInUp { 0% { opacity: 0; transform: translateY(50px); } 100% { opacity: 1; transform: translateY(0); } }
        @keyframes logoRotate { 0% { opacity: 0; transform: rotate(-180deg) scale(0.3); } 100% { opacity: 1; transform: rotate(0) scale(1); } }
        .animate-slide-left { animation: slideInLeft 1s ease-out forwards; opacity: 0; }
        .animate-slide-right { animation: slideInRight 1s ease-out forwards; opacity: 0; }
        .animate-scale-in { animation: scaleIn 0.8s ease-out forwards; opacity: 0; }
        .animate-fade-up { animation: fadeInUp 0.8s ease-out forwards; opacity: 0; }
        .animate-logo-rotate { animation: logoRotate 1.5s ease-out forwards; opacity: 0; }
      `}</style>
      
      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className={`fixed top-6 md:top-32 right-6 z-50 p-3 rounded-full ${isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-200 hover:bg-gray-300'} backdrop-blur-md border-2 ${isDark ? 'border-white/20' : 'border-gray-300'} transition-all duration-300 shadow-lg hover:scale-110 active:scale-95`}
        aria-label="Toggle theme"
      >
        {isDark ? <Sun className="w-6 h-6 text-yellow-300" /> : <Moon className="w-6 h-6 text-gray-700" />}
      </button>
      
      {/* Background effects - solo en modo oscuro */}
      {isDark && (
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-purple-900/30 to-red-900/40"></div>
          <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-40 right-40 w-[500px] h-[500px] bg-red-500/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 right-1/4 w-[600px] h-[600px] bg-gradient-radial from-blue-400/20 via-transparent to-transparent blur-2xl"></div>
          <div className="absolute top-0 left-1/4 w-1 h-full bg-gradient-to-b from-transparent via-blue-400/40 to-transparent"></div>
          <div className="absolute top-0 right-1/3 w-1 h-full bg-gradient-to-b from-transparent via-red-400/40 to-transparent"></div>
          <div className="absolute top-1/4 left-1/2 w-2 h-2 bg-white rounded-full animate-ping"></div>
          <div className="absolute top-3/4 left-1/4 w-2 h-2 bg-blue-300 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
          <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-red-300 rounded-full animate-ping" style={{animationDelay: '1.5s'}}></div>
        </div>
      )}
      
      <div className="relative z-10 px-6 md:px-16 md:pt-16 flex flex-col md:flex-row items-center justify-between min-h-screen -mt-24 md:mt-0">
        <div className="w-full md:w-[42%] space-y-6 md:space-y-10 md:-mt-8 order-2 md:order-1 pb-8 md:pb-0">
          <div className={`flex items-center justify-start md:justify-start gap-2 md:gap-3 ${textSecondary} text-base md:text-lg animate-slide-left`} style={{animationDelay: '0.2s'}}>
            <div className="bg-[#FF0000] px-3 md:px-5 py-2 md:py-2.5 rounded-lg flex items-center gap-2">
              <span className="text-xl md:text-2xl">⭐</span>
              <span className="font-bold text-lg md:text-xl text-white">{TOTAL_REVIEWS}</span>
            </div>
            <span className="text-base md:text-xl">People tested it</span>
          </div>

          <h1 className={`font-rammetto text-[80px] sm:text-[120px] md:text-[180px] lg:text-[220px] leading-[0.8] ${textPrimary} tracking-wide text-left md:text-left md:-ml-2 animate-scale-in`} style={{animationDelay: '0.4s'}}>
            PEPSI
          </h1>

          <div className={`border-l-[4px] md:border-l-[6px] border-[#FF0000] pl-4 md:pl-8 -mt-2 md:-mt-4 animate-slide-left pr-4`} style={{animationDelay: '0.6s'}}>
            <p className={`${textSecondary} text-base md:text-xl leading-relaxed max-w-[85%] md:max-w-lg`}>
              Enjoy the best beverage of all time, brought to you by the biggest enthusiasts in the country.
            </p>
          </div>

          <div className="flex justify-center md:justify-start gap-4 -mt-4 md:pt-4 animate-fade-up" style={{animationDelay: '0.8s'}}>
            <button 
              className="bg-[#FF0000]/80 backdrop-blur-md border-2 border-white/30 hover:bg-[#FF0000] hover:shadow-[0_0_30px_rgba(255,0,0,0.8),0_0_60px_rgba(255,0,0,0.5)] hover:border-red-400 hover:scale-105 active:scale-95 text-white px-8 md:px-12 py-3 md:py-4 rounded-full flex items-center gap-2 md:gap-3 font-bold text-lg md:text-xl transition-all duration-300 shadow-xl disabled:opacity-50"
              onClick={handleDeliveryClick}
              disabled={loading}
            >
              <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
              {loading ? 'Loading...' : 'Delivery'}
            </button>
          </div>

          <div className={`md:flex items-center justify-center gap-3 md:gap-6 pt-4 md:pt-6 -mt-8 md:mt-0 animate-fade-up hidden`} style={{animationDelay: '1s'}}>
            <button onClick={prevProduct} className={`${isDark ? 'bg-white/10 border-white/20 hover:bg-white/20' : 'bg-white border-gray-300 hover:bg-gray-50'} backdrop-blur-md border-2 hover:scale-110 active:scale-95 p-3 md:p-5 rounded-full transition-all duration-300 shadow-xl hover:shadow-2xl`}>
              <ChevronLeft className={`w-6 h-6 md:w-8 md:h-8 ${textPrimary}`} />
            </button>
            
            <div className={`${isDark ? 'bg-white/10 border-white/20' : 'bg-white border-gray-300'} backdrop-blur-md border-2 rounded-2xl md:rounded-3xl px-6 md:px-12 py-4 md:py-6 flex items-center gap-3 md:gap-6 min-w-[220px] md:min-w-[280px] shadow-2xl transition-all duration-300`}>
              <img key={`small-${currentProduct}`} src={activeProduct.image} alt={activeProduct.name} className="h-20 md:h-28 object-contain" />
              <div>
                <p className={`${textMuted} text-xs md:text-sm uppercase tracking-wider font-semibold`}>VERSION</p>
                <p className={`${textPrimary} font-bold text-lg md:text-2xl mt-1`}>{activeProduct.name}</p>
              </div>
            </div>

            <button onClick={nextProduct} className={`${isDark ? 'bg-white/10 border-white/20 hover:bg-white/20' : 'bg-white border-gray-300 hover:bg-gray-50'} backdrop-blur-md border-2 hover:scale-110 active:scale-95 p-3 md:p-5 rounded-full transition-all duration-300 shadow-xl hover:shadow-2xl`}>
              <ChevronRight className={`w-6 h-6 md:w-8 md:h-8 ${textPrimary}`} />
            </button>
          </div>
        </div>

        <div className="w-full md:w-[58%] flex items-center justify-center relative h-[50vh] md:h-full order-1 md:order-2 mt-12 md:mt-0">
          <div className="absolute inset-0 flex items-center justify-center md:justify-end overflow-visible md:-right-40 animate-logo-rotate mt-12 md:mt-0" style={{animationDelay: '0.3s'}}>
            <img src="/images/pepsi/pepsi-logo.png" alt="PEPSI Background" className={`w-[600px] md:w-[1500%] h-auto object-contain ${isDark ? 'opacity-80 md:opacity-100' : 'opacity-40 md:opacity-60'}`} />
          </div>
          
          <img key={currentProduct} src={activeProduct.imageLarge} alt={activeProduct.name} className="relative h-[350px] md:h-[900px] object-contain z-10 md:-mr-32 animate-slide-right mt-12 md:mt-0" style={{animationDelay: '0.7s', filter: 'drop-shadow(0 15px 30px rgba(0, 0, 0, 0.8)) drop-shadow(0 8px 15px rgba(0, 0, 0, 0.6))'}} />

          <div className="md:hidden absolute inset-x-0 top-1/2 flex justify-between px-4 z-20 mt-6">
            <button onClick={prevProduct} className={`${isDark ? 'bg-white/10 border-white/20 hover:bg-white/20' : 'bg-white border-gray-300 hover:bg-gray-50'} backdrop-blur-md border-2 hover:scale-110 active:scale-95 p-3 rounded-full transition-all duration-300 shadow-xl`}>
              <ChevronLeft className={`w-6 h-6 ${textPrimary}`} />
            </button>
            <button onClick={nextProduct} className={`${isDark ? 'bg-white/10 border-white/20 hover:bg-white/20' : 'bg-white border-gray-300 hover:bg-gray-50'} backdrop-blur-md border-2 hover:scale-110 active:scale-95 p-3 rounded-full transition-all duration-300 shadow-xl`}>
              <ChevronRight className={`w-6 h-6 ${textPrimary}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`${modalBg} rounded-2xl max-w-md w-full p-6 md:p-8 shadow-2xl border-2 ${isDark ? 'border-white/20' : 'border-gray-300'} relative animate-scale-in`}>
            <button onClick={() => setShowPaymentModal(false)} className={`absolute top-4 right-4 ${textMuted} hover:${textPrimary} transition-colors`}>
              <X className="w-6 h-6" />
            </button>

            <h2 className={`text-2xl md:text-3xl font-bold ${textPrimary} mb-6`}>Choose Payment Method</h2>

            <div className="space-y-3 mb-6">
              {paymentCards.map((card) => (
                <div 
                  key={card.id} 
                  onClick={() => setSelectedCard(card.id)} 
                  className={`p-4 rounded-xl cursor-pointer transition-all ${
                    selectedCard === card.id 
                      ? `${selectedCardBg} border-2 ${selectedCardBorder}` 
                      : `${cardBg} border-2 ${cardBorder} ${cardHoverBorder}`
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CreditCard className={`w-6 h-6 ${textPrimary}`} />
                      <div>
                        <p className={`${textPrimary} font-semibold`}>{card.card_type}</p>
                        <p className={`${textMuted} text-sm`}>•••• •••• •••• {getLastFourDigits(card.card_number)}</p>
                      </div>
                    </div>
                    {selectedCard === card.id && <Check className="w-5 h-5 text-[#FF0000]" />}
                  </div>
                </div>
              ))}

              <button 
                onClick={() => navigate('/payment', { state: { from: '/product' } })} 
                className={`w-full p-4 rounded-xl border-2 border-dashed ${isDark ? 'border-white/30 hover:border-white/50 text-white/70 hover:text-white' : 'border-gray-400 hover:border-gray-600 text-gray-600 hover:text-gray-900'} transition-all flex items-center justify-center gap-2`}
              >
                <span className="text-xl">+</span>
                Add New Card
              </button>
            </div>

            <button 
              onClick={handleCheckout} 
              disabled={!selectedCard} 
              className="w-full bg-[#FF0000] hover:bg-[#FF0000]/90 disabled:bg-[#FF0000]/50 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 active:scale-95 shadow-xl"
            >
              Complete Purchase
            </button>
          </div>
        </div>
      )}

      {/* Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`${modalBg} rounded-2xl max-w-md w-full p-6 md:p-8 shadow-2xl border-2 ${isDark ? 'border-white/20' : 'border-gray-300'} relative animate-scale-in max-h-[90vh] overflow-y-auto`}>
            <button onClick={() => setShowAddressModal(false)} className={`absolute top-4 right-4 ${textMuted} hover:${textPrimary} transition-colors`}>
              <X className="w-6 h-6" />
            </button>

            <h2 className={`text-2xl md:text-3xl font-bold ${textPrimary} mb-6`}>Shipping Address</h2>

            <div className="space-y-4">
              <div>
                <label className={`${textSecondary} text-sm mb-2 block font-semibold`}>Full Name *</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={addressData.name}
                  onChange={(e) => setAddressData({...addressData, name: e.target.value})}
                  className={`w-full ${inputBg} border-2 ${inputBorder} rounded-lg px-4 py-3 ${inputText} ${inputPlaceholder} focus:border-[#FF0000] focus:outline-none transition-colors`}
                />
              </div>

              <div>
                <label className={`${textSecondary} text-sm mb-2 block font-semibold`}>Street Address *</label>
                <input
                  type="text"
                  placeholder="123 Main Street, Apt 4B"
                  value={addressData.address}
                  onChange={(e) => setAddressData({...addressData, address: e.target.value})}
                  className={`w-full ${inputBg} border-2 ${inputBorder} rounded-lg px-4 py-3 ${inputText} ${inputPlaceholder} focus:border-[#FF0000] focus:outline-none transition-colors`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`${textSecondary} text-sm mb-2 block font-semibold`}>City *</label>
                  <input
                    type="text"
                    placeholder="New York"
                    value={addressData.city}
                    onChange={(e) => setAddressData({...addressData, city: e.target.value})}
                    className={`w-full ${inputBg} border-2 ${inputBorder} rounded-lg px-4 py-3 ${inputText} ${inputPlaceholder} focus:border-[#FF0000] focus:outline-none transition-colors`}
                  />
                </div>

                <div>
                  <label className={`${textSecondary} text-sm mb-2 block font-semibold`}>Zip Code</label>
                  <input
                    type="text"
                    placeholder="10001"
                    value={addressData.zipCode}
                    onChange={(e) => setAddressData({...addressData, zipCode: e.target.value})}
                    className={`w-full ${inputBg} border-2 ${inputBorder} rounded-lg px-4 py-3 ${inputText} ${inputPlaceholder} focus:border-[#FF0000] focus:outline-none transition-colors`}
                  />
                </div>
              </div>

              <div>
                <label className={`${textSecondary} text-sm mb-2 block font-semibold`}>Country *</label>
                <input
                  type="text"
                  placeholder="United States"
                  value={addressData.country}
                  onChange={(e) => setAddressData({...addressData, country: e.target.value})}
                  className={`w-full ${inputBg} border-2 ${inputBorder} rounded-lg px-4 py-3 ${inputText} ${inputPlaceholder} focus:border-[#FF0000] focus:outline-none transition-colors`}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setShowAddressModal(false)} 
                className={`flex-1 ${isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-200 hover:bg-gray-300'} ${textPrimary} py-3 rounded-xl font-semibold transition-all`}
              >
                Back
              </button>
              <button 
                onClick={handleConfirmOrder} 
                className="flex-1 bg-[#FF0000] hover:bg-[#FF0000]/90 text-white py-3 rounded-xl font-semibold transition-all hover:scale-105 active:scale-95"
              >
                Confirm Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`${modalBg} rounded-2xl max-w-md w-full p-8 shadow-2xl border-2 border-[#FF0000] text-center animate-scale-in`}>
            <div className="w-20 h-20 bg-[#FF0000] rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-white" />
            </div>
            <h2 className={`text-3xl font-bold ${textPrimary} mb-3`}>Purchase Successful!</h2>
            <p className={`${textMuted} text-lg`}>Your Pepsi order has been confirmed</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PepsiSection;
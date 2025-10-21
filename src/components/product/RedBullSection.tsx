import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, CreditCard, Check } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useTheme } from '@/context/ThemeContext';
import type { CanData } from '../../types/redbull.types';
import { cansData } from '../../data/redbull';
import RedBullGrid from './redbull/RedBullGrid';
import RedBullModal from './redbull/RedBullModal';

interface PaymentCard {
  id: string;
  card_number: string;
  card_holder: string;
  expiry_date: string;
  card_type: string;
}

const RedBullSection = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [selectedCan, setSelectedCan] = useState<CanData | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  
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

  // Estilos dinámicos basados en el tema
  const isDark = theme === 'dark';
  
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
  
  const selectedCardBg = isDark ? 'bg-blue-600/20' : 'bg-blue-50';
  const selectedCardBorder = isDark ? 'border-blue-500' : 'border-blue-500';

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

  const handleCanClick = (can: CanData) => {
    setIsClosing(false);
    setSelectedCan(can);
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setSelectedCan(null);
      setIsClosing(false);
    }, 300);
  };

  const handleBuyClick = async () => {
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
      navigate('/payment', { state: { from: '/product' } });
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

  const getLastFourDigits = (cardNumber: string) => cardNumber.slice(-4);

  return (
    <section className="min-h-screen relative overflow-hidden bg-black">
      <div
        className="absolute inset-0 bg-cover animate-[fadeInSharp_1.5s_ease-out_forwards] hidden md:block"
        style={{
          backgroundImage: "url('/images/red-bull/RedBullSection.png')",
          backgroundPosition: 'center calc(50% - 80px)'
        }}
      />
     
      <div className="absolute top-[23%] left-[35%] right-0 justify-start items-center -space-x-6 px-8 z-10 hidden md:flex">
        {cansData.map((can, index) => (
          <img
            key={can.id}
            src={can.image}
            alt={can.name}
            onClick={() => handleCanClick(can)}
            className={`${can.className} object-contain hover:scale-110 transition-transform duration-300 drop-shadow-2xl cursor-pointer opacity-0 scale-80`}
            style={{
              animation: `fadeInZoom 0.6s ease-out ${1.5 + index * 0.15}s forwards`
            }}
          />
        ))}
      </div>

      <RedBullGrid cans={cansData} onSelect={handleCanClick} />

      {selectedCan && (
        <RedBullModal 
          can={selectedCan} 
          onClose={handleClose} 
          isClosing={isClosing}
          onBuyClick={handleBuyClick}
          loading={loading}
        />
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
          <div className={`${modalBg} rounded-2xl max-w-md w-full p-6 md:p-8 shadow-2xl border-2 ${isDark ? 'border-white/20' : 'border-gray-300'} relative animate-scale-in`}>
            <button 
              onClick={() => setShowPaymentModal(false)} 
              className={`absolute top-4 right-4 ${textMuted} hover:${textPrimary} transition-colors`}
            >
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
                    {selectedCard === card.id && <Check className="w-5 h-5 text-blue-500" />}
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
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 active:scale-95 shadow-xl"
            >
              Complete Purchase
            </button>
          </div>
        </div>
      )}

      {/* Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
          <div className={`${modalBg} rounded-2xl max-w-md w-full p-6 md:p-8 shadow-2xl border-2 ${isDark ? 'border-white/20' : 'border-gray-300'} relative animate-scale-in max-h-[90vh] overflow-y-auto`}>
            <button 
              onClick={() => setShowAddressModal(false)} 
              className={`absolute top-4 right-4 ${textMuted} hover:${textPrimary} transition-colors`}
            >
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
                  className={`w-full ${inputBg} border-2 ${inputBorder} rounded-lg px-4 py-3 ${inputText} ${inputPlaceholder} focus:border-blue-500 focus:outline-none transition-colors`}
                />
              </div>

              <div>
                <label className={`${textSecondary} text-sm mb-2 block font-semibold`}>Street Address *</label>
                <input
                  type="text"
                  placeholder="123 Main Street, Apt 4B"
                  value={addressData.address}
                  onChange={(e) => setAddressData({...addressData, address: e.target.value})}
                  className={`w-full ${inputBg} border-2 ${inputBorder} rounded-lg px-4 py-3 ${inputText} ${inputPlaceholder} focus:border-blue-500 focus:outline-none transition-colors`}
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
                    className={`w-full ${inputBg} border-2 ${inputBorder} rounded-lg px-4 py-3 ${inputText} ${inputPlaceholder} focus:border-blue-500 focus:outline-none transition-colors`}
                  />
                </div>

                <div>
                  <label className={`${textSecondary} text-sm mb-2 block font-semibold`}>Zip Code</label>
                  <input
                    type="text"
                    placeholder="10001"
                    value={addressData.zipCode}
                    onChange={(e) => setAddressData({...addressData, zipCode: e.target.value})}
                    className={`w-full ${inputBg} border-2 ${inputBorder} rounded-lg px-4 py-3 ${inputText} ${inputPlaceholder} focus:border-blue-500 focus:outline-none transition-colors`}
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
                  className={`w-full ${inputBg} border-2 ${inputBorder} rounded-lg px-4 py-3 ${inputText} ${inputPlaceholder} focus:border-blue-500 focus:outline-none transition-colors`}
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
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-all hover:scale-105 active:scale-95"
              >
                Confirm Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
          <div className={`${modalBg} rounded-2xl max-w-md w-full p-8 shadow-2xl border-2 border-blue-500 text-center animate-scale-in`}>
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-white" />
            </div>
            <h2 className={`text-3xl font-bold ${textPrimary} mb-3`}>Purchase Successful!</h2>
            <p className={`${textMuted} text-lg`}>Your Red Bull order has been confirmed</p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeInSharp {
          0% {
            filter: blur(20px);
            opacity: 0;
          }
          100% {
            filter: blur(0px);
            opacity: 1;
          }
        }

        @keyframes fadeInZoom {
          0% {
            opacity: 0;
            transform: scale(0.8) translateY(20px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideIn {
          0% {
            transform: scale(0.95) translateY(20px);
            opacity: 0;
          }
          100% {
            transform: scale(1) translateY(0);
            opacity: 1;
          }
        }

        @keyframes scale-in {
          0% { opacity: 0; transform: scale(0.5); }
          100% { opacity: 1; transform: scale(1); }
        }
        
        .animate-scale-in {
          animation: scale-in 0.3s ease-out forwards;
        }
      `}</style>
    </section>
  );
};

export default RedBullSection;
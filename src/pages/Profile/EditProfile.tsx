import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Camera, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useTheme } from '../../context/ThemeContext';

interface PaymentCard {
  id: string;
  card_number: string;
  card_holder: string;
  expiry_date: string;
  card_type: string;
}

export default function EditProfile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [paymentCards, setPaymentCards] = useState<PaymentCard[]>([]);
  const [selectedCard, setSelectedCard] = useState<string>('');
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    password: '••••••••••',
    phone: '',
    address: '',
    nation: '',
    gender: 'Male',
    birthMonth: 'January',
    birthDay: '1',
    birthYear: '1990',
    twitter: '',
    linkedin: '',
    facebook: '',
    google: '',
    slogan: '',
    language: 'English'
  });

  useEffect(() => {
    fetchUserData();
    fetchPaymentCards();
  }, [user]);

  const fetchUserData = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (data && !error) {
        const nameParts = data.full_name?.split(' ') || ['', ''];
        setFormData(prev => ({
          ...prev,
          firstName: nameParts[0] || '',
          lastName: nameParts.slice(1).join(' ') || '',
          phone: data.phone || '',
          address: data.address || '',
          nation: data.nation || '',
          gender: data.gender || 'Male',
          birthMonth: data.birth_month || 'January',
          birthDay: data.birth_day || '1',
          birthYear: data.birth_year || '1990',
          twitter: data.twitter || '',
          linkedin: data.linkedin || '',
          facebook: data.facebook || '',
          google: data.google || '',
          slogan: data.slogan || '',
          language: data.language || 'English'
        }));
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
    }
  };

  const fetchPaymentCards = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('payment_cards')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (data && !error) {
        setPaymentCards(data);
        if (data.length > 0 && !selectedCard) {
          setSelectedCard(data[0].id);
        }
      }
    } catch (err) {
      console.error('Error fetching payment cards:', err);
    }
  };

  const handleRemoveCard = async (cardId: string) => {
    if (!confirm('Are you sure you want to remove this card?')) return;

    try {
      const { error } = await supabase
        .from('payment_cards')
        .delete()
        .eq('id', cardId);

      if (!error) {
        setPaymentCards(prev => prev.filter(card => card.id !== cardId));
        if (selectedCard === cardId) {
          setSelectedCard(paymentCards.find(c => c.id !== cardId)?.id || '');
        }
        setMessage('Card removed successfully');
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (err) {
      console.error('Error removing card:', err);
      setError('Failed to remove card');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();

      const { error: updateError } = await supabase
        .from('users')
        .upsert({
          user_id: user.id,
          full_name: fullName,
          phone: formData.phone || null,
          address: formData.address || null,
          nation: formData.nation || null,
          gender: formData.gender,
          birth_month: formData.birthMonth,
          birth_day: formData.birthDay,
          birth_year: formData.birthYear,
          twitter: formData.twitter || null,
          linkedin: formData.linkedin || null,
          facebook: formData.facebook || null,
          google: formData.google || null,
          slogan: formData.slogan || null,
          language: formData.language,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (updateError) {
        setError('Failed to update profile');
        console.error('Error updating profile:', updateError);
      } else {
        setMessage('Profile updated successfully!');
        setTimeout(() => {
          navigate('/profile');
        }, 1500);
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Error saving profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/profile');
  };

  const handleAddPaymentMethod = () => {
    navigate('/payment');
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getLastFourDigits = (cardNumber: string) => {
    return cardNumber.slice(-4);
  };

  // CLASES CONDICIONALES PARA MODO OSCURO
  const isDark = theme === 'dark';
  
  const containerClasses = isDark ? 'bg-slate-900 text-white' : 'bg-gray-50 text-gray-900';
  const cardClasses = isDark ? 'bg-slate-800 shadow-xl shadow-black/30' : 'bg-white shadow-sm';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-500';
  const textBreadcrumb = isDark ? 'text-gray-500' : 'text-gray-400';
  const inputClasses = isDark 
    ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-500 focus:ring-blue-500' 
    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-blue-500';
  const selectClasses = `${inputClasses} appearance-none cursor-pointer`;
  const btnCancelClasses = isDark 
    ? 'text-gray-400 hover:text-white' 
    : 'text-gray-600 hover:text-gray-900';
  const msgSuccessClasses = isDark
    ? 'bg-green-900 border-green-500 text-green-300'
    : 'bg-green-50 border-green-500 text-green-700';
  const msgErrorClasses = isDark
    ? 'bg-red-900 border-red-500 text-red-300'
    : 'bg-red-50 border-red-500 text-red-700';
  const paymentCardDefaultClasses = isDark
    ? 'border-gray-600 hover:bg-slate-700'
    : 'border-gray-200 hover:bg-gray-50';
  const paymentCardCheckedClasses = isDark
    ? 'peer-checked:border-blue-500 peer-checked:bg-blue-900/50'
    : 'peer-checked:border-blue-500 peer-checked:bg-blue-50';
  const paymentCardTextSecondary = isDark ? 'text-gray-500' : 'text-gray-500';
  const paymentCardRemoveButton = isDark ? 'text-red-500 hover:text-red-400' : 'text-red-400 hover:text-red-600';
  const addPaymentButtonClasses = isDark 
    ? 'border-gray-600 text-green-400 hover:border-green-400 hover:text-green-300'
    : 'border-gray-300 text-green-500 hover:border-green-500 hover:text-green-600';


  return (
    <div className={`min-h-screen ${containerClasses} pt-4 lg:pt-24`}>
      {/* AÑADIDO: pb-24 para dejar espacio al MobileTabBar en móviles (lg:pb-8 para escritorio) */}
      <div className="h-[calc(100vh-1rem)] lg:h-[calc(100vh-6rem)] overflow-y-auto px-4 sm:px-6 lg:px-8 pb-24 lg:pb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-sm">
            <span className={textBreadcrumb}>My profile</span>
            <span className={textBreadcrumb}>›</span>
            <span className={`font-medium ${textPrimary}`}>Edit Profile</span>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleCancel}
              className={`flex items-center gap-2 px-4 py-2 ${btnCancelClasses} transition-colors`}
              disabled={loading}
            >
              <span>Cancel</span>
              <X className="w-4 h-4" />
            </button>
            <button 
              onClick={handleSave}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-full transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <span>Save</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>

        {message && (
          <div className={`mb-6 border-l-4 px-4 py-3 rounded ${msgSuccessClasses}`}>
            {message}
          </div>
        )}

        {error && (
          <div className={`mb-6 border-l-4 px-4 py-3 rounded ${msgErrorClasses}`}>
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className={`${cardClasses} rounded-2xl p-6`}>
              <div className="flex flex-col items-center">
                <div className="relative mb-6">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg overflow-hidden">
                    {formData.firstName.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
                  </div>
                  <button className="absolute bottom-0 right-0 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-colors">
                    <Camera className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className={`block text-xs font-medium ${textSecondary} mb-2`}>
                    First Name
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-sm ${inputClasses}`}
                    placeholder="Arthur"
                  />
                </div>

                <div>
                  <label className={`block text-xs font-medium ${textSecondary} mb-2`}>
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-sm ${inputClasses}`}
                    placeholder="Nancy"
                  />
                </div>

                <div>
                  <label className={`block text-xs font-medium ${textSecondary} mb-2`}>
                    Password
                  </label>
                  <div className="flex items-center justify-between">
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className={`flex-1 px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-sm ${inputClasses}`}
                      placeholder="••••••••••"
                      disabled
                    />
                    <button 
                      onClick={() => navigate('/forgot-password')}
                      className="ml-3 text-green-500 hover:text-green-600 text-xs font-medium whitespace-nowrap"
                    >
                      CHANGE PASSWORD
                    </button>
                  </div>
                </div>

                <div>
                  <label className={`block text-xs font-medium ${textSecondary} mb-2`}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-sm ${inputClasses}`}
                    placeholder="bradley.ortiz@gmail.com"
                    disabled
                  />
                </div>

                <div>
                  <label className={`block text-xs font-medium ${textSecondary} mb-2`}>
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-sm ${inputClasses}`}
                    placeholder="477-046-1827"
                  />
                </div>

                <div>
                  <label className={`block text-xs font-medium ${textSecondary} mb-2`}>
                    Address
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-sm ${inputClasses}`}
                    placeholder="H8 Jaaskeldi Stravonus Suita 883"
                  />
                </div>

                <div>
                  <label className={`block text-xs font-medium ${textSecondary} mb-2`}>
                    Nation
                  </label>
                  <input
                    type="text"
                    value={formData.nation}
                    onChange={(e) => setFormData({...formData, nation: e.target.value})}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-sm ${inputClasses}`}
                    placeholder="Colombia"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            {/* General Settings Card */}
            <div className={`${cardClasses} rounded-2xl p-6`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-xs font-medium ${textSecondary} mb-2`}>
                    Gender
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({...formData, gender: e.target.value})}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-sm ${selectClasses}`}
                  >
                    <option className={isDark ? 'bg-slate-700' : 'bg-white'}>Male</option>
                    <option className={isDark ? 'bg-slate-700' : 'bg-white'}>Female</option>
                    <option className={isDark ? 'bg-slate-700' : 'bg-white'}>Other</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-xs font-medium ${textSecondary} mb-2`}>
                    Language
                  </label>
                  <select
                    value={formData.language}
                    onChange={(e) => setFormData({...formData, language: e.target.value})}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-sm ${selectClasses}`}
                  >
                    <option className={isDark ? 'bg-slate-700' : 'bg-white'}>English</option>
                    <option className={isDark ? 'bg-slate-700' : 'bg-white'}>Spanish</option>
                    <option className={isDark ? 'bg-slate-700' : 'bg-white'}>French</option>
                    <option className={isDark ? 'bg-slate-700' : 'bg-white'}>German</option>
                    <option className={isDark ? 'bg-slate-700' : 'bg-white'}>Portuguese</option>
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <label className={`block text-xs font-medium ${textSecondary} mb-2`}>
                  Date of Birth
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <select
                    value={formData.birthMonth}
                    onChange={(e) => setFormData({...formData, birthMonth: e.target.value})}
                    className={`px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-sm ${selectClasses}`}
                  >
                    {months.map(month => (
                      <option key={month} className={isDark ? 'bg-slate-700' : 'bg-white'}>{month}</option>
                    ))}
                  </select>
                  <select
                    value={formData.birthDay}
                    onChange={(e) => setFormData({...formData, birthDay: e.target.value})}
                    className={`px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-sm ${selectClasses}`}
                  >
                    {Array.from({length: 31}, (_, i) => i + 1).map(day => (
                      <option key={day} className={isDark ? 'bg-slate-700' : 'bg-white'}>{day}</option>
                    ))}
                  </select>
                  <select
                    value={formData.birthYear}
                    onChange={(e) => setFormData({...formData, birthYear: e.target.value})}
                    className={`px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-sm ${selectClasses}`}
                  >
                    {Array.from({length: 100}, (_, i) => 2024 - i).map(year => (
                      <option key={year} className={isDark ? 'bg-slate-700' : 'bg-white'}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <label className={`block text-xs font-medium ${textSecondary} mb-2`}>
                    Twitter
                  </label>
                  <input
                    type="text"
                    value={formData.twitter}
                    onChange={(e) => setFormData({...formData, twitter: e.target.value})}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-sm ${inputClasses}`}
                    placeholder="twitter.com/envato"
                  />
                </div>

                <div>
                  <label className={`block text-xs font-medium ${textSecondary} mb-2`}>
                    Linked In
                  </label>
                  <input
                    type="text"
                    value={formData.linkedin}
                    onChange={(e) => setFormData({...formData, linkedin: e.target.value})}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-sm ${inputClasses}`}
                    placeholder="linked.in/envato"
                  />
                </div>

                <div>
                  <label className={`block text-xs font-medium ${textSecondary} mb-2`}>
                    Facebook
                  </label>
                  <input
                    type="text"
                    value={formData.facebook}
                    onChange={(e) => setFormData({...formData, facebook: e.target.value})}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-sm ${inputClasses}`}
                    placeholder="facebook.com/envato"
                  />
                </div>

                <div>
                  <label className={`block text-xs font-medium ${textSecondary} mb-2`}>
                    Google
                  </label>
                  <input
                    type="text"
                    value={formData.google}
                    onChange={(e) => setFormData({...formData, google: e.target.value})}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-sm ${inputClasses}`}
                    placeholder="zachary.Rust"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className={`block text-xs font-medium ${textSecondary} mb-2`}>
                  Slogan
                </label>
                <input
                  type="text"
                  value={formData.slogan}
                  onChange={(e) => setFormData({...formData, slogan: e.target.value})}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-sm ${inputClasses}`}
                  placeholder="Land acquisition Specialist"
                />
              </div>
            </div>

            {/* Payment Method Card */}
            <div className={`${cardClasses} rounded-2xl p-6`}>
              <label className={`block text-xs font-medium ${textSecondary} mb-4`}>
                Payment Method
              </label>
              
              {paymentCards.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {paymentCards.map((card) => (
                    <div key={card.id} className="relative">
                      <input
                        type="radio"
                        name="payment"
                        value={card.id}
                        checked={selectedCard === card.id}
                        onChange={(e) => setSelectedCard(e.target.value)}
                        className="peer sr-only"
                        id={card.id}
                      />
                      <label
                        htmlFor={card.id}
                        className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all ${paymentCardDefaultClasses} ${paymentCardCheckedClasses}`}
                      >
                        <div className="flex items-center gap-3">
                          <img 
                            src="/images/payment/tarjeta.png" 
                            alt="Card" 
                            className="w-12 h-8 object-cover rounded"
                          />
                          <div>
                            <div className={`text-sm font-medium ${textPrimary}`}>
                              {card.card_type} ....{getLastFourDigits(card.card_number)}
                            </div>
                            <div className={`text-xs ${paymentCardTextSecondary}`}>
                              Exp {card.expiry_date}
                            </div>
                          </div>
                        </div>
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            handleRemoveCard(card.id);
                          }}
                          className={`text-xs ${paymentCardRemoveButton}`}
                        >
                          REMOVE
                        </button>
                      </label>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={`text-center py-8 text-sm ${textSecondary}`}>
                  No payment methods added yet
                </div>
              )}

              <button 
                onClick={handleAddPaymentMethod}
                className={`mt-4 w-full py-3 border-2 border-dashed rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors ${addPaymentButtonClasses}`}
              >
                <span className="text-lg">+</span>
                ADD PAYMENT METHOD
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
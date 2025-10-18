import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Camera, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';

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

  return (
    <div className="min-h-screen bg-gray-50 pt-4 lg:pt-24">
      <div className="h-[calc(100vh-1rem)] lg:h-[calc(100vh-6rem)] overflow-y-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-400">My profile</span>
            <span className="text-gray-400">›</span>
            <span className="text-gray-900 font-medium">Edit Profile</span>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleCancel}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
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
          <div className="mb-6 bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6">
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
                  <label className="block text-xs font-medium text-gray-500 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="Arthur"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="Nancy"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-2">
                    Password
                  </label>
                  <div className="flex items-center justify-between">
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
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
                  <label className="block text-xs font-medium text-gray-500 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="bradley.ortiz@gmail.com"
                    disabled
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="477-046-1827"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="H8 Jaaskeldi Stravonus Suita 883"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-2">
                    Nation
                  </label>
                  <input
                    type="text"
                    value={formData.nation}
                    onChange={(e) => setFormData({...formData, nation: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="Colombia"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-2">
                    Gender
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({...formData, gender: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm appearance-none cursor-pointer"
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-2">
                    Language
                  </label>
                  <select
                    value={formData.language}
                    onChange={(e) => setFormData({...formData, language: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm appearance-none cursor-pointer"
                  >
                    <option>English</option>
                    <option>Spanish</option>
                    <option>French</option>
                    <option>German</option>
                    <option>Portuguese</option>
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-xs font-medium text-gray-500 mb-2">
                  Date of Birth
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <select
                    value={formData.birthMonth}
                    onChange={(e) => setFormData({...formData, birthMonth: e.target.value})}
                    className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm appearance-none cursor-pointer"
                  >
                    {months.map(month => (
                      <option key={month}>{month}</option>
                    ))}
                  </select>
                  <select
                    value={formData.birthDay}
                    onChange={(e) => setFormData({...formData, birthDay: e.target.value})}
                    className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm appearance-none cursor-pointer"
                  >
                    {Array.from({length: 31}, (_, i) => i + 1).map(day => (
                      <option key={day}>{day}</option>
                    ))}
                  </select>
                  <select
                    value={formData.birthYear}
                    onChange={(e) => setFormData({...formData, birthYear: e.target.value})}
                    className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm appearance-none cursor-pointer"
                  >
                    {Array.from({length: 100}, (_, i) => 2024 - i).map(year => (
                      <option key={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-2">
                    Twitter
                  </label>
                  <input
                    type="text"
                    value={formData.twitter}
                    onChange={(e) => setFormData({...formData, twitter: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="twitter.com/envato"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-2">
                    Linked In
                  </label>
                  <input
                    type="text"
                    value={formData.linkedin}
                    onChange={(e) => setFormData({...formData, linkedin: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="linked.in/envato"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-2">
                    Facebook
                  </label>
                  <input
                    type="text"
                    value={formData.facebook}
                    onChange={(e) => setFormData({...formData, facebook: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="facebook.com/envato"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-2">
                    Google
                  </label>
                  <input
                    type="text"
                    value={formData.google}
                    onChange={(e) => setFormData({...formData, google: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="zachary.Rust"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-xs font-medium text-gray-500 mb-2">
                  Slogan
                </label>
                <input
                  type="text"
                  value={formData.slogan}
                  onChange={(e) => setFormData({...formData, slogan: e.target.value})}
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="Land acquisition Specialist"
                />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6">
              <label className="block text-xs font-medium text-gray-500 mb-4">
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
                        className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg cursor-pointer peer-checked:border-blue-500 peer-checked:bg-blue-50 hover:bg-gray-50 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <img 
                            src="/images/payment/tarjeta.png" 
                            alt="Card" 
                            className="w-12 h-8 object-cover rounded"
                          />
                          <div>
                            <div className="text-sm font-medium">
                              {card.card_type} ....{getLastFourDigits(card.card_number)}
                            </div>
                            <div className="text-xs text-gray-500">
                              Exp {card.expiry_date}
                            </div>
                          </div>
                        </div>
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            handleRemoveCard(card.id);
                          }}
                          className="text-red-400 hover:text-red-600 text-xs"
                        >
                          REMOVE
                        </button>
                      </label>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400 text-sm">
                  No payment methods added yet
                </div>
              )}

              <button 
                onClick={handleAddPaymentMethod}
                className="mt-4 w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-green-500 hover:text-green-600 hover:border-green-500 transition-colors text-sm font-medium flex items-center justify-center gap-2"
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
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { CreditCard, Lock, ArrowLeft, CheckCircle, Shield, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Payment() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Obtener la ruta desde donde vino el usuario
  const fromRoute = location.state?.from || '/profile/edit';

  const [formData, setFormData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardType: 'Visa'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'cardNumber') {
      const cleaned = value.replace(/\s/g, '');
      if (cleaned.length <= 16 && /^\d*$/.test(cleaned)) {
        const formatted = cleaned.replace(/(\d{4})/g, '$1 ').trim();
        setFormData({ ...formData, cardNumber: formatted });
      }
    } else if (name === 'cvv') {
      if (value.length <= 3 && /^\d*$/.test(value)) {
        setFormData({ ...formData, cvv: value });
      }
    } else if (name === 'cardHolder') {
      if (/^[a-zA-Z\s]*$/.test(value)) {
        setFormData({ ...formData, cardHolder: value.toUpperCase() });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('You must be logged in to add a payment method');
      return;
    }

    const cardNumberClean = formData.cardNumber.replace(/\s/g, '');
    
    if (cardNumberClean.length !== 16) {
      setError('Card number must be 16 digits');
      return;
    }

    if (formData.cvv.length !== 3) {
      setError('CVV must be 3 digits');
      return;
    }

    if (!formData.cardHolder.trim()) {
      setError('Card holder name is required');
      return;
    }

    if (!formData.expiryMonth || !formData.expiryYear) {
      setError('Expiry date is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const expiryDate = `${formData.expiryMonth}/${formData.expiryYear}`;

      const { error: insertError } = await supabase
        .from('payment_cards')
        .insert({
          user_id: user.id,
          card_number: cardNumberClean,
          card_holder: formData.cardHolder,
          expiry_date: expiryDate,
          card_type: formData.cardType,
          cvv: formData.cvv
        });

      if (insertError) {
        setError('Failed to add payment method');
        console.error('Error adding card:', insertError);
      } else {
        setSuccess(true);
        setTimeout(() => {
          navigate(fromRoute);
        }, 2000);
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Error saving card:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(fromRoute);
  };

  const months = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 15 }, (_, i) => currentYear + i);

  const formatCardNumberForDisplay = (num: string) => {
    const cleaned = num.replace(/\s/g, '');
    if (cleaned.length === 0) return '•••• •••• •••• ••••';
    
    const parts = [];
    for (let i = 0; i < 16; i += 4) {
      const segment = cleaned.slice(i, i + 4);
      if (segment.length === 4) {
        parts.push(segment);
      } else if (segment.length > 0) {
        parts.push(segment + '••••'.slice(segment.length));
      } else {
        parts.push('••••');
      }
    }
    return parts.join('  ');
  };

  const getCardGradient = () => {
    switch (formData.cardType) {
      case 'Visa':
        return 'from-blue-600 via-blue-700 to-indigo-800';
      case 'Mastercard':
        return 'from-orange-600 via-red-600 to-pink-700';
      case 'American Express':
        return 'from-black via-gray-900 to-slate-950';
      case 'Discover':
        return 'from-orange-500 via-amber-600 to-yellow-700';
      default:
        return 'from-slate-700 via-slate-800 to-slate-900';
    }
  };

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <style>{`
        body::-webkit-scrollbar {
          display: none;
        }
        body {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      <div className="pt-24 lg:pt-28 pb-16 lg:pb-6">
        <div className="px-4 sm:px-6 lg:px-12">
          
          <div className="flex items-center justify-between mb-4 lg:mb-6">
            <button
              onClick={handleCancel}
              className="group inline-flex items-center gap-3 px-5 py-3 text-gray-700 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 font-semibold"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
              <span className="hidden sm:inline">Back</span>
              <span className="sm:hidden">Back</span>
            </button>
            
            <div className="inline-flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl shadow-sm border border-green-200">
              <Lock className="w-5 h-5 text-green-600" />
              <span className="text-sm font-bold text-green-800 hidden sm:inline">Secure Payment</span>
            </div>
          </div>

          {success && (
            <div className="mb-6 bg-gradient-to-r from-green-500 to-emerald-600 p-6 rounded-3xl shadow-2xl">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-14 h-14 bg-white rounded-full inline-flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <p className="text-white font-bold text-lg">Payment method added successfully!</p>
                  <p className="text-green-50 text-sm mt-1">Redirecting...</p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 bg-gradient-to-r from-red-500 to-rose-600 p-6 rounded-3xl shadow-2xl">
              <p className="text-white font-bold text-lg">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
            
            <div>
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl shadow-2xl p-5 lg:p-6 border border-gray-200">
                <div className="mb-6">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-xl opacity-50 animate-pulse"></div>
                      <div className="relative w-14 h-14 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-2xl inline-flex items-center justify-center shadow-xl">
                        <CreditCard className="w-7 h-7 text-white" />
                      </div>
                    </div>
                    <div>
                      <h2 className="text-2xl lg:text-3xl font-black text-gray-900">
                        <span className="inline-flex items-center gap-2">
                          Add Payment Method
                          <Sparkles className="w-6 h-6 text-yellow-500" />
                        </span>
                      </h2>
                      <p className="text-sm text-gray-600 font-medium mt-1">Securely save your card details</p>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="group">
                    <label className="inline-flex items-center gap-2 text-sm font-black text-gray-800 mb-2">
                      Card Type
                      <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="cardType"
                      value={formData.cardType}
                      onChange={handleInputChange}
                      className="w-full px-5 py-4 bg-white border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-600 text-gray-900 font-bold transition-all duration-300 hover:border-gray-400 shadow-sm hover:shadow-md cursor-pointer"
                    >
                      <option>Visa</option>
                      <option>Mastercard</option>
                      <option>American Express</option>
                      <option>Discover</option>
                    </select>
                  </div>

                  <div className="group">
                    <label className="inline-flex items-center gap-2 text-sm font-black text-gray-800 mb-2">
                      Card Number
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-5 py-4 bg-white border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-600 text-gray-900 font-mono text-xl tracking-wider transition-all duration-300 hover:border-gray-400 shadow-sm hover:shadow-md"
                      required
                    />
                  </div>

                  <div className="group">
                    <label className="inline-flex items-center gap-2 text-sm font-black text-gray-800 mb-2">
                      Card Holder Name
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="cardHolder"
                      value={formData.cardHolder}
                      onChange={handleInputChange}
                      placeholder="JOHN DOE"
                      className="w-full px-5 py-4 bg-white border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-600 text-gray-900 font-black uppercase transition-all duration-300 hover:border-gray-400 shadow-sm hover:shadow-md"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-7 gap-4">
                    <div className="col-span-2">
                      <label className="inline-flex items-center gap-1 text-sm font-black text-gray-800 mb-2">
                        Month
                        <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="expiryMonth"
                        value={formData.expiryMonth}
                        onChange={handleInputChange}
                        className="w-full px-3 py-4 bg-white border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-600 text-gray-900 font-bold transition-all duration-300 hover:border-gray-400 shadow-sm hover:shadow-md cursor-pointer"
                        required
                      >
                        <option value="">MM</option>
                        {months.map(month => (
                          <option key={month.value} value={month.value}>
                            {month.value}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-span-2">
                      <label className="inline-flex items-center gap-1 text-sm font-black text-gray-800 mb-2">
                        Year
                        <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="expiryYear"
                        value={formData.expiryYear}
                        onChange={handleInputChange}
                        className="w-full px-3 py-4 bg-white border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-600 text-gray-900 font-bold transition-all duration-300 hover:border-gray-400 shadow-sm hover:shadow-md cursor-pointer"
                        required
                      >
                        <option value="">YY</option>
                        {years.map(year => (
                          <option key={year} value={year.toString().slice(-2)}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-span-3">
                      <label className="inline-flex items-center gap-2 text-sm font-black text-gray-800 mb-2">
                        CVV
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        placeholder="123"
                        className="w-full px-4 py-4 bg-white border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-600 text-gray-900 font-mono text-xl text-center transition-all duration-300 hover:border-gray-400 shadow-sm hover:shadow-md"
                        required
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={handleCancel}
                        disabled={loading}
                        className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-2xl font-black text-lg hover:bg-gray-100 hover:border-gray-400 hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="relative flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white rounded-2xl font-black text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 overflow-hidden group"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-500 opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                        {loading ? (
                          <span className="relative z-10 inline-flex items-center justify-center gap-3">
                            <span className="inline-flex gap-2">
                              <span className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                              <span className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                              <span className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                            </span>
                            <span>Processing...</span>
                          </span>
                        ) : (
                          <span className="relative z-10">Add Card</span>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="pt-4 border-t-2 border-gray-200">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-2xl border border-blue-200 shadow-sm">
                      <div className="flex items-start gap-4 text-sm text-gray-700">
                        <Shield className="w-6 h-6 mt-0.5 text-blue-600 flex-shrink-0" />
                        <p className="leading-relaxed font-medium">
                          Your payment information is encrypted and secure. We use industry-standard 256-bit SSL encryption.
                        </p>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            <div>
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl shadow-2xl p-5 lg:p-6 border border-gray-200">
                <h3 className="text-2xl font-black text-gray-900 mb-6">
                  <span className="inline-flex items-center gap-3">
                    <span className="w-2 h-10 bg-gradient-to-b from-blue-600 via-purple-600 to-indigo-700 rounded-full shadow-lg"></span>
                    Card Preview
                  </span>
                </h3>
                
                <div className="relative w-full max-w-md mx-auto mb-6 group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                  <div className={`relative w-full aspect-[1.586] rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 hover:rotate-1 transition-all duration-500 bg-gradient-to-br ${getCardGradient()}`}>
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white via-transparent to-transparent"></div>
                      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-black/20 via-transparent to-transparent rounded-full blur-3xl"></div>
                    </div>
                    
                    <div className="absolute inset-0 p-5 lg:p-6">
                      <div className="h-full flex-col justify-between" style={{ display: 'flex' }}>
                        <div className="flex justify-between items-start">
                          <div className="backdrop-blur-md bg-white/20 px-4 py-2 rounded-xl border border-white/40 shadow-xl">
                            <span className="text-white text-sm font-black tracking-wider">{formData.cardType || 'CARD TYPE'}</span>
                          </div>
                          <div className="relative">
                            <div className="absolute inset-0 bg-yellow-400 rounded-xl blur-md opacity-60"></div>
                            <div className="relative w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-yellow-300 via-yellow-400 to-amber-500 rounded-xl shadow-2xl inline-flex items-center justify-center">
                              <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-br from-yellow-200 to-yellow-300 rounded-lg"></div>
                            </div>
                          </div>
                        </div>

                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-yellow-300 to-amber-400 rounded-2xl shadow-2xl opacity-90">
                          <div className="absolute inset-2 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl"></div>
                          <div className="absolute inset-3 bg-gradient-to-br from-amber-300 to-yellow-400 rounded-lg"></div>
                          <div className="absolute inset-4 grid grid-cols-3 gap-0.5">
                            {Array.from({ length: 9 }).map((_, i) => (
                              <div key={i} className="bg-amber-600 rounded-sm"></div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="space-y-3 lg:space-y-4">
                          <div className="font-mono text-white text-lg lg:text-2xl tracking-[0.35em] font-black drop-shadow-2xl">
                            {formatCardNumberForDisplay(formData.cardNumber)}
                          </div>
                          
                          <div className="flex justify-between items-end">
                            <div className="flex-1">
                              <div className="text-white/70 text-xs uppercase mb-2 font-black tracking-widest">Card Holder</div>
                              <div className="text-white text-sm lg:text-base font-black drop-shadow-2xl">
                                {formData.cardHolder || 'YOUR NAME'}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-white/70 text-xs uppercase mb-2 font-black tracking-widest">Expires</div>
                              <div className="text-white text-sm lg:text-base font-black drop-shadow-2xl">
                                {formData.expiryMonth && formData.expiryYear 
                                  ? `${formData.expiryMonth}/${formData.expiryYear}` 
                                  : 'MM/YY'}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 bg-white rounded-2xl p-5 shadow-lg">
                  <div className="flex items-center justify-between py-4 border-b-2 border-gray-100">
                    <span className="text-sm font-black text-gray-600">Card Number</span>
                    <span className="text-sm font-mono font-black text-gray-900">
                      {formData.cardNumber || '•••• •••• •••• ••••'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between py-4 border-b-2 border-gray-100">
                    <span className="text-sm font-black text-gray-600">Card Holder</span>
                    <span className="text-sm font-black text-gray-900">
                      {formData.cardHolder || 'Not provided'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between py-4 border-b-2 border-gray-100">
                    <span className="text-sm font-black text-gray-600">Expiry Date</span>
                    <span className="text-sm font-black text-gray-900">
                      {formData.expiryMonth && formData.expiryYear 
                        ? `${formData.expiryMonth}/${formData.expiryYear}` 
                        : 'Not provided'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between py-4">
                    <span className="text-sm font-black text-gray-600">Security Code</span>
                    <span className="text-sm font-mono font-black text-gray-900">
                      {formData.cvv ? '•••' : 'Not provided'}
                    </span>
                  </div>
                </div>

                <div className="mt-5 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-2xl p-5 shadow-lg">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="relative">
                        <div className="absolute inset-0 bg-green-500 rounded-2xl blur-lg opacity-40 animate-pulse"></div>
                        <div className="relative w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl inline-flex items-center justify-center shadow-xl">
                          <Lock className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-base font-black text-green-900 mb-2">
                        <span className="inline-flex items-center gap-2">
                          Secure & Encrypted
                          <Shield className="w-4 h-4" />
                        </span>
                      </h4>
                      <p className="text-sm text-green-800 leading-relaxed font-medium">
                        All transactions are secured with military-grade 256-bit SSL encryption. Your data is completely safe.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
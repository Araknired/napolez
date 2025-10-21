import type { FC, ChangeEvent, FormEvent } from 'react';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CreditCard, Lock, ArrowLeft, CheckCircle, Shield, Sparkles } from 'lucide-react';
// 🔥 IMPORTACIONES CORREGIDAS
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext'; 
import { supabase } from '../lib/supabase';

// ===========================================================================
// Types
// ===========================================================================
interface PaymentFormData {
  cardNumber: string;
  cardHolder: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  cardType: CardType;
}

type CardType = 'Visa' | 'Mastercard' | 'American Express' | 'Discover';

interface Month {
  value: string;
  label: string;
}

interface LocationState {
  from?: string;
}

// ===========================================================================
// Constants
// ===========================================================================
const MONTHS: Month[] = [
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
  { value: '12', label: 'December' },
];

const CARD_NUMBER_LENGTH = 16;
const CVV_LENGTH = 3;
const YEARS_AHEAD = 15;
const REDIRECT_DELAY = 2000;

const CARD_GRADIENTS: Record<CardType, string> = {
  Visa: 'from-blue-600 via-blue-700 to-indigo-800',
  Mastercard: 'from-orange-600 via-red-600 to-pink-700',
  'American Express': 'from-black via-gray-900 to-slate-950',
  Discover: 'from-orange-500 via-amber-600 to-yellow-700',
};

const PLACEHOLDER_CARD_NUMBER = '•••• •••• •••• ••••';

// ===========================================================================
// Utility Functions
// ===========================================================================
const cleanCardNumber = (value: string): string => value.replace(/\s/g, '');

const formatCardNumber = (value: string): string => {
  const cleaned = cleanCardNumber(value);
  return cleaned.replace(/(\d{4})/g, '$1 ').trim();
};

const isNumericOnly = (value: string): boolean => /^\d*$/.test(value);

const isAlphabeticOnly = (value: string): boolean => /^[a-zA-Z\s]*$/.test(value);

const generateYears = (): number[] => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: YEARS_AHEAD }, (_, i) => currentYear + i);
};

const formatCardNumberForDisplay = (cardNumber: string): string => {
  const cleaned = cleanCardNumber(cardNumber);
  if (cleaned.length === 0) return PLACEHOLDER_CARD_NUMBER;

  const parts: string[] = [];
  for (let i = 0; i < CARD_NUMBER_LENGTH; i += 4) {
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

const getCardGradient = (cardType: CardType): string => {
  return CARD_GRADIENTS[cardType] || 'from-slate-700 via-slate-800 to-slate-900';
};

// ===========================================================================
// Main Component
// ===========================================================================
/**
 * Payment form component for securely adding credit card information.
 */
const Payment: FC = () => {
  const { user } = useAuth();
  const { theme } = useTheme(); // Usando useTheme correctamente
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<PaymentFormData>({
    cardNumber: '',
    cardHolder: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardType: 'Visa',
  });

  const fromRoute = (location.state as LocationState)?.from || '/profile/edit';

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;

    if (name === 'cardNumber') {
      const cleaned = cleanCardNumber(value);
      if (cleaned.length <= CARD_NUMBER_LENGTH && isNumericOnly(cleaned)) {
        setFormData((prev) => ({ ...prev, cardNumber: formatCardNumber(cleaned) }));
      }
      return;
    }

    if (name === 'cvv') {
      if (value.length <= CVV_LENGTH && isNumericOnly(value)) {
        setFormData((prev) => ({ ...prev, cvv: value }));
      }
      return;
    }

    if (name === 'cardHolder') {
      if (isAlphabeticOnly(value)) {
        setFormData((prev) => ({ ...prev, cardHolder: value.toUpperCase() }));
      }
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = (): string | null => {
    if (!user) {
      return 'You must be logged in to add a payment method';
    }

    const cardNumberClean = cleanCardNumber(formData.cardNumber);
    if (cardNumberClean.length !== CARD_NUMBER_LENGTH) {
      return 'Card number must be 16 digits';
    }

    if (formData.cvv.length !== CVV_LENGTH) {
      return 'CVV must be 3 digits';
    }

    if (!formData.cardHolder.trim()) {
      return 'Card holder name is required';
    }

    if (!formData.expiryMonth || !formData.expiryYear) {
      return 'Expiry date is required';
    }

    return null;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const cardNumberClean = cleanCardNumber(formData.cardNumber);
      const expiryDate = `${formData.expiryMonth}/${formData.expiryYear}`;

      // Supabase insertion mock (assuming supabase is configured)
      const { error: insertError } = await supabase.from('payment_cards').insert({
        user_id: user!.id,
        card_number: cardNumberClean,
        card_holder: formData.cardHolder,
        expiry_date: expiryDate,
        card_type: formData.cardType,
        cvv: formData.cvv,
      });

      if (insertError) {
        setError('Failed to add payment method');
        console.error('Error adding card:', insertError);
      } else {
        setSuccess(true);
        setTimeout(() => {
          navigate(fromRoute);
        }, REDIRECT_DELAY);
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Error saving card:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = (): void => {
    navigate(fromRoute);
  };

  const years = generateYears();
  
  // 🔥 CLASES DE MODO OSCURO PROFESIONAL (Slate Palette)
  // Fondo principal: Slate-900 sólido
  const mainBgClass = theme === 'dark'
    ? 'bg-slate-900'
    : 'bg-white';
    
  // Borde y fondo de la tarjeta/contenedor (Slate-800 para contraste con Slate-900)
  const containerBorder = theme === 'dark' ? 'border-slate-700' : 'border-gray-200';
  const containerBg = theme === 'dark' ? 'bg-slate-800' : 'from-gray-50 to-gray-100';

  return (
    <div className={`min-h-screen overflow-hidden ${mainBgClass}`}>
      <style>{`
        body::-webkit-scrollbar {
          display: none;
        }
        body {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <div className="pb-16 pt-24 lg:pb-6 lg:pt-28">
        <div className="px-4 sm:px-6 lg:px-12">
          {/* Header Actions */}
          <div className="mb-4 flex items-center justify-between lg:mb-6">
            <button
              onClick={handleCancel}
              className="group inline-flex items-center gap-3 rounded-2xl bg-gray-50 dark:bg-slate-800 px-5 py-3 font-semibold text-gray-700 dark:text-gray-300 shadow-sm transition-all duration-300 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white hover:shadow-md"
            >
              <ArrowLeft className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1" />
              <span>Back</span>
            </button>

            <div className="inline-flex items-center gap-3 rounded-2xl border border-green-200 dark:border-green-800 bg-gradient-to-r from-green-50 dark:from-green-900 to-emerald-50 dark:to-emerald-950 px-5 py-3 shadow-sm">
              <Lock className="h-5 w-5 text-green-600" />
              <span className="hidden text-sm font-bold text-green-800 dark:text-green-400 sm:inline">
                Secure Payment
              </span>
            </div>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-6 rounded-3xl bg-gradient-to-r from-green-500 to-emerald-600 p-6 shadow-2xl">
              <div className="flex items-center gap-4">
                <div className="inline-flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-white shadow-lg">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <p className="text-lg font-bold text-white">
                    Payment method added successfully!
                  </p>
                  <p className="mt-1 text-sm text-green-50">Redirecting...</p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 rounded-3xl bg-gradient-to-r from-red-500 to-rose-600 p-6 shadow-2xl">
              <p className="text-lg font-bold text-white">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-10">
            {/* Form Section */}
            <div>
              {/* Contenedor del formulario: Slate-800 */}
              <div className={`rounded-3xl border ${containerBorder} ${containerBg} p-5 shadow-2xl lg:p-6`}>
                
                {/* Form Header */}
                <div className="mb-6">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="absolute inset-0 animate-pulse rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 opacity-50 blur-xl" />
                      <div className="relative inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 shadow-xl">
                        <CreditCard className="h-7 w-7 text-white" />
                      </div>
                    </div>
                    <div>
                      {/* Título y Subtítulo: Texto blanco en Dark Mode */}
                      <h2 className="text-2xl font-black text-gray-900 dark:text-white lg:text-3xl">
                        <span className="inline-flex items-center gap-2">
                          Add Payment Method
                          <Sparkles className="h-6 w-6 text-yellow-500" />
                        </span>
                      </h2>
                      <p className="mt-1 text-sm font-medium text-gray-600 dark:text-gray-400">
                        Securely save your card details
                      </p>
                    </div>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Card Type */}
                  <div className="group">
                    <label className="mb-2 inline-flex items-center gap-2 text-sm font-black text-gray-800 dark:text-gray-200">
                      Card Type
                      <span className="text-red-500">*</span>
                    </label>
                    {/* Select: Fondo Slate-900 con texto White/Gray-200 */}
                    <select
                      name="cardType"
                      value={formData.cardType}
                      onChange={handleInputChange}
                      className="w-full cursor-pointer rounded-2xl border-2 border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-5 py-4 font-bold text-gray-900 dark:text-gray-200 shadow-sm transition-all duration-300 hover:border-gray-400 dark:hover:border-slate-600 hover:shadow-md focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
                    >
                      <option>Visa</option>
                      <option>Mastercard</option>
                      <option>American Express</option>
                      <option>Discover</option>
                    </select>
                  </div>

                  {/* Card Number */}
                  <div className="group">
                    <label className="mb-2 inline-flex items-center gap-2 text-sm font-black text-gray-800 dark:text-gray-200">
                      Card Number
                      <span className="text-red-500">*</span>
                    </label>
                    {/* Input: Fondo Slate-900 con texto White/Gray-200 */}
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      placeholder="1234 5678 9012 3456"
                      className="w-full rounded-2xl border-2 border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-5 py-4 font-mono text-xl tracking-wider text-gray-900 dark:text-gray-200 shadow-sm transition-all duration-300 hover:border-gray-400 dark:hover:border-slate-600 hover:shadow-md focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
                      required
                    />
                  </div>

                  {/* Card Holder */}
                  <div className="group">
                    <label className="mb-2 inline-flex items-center gap-2 text-sm font-black text-gray-800 dark:text-gray-200">
                      Card Holder Name
                      <span className="text-red-500">*</span>
                    </label>
                    {/* Input: Fondo Slate-900 con texto White/Gray-200 */}
                    <input
                      type="text"
                      name="cardHolder"
                      value={formData.cardHolder}
                      onChange={handleInputChange}
                      placeholder="JOHN DOE"
                      className="w-full rounded-2xl border-2 border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-5 py-4 font-black uppercase text-gray-900 dark:text-gray-200 shadow-sm transition-all duration-300 hover:border-gray-400 dark:hover:border-slate-600 hover:shadow-md focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
                      required
                    />
                  </div>

                  {/* Expiry Date and CVV */}
                  <div className="grid grid-cols-7 gap-4">
                    <div className="col-span-2">
                      <label className="mb-2 inline-flex items-center gap-1 text-sm font-black text-gray-800 dark:text-gray-200">
                        Month
                        <span className="text-red-500">*</span>
                      </label>
                      {/* Select: Fondo Slate-900 con texto White/Gray-200 */}
                      <select
                        name="expiryMonth"
                        value={formData.expiryMonth}
                        onChange={handleInputChange}
                        className="w-full cursor-pointer rounded-2xl border-2 border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-4 font-bold text-gray-900 dark:text-gray-200 shadow-sm transition-all duration-300 hover:border-gray-400 dark:hover:border-slate-600 hover:shadow-md focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
                        required
                      >
                        <option value="">MM</option>
                        {MONTHS.map((month) => (
                          <option key={month.value} value={month.value}>
                            {month.value}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-span-2">
                      <label className="mb-2 inline-flex items-center gap-1 text-sm font-black text-gray-800 dark:text-gray-200">
                        Year
                        <span className="text-red-500">*</span>
                      </label>
                      {/* Select: Fondo Slate-900 con texto White/Gray-200 */}
                      <select
                        name="expiryYear"
                        value={formData.expiryYear}
                        onChange={handleInputChange}
                        className="w-full cursor-pointer rounded-2xl border-2 border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-4 font-bold text-gray-900 dark:text-gray-200 shadow-sm transition-all duration-300 hover:border-gray-400 dark:hover:border-slate-600 hover:shadow-md focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
                        required
                      >
                        <option value="">YY</option>
                        {years.map((year) => (
                          <option key={year} value={year.toString().slice(-2)}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-span-3">
                      <label className="mb-2 inline-flex items-center gap-2 text-sm font-black text-gray-800 dark:text-gray-200">
                        CVV
                        <span className="text-red-500">*</span>
                      </label>
                      {/* Input: Fondo Slate-900 con texto White/Gray-200 */}
                      <input
                        type="text"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        placeholder="123"
                        className="w-full rounded-2xl border-2 border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-4 text-center font-mono text-xl text-gray-900 dark:text-gray-200 shadow-sm transition-all duration-300 hover:border-gray-400 dark:hover:border-slate-600 hover:shadow-md focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
                        required
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-4">
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={handleCancel}
                        disabled={loading}
                        className="flex-1 rounded-2xl border-2 border-gray-300 dark:border-slate-700 px-6 py-4 text-lg font-black text-gray-700 dark:text-gray-300 transition-all duration-300 hover:border-gray-400 dark:hover:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="group relative flex-1 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 px-6 py-4 text-lg font-black text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-500 opacity-0 transition-opacity duration-300 group-hover:opacity-30" />
                        {loading ? (
                          <span className="relative z-10 inline-flex items-center justify-center gap-3">
                            <span className="inline-flex gap-2">
                              <span
                                className="h-3 w-3 animate-bounce rounded-full bg-white"
                                style={{ animationDelay: '0ms' }}
                              />
                              <span
                                className="h-3 w-3 animate-bounce rounded-full bg-white"
                                style={{ animationDelay: '150ms' }}
                              />
                              <span
                                className="h-3 w-3 animate-bounce rounded-full bg-white"
                                style={{ animationDelay: '300ms' }}
                              />
                            </span>
                            <span>Processing...</span>
                          </span>
                        ) : (
                          <span className="relative z-10">Add Card</span>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Security Notice */}
                  <div className="border-t-2 border-gray-200 dark:border-slate-700 pt-4">
                    <div className="rounded-2xl border border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 dark:from-blue-900 to-indigo-50 dark:to-indigo-950 p-5 shadow-sm">
                      <div className="flex items-start gap-4 text-sm text-gray-700 dark:text-blue-200">
                        <Shield className="mt-0.5 h-6 w-6 flex-shrink-0 text-blue-600" />
                        <p className="font-medium leading-relaxed">
                          Your payment information is encrypted and secure. We use
                          industry-standard 256-bit SSL encryption.
                        </p>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Preview Section */}
            <div>
              {/* Contenedor del Preview: Slate-800 */}
              <div className={`rounded-3xl border ${containerBorder} ${containerBg} p-5 shadow-2xl lg:p-6`}>
                
                {/* Title */}
                <h3 className="mb-6 text-2xl font-black text-gray-900 dark:text-white">
                  <span className="inline-flex items-center gap-3">
                    <span className="h-10 w-2 rounded-full bg-gradient-to-b from-blue-600 via-purple-600 to-indigo-700 shadow-lg" />
                    Card Preview
                  </span>
                </h3>

                {/* Card Visual (The card itself is dynamic/colorized) */}
                <div className="group relative mx-auto mb-6 w-full max-w-md">
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 opacity-30 blur-2xl transition-opacity duration-500 group-hover:opacity-50" />
                  <div
                    className={`relative aspect-[1.586] w-full transform overflow-hidden rounded-3xl bg-gradient-to-br shadow-2xl transition-all duration-500 hover:scale-105 hover:rotate-1 ${getCardGradient(
                      formData.cardType
                    )}`}
                  >
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute left-0 top-0 h-full w-full bg-gradient-to-br from-white via-transparent to-transparent" />
                      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-gradient-to-tl from-black/20 via-transparent to-transparent blur-3xl" />
                    </div>

                    <div className="absolute inset-0 p-5 lg:p-6">
                      <div className="flex h-full flex-col justify-between">
                        <div className="flex items-start justify-between">
                          <div className="rounded-xl border border-white/40 bg-white/20 px-4 py-2 shadow-xl backdrop-blur-md">
                            <span className="text-sm font-black tracking-wider text-white">
                              {formData.cardType || 'CARD TYPE'}
                            </span>
                          </div>
                          <div className="relative">
                            <div className="absolute inset-0 rounded-xl bg-yellow-400 opacity-60 blur-md" />
                            <div className="relative inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-300 via-yellow-400 to-amber-500 shadow-2xl lg:h-14 lg:w-14">
                              <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-yellow-200 to-yellow-300 lg:h-8 lg:w-8" />
                            </div>
                          </div>
                        </div>

                        <div className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-gradient-to-br from-yellow-300 to-amber-400 opacity-90 shadow-2xl lg:h-16 lg:w-16">
                          <div className="absolute inset-2 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500" />
                          <div className="absolute inset-3 rounded-lg bg-gradient-to-br from-amber-300 to-yellow-400" />
                          <div className="absolute inset-4 grid grid-cols-3 gap-0.5">
                            {Array.from({ length: 9 }).map((_, i) => (
                              <div key={i} className="rounded-sm bg-amber-600" />
                            ))}
                          </div>
                        </div>

                        <div className="space-y-3 lg:space-y-4">
                          <div className="font-mono text-lg font-black tracking-[0.35em] text-white drop-shadow-2xl lg:text-2xl">
                            {formatCardNumberForDisplay(formData.cardNumber)}
                          </div>

                          <div className="flex items-end justify-between">
                            <div className="flex-1">
                              <div className="mb-2 text-xs font-black uppercase tracking-widest text-white/70">
                                Card Holder
                              </div>
                              <div className="text-sm font-black text-white drop-shadow-2xl lg:text-base">
                                {formData.cardHolder || 'YOUR NAME'}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="mb-2 text-xs font-black uppercase tracking-widest text-white/70">
                                Expires
                              </div>
                              <div className="text-sm font-black text-white drop-shadow-2xl lg:text-base">
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

                {/* Card Details Summary */}
                {/* Resumen: Fondo Slate-900 (más oscuro que la tarjeta) */}
                <div className="space-y-2 rounded-2xl bg-white dark:bg-slate-900 p-5 shadow-lg">
                  <div className="flex items-center justify-between border-b-2 border-gray-100 dark:border-slate-800 py-4">
                    <span className="text-sm font-black text-gray-600 dark:text-gray-300">Card Number</span>
                    <span className="font-mono text-sm font-black text-gray-900 dark:text-white">
                      {formData.cardNumber || PLACEHOLDER_CARD_NUMBER}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-b-2 border-gray-100 dark:border-slate-800 py-4">
                    <span className="text-sm font-black text-gray-600 dark:text-gray-300">Card Holder</span>
                    <span className="text-sm font-black text-gray-900 dark:text-white">
                      {formData.cardHolder || 'Not provided'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-b-2 border-gray-100 dark:border-slate-800 py-4">
                    <span className="text-sm font-black text-gray-600 dark:text-gray-300">Expiry Date</span>
                    <span className="text-sm font-black text-gray-900 dark:text-white">
                      {formData.expiryMonth && formData.expiryYear
                        ? `${formData.expiryMonth}/${formData.expiryYear}`
                        : 'Not provided'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-4">
                    <span className="text-sm font-black text-gray-600 dark:text-gray-300">Security Code</span>
                    <span className="font-mono text-sm font-black text-gray-900 dark:text-white">
                      {formData.cvv ? '•••' : 'Not provided'}
                    </span>
                  </div>
                </div>

                {/* Security Badge */}
                <div className="mt-5 rounded-2xl border-2 border-green-300 dark:border-green-800 bg-gradient-to-br from-green-50 dark:from-green-900 to-emerald-50 dark:to-emerald-950 p-5 shadow-lg">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="relative">
                        <div className="absolute inset-0 animate-pulse rounded-2xl bg-green-500 opacity-40 blur-lg" />
                        <div className="relative inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-xl">
                          <Lock className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="mb-2 text-base font-black text-green-900 dark:text-green-300">
                        <span className="inline-flex items-center gap-2">
                          Secure & Encrypted
                          <Shield className="h-4 w-4" />
                        </span>
                      </h4>
                      <p className="text-sm font-medium leading-relaxed text-green-800 dark:text-green-400">
                        All transactions are secured with military-grade 256-bit SSL
                        encryption. Your data is completely safe.
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
};

export default Payment;
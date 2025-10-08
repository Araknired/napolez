import { useState, useEffect, type FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { ArrowLeft, Phone, Shield, CheckCircle } from 'lucide-react';

export default function CodeDesktop() {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState<string | null>(null);

  const location = useLocation();
  const navigate = useNavigate();
  const phone = location.state?.phone;
  const from = location.state?.from;
  const name = location.state?.name;

  useEffect(() => {
    if (!phone) {
      navigate('/register');
    }
  }, [phone, navigate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleVerifyOtp = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        phone,
        token: otp,
        type: 'sms',
      });

      if (verifyError) {
        setError(verifyError.message);
        setLoading(false);
        return;
      }

      if (data?.user && name && from === 'register') {
        const { data: existingUser } = await supabase
          .from('users')
          .select('user_id')
          .eq('user_id', data.user.id)
          .single();

        if (!existingUser) {
          const { error: insertError } = await supabase
            .from('users')
            .insert({
              user_id: data.user.id,
              full_name: name,
              phone: phone
            });

          if (insertError) {
            console.error('Error saving user data:', insertError);
            setError(`User verified but failed to save profile: ${insertError.message}`);
          }
        }
      }

      navigate('/profile');
    } catch (err) {
      console.error('Verification error:', err);
      setError('Invalid or expired code');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setError(null);
    setResendMessage(null);
    setResendLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone,
      });

      if (error) {
        setError(error.message);
      } else {
        setResendMessage('Code resent successfully!');
      }
    } catch {
      setError('Failed to resend code');
    } finally {
      setResendLoading(false);
    }
  };

  const handleBack = () => {
    if (from === 'register') {
      navigate('/register');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="h-screen pt-24 overflow-hidden">
      <div className="flex h-full">
        {/* Left side - Gray gradient with security info */}
        <div 
          className={`hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 p-16 items-center justify-center relative overflow-hidden transition-all duration-1000 ${
            pageLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
          }`}
          style={{ transitionDelay: '200ms' }}
        >

          {/* Security features */}
          <div className="relative z-10 flex flex-col items-center justify-center max-w-lg">
            <div className="mb-12">
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl">
                <Shield className="w-16 h-16 text-white" />
              </div>
            </div>

            <h2 className="text-gray-800 text-4xl font-bold mb-6 text-center">
              Secure Verification
            </h2>
            <p className="text-gray-600 text-xl text-center mb-12">
              We've sent a verification code to your phone to ensure it's really you
            </p>

            <div className="space-y-6 w-full">
              <div className="flex items-start gap-4 bg-white/50 backdrop-blur-sm rounded-2xl p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">SMS Verification</h3>
                  <p className="text-gray-600 text-sm">
                    Enter the 6-digit code sent to your phone number
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-white/50 backdrop-blur-sm rounded-2xl p-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Protected Account</h3>
                  <p className="text-gray-600 text-sm">
                    Your account will be protected with phone verification
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-32 right-32 w-64 h-64 bg-white/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-32 left-32 w-80 h-80 bg-white/20 rounded-full blur-3xl"></div>
        </div>

        {/* Right side - White with verification form */}
        <div className="w-full lg:w-1/2 bg-white p-16 flex flex-col justify-center overflow-y-auto">
          <div className="max-w-md mx-auto w-full">
            <div 
              className={`mb-8 transition-all duration-700 ${
                pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: '400ms' }}
            >
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-8"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="text-sm font-medium">Back</span>
              </button>

              <h1 className="text-5xl font-bold text-gray-900 mb-3">
                Verify Code
              </h1>
              <p className="text-gray-500 text-lg mb-2">
                Please enter the code we just sent to
              </p>
              <p className="text-blue-500 font-semibold text-xl">
                {phone}
              </p>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-8">
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 text-sm rounded">
                  {error}
                </div>
              )}

              {resendMessage && (
                <div className="bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-3 text-sm rounded">
                  {resendMessage}
                </div>
              )}

              <div 
                className={`transition-all duration-700 ${
                  pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: '500ms' }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
                  Enter verification code
                </label>
                <div className="flex justify-center gap-4">
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength={1}
                      value={otp[index] || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (!/^\d*$/.test(value)) return;
                        
                        const newOtp = otp.split('');
                        newOtp[index] = value;
                        setOtp(newOtp.join(''));

                        if (value && index < 5) {
                          const nextInput = document.getElementById(`otp-desktop-${index + 1}`);
                          nextInput?.focus();
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Backspace' && !otp[index] && index > 0) {
                          const prevInput = document.getElementById(`otp-desktop-${index - 1}`);
                          prevInput?.focus();
                        }
                      }}
                      id={`otp-desktop-${index}`}
                      className="w-16 h-16 text-center text-2xl font-bold border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                    />
                  ))}
                </div>
              </div>

              <div 
                className={`text-center transition-all duration-700 ${
                  pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: '600ms' }}
              >
                <p className="text-sm text-gray-600 mb-3">
                  Didn't receive the code?
                </p>
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={resendLoading}
                  className="text-sm text-blue-500 hover:text-blue-600 font-semibold disabled:opacity-50 underline"
                >
                  {resendLoading ? 'Sending...' : 'Resend code'}
                </button>
              </div>

              <div 
                className={`transition-all duration-700 ${
                  pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: '700ms' }}
              >
                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg text-lg"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                      </div>
                      <span>Verifying...</span>
                    </div>
                  ) : 'Verify'}
                </button>
              </div>
            </form>

            <div 
              className={`mt-8 p-6 bg-blue-50 rounded-xl transition-all duration-700 ${
                pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: '800ms' }}
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 text-sm mb-1">Security Tip</h4>
                  <p className="text-gray-600 text-sm">
                    Never share your verification code with anyone. NAPOLEZ will never ask for your code via phone or email.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import { useState, useEffect, type FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { ArrowLeft, Phone, Shield, CheckCircle, Zap } from 'lucide-react';

export default function CodeDesktop() {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState<string | null>(null);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

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
        setTimeout(() => setResendMessage(null), 3000);
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
    <div className="hidden lg:flex h-screen pt-20 overflow-hidden bg-white">
      {/* Left Side - Security Info */}
      <div 
        className={`lg:w-1/2 bg-gradient-to-br from-cyan-50 via-blue-50 to-purple-50 p-16 flex items-center justify-center relative overflow-hidden transition-all duration-1000 ${
          pageLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
        }`}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-gradient-to-br from-cyan-300 to-blue-300 rounded-full blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-gradient-to-br from-blue-300 to-purple-300 rounded-full blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-purple-300 to-cyan-300 rounded-full blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center max-w-2xl">
          <div 
            className={`transition-all duration-1000 ${
              pageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
            }`}
            style={{ transitionDelay: '300ms' }}
          >
            {/* Main Icon */}
            <div className="mb-12 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 rounded-full blur-2xl opacity-40"></div>
              <div className="relative w-40 h-40 mx-auto bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform duration-500">
                <Shield className="w-20 h-20 text-white" />
              </div>
            </div>

            {/* Title */}
            <h2 className={`text-5xl font-bold bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-6 text-center transition-all duration-1000 ${
              pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              Verify Your Phone
            </h2>

            {/* Description */}
            <p className={`text-gray-600 text-xl text-center mb-12 transition-all duration-1000 ${
              pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: '200ms' }}>
              We've sent a secure code to confirm it's really you
            </p>

            {/* Feature Cards */}
            <div className="space-y-4 w-full">
              <div 
                className={`transform transition-all duration-700 ${
                  pageLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
                }`}
                style={{ transitionDelay: '400ms' }}
              >
                <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 border border-white/50">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                      <Phone className="w-7 h-7 text-cyan-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1 text-lg">SMS Verification</h3>
                      <p className="text-gray-600 text-sm">
                        Enter the 6-digit code we sent to your phone
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div 
                className={`transform transition-all duration-700 ${
                  pageLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
                }`}
                style={{ transitionDelay: '500ms' }}
              >
                <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 border border-white/50">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                      <CheckCircle className="w-7 h-7 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1 text-lg">Account Protected</h3>
                      <p className="text-gray-600 text-sm">
                        Your account will be fully secured with phone verification
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div 
                className={`transform transition-all duration-700 ${
                  pageLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
                }`}
                style={{ transitionDelay: '600ms' }}
              >
                <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 border border-white/50">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                      <Zap className="w-7 h-7 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1 text-lg">Quick & Easy</h3>
                      <p className="text-gray-600 text-sm">
                        Takes less than a minute to verify and start using NAPOLEZ
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-20 w-24 h-24 bg-cyan-200 rounded-full opacity-20 blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-purple-200 rounded-full opacity-20 blur-xl animate-pulse animation-delay-1000"></div>
      </div>

      {/* Right Side - Verification Form */}
      <div className="w-full lg:w-1/2 bg-white p-16 flex flex-col justify-center overflow-y-auto relative">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-cyan-50/20 to-white pointer-events-none"></div>

        <div className="relative z-10 max-w-md mx-auto w-full">
          {/* Back Button */}
          <div 
            className={`mb-8 transition-all duration-700 ${
              pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: '400ms' }}
          >
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-all duration-300 group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-semibold">Back</span>
            </button>
          </div>

          {/* Header */}
          <div 
            className={`mb-12 transition-all duration-700 ${
              pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: '450ms' }}
          >
            <div className="inline-block mb-6">
              <span className="px-4 py-2 bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-600 text-sm font-semibold rounded-full">
                Security Verification
              </span>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-3">
              Enter Code
            </h1>
            <p className="text-gray-500 text-lg mb-2">
              We sent a 6-digit code to
            </p>
            <p className="text-cyan-600 font-bold text-xl flex items-center gap-2">
              <Phone className="w-5 h-5" />
              {phone}
            </p>
          </div>

          {/* Alerts */}
          {error && (
            <div 
              className={`bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 text-sm rounded-r-lg mb-6 shadow-lg animate-slideIn ${
                error ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="font-medium">{error}</span>
              </div>
            </div>
          )}

          {resendMessage && (
            <div 
              className={`bg-green-50 border-l-4 border-green-500 text-green-700 px-6 py-4 text-sm rounded-r-lg mb-6 shadow-lg animate-slideIn ${
                resendMessage ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
              }`}
            >
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">{resendMessage}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleVerifyOtp} className="space-y-8">
            {/* OTP Inputs */}
            <div 
              className={`transition-all duration-700 ${
                pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: '550ms' }}
            >
              <label className="block text-sm font-semibold text-gray-700 mb-6 text-center">
                Enter verification code
              </label>
              <div className="flex justify-center gap-3">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <div key={index} className="relative group">
                    <input
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
                      onFocus={() => setFocusedIndex(index)}
                      onBlur={() => setFocusedIndex(null)}
                      id={`otp-desktop-${index}`}
                      className={`w-16 h-16 text-center text-3xl font-bold rounded-xl transition-all duration-300 ${
                        focusedIndex === index
                          ? 'shadow-xl shadow-cyan-500/30 border-2 border-cyan-500 scale-110 bg-cyan-50'
                          : otp[index]
                          ? 'border-2 border-green-500 shadow-lg shadow-green-500/20 bg-green-50/30'
                          : 'border-2 border-gray-200 shadow-md shadow-gray-200/50 hover:border-cyan-300'
                      } outline-none`}
                    />
                    {otp[index] && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Resend Link */}
            <div 
              className={`text-center transition-all duration-700 ${
                pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: '650ms' }}
            >
              <p className="text-sm text-gray-600 mb-3">
                Didn't receive the code?
              </p>
              <button
                type="button"
                onClick={handleResendCode}
                disabled={resendLoading}
                className="text-sm text-cyan-500 hover:text-cyan-600 font-bold disabled:opacity-50 transition-all duration-300 underline underline-offset-2"
              >
                {resendLoading ? (
                  <span className="flex items-center gap-2 justify-center">
                    <div className="w-1 h-1 bg-cyan-500 rounded-full animate-bounce"></div>
                    Sending...
                  </span>
                ) : (
                  'Resend code'
                )}
              </button>
            </div>

            {/* Verify Button */}
            <div 
              className={`transition-all duration-700 ${
                pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: '750ms' }}
            >
              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full relative overflow-hidden group rounded-2xl font-semibold text-lg text-white transition-all duration-300 shadow-xl shadow-cyan-500/30 hover:shadow-2xl hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 transition-all duration-300"></div>
                
                <div className="relative px-6 py-4 flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                      </div>
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <span>Verify Code</span>
                      <CheckCircle className="w-5 h-5" />
                    </>
                  )}
                </div>
              </button>
            </div>
          </form>

          {/* Security Tips */}
          <div 
            className={`mt-10 p-6 bg-gradient-to-r from-cyan-50/50 to-blue-50/50 backdrop-blur-sm rounded-2xl transition-all duration-700 border border-cyan-200/30 shadow-lg ${
              pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: '850ms' }}
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-200 to-blue-200 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                <Shield className="w-5 h-5 text-cyan-700" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm mb-1">Security Tips</h4>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li>✓ Never share your code with anyone</li>
                  <li>✓ NAPOLEZ never asks for your code via email</li>
                  <li>✓ Code expires in 10 minutes</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animation-delay-1000 {
          animation-delay: 1s;
        }

        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
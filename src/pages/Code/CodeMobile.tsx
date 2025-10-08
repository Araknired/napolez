import { useState, useEffect, type FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { ArrowLeft, Delete, Sparkles, Check } from 'lucide-react';

export default function CodeMobile() {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState<string | null>(null);
  const [pressedButton, setPressedButton] = useState<string | null>(null);
  const [shakeError, setShakeError] = useState(false);
  const [successAnimation, setSuccessAnimation] = useState(false);
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);

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

  const handleVerifyOtp = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (otp.length !== 6) return;
    
    setError(null);
    setLoading(true);
    setSuccessAnimation(true);

    try {
      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        phone,
        token: otp,
        type: 'sms',
      });

      if (verifyError) {
        setError(verifyError.message);
        setShakeError(true);
        setSuccessAnimation(false);
        setTimeout(() => setShakeError(false), 500);
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
            setShakeError(true);
            setTimeout(() => setShakeError(false), 500);
            setSuccessAnimation(false);
          }
        }
      }

      setTimeout(() => {
        navigate('/profile');
      }, 1000);
    } catch (err) {
      console.error('Verification error:', err);
      setError('Invalid or expired code');
      setShakeError(true);
      setTimeout(() => setShakeError(false), 500);
      setSuccessAnimation(false);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
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
        setShakeError(true);
        setTimeout(() => setShakeError(false), 500);
      } else {
        setResendMessage('Code resent successfully!');
        setTimeout(() => setResendMessage(null), 3000);
      }
    } catch {
      setError('Failed to resend code');
      setShakeError(true);
      setTimeout(() => setShakeError(false), 500);
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

  const handleNumberPress = (num: string) => {
    if (otp.length < 6) {
      setPressedButton(num);
      setTimeout(() => setPressedButton(null), 100);
      
      const newOtp = otp + num;
      setOtp(newOtp);
      
      if (newOtp.length === 6) {
        setTimeout(() => {
          const fakeEvent = { preventDefault: () => {} } as FormEvent;
          handleVerifyOtp(fakeEvent);
        }, 300);
      }
    }
  };

  const handleDelete = () => {
    if (otp.length > 0) {
      setPressedButton('delete');
      setDeletingIndex(otp.length - 1);
      
      setTimeout(() => {
        setOtp(otp.slice(0, -1));
        setDeletingIndex(null);
      }, 100);
      
      setTimeout(() => setPressedButton(null), 150);
    }
  };

  const numberPadButtons = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['', '0', 'delete']
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300/15 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-300/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-300/10 rounded-full blur-3xl"></div>
      </div>

      <div className="flex-1 flex flex-col px-6 py-8 pt-16 relative z-10">
        
        {/* Header Section */}
        <div 
          className={`mb-8 transition-all duration-700 ease-out ${
            pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
          }`}
        >
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition-all duration-300 hover:gap-3 mb-8 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
            <span className="text-sm font-semibold">Back</span>
          </button>

          <div className="relative">
            <div className="absolute -top-3 -right-3">
              <Sparkles className="w-7 h-7 text-yellow-400 drop-shadow-lg" />
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-3">
              Check your inbox
            </h1>
            <p className="text-sm text-gray-600 mb-3 font-medium">
              We have sent you a verification code by email
            </p>
            <div className="flex items-center gap-3 bg-white/70 backdrop-blur-md rounded-xl px-4 py-3 w-fit shadow-lg border border-white/50 hover:shadow-xl transition-shadow duration-300">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <p className="text-sm text-gray-900 font-semibold">
                {phone}
              </p>
              <button 
                onClick={handleBack}
                className="text-gray-400 hover:text-indigo-600 transition-all duration-300 hover:scale-110 hover:rotate-12 transform"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className={`bg-red-50/95 backdrop-blur-sm border-l-4 border-red-600 text-red-700 px-5 py-4 rounded-xl text-sm mb-4 shadow-xl ${
            shakeError ? 'animate-shake' : 'animate-slideDown'
          }`}>
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="font-semibold mb-1">Verification Failed</p>
                <p className="text-xs">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Success Message */}
        {resendMessage && (
          <div className="bg-green-50/95 backdrop-blur-sm border-l-4 border-green-500 text-green-700 px-5 py-4 rounded-xl text-sm mb-4 shadow-xl animate-slideDown">
            <div className="flex items-start gap-3">
              <Check className="w-6 h-6 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold mb-1">Success!</p>
                <p className="text-xs">{resendMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* OTP Display Section */}
        <div 
          className={`mb-10 transition-all duration-700 ${
            pageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
          }`}
          style={{ transitionDelay: '200ms' }}
        >
          <div className="flex justify-center gap-3 mb-8">
            {[0, 1, 2, 3, 4, 5].map((index) => {
              const hasValue = otp[index];
              const isActive = index === otp.length && otp.length < 6;
              const isDeleting = deletingIndex === index;
              
              return (
                <div
                  key={index}
                  className={`w-14 h-16 flex items-center justify-center rounded-2xl text-2xl font-bold transition-all duration-150 transform relative overflow-hidden ${
                    hasValue
                      ? 'bg-white text-blue-600 shadow-xl shadow-green-400/60 ring-2 ring-green-400' 
                      : isActive
                      ? 'bg-white text-gray-900 shadow-lg hover:shadow-xl border-2 border-green-500 animate-pulse'
                      : 'bg-white text-gray-900 shadow-lg hover:shadow-xl border-2 border-gray-900'
                  } ${
                    isDeleting ? 'animate-shrinkOut' : hasValue ? 'animate-popIn' : ''
                  }`}
                  style={{
                    animationDelay: `${index * 30}ms`
                  }}
                >
                  {hasValue && !isDeleting && (
                    <>
                      <span className="relative z-10 animate-popIn">{otp[index]}</span>
                    </>
                  )}
                  {isDeleting && (
                    <span className="relative z-10 animate-fadeOut">{otp[index]}</span>
                  )}
                  {!hasValue && (
                    <span className="text-gray-400 text-xl">•</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Resend Code Button */}
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-3 font-medium">
              Didn't receive the code?
            </p>
            <button
              type="button"
              onClick={handleResendCode}
              disabled={resendLoading}
              className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold disabled:opacity-50 transition-all duration-300 hover:scale-105 transform inline-flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 px-5 py-2.5 rounded-xl shadow-sm hover:shadow-md disabled:hover:scale-100"
            >
              {resendLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Resend code</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1 min-h-8"></div>

        {/* Number Pad Section */}
        <div 
          className={`transition-all duration-700 ${
            pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '300ms' }}
        >
          <div className="grid grid-cols-3 gap-4 mb-6">
            {numberPadButtons.map((row, rowIndex) => 
              row.map((btn, colIndex) => {
                if (btn === '') {
                  return <div key={`${rowIndex}-${colIndex}`}></div>;
                }
                
                if (btn === 'delete') {
                  const isPressed = pressedButton === 'delete';
                  return (
                    <button
                      key={`${rowIndex}-${colIndex}`}
                      onClick={handleDelete}
                      disabled={otp.length === 0}
                      className={`h-16 flex items-center justify-center rounded-2xl backdrop-blur-md active:scale-95 transition-all duration-100 disabled:opacity-30 border-2 transform relative overflow-hidden ${
                        isPressed
                          ? 'scale-95 bg-white shadow-lg shadow-red-400/60 border-gray-900' 
                          : 'bg-white/80 hover:bg-white disabled:hover:bg-white/80 border-gray-900 shadow-md'
                      }`}
                    >
                      <Delete className={`w-6 h-6 transition-all duration-100 relative z-10 ${
                        isPressed ? 'text-red-600 scale-110' : 'text-gray-700'
                      }`} />
                    </button>
                  );
                }

                const isPressed = pressedButton === btn;
                return (
                  <button
                    key={`${rowIndex}-${colIndex}`}
                    onClick={() => handleNumberPress(btn)}
                    disabled={otp.length >= 6}
                    className={`h-16 flex items-center justify-center rounded-2xl backdrop-blur-md active:scale-95 transition-all duration-200 text-2xl font-bold disabled:opacity-30 shadow-lg hover:shadow-2xl transform border relative overflow-hidden ${
                      isPressed 
                        ? 'scale-95 bg-gradient-to-br text-white shadow-blue-500/50 border-blue-500' 
                        : 'bg-white/80 hover:bg-white/90 text-gray-900 border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    {isPressed && (
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/30 to-white/0 animate-shimmer-fast"></div>
                    )}
                    <span className={`relative z-10 ${isPressed ? 'animate-bounce-once' : ''}`}>
                      {btn}
                    </span>
                  </button>
                );
              })
            )}
          </div>

          {/* Verify Button */}
          <button
            type="button"
            onClick={(e) => handleVerifyOtp(e)}
            disabled={loading || otp.length !== 6}
            className={`w-full py-5 rounded-2xl font-bold text-lg transition-all duration-300 shadow-2xl disabled:cursor-not-allowed transform relative overflow-hidden group ${
              successAnimation
                ? 'bg-gradient-to-r from-green-500 via-green-600 to-emerald-600 text-white shadow-green-500/50 scale-105'
                : 'bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:from-green-500 hover:via-green-600 hover:to-green-700 text-white shadow-green-500/50 hover:shadow-green-600/60 active:scale-98 disabled:opacity-50 disabled:hover:from-green-400 disabled:hover:via-green-500 disabled:hover:to-green-600 hover:scale-[1.02]'
            }`}
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
            
            {loading ? (
              <div className="flex items-center justify-center gap-3 relative z-10">
                {successAnimation ? (
                  <>
                    <Check className="w-6 h-6 animate-bounce" />
                    <span className="animate-pulse">Verification successful!</span>
                  </>
                ) : (
                  <>
                    <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Verifying...</span>
                  </>
                )}
              </div>
            ) : (
              <span className="relative z-10 flex items-center justify-center gap-2">
                <span>Verify</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            )}
          </button>

          {/* Security Badge */}
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500">
            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Secure verification protected</span>
          </div>
        </div>

        {/* Bottom Safe Area */}
        <div className="h-8"></div>
      </div>

      {/* Custom Styles */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-6px); }
          20%, 40%, 60%, 80% { transform: translateX(6px); }
        }
        
        @keyframes slideDown {
          from {
            transform: translateY(-12px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        @keyframes popIn {
          0% {
            transform: scale(0.5);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes shrinkOut {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(0.5);
            opacity: 0;
          }
        }

        @keyframes fadeOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }

        @keyframes flash {
          0% {
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%) translateY(-100%) rotate(30deg);
          }
          100% {
            transform: translateX(100%) translateY(100%) rotate(30deg);
          }
        }

        @keyframes shimmer-fast {
          0% {
            transform: translateX(-100%) rotate(30deg);
          }
          100% {
            transform: translateX(100%) rotate(30deg);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes twinkle {
          0%, 100% {
            opacity: 0.2;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.5);
          }
        }

        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes bounce-once {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-4px);
          }
        }

        @keyframes pulse-once {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
        
        .animate-shake {
          animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97);
        }
        
        .animate-slideDown {
          animation: slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .animate-popIn {
          animation: popIn 0.2s ease-out;
        }

        .animate-shrinkOut {
          animation: shrinkOut 0.15s ease-out forwards;
        }

        .animate-fadeOut {
          animation: fadeOut 0.15s ease-out forwards;
        }

        .animate-flash {
          animation: flash 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
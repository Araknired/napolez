import { useState, useEffect, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, Shield, Sparkles, Check, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function ForgotMobile() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isEmail = (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const handleResetPassword = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    if (!isEmail(email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className={`absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full blur-3xl opacity-30 transition-all duration-[3000ms] ${
            mounted ? 'scale-100' : 'scale-0'
          }`}
        />
        <div 
          className={`absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-green-100 to-blue-100 rounded-full blur-3xl opacity-30 transition-all duration-[3000ms] delay-300 ${
            mounted ? 'scale-100' : 'scale-0'
          }`}
        />
      </div>

      <div className="relative z-10 min-h-screen px-6 py-12 pb-24 flex flex-col justify-center">
        <div 
          className={`flex items-center justify-between mb-10 transition-all duration-700 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <img 
                src="/logo192.png" 
                alt="Logo" 
                className="w-12 h-12 rounded-2xl shadow-lg"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white">
                <Sparkles className="w-3 h-3 text-white p-0.5" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Reset Password</h1>
              <p className="text-xs text-gray-500">Recover your account</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm">
            <Shield className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-semibold text-gray-700">Secure</span>
          </div>
        </div>

        {!success ? (
          <div 
            className={`transition-all duration-700 delay-100 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Forgot Password?
              </h2>
              <p className="text-gray-600 text-sm">
                No worries! Enter your email and we'll send you instructions to reset your password.
              </p>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-5">
              {error && (
                <div className="bg-red-50/80 backdrop-blur-sm border-l-4 border-red-500 rounded-r-xl px-4 py-3 animate-shake">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <p className="text-sm text-red-700 font-medium">{error}</p>
                  </div>
                </div>
              )}

              <div className="relative">
                <label className="block text-xs font-semibold text-gray-600 mb-2 ml-1">
                  Email Address
                </label>
                <div className={`relative transition-all duration-300 ${
                  focusedField === 'email' ? 'transform scale-[1.02]' : ''
                }`}>
                  <div className={`absolute inset-0 bg-gradient-to-r rounded-2xl transition-opacity duration-300 ${
                    focusedField === 'email' 
                      ? 'from-blue-500 to-purple-500 opacity-20' 
                      : 'opacity-0'
                  }`} />
                  <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100">
                    <div className="flex items-center px-4 py-4">
                      <Mail className={`w-5 h-5 mr-3 transition-all duration-300 ${
                        focusedField === 'email' ? 'text-blue-500 scale-110' : 'text-gray-400'
                      }`} />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                        className="flex-1 bg-transparent border-0 focus:outline-none text-gray-900 placeholder-gray-400 text-sm font-medium"
                        placeholder="noreply@example.com"
                      />
                      {email && isEmail(email) && (
                        <Check className="w-5 h-5 text-green-500 animate-scale-in" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full relative overflow-hidden rounded-2xl shadow-2xl transition-all duration-300 ${
                    loading ? 'scale-95' : 'hover:scale-[1.02] active:scale-95'
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600" />
                  
                  {!loading && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 hover:opacity-20 translate-x-[-200%] hover:translate-x-[200%] transition-all duration-1000" />
                  )}

                  <div className="relative px-6 py-4 flex items-center justify-center gap-3">
                    {loading ? (
                      <>
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                        <span className="text-white font-bold text-base">Sending...</span>
                      </>
                    ) : (
                      <>
                        <span className="text-white font-bold text-base">Send Reset Link</span>
                        <ArrowRight className="w-5 h-5 text-white" />
                      </>
                    )}
                  </div>
                </button>
              </div>
            </form>

            <div className={`text-center mt-8 transition-all duration-700 delay-300 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <p className="text-sm text-gray-600">
                Remember your password?{' '}
                <Link 
                  to="/login" 
                  className="text-blue-500 font-bold hover:text-blue-600 underline underline-offset-2 transition-colors"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        ) : (
          <div 
            className={`transition-all duration-700 delay-100 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-3xl p-6 mb-6 shadow-xl">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                    <Check className="w-7 h-7 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-green-800 font-bold text-xl mb-2">
                    Check Your Email!
                  </h3>
                  <p className="text-green-700 text-sm mb-3">
                    We've sent password reset instructions to:
                  </p>
                  <div className="bg-white/60 rounded-xl px-4 py-3 mb-3">
                    <p className="text-green-900 font-semibold text-sm break-all">
                      {email}
                    </p>
                  </div>
                  <p className="text-green-600 text-xs">
                    Click the link in the email to reset your password.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50/80 backdrop-blur-sm border border-blue-200 rounded-2xl p-4 mb-6">
              <p className="text-blue-800 text-sm font-semibold mb-2">
                Didn't receive the email?
              </p>
              <ul className="text-blue-700 text-xs space-y-1.5">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>Check your spam/junk folder</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>Make sure you entered the correct email</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>Wait a few minutes for the email to arrive</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => {
                setSuccess(false);
                setEmail('');
              }}
              className="w-full bg-white/80 backdrop-blur-sm text-gray-700 py-4 rounded-2xl font-bold hover:bg-gray-50 transition-all shadow-lg border border-gray-200"
            >
              Try Another Email
            </button>

            <div className="text-center mt-6">
              <Link 
                to="/login" 
                className="text-sm text-blue-500 font-bold hover:text-blue-600 underline underline-offset-2 transition-colors"
              >
                Back to Sign In
              </Link>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
        
        @keyframes scale-in {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); opacity: 1; }
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
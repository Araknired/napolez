import { useState, useEffect, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import forgotImage from '../Login/design.png';
import { Mail, ArrowLeft, CheckCircle, AlertCircle, Zap, Shield } from 'lucide-react';

export default function ForgotDesktop() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
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
        setEmail('');
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hidden lg:flex h-screen pt-20 overflow-hidden bg-white">
      {/* Left Side - Image */}
      <div 
        className={`lg:w-1/2 bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 p-16 flex items-center justify-center relative overflow-hidden transition-all duration-1000 ${
          pageLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
        }`}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-gradient-to-br from-orange-300 to-red-300 rounded-full blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-gradient-to-br from-red-300 to-pink-300 rounded-full blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-pink-300 to-orange-300 rounded-full blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
        </div>

        {/* Card Container */}
        <div className="relative z-10 flex flex-col items-center justify-center max-w-2xl">
          <div 
            className={`transition-all duration-1000 ${
              pageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
            }`}
            style={{ transitionDelay: '300ms' }}
          >
            {/* Image */}
            <div className="relative mb-12 transform hover:scale-105 transition-transform duration-500">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 rounded-3xl blur-2xl opacity-40"></div>
              <img 
                src={forgotImage} 
                alt="Reset Password" 
                className="relative w-full h-auto object-contain rounded-3xl"
              />
            </div>

            {/* Text Content */}
            <div className="text-center">
              <h2 className={`text-5xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent mb-4 transition-all duration-1000 ${
                pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}>
                Recover Access
              </h2>
              <p className={`text-gray-600 text-xl transition-all duration-1000 ${
                pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: '200ms' }}>
                Reset your password in just a few minutes
              </p>
              <p className={`text-gray-500 text-sm mt-4 transition-all duration-1000 ${
                pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: '300ms' }}>
                We'll send you a secure link via email
              </p>
            </div>
          </div>
        </div>

        {/* Floating Decorative Elements */}
        <div className="absolute top-20 left-20 w-24 h-24 bg-orange-200 rounded-full opacity-20 blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-pink-200 rounded-full opacity-20 blur-xl animate-pulse animation-delay-1000"></div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 bg-white p-16 flex flex-col justify-center overflow-y-auto relative">
        {/* Background Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-orange-50/30 to-white pointer-events-none"></div>

        <div className="relative z-10 max-w-md mx-auto w-full">
          {/* Back Button */}
          <div 
            className={`mb-8 transition-all duration-700 ${
              pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: '400ms' }}
          >
            <Link
              to="/login"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-all duration-300 group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-semibold">Back to Sign In</span>
            </Link>
          </div>

          {/* Header */}
          <div 
            className={`mb-12 transition-all duration-700 ${
              pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: '450ms' }}
          >
            <div className="inline-block mb-6">
              <span className="px-4 py-2 bg-gradient-to-r from-orange-100 to-red-100 text-orange-600 text-sm font-semibold rounded-full">
                Password Recovery
              </span>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-3">
              Forgot Password?
            </h1>
            <p className="text-gray-500 text-lg">
              Enter your email to receive reset instructions
            </p>
          </div>

          {!success ? (
            <form onSubmit={handleResetPassword} className="space-y-6">
              {/* Error Alert */}
              {error && (
                <div 
                  className={`bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 text-sm rounded-r-lg mb-6 shadow-lg animate-slideIn ${
                    error ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span className="font-medium">{error}</span>
                  </div>
                </div>
              )}

              {/* Email Input */}
              <div 
                className={`transition-all duration-700 ${
                  pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: '500ms' }}
              >
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Email Address
                </label>
                <div className={`relative bg-white rounded-2xl overflow-hidden transition-all duration-300 ${
                  focusedField === 'email' 
                    ? 'shadow-xl shadow-orange-500/20 border-2 border-orange-500' 
                    : 'shadow-md shadow-gray-200/50 border-2 border-gray-200'
                }`}>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    className="w-full px-6 py-4 bg-transparent border-0 outline-none text-gray-900 font-medium placeholder-gray-400"
                    placeholder="Enter your email address"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <Mail className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div 
                className={`transition-all duration-700 pt-4 ${
                  pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: '600ms' }}
              >
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full relative overflow-hidden group rounded-2xl font-semibold text-lg text-white transition-all duration-300 shadow-xl shadow-orange-500/30 hover:shadow-2xl hover:shadow-orange-500/40 hover:scale-[1.02] active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-red-500 to-pink-600 transition-all duration-300"></div>
                  
                  <div className="relative px-6 py-4 flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                          <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                          <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                        </div>
                        <span className="text-white">Sending...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Reset Link</span>
                        <Zap className="w-5 h-5" />
                      </>
                    )}
                  </div>
                </button>
              </div>

              {/* Info Box */}
              <div 
                className={`mt-10 p-6 bg-gradient-to-r from-blue-50/50 to-cyan-50/50 backdrop-blur-sm rounded-2xl transition-all duration-700 border border-blue-200/30 shadow-lg ${
                  pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: '700ms' }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-200 to-cyan-200 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                    <Shield className="w-5 h-5 text-blue-700" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm mb-2">What happens next?</h4>
                    <ul className="text-gray-700 text-sm space-y-1">
                      <li>✓ We'll send a secure link to your email</li>
                      <li>✓ Click the link to reset your password</li>
                      <li>✓ Link expires in 24 hours for security</li>
                    </ul>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <div 
              className={`transition-all duration-700 ${
                pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: '500ms' }}
            >
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-3xl p-10 shadow-2xl">
                <div className={`w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg mx-auto mb-8 transition-all duration-700 ${
                  success ? 'scale-100' : 'scale-0'
                }`}>
                  <CheckCircle className="w-14 h-14 text-white" />
                </div>

                <h2 className="text-3xl font-bold text-green-800 mb-3 text-center">
                  Check Your Email
                </h2>
                <p className="text-green-700 text-base text-center mb-2">
                  We've sent password reset instructions to
                </p>
                <p className="text-green-600 font-bold text-center mb-6">
                  {email}
                </p>

                {/* Steps */}
                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3 bg-white/50 rounded-xl p-3">
                    <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center text-green-700 font-bold text-sm flex-shrink-0">1</div>
                    <p className="text-green-800 text-sm font-medium">Check your inbox</p>
                  </div>
                  <div className="flex items-center gap-3 bg-white/50 rounded-xl p-3">
                    <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center text-green-700 font-bold text-sm flex-shrink-0">2</div>
                    <p className="text-green-800 text-sm font-medium">Click the reset link</p>
                  </div>
                  <div className="flex items-center gap-3 bg-white/50 rounded-xl p-3">
                    <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center text-green-700 font-bold text-sm flex-shrink-0">3</div>
                    <p className="text-green-800 text-sm font-medium">Create a new password</p>
                  </div>
                </div>

                <div className="bg-yellow-50/50 border border-yellow-200 rounded-xl p-4">
                  <p className="text-yellow-800 text-sm">
                    <strong>Tip:</strong> Check your spam or junk folder if you don't see the email in your inbox
                  </p>
                </div>

                <button
                  onClick={() => {
                    setSuccess(false);
                    setEmail('');
                    setError(null);
                  }}
                  className="w-full mt-8 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
                >
                  Try Another Email
                </button>
              </div>
            </div>
          )}

          {/* Sign In Link */}
          {!success && (
            <div 
              className={`text-center mt-12 transition-all duration-700 ${
                pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: '800ms' }}
            >
              <p className="text-sm text-gray-600">
                Remember your password?{' '}
                <Link 
                  to="/login" 
                  className="text-orange-500 hover:text-orange-600 font-semibold transition-colors"
                >
                  Sign In
                </Link>
              </p>
            </div>
          )}
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
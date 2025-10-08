import { useState, useEffect, type FormEvent } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export default function RegisterDesktop() {
  const [name, setName] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);

  const { signUp, signInWithGoogle, signInWithGithub, signInWithFacebook, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/profile');
    }
  }, [user, navigate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Función para detectar si es email o teléfono
  const isEmail = (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const isPhone = (value: string): boolean => {
    // Detecta si es un número de teléfono (solo números, puede tener + al inicio)
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    return phoneRegex.test(value.replace(/\s/g, ''));
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!agreeTerms) {
      setError('You must agree to the Terms & Conditions');
      return;
    }

    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    if (!emailOrPhone.trim()) {
      setError('Please enter your email or phone number');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      // Determinar si es email o teléfono
      if (isEmail(emailOrPhone)) {
        // Registro con email
        const { error } = await signUp(emailOrPhone, password);
        if (error) {
          setError(error.message);
        } else {
          setMessage('Registration successful! Check your email to confirm your account.');
        }
      } else if (isPhone(emailOrPhone)) {
        // Registro con teléfono
        const cleanPhone = emailOrPhone.replace(/\s/g, '');
        
        const { error } = await supabase.auth.signInWithOtp({
          phone: cleanPhone,
        });

        if (error) {
          setError(error.message);
        } else {
          // Redirigir a la página de verificación con el nombre
          navigate('/code', { 
            state: { 
              phone: cleanPhone, 
              from: 'register',
              name: name 
            } 
          });
        }
      } else {
        setError('Please enter a valid email or phone number');
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (loginFunction: () => Promise<any>) => {
    setError(null);
    try {
      await loginFunction();
    } catch (err: any) {
      if (err && err.message && !err.message.includes('popup') && !err.message.includes('closed')) {
        setError(err.message);
      }
    }
  };

  return (
    <div className="h-screen pt-24 overflow-hidden">
      <div className="flex h-full">
        {/* Left side - Gray gradient with statistics */}
        <div 
          className={`hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 p-16 items-center justify-center relative overflow-hidden transition-all duration-1000 ${
            pageLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
          }`}
          style={{ transitionDelay: '200ms' }}
        >

          {/* Statistics card */}
          <div className="relative z-10 flex flex-col items-center justify-center">
            <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-gray-800">Statistics</h3>
                <button className="text-sm text-blue-500 hover:text-blue-600">show more</button>
              </div>

              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <svg className="w-32 h-32 transform -rotate-90">
                      <circle cx="64" cy="64" r="56" stroke="#E5E7EB" strokeWidth="12" fill="none" />
                      <circle cx="64" cy="64" r="56" stroke="url(#gradient)" strokeWidth="12" fill="none" 
                        strokeDasharray="351.86" strokeDashoffset="87.96" strokeLinecap="round" />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#3B82F6" />
                          <stop offset="50%" stopColor="#8B5CF6" />
                          <stop offset="100%" stopColor="#EC4899" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl font-bold text-gray-800">23</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-1">Total Hours</p>
                      <p className="text-2xl font-bold text-gray-800">1,240</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Budget</p>
                      <p className="text-2xl font-bold text-gray-800">$2,500</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mb-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">Super</span>
                <span className="px-3 py-1 bg-green-100 text-green-600 text-xs rounded-full">Good</span>
                <span className="px-3 py-1 bg-pink-100 text-pink-600 text-xs rounded-full">Progress</span>
                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">+18%</span>
              </div>

              <p className="text-gray-600 text-sm mt-6">
                Let's see what we have new, check it out! So maybe write here something more.
              </p>

              <div className="flex gap-2 mt-4">
                <div className="h-1 bg-blue-500 rounded-full flex-1"></div>
                <div className="h-1 bg-gray-300 rounded-full flex-1"></div>
                <div className="h-1 bg-gray-300 rounded-full flex-1"></div>
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-32 right-32 w-64 h-64 bg-white/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-32 left-32 w-80 h-80 bg-white/20 rounded-full blur-3xl"></div>
        </div>

        {/* Right side - White with form */}
        <div className="w-full lg:w-1/2 bg-white p-16 flex flex-col justify-center overflow-y-auto">
          <div className="max-w-md mx-auto w-full">
            <div 
              className={`text-center mb-10 transition-all duration-700 ${
                pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: '400ms' }}
            >
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Create your account
              </h1>
              <p className="text-gray-500 text-lg">
                It's free and easy
              </p>
            </div>

            <form onSubmit={handleRegister} className="space-y-6">
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 text-sm rounded">
                  {error}
                </div>
              )}

              {message && (
                <div className="bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-3 text-sm rounded">
                  {message}
                </div>
              )}

              <div 
                className={`transition-all duration-700 ${
                  pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: '500ms' }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="Enter your name"
                />
              </div>

              <div 
                className={`transition-all duration-700 ${
                  pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: '600ms' }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  E-mail or phone number
                </label>
                <input
                  type="text"
                  required
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="Type your e-mail or phone number"
                />
              </div>

              <div 
                className={`transition-all duration-700 ${
                  pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: '700ms' }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="Type your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {showPassword ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      )}
                    </svg>
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Must be 8 characters at least</p>
              </div>

              <div 
                className={`transition-all duration-700 ${
                  pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: '800ms' }}
              >
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-4 h-4 mt-0.5 text-blue-500 border-gray-300 rounded focus:ring-blue-400"
                  />
                  <span className="text-sm text-gray-600">
                    By creating an account means you agree to the{' '}
                    <Link to="/terms" className="text-blue-500 hover:text-blue-600 font-medium">
                      Terms and Conditions
                    </Link>
                    , and our{' '}
                    <Link to="/privacy" className="text-blue-500 hover:text-blue-600 font-medium">
                      Privacy Policy
                    </Link>
                  </span>
                </label>
              </div>

              <div 
                className={`transition-all duration-700 ${
                  pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: '900ms' }}
              >
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3.5 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg text-lg"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                      </div>
                      <span>Creating account...</span>
                    </div>
                  ) : 'Register'}
                </button>
              </div>
            </form>

            <div 
              className={`relative my-8 transition-all duration-700 ${
                pageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              }`}
              style={{ transitionDelay: '1000ms' }}
            >
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">or do it via other accounts</span>
              </div>
            </div>

            <div 
              className={`flex justify-center gap-4 transition-all duration-700 ${
                pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: '1100ms' }}
            >
              <button
                type="button"
                onClick={() => handleSocialLogin(signInWithGoogle)}
                disabled={loading}
                className="w-14 h-14 flex items-center justify-center rounded-full border-2 border-gray-300 hover:border-blue-500 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-white"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </button>

              <button
                type="button"
                onClick={() => handleSocialLogin(signInWithGithub)}
                disabled={loading}
                className="w-14 h-14 flex items-center justify-center rounded-full border-2 border-gray-300 hover:border-gray-900 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-white"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
                </svg>
              </button>

              <button
                type="button"
                onClick={() => handleSocialLogin(signInWithFacebook)}
                disabled={loading}
                className="w-14 h-14 flex items-center justify-center rounded-full border-2 border-gray-300 hover:border-blue-600 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-white"
              >
                <svg className="w-6 h-6" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </button>
            </div>

            <div 
              className={`text-center mt-8 transition-all duration-700 ${
                pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: '1200ms' }}
            >
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link 
                  to="/login"
                  className="text-blue-500 hover:text-blue-600 font-semibold"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import { useState, useEffect, type FormEvent } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import registerImage from '../../assets/images/register/register.png';

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
  const [focusedField, setFocusedField] = useState<string | null>(null);

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

  const isEmail = (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const isPhone = (value: string): boolean => {
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    return phoneRegex.test(value.replace(/\s/g, ''));
  };

  const saveUserData = async (userId: string, fullName: string, phone?: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .upsert({
          user_id: userId,
          full_name: fullName,
          phone: phone || null,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (error) {
        console.error('Error saving user data:', error);
      }
    } catch (err) {
      console.error('Unexpected error saving user data:', err);
    }
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
      if (isEmail(emailOrPhone)) {
        const { data, error } = await signUp(emailOrPhone, password);
        if (error) {
          setError(error.message);
        } else if (data?.user) {
          await saveUserData(data.user.id, name);
          setMessage('Registration successful! Check your email to confirm your account.');
        }
      } else if (isPhone(emailOrPhone)) {
        const cleanPhone = emailOrPhone.replace(/\s/g, '');
        
        const { error } = await supabase.auth.signInWithOtp({
          phone: cleanPhone,
        });

        if (error) {
          setError(error.message);
        } else {
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
    <div className="hidden lg:flex h-screen pt-20 overflow-hidden bg-white">
      {/* Left Side - Image */}
      <div 
        className={`lg:w-1/2 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 p-16 flex items-center justify-center relative overflow-hidden transition-all duration-1000 ${
          pageLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
        }`}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-gradient-to-br from-purple-300 to-blue-300 rounded-full blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-gradient-to-br from-indigo-300 to-purple-300 rounded-full blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-blue-300 to-indigo-300 rounded-full blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
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
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-blue-400 to-indigo-400 rounded-3xl blur-2xl opacity-40"></div>
              <img 
                src={registerImage} 
                alt="Register" 
                className="relative w-full h-auto object-contain rounded-3xl"
              />
            </div>

            {/* Text Content */}
            <div className="text-center">
              <h2 className={`text-5xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4 transition-all duration-1000 ${
                pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}>
                Join NAPOLEZ
              </h2>
              <p className={`text-gray-600 text-xl transition-all duration-1000 ${
                pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: '200ms' }}>
                Create your account and start exploring
              </p>
              <p className={`text-gray-500 text-sm mt-4 transition-all duration-1000 ${
                pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: '300ms' }}>
                It's free, easy, and takes less than a minute
              </p>
            </div>
          </div>
        </div>

        {/* Floating Decorative Elements */}
        <div className="absolute top-20 left-20 w-24 h-24 bg-purple-200 rounded-full opacity-20 blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-blue-200 rounded-full opacity-20 blur-xl animate-pulse animation-delay-1000"></div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 bg-white p-16 flex flex-col justify-center overflow-y-auto relative">
        {/* Background Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-purple-50/30 to-white pointer-events-none"></div>

        <div className="relative z-10 max-w-md mx-auto w-full">
          {/* Header */}
          <div 
            className={`transition-all duration-700 mb-12 ${
              pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: '400ms' }}
          >
            <div className="inline-block mb-6">
              <span className="px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-600 text-sm font-semibold rounded-full">
                Create Account
              </span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Sign Up
            </h1>
            <p className="text-gray-500 text-lg">
              Join thousands of users enjoying NAPOLEZ
            </p>
          </div>

          {/* Error Alert */}
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

          {/* Success Alert */}
          {message && (
            <div 
              className={`bg-green-50 border-l-4 border-green-500 text-green-700 px-6 py-4 text-sm rounded-r-lg mb-6 shadow-lg animate-slideIn ${
                message ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-medium">{message}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            {/* Name Input */}
            <div 
              className={`transition-all duration-700 ${
                pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: '500ms' }}
            >
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Full Name
              </label>
              <div className={`relative bg-white rounded-2xl overflow-hidden transition-all duration-300 ${
                focusedField === 'name' 
                  ? 'shadow-xl shadow-purple-500/20 border-2 border-purple-500' 
                  : 'shadow-md shadow-gray-200/50 border-2 border-gray-200'
              }`}>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full px-6 py-4 bg-transparent border-0 outline-none text-gray-900 font-medium placeholder-gray-400"
                  placeholder="Enter your full name"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Email/Phone Input */}
            <div 
              className={`transition-all duration-700 ${
                pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: '550ms' }}
            >
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Email or Phone
              </label>
              <div className={`relative bg-white rounded-2xl overflow-hidden transition-all duration-300 ${
                focusedField === 'email' 
                  ? 'shadow-xl shadow-purple-500/20 border-2 border-purple-500' 
                  : 'shadow-md shadow-gray-200/50 border-2 border-gray-200'
              }`}>
                <input
                  type="text"
                  required
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full px-6 py-4 bg-transparent border-0 outline-none text-gray-900 font-medium placeholder-gray-400"
                  placeholder="Enter your email or phone number"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Password Input */}
            <div 
              className={`transition-all duration-700 ${
                pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: '600ms' }}
            >
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Password
              </label>
              <div className={`relative bg-white rounded-2xl overflow-hidden transition-all duration-300 ${
                focusedField === 'password' 
                  ? 'shadow-xl shadow-purple-500/20 border-2 border-purple-500' 
                  : 'shadow-md shadow-gray-200/50 border-2 border-gray-200'
              }`}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full px-6 py-4 pr-12 bg-transparent border-0 outline-none text-gray-900 font-medium placeholder-gray-400"
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
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
              <p className="text-xs text-gray-500 mt-2">Must be at least 6 characters</p>
            </div>

            {/* Terms Checkbox */}
            <div 
              className={`transition-all duration-700 ${
                pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: '650ms' }}
            >
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-5 h-5 mt-0.5 text-purple-500 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 cursor-pointer"
                />
                <span className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors">
                  I agree to the{' '}
                  <Link to="/terms" className="text-purple-500 hover:text-purple-600 font-medium">
                    Terms and Conditions
                  </Link>
                  {' '}and{' '}
                  <Link to="/privacy" className="text-purple-500 hover:text-purple-600 font-medium">
                    Privacy Policy
                  </Link>
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <div 
              className={`transition-all duration-700 pt-4 ${
                pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: '750ms' }}
            >
              <button
                type="submit"
                disabled={loading}
                className="w-full relative overflow-hidden group rounded-2xl font-semibold text-lg text-white transition-all duration-300 shadow-xl shadow-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/40 hover:scale-[1.02] active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-purple-600 to-blue-600 transition-all duration-300"></div>
                
                <div className="relative px-6 py-4 flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                      </div>
                      <span className="text-white">Creating account...</span>
                    </>
                  ) : 'Create Account'}
                </div>
              </button>
            </div>
          </form>

          {/* Divider */}
          <div 
            className={`relative my-10 transition-all duration-700 ${
              pageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
            style={{ transitionDelay: '850ms' }}
          >
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-gray-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-white text-gray-500 text-sm font-medium">Or sign up with</span>
            </div>
          </div>

          {/* Social Buttons */}
          <div 
            className={`flex justify-center gap-4 transition-all duration-700 ${
              pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: '950ms' }}
          >
            <button
              type="button"
              onClick={() => handleSocialLogin(signInWithGoogle)}
              disabled={loading}
              className="w-16 h-16 flex items-center justify-center rounded-2xl border-2 border-gray-200 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 bg-white hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-110"
            >
              <svg className="w-7 h-7" viewBox="0 0 24 24">
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
              className="w-16 h-16 flex items-center justify-center rounded-2xl border-2 border-gray-200 hover:border-gray-900 hover:shadow-lg hover:shadow-gray-900/20 transition-all duration-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-110"
            >
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
              </svg>
            </button>

            <button
              type="button"
              onClick={() => handleSocialLogin(signInWithFacebook)}
              disabled={loading}
              className="w-16 h-16 flex items-center justify-center rounded-2xl border-2 border-gray-200 hover:border-blue-600 hover:shadow-lg hover:shadow-blue-600/20 transition-all duration-300 bg-white hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-110"
            >
              <svg className="w-7 h-7" fill="#1877F2" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </button>
          </div>

          {/* Sign In Link */}
          <div 
            className={`text-center mt-12 transition-all duration-700 ${
              pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: '1050ms' }}
          >
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link 
                to="/login"
                className="text-purple-500 hover:text-purple-600 font-semibold transition-colors"
              >
                Sign In
              </Link>
            </p>
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
import { useState, useEffect, type FormEvent } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useMenu } from '../../context/MenuContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Check, ArrowRight, Shield, Sparkles } from 'lucide-react';

export default function LoginMobile() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [formProgress, setFormProgress] = useState(0);

  const { signIn, signInWithGoogle, signInWithGithub, signInWithFacebook, user } = useAuth();
  const { intendedPath, setIntendedPath } = useMenu();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = (location.state as any)?.from || intendedPath || '/profile';

  useEffect(() => {
    if (user) {
      setIntendedPath(null);
      navigate(from, { replace: true });
    }
  }, [user, navigate, from, setIntendedPath]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let progress = 0;
    if (email) progress += 50;
    if (password) progress += 50;
    setFormProgress(progress);
  }, [email, password]);

  const handleEmailLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { error } = await signIn(email, password);
      if (error) {
        setError(error.message);
      } else {
        setIntendedPath(null);
        navigate(from, { replace: true });
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
        <div 
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-50 to-pink-50 rounded-full blur-3xl opacity-20 transition-all duration-[4000ms] delay-500 ${
            mounted ? 'scale-100 rotate-45' : 'scale-0 rotate-0'
          }`}
        />
      </div>

      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 z-50">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-500 ease-out"
          style={{ width: `${formProgress}%` }}
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
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white">
                <Sparkles className="w-3 h-3 text-white p-0.5" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Welcome Back</h1>
              <p className="text-xs text-gray-500">Sign in to continue</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm">
            <Shield className="w-4 h-4 text-green-500" />
            <span className="text-xs font-semibold text-gray-700">Secure</span>
          </div>
        </div>

        <div 
          className={`transition-all duration-700 delay-100 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <form onSubmit={handleEmailLogin} className="space-y-5">
            {error && (
              <div className="bg-red-50/80 backdrop-blur-sm border-l-4 border-red-500 rounded-r-xl px-4 py-3 animate-shake">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
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
                      placeholder="example@gmail.com"
                    />
                    {email && email.includes('@') && (
                      <Check className="w-5 h-5 text-green-500 animate-scale-in" />
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <label className="block text-xs font-semibold text-gray-600 mb-2 ml-1">
                Password
              </label>
              <div className={`relative transition-all duration-300 ${
                focusedField === 'password' ? 'transform scale-[1.02]' : ''
              }`}>
                <div className={`absolute inset-0 bg-gradient-to-r rounded-2xl transition-opacity duration-300 ${
                  focusedField === 'password' 
                    ? 'from-purple-500 to-pink-500 opacity-20' 
                    : 'opacity-0'
                }`} />
                <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100">
                  <div className="flex items-center px-4 py-4">
                    <Lock className={`w-5 h-5 mr-3 transition-all duration-300 ${
                      focusedField === 'password' ? 'text-purple-500 scale-110' : 'text-gray-400'
                    }`} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                      className="flex-1 bg-transparent border-0 focus:outline-none text-gray-900 placeholder-gray-400 text-sm font-medium"
                      placeholder="••••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              <div className="text-right mt-3">
                <Link 
                  to="/forgot-password" 
                  className="text-xs text-blue-500 hover:text-blue-600 font-semibold underline underline-offset-2 transition-colors"
                >
                  Forgot Password?
                </Link>
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
                      <span className="text-white font-bold text-base">Signing in...</span>
                    </>
                  ) : (
                    <>
                      <span className="text-white font-bold text-base">Sign In</span>
                      <ArrowRight className="w-5 h-5 text-white" />
                    </>
                  )}
                </div>
              </button>
            </div>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-gradient-to-r from-gray-50 via-white to-gray-50 text-xs text-gray-500 font-medium">
                Or sign in with
              </span>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <button
              type="button"
              onClick={() => handleSocialLogin(signInWithGoogle)}
              disabled={loading}
              className={`w-16 h-16 flex items-center justify-center rounded-2xl bg-white/80 backdrop-blur-sm border-2 border-gray-100 shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 hover:border-blue-500 hover:shadow-blue-100 disabled:opacity-50 disabled:cursor-not-allowed ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: '600ms' }}
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
              className={`w-16 h-16 flex items-center justify-center rounded-2xl bg-white/80 backdrop-blur-sm border-2 border-gray-100 shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 hover:border-gray-800 hover:shadow-gray-100 disabled:opacity-50 disabled:cursor-not-allowed ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: '700ms' }}
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
              </svg>
            </button>

            <button
              type="button"
              onClick={() => handleSocialLogin(signInWithFacebook)}
              disabled={loading}
              className={`w-16 h-16 flex items-center justify-center rounded-2xl bg-white/80 backdrop-blur-sm border-2 border-gray-100 shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 hover:border-blue-600 hover:shadow-blue-100 disabled:opacity-50 disabled:cursor-not-allowed ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: '800ms' }}
            >
              <svg className="w-6 h-6" fill="#1877F2" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </button>
          </div>

          <div className={`text-center mt-8 transition-all duration-700 delay-[900ms] ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link 
                to="/register" 
                state={{ from }}
                className="text-blue-500 font-bold hover:text-blue-600 underline underline-offset-2 transition-colors"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
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
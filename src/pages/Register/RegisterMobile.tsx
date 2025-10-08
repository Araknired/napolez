import { useState, useEffect, type FormEvent } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Mail, Lock, User, Phone, Eye, EyeOff, Check, ArrowRight, Shield, Sparkles } from 'lucide-react';

export default function RegisterMobile() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [registrationType, setRegistrationType] = useState<'email' | 'phone'>('email');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [formProgress, setFormProgress] = useState(0);

  const { signUp, signInWithGoogle, signInWithGithub, signInWithFacebook, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/profile');
    }
  }, [user, navigate]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let progress = 0;
    if (name) progress += 25;
    if (registrationType === 'email' ? email : phone) progress += 25;
    if (registrationType === 'email' && password) progress += 25;
    if (agreeTerms) progress += 25;
    setFormProgress(progress);
  }, [name, email, phone, password, agreeTerms, registrationType]);

  useEffect(() => {
    if (password) {
      let strength = 0;
      if (password.length >= 6) strength += 25;
      if (password.length >= 10) strength += 25;
      if (/[A-Z]/.test(password)) strength += 25;
      if (/[0-9]/.test(password)) strength += 25;
      setPasswordStrength(strength);
    } else {
      setPasswordStrength(0);
    }
  }, [password]);

  const handleEmailRegister = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!agreeTerms) {
      setError('You must agree to the Terms & Conditions');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const { error } = await signUp(email, password);
      if (error) {
        setError(error.message);
      } else {
        setMessage('Registration successful! Check your email to confirm your account.');
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneRegister = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!agreeTerms) {
      setError('You must agree to the Terms & Conditions');
      return;
    }

    if (!phone || phone.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone,
      });

      if (error) {
        setError(error.message);
      } else {
        navigate('/code', { state: { phone, from: 'register' } });
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    if (registrationType === 'email') {
      handleEmailRegister(e);
    } else {
      handlePhoneRegister(e);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 25) return 'bg-red-500';
    if (passwordStrength <= 50) return 'bg-orange-500';
    if (passwordStrength <= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 25) return 'Weak';
    if (passwordStrength <= 50) return 'Fair';
    if (passwordStrength <= 75) return 'Good';
    return 'Strong';
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

      <div className="relative z-10 min-h-screen px-6 py-8 pb-24 flex flex-col">
        <div 
          className={`flex items-center justify-between mb-8 transition-all duration-700 ${
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
              <h1 className="text-xl font-bold text-gray-900">Create Account</h1>
              <p className="text-xs text-gray-500">Join our community</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm">
            <Shield className="w-4 h-4 text-green-500" />
            <span className="text-xs font-semibold text-gray-700">Secure</span>
          </div>
        </div>

        <div 
          className={`mb-6 transition-all duration-700 delay-100 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-1.5 shadow-lg border border-gray-100">
            <div className="relative flex gap-1">
              <button
                type="button"
                onClick={() => setRegistrationType('email')}
                className={`flex-1 relative z-10 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 ${
                  registrationType === 'email'
                    ? 'text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Mail className="w-4 h-4 inline-block mr-2 mb-0.5" />
                Email
              </button>
              <button
                type="button"
                onClick={() => setRegistrationType('phone')}
                className={`flex-1 relative z-10 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 ${
                  registrationType === 'phone'
                    ? 'text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Phone className="w-4 h-4 inline-block mr-2 mb-0.5" />
                Phone
              </button>
              <div 
                className={`absolute top-0 bottom-0 w-[calc(50%-2px)] bg-gradient-to-r rounded-xl shadow-lg transition-all duration-300 ${
                  registrationType === 'email'
                    ? 'left-0 from-blue-500 to-blue-600'
                    : 'left-[calc(50%+2px)] from-green-500 to-green-600'
                }`}
              />
            </div>
          </div>
        </div>

        <div 
          className={`flex-1 transition-all duration-700 delay-200 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50/80 backdrop-blur-sm border-l-4 border-red-500 rounded-r-xl px-4 py-3 animate-shake">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <p className="text-sm text-red-700 font-medium">{error}</p>
                </div>
              </div>
            )}

            {message && (
              <div className="bg-green-50/80 backdrop-blur-sm border-l-4 border-green-500 rounded-r-xl px-4 py-3">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <p className="text-sm text-green-700 font-medium">{message}</p>
                </div>
              </div>
            )}

            <div className="relative">
              <label className="block text-xs font-semibold text-gray-600 mb-2 ml-1">
                Full Name
              </label>
              <div className={`relative transition-all duration-300 ${
                focusedField === 'name' ? 'transform scale-[1.02]' : ''
              }`}>
                <div className={`absolute inset-0 bg-gradient-to-r rounded-2xl transition-opacity duration-300 ${
                  focusedField === 'name' 
                    ? 'from-blue-500 to-purple-500 opacity-20' 
                    : 'opacity-0'
                }`} />
                <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100">
                  <div className="flex items-center px-4 py-4">
                    <User className={`w-5 h-5 mr-3 transition-all duration-300 ${
                      focusedField === 'name' ? 'text-blue-500 scale-110' : 'text-gray-400'
                    }`} />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField(null)}
                      className="flex-1 bg-transparent border-0 focus:outline-none text-gray-900 placeholder-gray-400 text-sm font-medium"
                      placeholder="John Doe"
                    />
                    {name && (
                      <Check className="w-5 h-5 text-green-500 animate-scale-in" />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {registrationType === 'phone' ? (
              <div className="relative">
                <label className="block text-xs font-semibold text-gray-600 mb-2 ml-1">
                  Phone Number
                </label>
                <div className={`relative transition-all duration-300 ${
                  focusedField === 'phone' ? 'transform scale-[1.02]' : ''
                }`}>
                  <div className={`absolute inset-0 bg-gradient-to-r rounded-2xl transition-opacity duration-300 ${
                    focusedField === 'phone' 
                      ? 'from-green-500 to-teal-500 opacity-20' 
                      : 'opacity-0'
                  }`} />
                  <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100">
                    <div className="flex items-center px-4 py-4">
                      <Phone className={`w-5 h-5 mr-3 transition-all duration-300 ${
                        focusedField === 'phone' ? 'text-green-500 scale-110' : 'text-gray-400'
                      }`} />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        onFocus={() => setFocusedField('phone')}
                        onBlur={() => setFocusedField(null)}
                        className="flex-1 bg-transparent border-0 focus:outline-none text-gray-900 placeholder-gray-400 text-sm font-medium"
                        placeholder="+1 234 567 8900"
                      />
                      {phone && phone.length >= 10 && (
                        <Check className="w-5 h-5 text-green-500 animate-scale-in" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
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
                      {password && (
                        <div className="px-4 pb-3">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-medium text-gray-600">
                              Strength: <span className={
                                passwordStrength <= 25 ? 'text-red-500' :
                                passwordStrength <= 50 ? 'text-orange-500' :
                                passwordStrength <= 75 ? 'text-yellow-500' :
                                'text-green-500'
                              }>{getPasswordStrengthText()}</span>
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${getPasswordStrengthColor()} transition-all duration-500 rounded-full`}
                              style={{ width: `${passwordStrength}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="relative">
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative flex-shrink-0 mt-0.5">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className={`w-6 h-6 rounded-lg border-2 transition-all duration-300 ${
                    agreeTerms 
                      ? 'bg-gradient-to-br from-blue-500 to-purple-500 border-blue-500 scale-110' 
                      : 'bg-white border-gray-300 group-hover:border-blue-400'
                  }`}>
                    {agreeTerms && (
                      <Check className="w-5 h-5 text-white p-0.5 animate-scale-in" />
                    )}
                  </div>
                </div>
                <span className="text-sm text-gray-600 leading-relaxed">
                  I agree to the{' '}
                  <Link to="/terms" className="text-blue-500 font-semibold hover:text-blue-600 underline underline-offset-2">
                    Terms & Conditions
                  </Link>
                  {' '}and{' '}
                  <Link to="/privacy" className="text-blue-500 font-semibold hover:text-blue-600 underline underline-offset-2">
                    Privacy Policy
                  </Link>
                </span>
              </label>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className={`w-full relative overflow-hidden rounded-2xl shadow-2xl transition-all duration-300 ${
                  loading ? 'scale-95' : 'hover:scale-[1.02] active:scale-95'
                }`}
              >
                <div className={`absolute inset-0 bg-gradient-to-r transition-opacity duration-300 ${
                  registrationType === 'email'
                    ? 'from-blue-500 via-blue-600 to-purple-600'
                    : 'from-green-500 via-green-600 to-teal-600'
                } ${loading ? 'opacity-80' : 'opacity-100'}`} />
                
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
                      <span className="text-white font-bold text-base">Creating account...</span>
                    </>
                  ) : (
                    <>
                      <span className="text-white font-bold text-base">Create Account</span>
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
                Or sign up with
              </span>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <button
              type="button"
              onClick={signInWithGoogle}
              className={`w-16 h-16 flex items-center justify-center rounded-2xl bg-white/80 backdrop-blur-sm border-2 border-gray-100 shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 hover:border-blue-500 hover:shadow-blue-100 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: '800ms' }}
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
              onClick={signInWithGithub}
              className={`w-16 h-16 flex items-center justify-center rounded-2xl bg-white/80 backdrop-blur-sm border-2 border-gray-100 shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 hover:border-gray-800 hover:shadow-gray-100 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: '900ms' }}
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
              </svg>
            </button>

            <button
              type="button"
              onClick={signInWithFacebook}
              className={`w-16 h-16 flex items-center justify-center rounded-2xl bg-white/80 backdrop-blur-sm border-2 border-gray-100 shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 hover:border-blue-600 hover:shadow-blue-100 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: '1000ms' }}
            >
              <svg className="w-6 h-6" fill="#1877F2" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </button>
          </div>

          <div className={`text-center mt-8 transition-all duration-700 delay-[1100ms] ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-500 font-bold hover:text-blue-600 underline underline-offset-2 transition-colors">
                Sign In
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
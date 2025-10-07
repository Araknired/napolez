import { useState, useEffect, type FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ArrowLeft } from 'lucide-react';

export default function Code() {
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
    <div className="min-h-screen bg-white flex items-center justify-center px-6 py-12 pt-28 md:pt-12">
      <div className="w-full max-w-md">
        
        <div 
          className={`mb-8 transition-all duration-700 ${
            pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
          }`}
          style={{ transitionDelay: '100ms' }}
        >
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back</span>
          </button>

          <div className="text-center">
            <img 
              src="/logo192.png" 
              alt="Logo" 
              className="w-16 h-16 mx-auto mb-4"
            />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Verify Code
            </h1>
            <p className="text-sm text-gray-500">
              Please enter the code we just sent to
            </p>
            <p className="text-sm text-blue-500 font-medium mt-1">
              {phone}
            </p>
          </div>
        </div>

        <form onSubmit={handleVerifyOtp} className="space-y-6">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 text-sm">
              {error}
            </div>
          )}

          {resendMessage && (
            <div className="bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-3 text-sm">
              {resendMessage}
            </div>
          )}

          <div 
            className={`transition-all duration-700 ${
              pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            <div className="flex justify-center gap-3 mb-6">
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
                      const nextInput = document.getElementById(`otp-${index + 1}`);
                      nextInput?.focus();
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Backspace' && !otp[index] && index > 0) {
                      const prevInput = document.getElementById(`otp-${index - 1}`);
                      prevInput?.focus();
                    }
                  }}
                  id={`otp-${index}`}
                  className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-200 rounded-lg focus:border-blue-400 focus:outline-none focus:ring-0 text-gray-900 transition-colors"
                />
              ))}
            </div>
          </div>

          <div 
            className={`text-center transition-all duration-700 ${
              pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: '300ms' }}
          >
            <p className="text-sm text-gray-600 mb-2">
              Didn't receive OTP?
            </p>
            <button
              type="button"
              onClick={handleResendCode}
              disabled={resendLoading}
              className="text-sm text-green-500 hover:text-green-600 font-semibold disabled:opacity-50"
            >
              {resendLoading ? 'Sending...' : 'Resend code'}
            </button>
          </div>

          <div 
            className={`transition-all duration-700 ${
              pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: '400ms' }}
          >
            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full text-white py-3 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 focus:ring-green-400"
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
      </div>
    </div>
  );
}
import { useState, useEffect, useCallback, useMemo } from 'react';
import type { FC, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import {
  Eye,
  EyeOff,
  Lock,
  Check,
  Shield,
  ArrowRight,
  Zap,
} from 'lucide-react';

/**
 * Password strength evaluation result
 */
interface PasswordStrength {
  readonly score: number;
  readonly label: 'Weak' | 'Fair' | 'Good' | 'Strong';
  readonly color: string;
}

/**
 * Password validation requirement
 */
interface PasswordRequirement {
  readonly id: string;
  readonly label: string;
  readonly test: (password: string) => boolean;
}

/**
 * Animated background blob component
 */
const BackgroundBlob: FC<{
  position: string;
  gradient: string;
  delay?: number;
  mounted: boolean;
}> = ({ position, gradient, delay = 0, mounted }) => (
  <div
    className={`absolute ${position} w-96 h-96 bg-gradient-to-br ${gradient} rounded-full blur-3xl opacity-30 transition-all duration-[3000ms] ${
      mounted ? 'scale-100' : 'scale-0'
    }`}
    style={{ transitionDelay: `${delay}ms` }}
  />
);

/**
 * Password requirement item component
 */
const RequirementItem: FC<{
  requirement: PasswordRequirement;
  password: string;
}> = ({ requirement, password }) => {
  const isMet = requirement.test(password);

  return (
    <div
      className={`flex items-center gap-2 text-xs transition-all duration-300 ${
        isMet ? 'text-green-600' : 'text-gray-500'
      }`}
    >
      <Check
        className={`w-4 h-4 transition-all ${
          isMet ? 'opacity-100 scale-100' : 'opacity-30 scale-75'
        }`}
      />
      <span>{requirement.label}</span>
    </div>
  );
};

/**
 * Password strength indicator component
 */
const PasswordStrengthIndicator: FC<{
  strength: PasswordStrength;
  requirements: readonly PasswordRequirement[];
  password: string;
  mounted: boolean;
}> = ({ strength, requirements, password, mounted }) => (
  <div
    className={`mt-4 transition-all duration-500 ${
      mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
    }`}
  >
    <div className="flex items-center justify-between mb-2">
      <span className="text-xs font-semibold text-gray-600">
        Password Strength
      </span>
      <span
        className={`text-xs font-bold ${
          strength.label === 'Weak'
            ? 'text-red-500'
            : strength.label === 'Fair'
            ? 'text-yellow-500'
            : strength.label === 'Good'
            ? 'text-blue-500'
            : 'text-green-500'
        }`}
      >
        {strength.label}
      </span>
    </div>
    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
      <div
        className={`h-full bg-gradient-to-r ${strength.color} transition-all duration-300 rounded-full`}
        style={{ width: `${strength.score}%` }}
      />
    </div>

    <div className="mt-4 space-y-2">
      {requirements.map((req) => (
        <RequirementItem key={req.id} requirement={req} password={password} />
      ))}
    </div>
  </div>
);

/**
 * Password input field component
 */
const PasswordInput: FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  showPassword: boolean;
  onToggleVisibility: () => void;
  placeholder: string;
  showCheckmark?: boolean;
}> = ({
  label,
  value,
  onChange,
  showPassword,
  onToggleVisibility,
  placeholder,
  showCheckmark = false,
}) => (
  <div className="relative">
    <label className="block text-sm font-semibold text-gray-700 mb-3 ml-1">
      {label}
    </label>
    <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 transition-all duration-300 hover:border-blue-300 focus-within:border-blue-500 focus-within:shadow-xl focus-within:shadow-blue-500/20">
      <div className="flex items-center px-5 py-4">
        <Lock className="w-5 h-5 mr-3 text-gray-400" />
        <input
          type={showPassword ? 'text' : 'password'}
          required
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-transparent border-0 focus:outline-none text-gray-900 placeholder-gray-400 text-base font-medium"
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={onToggleVisibility}
          className="ml-3 text-gray-400 hover:text-gray-600 transition-colors"
        >
          {showPassword ? (
            <EyeOff className="w-5 h-5" />
          ) : (
            <Eye className="w-5 h-5" />
          )}
        </button>
        {showCheckmark && (
          <Check className="w-5 h-5 text-green-500 ml-2 animate-scaleIn" />
        )}
      </div>
    </div>
  </div>
);

/**
 * Success message component
 */
const SuccessMessage: FC<{ success: boolean; mounted: boolean }> = ({
  success,
  mounted,
}) => (
  <div
    className={`transition-all duration-700 delay-100 ${
      mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
    }`}
  >
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-3xl p-10 shadow-2xl text-center">
      <div
        className={`w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg mx-auto mb-8 transition-all duration-700 ${
          success ? 'scale-100 rotate-0' : 'scale-0 rotate-180'
        }`}
      >
        <Check className="w-14 h-14 text-white" />
      </div>

      <h2 className="text-3xl font-bold text-green-800 mb-3">
        Password Reset Successful!
      </h2>
      <p className="text-green-700 text-base mb-2">
        Your password has been successfully updated.
      </p>
      <p className="text-green-600 text-sm">
        Redirecting to login page in a moment...
      </p>

      <div className="mt-8 flex justify-center gap-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 bg-green-500 rounded-full animate-pulse"
            style={{ animationDelay: `${i}s` }}
          />
        ))}
      </div>
    </div>
  </div>
);

/**
 * Custom styles for animations
 */
const ANIMATION_STYLES = `
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

  @keyframes scaleIn {
    0% {
      transform: scale(0);
      opacity: 0;
    }
    50% {
      transform: scale(1.2);
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }

  @keyframes blob {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33% { transform: translate(30px, -50px) scale(1.1); }
    66% { transform: translate(-20px, 20px) scale(0.9); }
  }

  .animate-slideIn {
    animation: slideIn 0.3s ease-out;
  }

  .animate-scaleIn {
    animation: scaleIn 0.4s ease-out;
  }

  .animate-blob {
    animation: blob 7s infinite;
  }

  .animation-delay-4000 {
    animation-delay: 4s;
  }
`;

/**
 * Password requirements configuration
 */
const PASSWORD_REQUIREMENTS: readonly PasswordRequirement[] = [
  {
    id: 'length',
    label: 'At least 8 characters',
    test: (pwd) => pwd.length >= 8,
  },
  {
    id: 'uppercase',
    label: 'One uppercase letter',
    test: (pwd) => /[A-Z]/.test(pwd),
  },
  {
    id: 'lowercase',
    label: 'One lowercase letter',
    test: (pwd) => /[a-z]/.test(pwd),
  },
  {
    id: 'number',
    label: 'One number',
    test: (pwd) => /[0-9]/.test(pwd),
  },
];

/**
 * Validates password against security requirements
 */
const validatePassword = (password: string): string | null => {
  if (password.length < 8) {
    return 'Password must be at least 8 characters';
  }
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter';
  }
  if (!/[a-z]/.test(password)) {
    return 'Password must contain at least one lowercase letter';
  }
  if (!/[0-9]/.test(password)) {
    return 'Password must contain at least one number';
  }
  return null;
};

/**
 * Calculates password strength score and label
 */
const calculatePasswordStrength = (password: string): PasswordStrength => {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) {
    return { score: score * 25, label: 'Weak', color: 'from-red-500 to-red-600' };
  }
  if (score === 3) {
    return { score: 60, label: 'Fair', color: 'from-yellow-500 to-yellow-600' };
  }
  if (score === 4) {
    return { score: 80, label: 'Good', color: 'from-blue-500 to-blue-600' };
  }
  return { score: 100, label: 'Strong', color: 'from-green-500 to-green-600' };
};

/**
 * Reset password page component
 */
const ResetPassword: FC = () => {
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleResetPassword = useCallback(
    async (e: FormEvent): Promise<void> => {
      e.preventDefault();
      setError(null);
      setLoading(true);

      const validationError = validatePassword(password);
      if (validationError) {
        setError(validationError);
        setLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }

      try {
        const { error: updateError } = await supabase.auth.updateUser({
          password,
        });

        if (updateError) {
          setError(updateError.message);
        } else {
          setSuccess(true);
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        }
      } catch {
        setError('An unexpected error occurred. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    [password, confirmPassword, navigate]
  );

  const strength = useMemo(
    () => calculatePasswordStrength(password),
    [password]
  );

  const passwordsMatch = useMemo(
    () => password && confirmPassword && password === confirmPassword,
    [password, confirmPassword]
  );

  return (
    <div className="flex h-screen bg-gradient-to-br from-white via-blue-50 to-purple-50 relative overflow-hidden pt-20">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <BackgroundBlob
          position="-top-40 -right-40"
          gradient="from-blue-200 to-purple-200"
          mounted={mounted}
        />
        <BackgroundBlob
          position="-bottom-40 -left-40"
          gradient="from-green-200 to-blue-200"
          delay={300}
          mounted={mounted}
        />
        <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full min-h-screen px-6 py-12 pb-24 flex flex-col justify-center">
        <div className="max-w-md mx-auto w-full">
          {/* Header Icon */}
          <div
            className={`flex items-center justify-center mb-12 transition-all duration-700 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
            }`}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 rounded-2xl blur-lg opacity-40" />
              <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-3 shadow-2xl">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          {!success ? (
            <div
              className={`transition-all duration-700 delay-100 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              {/* Page Header */}
              <div className="mb-10">
                <div className="inline-block mb-6">
                  <span className="px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-600 text-sm font-semibold rounded-full">
                    Reset Your Password
                  </span>
                </div>
                <h1 className="text-5xl font-bold text-gray-900 mb-3">
                  Create New Password
                </h1>
                <p className="text-gray-600 text-lg">
                  Choose a strong password to keep your account secure
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50/80 backdrop-blur-sm border-l-4 border-red-500 rounded-r-xl px-6 py-4 mb-6 animate-slideIn shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <p className="text-sm text-red-700 font-medium">{error}</p>
                  </div>
                </div>
              )}

              {/* Password Form */}
              <form onSubmit={handleResetPassword} className="space-y-6">
                <div>
                  <PasswordInput
                    label="New Password"
                    value={password}
                    onChange={setPassword}
                    showPassword={showPassword}
                    onToggleVisibility={() => setShowPassword(!showPassword)}
                    placeholder="Enter new password"
                  />

                  {password && (
                    <PasswordStrengthIndicator
                      strength={strength}
                      requirements={PASSWORD_REQUIREMENTS}
                      password={password}
                      mounted={mounted}
                    />
                  )}
                </div>

                <PasswordInput
                  label="Confirm Password"
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  showPassword={showConfirmPassword}
                  onToggleVisibility={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  placeholder="Confirm new password"
                  showCheckmark={!!passwordsMatch}
                />

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading || !passwordsMatch}
                    className={`w-full relative overflow-hidden group rounded-2xl shadow-xl transition-all duration-300 ${
                      loading
                        ? 'scale-95'
                        : 'hover:scale-[1.02] active:scale-95'
                    } disabled:opacity-60 disabled:cursor-not-allowed`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600" />

                    {!loading && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    )}

                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/50 via-purple-400/50 to-pink-400/50 blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="relative px-6 py-4 flex items-center justify-center gap-3">
                      {loading ? (
                        <>
                          <div className="flex gap-1">
                            {[0, 150, 300].map((delay) => (
                              <span
                                key={delay}
                                className="w-2 h-2 bg-white rounded-full animate-bounce"
                                style={{ animationDelay: `${delay}ms` }}
                              />
                            ))}
                          </div>
                          <span className="text-white font-bold text-base">
                            Updating...
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="text-white font-bold text-base">
                            Reset Password
                          </span>
                          <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </div>
                  </button>
                </div>
              </form>

              {/* Password Tips */}
              <div
                className={`mt-10 p-6 bg-gradient-to-br from-blue-50/60 to-purple-50/60 backdrop-blur-sm rounded-2xl border border-blue-200/30 shadow-lg transition-all duration-700 ${
                  mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: '300ms' }}
              >
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm mb-2">
                      Password Tips
                    </h4>
                    <ul className="text-gray-700 text-sm space-y-1">
                      <li>• Use a mix of uppercase, lowercase, numbers</li>
                      <li>• Avoid using personal information</li>
                      <li>• Don't reuse passwords from other accounts</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <SuccessMessage success={success} mounted={mounted} />
          )}
        </div>
      </div>

      <style>{ANIMATION_STYLES}</style>
    </div>
  );
};

export default ResetPassword;
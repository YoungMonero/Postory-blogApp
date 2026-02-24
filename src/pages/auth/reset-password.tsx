import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { passwordResetService } from '@/src/services/password-reset.service';
import Link from 'next/link';
import { Eye, EyeOff, Check, X, ArrowLeft, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export default function ResetPasswordPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const storedEmail = sessionStorage.getItem('resetEmail');
    const storedCode = sessionStorage.getItem('resetCode');

    if (!storedEmail || !storedCode) {
      router.push('/auth/forgot-password');
      return;
    }

    setEmail(storedEmail);
    setResetCode(storedCode);
  }, []);


  const hasMinLength = password.length >= 6;
  const hasMatch = password && confirmPassword && password === confirmPassword;

  const validatePassword = () => {
    if (password.length < 6) {
      return 'Password must be at least 6 characters';
    }
    if (password !== confirmPassword) {
      return 'Passwords do not match';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validatePassword();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const data = await passwordResetService.resetPassword(email, resetCode, password);
      if (data && data.accessToken) {
        login(data.accessToken); 
        sessionStorage.removeItem('resetEmail');
        sessionStorage.removeItem('resetCode');
        router.push('/dashboard');
    } else {
      setSuccess(true); 
   }
    } catch (err: any) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-green-500 to-green-400"></div>
          <div className="p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-500" strokeWidth={2} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Password reset successful!</h2>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Your password has been changed. You can now sign in with your new password.
            </p>
            <Link
              href="/login"
              className="block w-full bg-gradient-to-r from-indigo-600 to-indigo-500 text-white py-4 rounded-xl font-semibold hover:from-indigo-700 hover:to-indigo-600 transition-all duration-200 shadow-lg shadow-indigo-200"
            >
              Sign in to your account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-md w-full">
        {/* Back button */}
        <button
          onClick={() => router.push('/auth/verify-reset-code')}
          className="flex items-center text-gray-500 hover:text-gray-700 mb-4 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to verification
        </button>

        {/* Main card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-indigo-600 to-indigo-400"></div>
          
          <div className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-indigo-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Create new password</h1>
              <p className="text-gray-500 leading-relaxed">
                Enter your new password below. Make sure it's strong and secure.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* New password field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  New password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full px-4 py-3.5 bg-gray-50 border-2 rounded-xl focus:ring-0 outline-none transition-all pr-12 ${
                      password 
                        ? hasMinLength 
                          ? 'border-green-500 bg-green-50/30' 
                          : 'border-red-300 bg-red-50/30'
                        : 'border-gray-200 hover:border-gray-300 focus:border-indigo-600'
                    }`}
                    placeholder="Enter new password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                
                {/* Password requirements */}
                <div className="mt-3 space-y-2">
                  <div className="flex items-center text-sm">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-2 transition-colors ${
                      hasMinLength ? 'bg-green-500' : 'bg-gray-200'
                    }`}>
                      {hasMinLength && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                    </div>
                    <span className={hasMinLength ? 'text-green-600' : 'text-gray-500'}>
                      At least 6 characters
                    </span>
                  </div>
                </div>
              </div>

              {/* Confirm password field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirm password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full px-4 py-3.5 bg-gray-50 border-2 rounded-xl focus:ring-0 outline-none transition-all pr-12 ${
                      confirmPassword 
                        ? hasMatch 
                          ? 'border-green-500 bg-green-50/30' 
                          : 'border-red-300 bg-red-50/30'
                        : 'border-gray-200 hover:border-gray-300 focus:border-indigo-600'
                    }`}
                    placeholder="Confirm new password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                
                {/* Password match indicator */}
                {confirmPassword && (
                  <div className="mt-3">
                    <div className="flex items-center text-sm">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-2 transition-colors ${
                        hasMatch ? 'bg-green-500' : 'bg-red-500'
                      }`}>
                        {hasMatch ? (
                          <Check className="w-3 h-3 text-white" strokeWidth={3} />
                        ) : (
                          <X className="w-3 h-3 text-white" strokeWidth={3} />
                        )}
                      </div>
                      <span className={hasMatch ? 'text-green-600' : 'text-red-500'}>
                        {hasMatch ? 'Passwords match' : 'Passwords do not match'}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Error message */}
              {error && (
                <div className="p-4 bg-red-50 border-2 border-red-100 rounded-xl flex items-start">
                  <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading || !hasMinLength || !hasMatch}
                className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 text-white py-4 rounded-xl font-semibold text-[16px] hover:from-indigo-700 hover:to-indigo-600 transition-all duration-200 shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-indigo-600 disabled:shadow-none flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Resetting password...</span>
                  </>
                ) : (
                  'Reset password'
                )}
              </button>

              {/* Email hint */}
              <p className="text-xs text-gray-400 text-center">
                Resetting password for: <span className="font-medium text-gray-600">{email}</span>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
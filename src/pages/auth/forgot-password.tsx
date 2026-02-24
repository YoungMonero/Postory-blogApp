import { useState } from 'react';
import { useRouter } from 'next/router';
import { passwordResetService } from '@/src/services/password-reset.service';
import Link from 'next/link';
import { Mail, ArrowLeft, AlertCircle, CheckCircle, Send } from 'lucide-react';

// CardWrapper with enhanced styling
const CardWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
    <div className="max-w-[440px] w-full bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="h-2 bg-gradient-to-r from-indigo-600 to-indigo-400"></div>
      <div className="p-8">
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <span className="text-white text-2xl font-bold">W</span>
          </div>
        </div>
        {children}
      </div>
    </div>
  </div>
);

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await passwordResetService.forgotPassword(email);
      sessionStorage.setItem('resetEmail', email);
      const expiry = Date.now() + 15 * 60 * 1000;
      sessionStorage.setItem('resetExpiry', expiry.toString());

      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <CardWrapper>
        <div className="text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Check your email</h2>
          <p className="text-gray-500 mb-6 leading-relaxed">
            We've sent a password reset code to <br />
            <span className="font-semibold text-gray-700">{email}</span>
          </p>
          <button
            onClick={() => router.push('/auth/verify-reset-code')}
            className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 text-white py-4 rounded-xl font-semibold text-[16px] hover:from-indigo-700 hover:to-indigo-600 transition-all duration-200 shadow-lg shadow-indigo-200 mb-4"
          >
            Enter reset code
          </button>
          <p className="text-gray-500">
            Didn't receive it?{' '}
            <button
              onClick={() => setSuccess(false)}
              className="text-indigo-600 font-semibold hover:text-indigo-700 hover:underline underline-offset-2 transition-all"
            >
              Try again
            </button>
          </p>
        </div>
      </CardWrapper>
    );
  }

  return (
    <>
  
    <CardWrapper>
    <button
        onClick={() => router.push('/login')}
        className="flex items-center text-gray-500 hover:text-gray-700 mb-6 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to sign in
      </button>
      

      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Reset your password</h1>
        <p className="text-gray-500 leading-relaxed">
          Enter your email address and we'll send you a 6-digit code to reset your password.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Email address
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              spellCheck="false"
              autoCapitalize="none"
              autoCorrect="off"
              inputMode="email"
              className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 rounded-xl focus:ring-0 outline-none transition-all placeholder:text-gray-400 text-gray-900 hover:border-gray-300 focus:border-indigo-600"
              placeholder="you@example.com"
              required
            />
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border-2 border-red-100 rounded-xl flex items-start">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 text-white py-4 rounded-xl font-semibold text-[16px] hover:from-indigo-700 hover:to-indigo-600 transition-all duration-200 shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-indigo-600 disabled:shadow-none flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Sending...</span>
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>Send reset code</span>
            </>
          )}
        </button>

        <p className="text-center text-gray-500">
          Remember your password?{' '}
          <Link 
            href="/login" 
            className="text-indigo-600 font-semibold hover:text-indigo-700 hover:underline underline-offset-2 transition-all"
          >
            Sign in
          </Link>
        </p>

        <p className="text-xs text-gray-400 text-center">
          We'll send a 6-digit verification code to your email address
        </p>
      </form>
    </CardWrapper>
    </>
  );
}
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { passwordResetService } from '@/src/services/password-reset.service';
import { Clock, Mail, ArrowLeft, AlertCircle, CheckCircle, RefreshCw, Ban } from 'lucide-react';


const ATTEMPT_LIMIT = 3;
const SHORT_COOLDOWN = 15 * 60 * 1000; // 15 minutes
const LONG_COOLDOWN = 24 * 60 * 60 * 1000; // 24 hours

interface RateLimitInfo {
  attempts: number;
  firstAttemptTime: number;
  cooldownUntil: number | null;
  permanentlyLocked: boolean;
}

export default function VerifyResetCodePage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [resetCode, setResetCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isResendLoading, setIsResendLoading] = useState(false); 
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(''); 
  const [timeLeft, setTimeLeft] = useState(900);
  const [expiryTime, setExpiryTime] = useState<number | null>(null);
  const [canResend, setCanResend] = useState(false);
  
  // Rate limit state
  const [rateLimitInfo, setRateLimitInfo] = useState<RateLimitInfo>(() => {
    const stored = sessionStorage.getItem('resetRateLimit');
    if (stored) {
      return JSON.parse(stored);
    }
    return {
      attempts: 0,
      firstAttemptTime: 0,
      cooldownUntil: null,
      permanentlyLocked: false
    };
  });

  // Check if user is in cooldown
  const isInCooldown = () => {
    if (rateLimitInfo.permanentlyLocked) return true;
    if (!rateLimitInfo.cooldownUntil) return false;
    return Date.now() < rateLimitInfo.cooldownUntil;
  };

  // Get cooldown time remaining
  const getCooldownRemaining = () => {
    if (rateLimitInfo.permanentlyLocked) return LONG_COOLDOWN;
    if (!rateLimitInfo.cooldownUntil) return 0;
    return Math.max(0, rateLimitInfo.cooldownUntil - Date.now());
  };

  // Format cooldown time for display
  const formatCooldown = (ms: number) => {
    if (ms >= LONG_COOLDOWN) {
      const hours = Math.floor(ms / (60 * 60 * 1000));
      return `${hours} hour${hours > 1 ? 's' : ''}`;
    }
    const minutes = Math.ceil(ms / (60 * 1000));
    return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  };

  // Track failed attempt
  const trackFailedAttempt = () => {
    const now = Date.now();
    let newRateLimit = { ...rateLimitInfo };

    // Reset attempts if last attempt was more than 24 hours ago
    if (now - rateLimitInfo.firstAttemptTime > 24 * 60 * 60 * 1000) {
      newRateLimit = {
        attempts: 1,
        firstAttemptTime: now,
        cooldownUntil: null,
        permanentlyLocked: false
      };
    } else {
      newRateLimit.attempts += 1;
      
      // Check if we need to apply cooldown
      if (newRateLimit.attempts >= ATTEMPT_LIMIT) {
        if (newRateLimit.attempts >= ATTEMPT_LIMIT * 2) {
          // After 6 attempts, lock for 24 hours
          newRateLimit.permanentlyLocked = true;
          newRateLimit.cooldownUntil = now + LONG_COOLDOWN;
          setError(`Too many failed attempts. Please wait 24 hours before trying again.`);
        } else {
          // After 3 attempts, lock for 15 minutes
          newRateLimit.cooldownUntil = now + SHORT_COOLDOWN;
          setError(`Too many failed attempts. Please wait 15 minutes before trying again.`);
        }
      }
    }

    setRateLimitInfo(newRateLimit);
    sessionStorage.setItem('resetRateLimit', JSON.stringify(newRateLimit));
  };

  // Reset rate limit on successful verification
  const resetRateLimit = () => {
    const newRateLimit = {
      attempts: 0,
      firstAttemptTime: 0,
      cooldownUntil: null,
      permanentlyLocked: false
    };
    setRateLimitInfo(newRateLimit);
    sessionStorage.removeItem('resetRateLimit');
  };

  useEffect(() => {
    const storedEmail = sessionStorage.getItem('resetEmail');
    if (!storedEmail) {
      router.push('/auth/forgot-password');
      return;
    }
    setEmail(storedEmail);

    // Check if we're in cooldown on page load
    if (isInCooldown()) {
      const remaining = getCooldownRemaining();
      setError(`Please wait ${formatCooldown(remaining)} before requesting another code.`);
    }

    const storedExpiry = sessionStorage.getItem('resetExpiry');
    
    if (storedExpiry) {
      const expiry = parseInt(storedExpiry, 10);
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((expiry - now) / 1000));
      
      setTimeLeft(remaining);
      setExpiryTime(expiry);
      
      if (remaining <= 0) {
        router.push('/auth/forgot-password?expired=true');
        return;
      }
    } else {
      const newExpiry = Date.now() + 5 * 60 * 1000;
      sessionStorage.setItem('resetExpiry', newExpiry.toString());
      setExpiryTime(newExpiry);
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          sessionStorage.removeItem('resetExpiry');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  // Check if resend is allowed based on cooldown
  useEffect(() => {
    if (isInCooldown()) {
      setCanResend(false);
    } else {
      setCanResend(true);
    }
  }, [rateLimitInfo]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newCode = [...resetCode];
    newCode[index] = value.toUpperCase();
    setResetCode(newCode);
    setError('');

    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !resetCode[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newCode = [...resetCode];
    pastedData.split('').forEach((char, index) => {
      if (index < 6) newCode[index] = char;
    });
    setResetCode(newCode);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if user is in cooldown
    if (isInCooldown()) {
      const remaining = getCooldownRemaining();
      setError(`Please wait ${formatCooldown(remaining)} before trying again.`);
      return;
    }
    
    const part1 = resetCode.slice(0, 3).join('');
    const part2 = resetCode.slice(3, 6).join('');
    const fullCode = `${part1}-${part2}`;
    
    if (part1.length !== 3 || part2.length !== 3) { 
      setError('Please enter all 6 digits');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await passwordResetService.verifyResetCode(email, fullCode);
      sessionStorage.setItem('resetCode', fullCode);
      sessionStorage.removeItem('resetExpiry');
      resetRateLimit(); // Reset rate limit on success
      router.push('/auth/reset-password');
    } catch (err: any) {
      trackFailedAttempt(); // Track failed attempt
      setError(err.message || 'Invalid or expired code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    // Check if user is in cooldown
    if (isInCooldown()) {
      const remaining = getCooldownRemaining();
      setError(`Please wait ${formatCooldown(remaining)} before requesting a new code.`);
      return;
    }

    setIsResendLoading(true);
    setError('');
    setSuccess('');

    try {
      await passwordResetService.resendResetCode(email);
      
      const newExpiry = Date.now() + 5 * 60 * 1000;
      sessionStorage.setItem('resetExpiry', newExpiry.toString());
      setExpiryTime(newExpiry);
      setTimeLeft(300);
      setResetCode(['', '', '', '', '', '']);
      setSuccess('New code sent successfully!');
      
      // Don't reset rate limit on resend - it counts as an attempt
      trackFailedAttempt();
    } catch (err: any) {
      trackFailedAttempt(); // Track failed attempt
      setError(err.message || 'Failed to resend code. Please try again.');
    } finally {
      setIsResendLoading(false);
    }
  };


  const timerProgress = (timeLeft / 300) * 100;
  const isLowTime = timeLeft < 60;


  if (isInCooldown()) {
    const remaining = getCooldownRemaining();
    const isPermanent = rateLimitInfo.permanentlyLocked;
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className={`h-2 bg-gradient-to-r ${isPermanent ? 'from-red-600 to-red-400' : 'from-orange-500 to-orange-400'}`}></div>
          <div className="p-8 text-center">
            <div className={`w-20 h-20 ${isPermanent ? 'bg-red-100' : 'bg-orange-100'} rounded-full flex items-center justify-center mx-auto mb-6`}>
              <Ban className={`w-10 h-10 ${isPermanent ? 'text-red-500' : 'text-orange-500'}`} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              {isPermanent ? 'Account Temporarily Locked' : 'Too Many Attempts'}
            </h1>
            <p className="text-gray-500 mb-4 leading-relaxed">
              {isPermanent 
                ? 'For security reasons, you\'ve exceeded the maximum number of attempts.'
                : 'You\'ve made too many failed attempts to verify your code.'}
            </p>
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-600">
                Please wait <span className="font-bold text-indigo-600">{formatCooldown(remaining)}</span> before trying again.
              </p>
            </div>
            <button
              onClick={() => router.push('/auth/forgot-password')}
              className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 text-white py-4 rounded-xl font-semibold hover:from-indigo-700 hover:to-indigo-600 transition-all duration-200 shadow-lg shadow-indigo-200"
            >
              Start Over
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (timeLeft === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-red-500 to-red-400"></div>
          <div className="p-8 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">Code Expired</h1>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Your reset code has expired. Please request a new one to continue.
            </p>
            <button
              onClick={() => router.push('/auth/forgot-password')}
              className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 text-white py-4 rounded-xl font-semibold hover:from-indigo-700 hover:to-indigo-600 transition-all duration-200 shadow-lg shadow-indigo-200"
            >
              Request new code
            </button>
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
          onClick={() => router.push('/auth/forgot-password')}
          className="flex items-center text-gray-500 hover:text-gray-700 mb-4 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back
        </button>

        {/* Main card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-indigo-600 to-indigo-400"></div>
          
          <div className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-indigo-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Enter verification code</h1>
              <p className="text-gray-500">
                We've sent a 6-digit code to <span className="font-semibold text-gray-700">{email}</span>
              </p>
            </div>

            {/* Attempt counter warning */}
            {rateLimitInfo.attempts > 0 && (
              <div className="mb-4 p-3 bg-yellow-50 border-2 border-yellow-100 rounded-xl flex items-center">
                <AlertCircle className="w-4 h-4 text-yellow-500 mr-2 flex-shrink-0" />
                <p className="text-xs text-yellow-700">
                  Attempts: {rateLimitInfo.attempts}/{ATTEMPT_LIMIT}. After {ATTEMPT_LIMIT} failed attempts, you'll need to wait 15 minutes.
                </p>
              </div>
            )}

            {/* Timer with progress bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>Code expires in</span>
                </div>
                <span className={`font-mono font-bold text-lg ${
                  isLowTime ? 'text-red-500' : 'text-indigo-600'
                }`}>
                  {formatTime(timeLeft)}
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 rounded-full ${
                    isLowTime ? 'bg-red-500' : 'bg-indigo-600'
                  }`}
                  style={{ width: `${timerProgress}%` }}
                />
              </div>
              {canResend && timeLeft > 0 && (
                <p className="text-xs text-green-600 mt-2 flex items-center">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  You can request a new code
                </p>
              )}
            </div>

            <form onSubmit={handleSubmit}>
              {/* Code input boxes */}
              <div className="flex justify-center gap-3 mb-8">
                {resetCode.map((digit, index) => (
                  <input
                    key={index}
                    id={`code-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    className="w-14 h-14 text-center text-2xl font-bold bg-gray-50 border-2 rounded-xl focus:ring-0 outline-none transition-all hover:border-gray-300 focus:border-indigo-600"
                    disabled={isLoading || isResendLoading}
                    autoFocus={index === 0}
                  />
                ))}
              </div>

              {/* Messages */}
              {error && (
                <div className="mb-4 p-4 bg-red-50 border-2 border-red-100 rounded-xl flex items-start">
                  <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {success && (
                <div className="mb-4 p-4 bg-green-50 border-2 border-green-100 rounded-xl flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-green-600">{success}</p>
                </div>
              )}

              {/* Verify button */}
              <button
                type="submit"
                disabled={isLoading || timeLeft === 0 || isResendLoading}
                className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 text-white py-4 rounded-xl font-semibold text-[16px] hover:from-indigo-700 hover:to-indigo-600 transition-all duration-200 shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-indigo-600 disabled:shadow-none mb-3"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verifying...
                  </span>
                ) : (
                  'Verify code'
                )}
              </button>

              {/* Resend button */}
              <button
                type="button"
                onClick={handleResend}
                disabled={isResendLoading || !canResend}
                className="w-full py-3 text-sm font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:cursor-not-allowed"
              >
                {isResendLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span className="text-gray-500">Sending...</span>
                  </>
                ) : (
                  <span className={!canResend ? 'text-gray-400' : 'text-indigo-600 hover:text-indigo-700'}>
                    Didn't receive the code? <span className="font-semibold underline underline-offset-2">Resend</span>
                  </span>
                )}
              </button>

              {/* Helper text */}
              <p className="text-xs text-gray-400 text-center mt-6">
                For security reasons, this code will expire in 5 minutes
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
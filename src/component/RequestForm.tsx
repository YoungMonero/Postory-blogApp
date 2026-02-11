import React, { useState } from 'react';
import { Mail, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

const ForgotPasswordRequest = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // ✅ MOVED INSIDE

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null); // ✅ CLEAR ERROR ON SUBMIT
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      if (res.ok) {
        setIsSent(true);
      } else {
        // ✅ BETTER ERROR HANDLING
        const data = await res.json().catch(() => ({}));
        setErrorMessage(data.message || 'Could not send reset email. Check if the email is correct.');
      }
    } catch (error) {
      console.error('Request failed:', error);
      setErrorMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIXED: handleInputChange function
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setErrorMessage(null); // Clear error when user types
  };

  if (isSent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-md p-10 rounded-2xl shadow-sm border border-gray-100 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-50 rounded-full mb-6">
            <Mail className="text-green-600" size={30} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h2>
          <p className="text-gray-500 mb-8">
            We've sent a 6-digit verification code to{' '}
            <span className="font-semibold text-gray-800">{email}</span>
          </p>
          <Link 
            href="/auth/reset-password" 
            className="block w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-md"
          >
            Enter Reset Code
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md p-10 rounded-2xl shadow-sm border border-gray-100">
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Forgot password?</h2>
          <p className="text-gray-500 mt-2">No worries, we'll send you reset instructions.</p>
        </div>

        <form onSubmit={handleRequest} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
            <input
              type="email"
              placeholder="Ex: tester@gmail.com"
              required
              value={email} // ✅ ADDED value binding
              onChange={handleInputChange} // ✅ FIXED: use handleInputChange
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-hidden transition-all text-gray-900"
            />
          </div>

          {/* ✅ ADDED: Error message display */}
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{errorMessage}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Reset password"}
          </button>

          <Link href="/login" className="flex items-center justify-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors">
            <ArrowLeft size={16} /> Back to login
          </Link>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordRequest; 
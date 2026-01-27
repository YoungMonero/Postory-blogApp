import React from 'react';
import ForgotPasswordForm from '@/components/ForgotPasswordForm';
import type { NextPage } from 'next';

const ForgotPasswordPage: NextPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Forgot your password?
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>
        
        <ForgotPasswordForm />
        
        <div className="text-center">
          <a 
            href="/auth/signin" 
            className="text-blue-600 hover:text-blue-500 text-sm font-medium"
          >
            Back to sign in
          </a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

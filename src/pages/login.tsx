import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import Link from 'next/link';

import { login as loginApi } from '../services/auth';
import { LoginDto } from '../types/auth';
import { Button } from '@/src/component/ui/button';

export default function Login() {
  const router = useRouter();

  const [form, setForm] = useState<LoginDto>({
    email: '',
    password: '',
  });

  const mutation = useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      localStorage.setItem('accessToken', data.accessToken);
      router.push('/dashboard');
    },
    onError: (err: any) => {
      alert(err.message || 'Login failed');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 font-sans">
      <div className="w-full max-w-[440px] bg-white rounded-2xl shadow-sm border border-gray-100 p-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-200 mb-6">
            B
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Welcome back</h1>
          <p className="text-gray-500 text-sm">Sign in to your BlogForge account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {mutation.isError && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center">
              {(mutation.error as any)?.message || 'Login failed'}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-900">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="john@example.com"
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-900 placeholder:text-gray-400"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-900">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-900 placeholder:text-gray-400"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full py-2.5"
            variant="black"
            isLoading={mutation.isPending}
          >
            {mutation.isPending ? 'Signing in...' : 'Sign in'}
          </Button>

          <div className="flex flex-col items-center gap-4 mt-6">
            <a href="#" className="text-sm font-medium text-primary hover:text-indigo-700 transition-colors">
              Forgot password?
            </a>
            <div className="text-sm text-gray-500">
              Don't have an account?{' '}
              <Link href="/register" className="font-medium text-primary hover:text-indigo-700 transition-colors">
                Sign up
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

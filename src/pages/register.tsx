
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { registerUser } from '../services/auth';
import { useAuth } from '../hooks/useAuth';
import { Button } from '@/src/component/ui/button';

export default function Register() {
  const [form, setForm] = useState({
    email: '',
    password: '',
    username: '',
  });

  const router = useRouter();
  const auth = useAuth();

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      auth.login(data.accessToken, data.username);
      router.push('/');
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
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Create an account</h1>
          <p className="text-gray-500 text-sm">Start your blog journey today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {mutation.isError && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center">
              {(mutation.error as any)?.message || 'Failed to create account.'}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-900">Username</label>
            <input
              type="text"
              value={form.userName}
              onChange={(e) => setForm({ ...form, userName: e.target.value })}
              placeholder="JohnDoe"
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-900 placeholder:text-gray-400"
              required
            />
          </div>

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
            Sign up
          </Button>

          <div className="flex flex-col items-center gap-4 mt-6">
            <div className="text-sm text-gray-500">
              Already have an account?{' '}
              <Link href="/login" className="font-medium text-primary hover:text-indigo-700 transition-colors">
                Sign in
              </Link>
            </div>
          </div>
        </form>
      </div>

    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Register</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <input
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
          placeholder="Username"
          value={form.username}
          onChange={(e) =>
            setForm({ ...form, username: e.target.value })
          }
        />

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 disabled:opacity-50"
        >
          {mutation.isPending ? 'Registering...' : 'Register'}
        </button>
      </form>

    </div>
  );
}

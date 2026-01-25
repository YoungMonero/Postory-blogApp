import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { createBlog, getMyBlog } from '@/src/services/blogs';
import { getToken } from '@/src/services/auth-storage';
import { Button } from '@/src/component/ui/button';

export default function CreateBlogPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const t = getToken();
    if (!t) {
        router.push('/login');
    } else {
        setToken(t);
    }
  }, [router]);

  // Check if blog exists (Backend logic allows only ONE)
  const { data: existingBlog, isLoading } = useQuery({
    queryKey: ['my-blog'],
    queryFn: () => getMyBlog(token as string),
    enabled: !!token,
  });

  useEffect(() => {
    if (existingBlog) {
      router.push('/dashboard');
    }
  }, [existingBlog, router]);

  // ✅ Based on your DTO, we only need these two!
  const [form, setForm] = useState({
    title: '',
    description: '',
  });

  const mutation = useMutation({
    mutationFn: (data: { title: string; description?: string }) => createBlog(data, token as string),
    onSuccess: (newBlog) => {
      queryClient.setQueryData(['my-blog'], newBlog);
      router.push('/dashboard');
    },
    onError: (err: any) => {
        // Error handling is in the UI
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  if (!token || isLoading || existingBlog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 font-sans relative overflow-hidden py-10 px-4">
      {/* Background Blobs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
      <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />

      <div className="w-full max-w-[500px] bg-white rounded-2xl shadow-sm border border-gray-100 p-10 relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-200 mb-6">
            W
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Create your blog</h1>
          <p className="text-gray-500 text-sm">Set up your profile to start writing.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {mutation.isError && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center font-medium">
              {(mutation.error as any)?.response?.data?.message || 'Failed to create blog'}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-900">Blog Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. My Tech Insights"
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none transition-all"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-900">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="What will you write about?"
              rows={4}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none transition-all resize-none"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full py-2.5 bg-gray-900 hover:bg-black text-white font-semibold rounded-lg shadow-md transition-all"
            isLoading={mutation.isPending}
          >
            Launch Blog
          </Button>
        </form>
      </div>
    </div>
  );
}
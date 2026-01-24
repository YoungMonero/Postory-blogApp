import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { createBlog, getMyBlog } from '@/src/services/blogs';
import { getToken } from '@/src/services/auth-storage';
import { CreateBlogDto } from '@/src/types/blogs';

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


  const { data: existingBlog, isLoading } = useQuery({
    queryKey: ['my-blog'],
    queryFn: () => getMyBlog(token as string),
    enabled: !!token,
  });

  useEffect(() => {
    if (existingBlog) {
   exists
      router.push('/dashboard');
    }
  }, [existingBlog, router]);

  const [form, setForm] = useState<CreateBlogDto>({
    title: '',
    description: '',
    content: '',
  });

  const mutation = useMutation({
    mutationFn: (data: CreateBlogDto) => createBlog(data, token as string),
    onSuccess: (newBlog) => {

      queryClient.setQueryData(['my-blog'], newBlog);
      router.push('/dashboard');
    },
    onError: (err: any) => {
      alert(err.message || 'Failed to create blog');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  if (!token || isLoading || existingBlog) return <p>Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 border rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Create Blog</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />

        <textarea
          name="description"
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        />

        <textarea
          name="content"
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
          placeholder="Content"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          required
        />

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {mutation.isPending ? 'Creating Blog...' : 'Create Blog'}
        </button>
      </form>

      {mutation.isError && (
        <p className="mt-4 text-red-600 text-sm">
          {(mutation.error as any)?.message || 'Failed to create blog. Please try again.'}
        </p>
      )}
    </div>
  );
}

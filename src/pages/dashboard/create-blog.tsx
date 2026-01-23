

import { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { CreateBlogDto } from '@/src/types/blogs';
import { useRouter } from 'next/router';
import { createBlog, getMyBlog } from '@/src/services/blogs';
import { getToken } from '@/src/services/auth-storage';

export default function CreateBlogPage() {
  const router = useRouter();
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
      router.push('/dashboard');
    }
  }, [existingBlog, router]);

  const [form, setForm] = useState<CreateBlogDto>({
    title: '',
    description: '',
  });

  const mutation = useMutation({
    mutationFn: (data: CreateBlogDto) =>
      createBlog(data, token as string),
    onSuccess: () => {
      alert('Blog created successfully');
      router.push('/dashboard');
    },
    onError: (err: any) => {
      alert(err.message || 'Failed to create blog');
    },
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutation.mutate(form);
  }

  if (!token || isLoading || existingBlog) return <p>Loading...</p>;

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 border rounded">
      <h1 className="text-2xl font-bold mb-4">Create Blog</h1>

      {/* <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          placeholder="Blog title"
          value={form.title}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Short description"
          value={form.description}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          disabled={mutation.isPending}
          className="bg-black text-white px-4 py-2 rounded"
        >
          {mutation.isPending ? 'Creating...' : 'Create Blog'}
        </button>
      </form> */}


      <form onSubmit={handleSubmit} className="space-y-4">
  <input
    name="title"
    placeholder="Blog title"
    value={form.title}
    onChange={handleChange}
    required
    className="w-full border px-3 py-2 rounded"
  />

  <textarea
    name="description"
    placeholder="Short description"
    value={form.description}
    onChange={handleChange}
    required
    className="w-full border px-3 py-2 rounded"
  />

  <textarea
    name="content"
    placeholder="Full blog content"
    value={form.content || ''}
    onChange={handleChange}
    className="w-full border px-3 py-2 rounded"
  />

  <input
    name="excerpt"
    placeholder="Excerpt (preview text)"
    value={form.excerpt || ''}
    onChange={handleChange}
    className="w-full border px-3 py-2 rounded"
  />

  <input
    name="coverImage"
    placeholder="Cover image URL"
    value={form.coverImage || ''}
    onChange={handleChange}
    className="w-full border px-3 py-2 rounded"
  />

  <input
    name="tags"
    placeholder="Tags (comma separated)"
    value={form.tags || ''}
    onChange={(e) =>
      setForm({ ...form, tags: e.target.value.split(',').map((t) => t.trim()) })
    }
    className="w-full border px-3 py-2 rounded"
  />

  <input
    name="metaTitle"
    placeholder="SEO Title"
    value={form.metaTitle || ''}
    onChange={handleChange}
    className="w-full border px-3 py-2 rounded"
  />

  <input
    name="metaDescription"
    placeholder="SEO Description"
    value={form.metaDescription || ''}
    onChange={handleChange}
    className="w-full border px-3 py-2 rounded"
  />

  <button
    type="submit"
    disabled={mutation.isPending}
    className="bg-black text-white px-4 py-2 rounded"
  >
    {mutation.isPending ? 'Creating...' : 'Create Blog'}
  </button>
</form>

    </div>
  );
}

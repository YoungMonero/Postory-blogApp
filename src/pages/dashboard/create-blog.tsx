// import { useState, useEffect } from 'react';
// import { useMutation } from '@tanstack/react-query';
// import { createBlog } from '@/services/blogs';
// import { CreateBlogDto } from '@/types/blog';
// import { useRouter } from 'next/router';
// import { getToken } from '@/services/auth-storage';

// export default function CreateBlogPage() {
//   const router = useRouter();
//   const token = getToken();

//   useEffect(() => {
//     if (!token) {
//       router.push('/login');
//     }
//   }, [token, router]);

//   const [form, setForm] = useState<CreateBlogDto>({
//     title: '',
//     slug: '',
//     description: '',
//   });

//   const mutation = useMutation({
//     mutationFn: (data: CreateBlogDto) =>
//       createBlog(data, token as string),
//     onSuccess: () => {
//       alert('Blog created successfully');
//       router.push('/dashboard');
//     },
//     onError: (err: any) => {
//       alert(err.message || 'Failed to create blog');
//     },
//   });

//   function handleChange(
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   }

//   function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     mutation.mutate(form);
//   }

//   return (
//     <div className="max-w-xl mx-auto mt-10 p-6 border rounded">
//       <h1 className="text-2xl font-bold mb-4">Create Blog</h1>

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <input
//           name="title"
//           placeholder="Blog title"
//           className="w-full border px-3 py-2 rounded"
//           value={form.title}
//           onChange={handleChange}
//           required
//         />

//         <input
//           name="slug"
//           placeholder="blog-slug"
//           className="w-full border px-3 py-2 rounded"
//           value={form.slug}
//           onChange={handleChange}
//           required
//         />

//         <textarea
//           name="description"
//           placeholder="Short description"
//           className="w-full border px-3 py-2 rounded"
//           value={form.description}
//           onChange={handleChange}
//           required
//         />

//         <button
//           type="submit"
//           disabled={mutation.isPending}
//           className="bg-black text-white px-4 py-2 rounded"
//         >
//           {mutation.isPending ? 'Creating...' : 'Create Blog'}
//         </button>
//       </form>
//     </div>
//   );
// }

import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { CreateBlogDto } from '@/src/types/blogs';
import { useRouter } from 'next/router';
import { createBlog } from '@/src/services/blogs';
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

  const [form, setForm] = useState<CreateBlogDto>({
    title: '',
    slug: '',
    description: '',
  });

  const mutation = useMutation({
    mutationFn: (data: CreateBlogDto) => createBlog(data, token as string),
    onSuccess: (blog) => {
      alert('Blog created successfully');
      router.push(`/blogs/${blog.slug}`);
    },
    onError: (err: any) => {
      alert(err.message || 'Failed to create blog');
    },
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutation.mutate(form);
  }

  if (!token) return <p>Loading...</p>;

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 border rounded">
      <h1 className="text-2xl font-bold mb-4">Create Blog</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          placeholder="Blog title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <input
          name="slug"
          placeholder="blog-slug"
          value={form.slug}
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
      </form>
    </div>
  );
}

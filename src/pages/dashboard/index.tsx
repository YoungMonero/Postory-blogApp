
// import Link from 'next/link';
// import { useQuery } from '@tanstack/react-query';
// import { getToken } from '@/src/services/auth-storage';
// import { getMyBlog } from '@/src/services/blogs';
// import { useRouter } from 'next/router';
// import { useEffect, useState } from 'react';
// import { Blog } from '@/src/types/blogs';

// export default function DashboardPage() {
//   const router = useRouter();
//   const [token, setToken] = useState<string | null>(null);

//   useEffect(() => {
//     const t = getToken();
//     if (!t) {
//       router.push('/login');
//     } else {
//       setToken(t);
//     }
//   }, [router]);

//   const { data: blog, isLoading } = useQuery({
//     queryKey: ['my-blog'],
//     queryFn: async () => {
//       const result = await getMyBlog(token as string);
//       console.log('Fetched blog:', result);
//       return result;
//     },
//     enabled: !!token,
//   });

//   if (!token) return <p>Loading...</p>;
//   if (isLoading) return <p>Loading...</p>;

//   return (
//     <div className="max-w-4xl mx-auto mt-10">
//       <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

//       {!blog ? (
//         <Link
//           href="/dashboard/create-blog"
//           className="inline-block bg-blue-600 text-white px-4 py-2 rounded"
//         >
//           Create Blog
//         </Link>
//       ) : (
//         <div className="border p-6 rounded-lg shadow-sm space-y-4">
//           <h2 className="text-2xl font-semibold">{blog.title}</h2>
//           <p className="text-gray-700">{blog.excerpt || blog.description}</p>

//           {blog.coverImage && (
//             <img
//               src={blog.coverImage}
//               alt={blog.title}
//               className="w-full h-64 object-cover rounded-md"
//             />
//           )}

//           <div className="flex flex-wrap gap-2">
//             {blog.tags?.map((tag: string) => (
//               <span
//                 key={tag}
//                 className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm"
//               >
//                 #{tag}
//               </span>
//             ))}
//           </div>

//           <p>Status: <strong>{blog.status}</strong></p>
//           {blog.publishedAt && (
//             <p>Published: {new Date(blog.publishedAt).toLocaleDateString()}{" "}
//               {new Date(blog.publishedAt).toLocaleTimeString()}
//             </p>
//           )}

//           {/*  Show createdAt and updatedAt */}
//           {blog.createdAt && (
//             <p className="text-sm text-gray-500">
//               Created: {new Date(blog.createdAt).toLocaleDateString()}{" "}
//               {new Date(blog.createdAt).toLocaleTimeString()}
//             </p>
//           )}
//           {blog.updatedAt && (
//             <p className="text-sm text-gray-500">
//               Last Updated: {new Date(blog.updatedAt).toLocaleDateString()}{" "}
//               {new Date(blog.updatedAt).toLocaleTimeString()}
//             </p>
//           )}

//           <p>SEO Title: {blog.metaTitle}</p>
//           <p>SEO Description: {blog.metaDescription}</p>

//           {/*  Make Public URL clickable */}
//           <p className="text-sm text-gray-500">
//             Public URL:{" "}
//             <Link href={`/${blog.slug}`} className="text-blue-600 underline">
//               /{blog.slug}
//             </Link>
//           </p>
// {/* 
//           <p className="text-sm text-gray-500">
//             Views: {blog.views} | Likes: {blog.likes}
//           </p> */}
//         </div>
//       )}
//     </div>
//   );
// }


// import Link from 'next/link';
// import { useQuery } from '@tanstack/react-query';
// import { getToken } from '@/src/services/auth-storage';
// import { getMyBlog } from '@/src/services/blogs';
// import { useRouter } from 'next/router';
// import { useEffect, useState } from 'react';
// import { Blog } from '@/src/types/blogs';

// export default function DashboardPage() {
//   const router = useRouter();
//   const [token, setToken] = useState<string | null>(null);

//   useEffect(() => {
//     const t = getToken();
//     if (!t) {
//       router.push('/login');
//     } else {
//       setToken(t);
//     }
//   }, [router]);

//   const {
//     data: blog,
//     isLoading,
//     isError,
//     error,
//   } = useQuery({
//     queryKey: ['my-blog'],
//     queryFn: async () => {
//       const result = await getMyBlog(token as string);
//       console.log('Fetched blog:', result);
//       return result;
//     },
//     enabled: !!token,
//   });

//   if (!token) return <p>Loading...</p>;
//   if (isLoading) return <p>Loading...</p>;

//   //  Handle errors gracefully
//   if (isError) {
//     return (
//       <div className="max-w-4xl mx-auto mt-10">
//         <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
//         <p className="text-red-600">
//           Error: {(error as any)?.message || 'Something went wrong while fetching your blog'}
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-4xl mx-auto mt-10">
//       <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

//       {!blog ? (
//         <Link
//           href="/dashboard/create-blog"
//           className="inline-block bg-blue-600 text-white px-4 py-2 rounded"
//         >
//           Create Blog
//         </Link>
//       ) : (
//         <div className="border p-6 rounded-lg shadow-sm space-y-4">
//           <h2 className="text-2xl font-semibold">{blog.title}</h2>
//           <p className="text-gray-700">{blog.excerpt || blog.description}</p>

//           {blog.coverImage && (
//             <img
//               src={blog.coverImage}
//               alt={blog.title}
//               className="w-full h-64 object-cover rounded-md"
//             />
//           )}

//           <div className="flex flex-wrap gap-2">
//             {blog.tags?.map((tag: string) => (
//               <span
//                 key={tag}
//                 className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm"
//               >
//                 #{tag}
//               </span>
//             ))}
//           </div>

//           <p>Status: <strong>{blog.status}</strong></p>
//           {blog.publishedAt && (
//             <p>
//               Published: {new Date(blog.publishedAt).toLocaleDateString()}{" "}
//               {new Date(blog.publishedAt).toLocaleTimeString()}
//             </p>
//           )}

//           {blog.createdAt && (
//             <p className="text-sm text-gray-500">
//               Created: {new Date(blog.createdAt).toLocaleDateString()}{" "}
//               {new Date(blog.createdAt).toLocaleTimeString()}
//             </p>
//           )}
//           {blog.updatedAt && (
//             <p className="text-sm text-gray-500">
//               Last Updated: {new Date(blog.updatedAt).toLocaleDateString()}{" "}
//               {new Date(blog.updatedAt).toLocaleTimeString()}
//             </p>
//           )}

//           <p>SEO Title: {blog.metaTitle}</p>
//           <p>SEO Description: {blog.metaDescription}</p>

//           <p className="text-sm text-gray-500">
//             Public URL:{" "}
//             <Link href={`/${blog.slug}`} className="text-blue-600 underline">
//               /{blog.slug}
//             </Link>
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }


import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { createBlog } from '@/src/services/blogs';
import { getToken } from '@/src/services/auth-storage';
import { CreateBlogDto } from '@/src/types/blogs';

export default function CreateBlogPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const token = getToken();

  const [form, setForm] = useState<CreateBlogDto>({
    title: '',
    description: '',
    content: '',
  });

  const mutation = useMutation({
    mutationFn: (data: CreateBlogDto) => createBlog(data, token as string),
    onSuccess: (newBlog) => {
      // ✅ Update React Query cache so Dashboard sees the new blog
      queryClient.setQueryData(['my-blog'], newBlog);

      // ✅ Redirect to dashboard
      router.push('/dashboard');
    },
    onError: (err: any) => {
      console.error(err);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 border rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Create Blog</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />

        <textarea
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        />

        <textarea
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

      {/* ✅ Inline error message */}
      {mutation.isError && (
        <p className="mt-4 text-red-600 text-sm">
          {(mutation.error as any)?.message || 'Failed to create blog. Please try again.'}
        </p>
      )}
    </div>
  );
}

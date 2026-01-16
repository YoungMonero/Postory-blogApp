// import Link from 'next/link';
// import { useQuery } from '@tanstack/react-query';
// import { getMyBlog } from '../../services/blogs';
// import { getToken } from '../../services/auth-storage';
// import { useRouter } from 'next/router';
// import { useEffect } from 'react';

// export default function DashboardPage() {
//   const router = useRouter();
//   const token = getToken();

//   useEffect(() => {
//     if (!token) {
//       router.push('/login');
//     }
//   }, [token]);

//   const { data: blog, isLoading } = useQuery({
//     queryKey: ['my-blog'],
//     queryFn: () => getMyBlog(token as string),
//     enabled: !!token,
//   });

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
//         <div className="border p-4 rounded">
//           <h2 className="text-xl font-semibold">{blog.title}</h2>
//           <p className="text-gray-600">{blog.description}</p>

//           <p className="mt-2 text-sm">
//             Public URL: <strong>/{blog.slug}</strong>
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { getToken } from '@/src/services/auth-storage';
import { getMyBlog } from '@/src/services/blogs';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Blog } from '@/src/types/blogs';


export default function DashboardPage() {
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

  // const { data: blog, isLoading } = useQuery<Blog | null>({
  //   queryKey: ['my-blog'],
  //   queryFn: () => getMyBlog(token as string),
  //   enabled: !!token,
  // });
  const { data: blog, isLoading } = useQuery({
  queryKey: ['my-blog'],
  queryFn: async () => {
    const result = await getMyBlog(token as string);
    console.log('Fetched blog:', result); // 👀 check this
    return result;
  },
  enabled: !!token,
});


  if (!token) return <p>Loading...</p>;
  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {!blog ? (
        <Link
          href="/dashboard/create-blog"
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create Blog
        </Link>
      ) : (
        <div className="border p-4 rounded">
          <h2 className="text-xl font-semibold">{blog.title}</h2>
          <p className="text-gray-600">{blog.description}</p>
          <p className="mt-2 text-sm">
            Public URL: <strong>/{blog.slug}</strong>
          </p>
        </div>
      )}
    </div>
  );
}

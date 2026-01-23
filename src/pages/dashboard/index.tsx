
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

  const {
    data: blog,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['my-blog'],
    queryFn: async () => {
      const result = await getMyBlog(token as string);
      console.log('Fetched blog:', result);
      return result;
    },
    enabled: !!token,
  });

  if (!token) return <p>Loading...</p>;
  if (isLoading) return <p>Loading...</p>;

  //  Handle errors gracefully
  if (isError) {
    return (
      <div className="max-w-4xl mx-auto mt-10">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <p className="text-red-600">
          Error: {(error as any)?.message || 'Something went wrong while fetching your blog'}
        </p>
      </div>
    );
  }

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
        <div className="border p-6 rounded-lg shadow-sm space-y-4">
          <h2 className="text-2xl font-semibold">{blog.title}</h2>
          <p className="text-gray-700">{blog.excerpt || blog.description}</p>

          {blog.coverImage && (
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="w-full h-64 object-cover rounded-md"
            />
          )}

          <div className="flex flex-wrap gap-2">
            {blog.tags?.map((tag: string) => (
              <span
                key={tag}
                className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm"
              >
                #{tag}
              </span>
            ))}
          </div>

          <p>Status: <strong>{blog.status}</strong></p>
          {blog.publishedAt && (
            <p>
              Published: {new Date(blog.publishedAt).toLocaleDateString()}{" "}
              {new Date(blog.publishedAt).toLocaleTimeString()}
            </p>
          )}

          {blog.createdAt && (
            <p className="text-sm text-gray-500">
              Created: {new Date(blog.createdAt).toLocaleDateString()}{" "}
              {new Date(blog.createdAt).toLocaleTimeString()}
            </p>
          )}
          {blog.updatedAt && (
            <p className="text-sm text-gray-500">
              Last Updated: {new Date(blog.updatedAt).toLocaleDateString()}{" "}
              {new Date(blog.updatedAt).toLocaleTimeString()}
            </p>
          )}

          <p>SEO Title: {blog.metaTitle}</p>
          <p>SEO Description: {blog.metaDescription}</p>

          <p className="text-sm text-gray-500">
            Public URL:{" "}
            <Link href={`/${blog.slug}`} className="text-blue-600 underline">
              /{blog.slug}
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}

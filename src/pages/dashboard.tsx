// src/pages/dashboard/index.tsx
import { DashboardLayout } from '@/src/component/DashboardLayout';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { getMyBlog } from '@/src/services/blogs';
import { useAuth } from '@/src/hooks/useAuth';

export default function DashboardPage() {
  const { token } = useAuth();
  const { data: blog, isLoading } = useQuery({
    queryKey: ['my-blog'],
    queryFn: () => getMyBlog(token as string),
    enabled: !!token,
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <header>
          <h1 className="text-3xl font-bold text-gray-900">Your Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage your blog and posts</p>
        </header>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : blog ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{blog.title}</h2>
                <p className="text-gray-600 mb-4">{blog.description}</p>
                <p className="text-sm text-gray-500 mb-6">
                  <span className="font-semibold text-gray-700">Slug:</span> {blog.slug}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link
                href={`/${blog.slug}`}
                className="inline-block bg-primary text-white px-6 py-2.5 rounded-full font-medium shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
              >
                View Blog
              </Link>
              <Link
                href="/dashboard/create-post"
                className="inline-block bg-gray-100 text-gray-900 px-6 py-2.5 rounded-full font-medium hover:bg-gray-200 transition-all"
              >
                Create Post
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center">
            <h3 className="text-lg font-medium text-gray-900">No blog found</h3>
            <p className="text-gray-500 mb-6">You haven't set up your blog yet. Create one to start writing!</p>
            <Link
              href="/dashboard/create-blog"
              className="inline-block bg-primary text-white px-6 py-2.5 rounded-full font-medium shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
            >
              Create My Blog
            </Link>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
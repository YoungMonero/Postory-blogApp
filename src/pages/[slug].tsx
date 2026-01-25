import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { getMyBlog } from '@/src/services/blogs';
import { useAuth } from '@/src/hooks/useAuth';
import PostList from '@/src/component/PostList';

export default function BlogChannelView() {
  const router = useRouter();
  const { token } = useAuth();

  const { data: blog, isLoading, error } = useQuery({
    queryKey: ['my-blog'],
    queryFn: async () => {
      if (!token) return null;
      const blogData = await getMyBlog(token);
      return blogData;
    },
    enabled: !!token, 
    retry: false
  });

  if (isLoading || !token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <p className="text-gray-500 font-medium">Channel not found or has been removed.</p>
        <p className="text-gray-400 text-sm">Error: {error?.message || 'No data available'}</p>
        <button onClick={() => router.push('/')} className="text-indigo-600 underline text-sm">
          Return to Home
        </button>
      </div>
    );
  }

  const blogData = blog;

  return (
    <div className="min-h-screen bg-white">
      <div className="h-48 md:h-64 w-full bg-gray-200 relative">
        {blogData?.coverImage ? (
          <img 
            src={blogData.coverImage} 
            alt="Channel Banner" 
            className="w-full h-full object-cover" 
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-indigo-500 to-purple-600" />
        )}
      </div>

      <article className="max-w-4xl mx-auto px-6 pb-20">
        <div className="relative -mt-12 mb-6">
          <div className="h-24 w-24 rounded-2xl bg-white p-1 shadow-xl border border-gray-100">
            <div className="h-full w-full rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 text-3xl font-bold uppercase">
              {blogData?.title?.charAt(0)}
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              {blogData?.title || 'Untitled Channel'}
            </h1>
            <p className="text-gray-500 mt-1">@{blogData?.slug}</p>
          </div>
          
          <button className="bg-black text-white px-6 py-2 rounded-full font-medium hover:bg-gray-800 transition-colors">
            Subscribe
          </button>
        </div>

        <div className="prose prose-slate max-w-none border-t border-gray-100 pt-8">
          <h2 className="text-sm uppercase tracking-widest text-gray-400 font-bold mb-4">About</h2>
          <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
            {blogData?.content || blogData?.description || 'This channel hasn’t added a description yet.'}
          </p>
        </div>

        {blogData?.tags && blogData.tags.length > 0 && (
          <div className="mt-10 flex gap-2 flex-wrap">
            {blogData.tags.map((tag: string) => (
              <span key={tag} className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Posts Section */}
        <div className="mt-16 border-t border-gray-200 pt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Posts</h2>
          <PostList />
        </div>
      </article>
    </div>
  );
}
import { useQuery } from '@tanstack/react-query';
import { getToken } from '@/src/services/auth-storage';
import { getMyBlog } from '@/src/services/blogs';
import { getTenantPublicPosts,  } from '@/src/services/post';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/src/component/DashboardLayout';
import { Post } from '@/src/types/posts';

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

  const categories = [
    { name: 'Fashion', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=100&q=80', color: 'bg-pink-50' },
    { name: 'Food', image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=100&q=80', color: 'bg-green-50' },
    { name: 'Coding', image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=100&q=80', color: 'bg-purple-50' },
    { name: 'Style', image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=100&q=80', color: 'bg-blue-50' }, 
    { name: 'Travel', image: 'https://images.unsplash.com/photo-1541849546-216549ae216d?auto=format&fit=crop&w=100&q=80', color: 'bg-rose-50' },
    { name: 'Culture', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=100&q=80', color: 'bg-orange-50' },
  ];

  const { isLoading: myBlogLoading } = useQuery({
    queryKey: ['my-blog'],
    queryFn: () => getMyBlog(token as string),
    enabled: !!token,
  });

  const { data: postsData, isLoading: postsLoading, error: postsError } = useQuery({
    queryKey: ['public-posts'],
    queryFn: () => getTenantPublicPosts({ limit: 10, page: 1 }),
    enabled: !!token,
  });

  
  

  useEffect(() => {
    if (postsData?.data?.posts) {
      postsData.data.posts.forEach((post: Post, index: number) => {
        console.log(`Post ${index} thumbnail:`, post.thumbnail);
      });
    }
  }, [postsData]);


  const posts: Post[] = postsData?.data?.posts || [];


  const getImageUrl = (thumbnail: string | undefined): string | null => {
    if (!thumbnail || thumbnail.trim() === '') return null;
    

    if (thumbnail.startsWith('http://') || thumbnail.startsWith('https://')) {
      return thumbnail;
    }
    

    if (thumbnail.startsWith('blob:')) {
      return thumbnail;
    }
    

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

    if (thumbnail.startsWith('/')) {
      return `${apiUrl}${thumbnail}`;
    }
    return `${apiUrl}/${thumbnail}`;
  };

  if (!token || myBlogLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-12">
        <section className="mb-16 w-full max-w-8xl">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-5 max-w-8xl">
            {categories.map((cat) => (
              <button 
                key={cat.name} 
                className={`flex items-center gap-3 p-3 rounded-xl transition-all hover:-translate-y-1 hover:shadow-md ${cat.color}`}
              >
                <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border-2 border-white shadow-sm">
                  <img 
                    src={cat.image} 
                    alt={cat.name} 
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <span className="font-semibold text-gray-800 text-sm">{cat.name}</span>
              </button>
            ))}
          </div>
        </section>


        <section className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">All Posts</h2>
            <span className="text-sm text-gray-500">
              {postsLoading ? 'Loading...' : `${posts.length} posts`}
            </span>
          </div>

          {postsLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : postsError ? (
            <div className="text-center py-12 bg-red-50 rounded-lg">
              <div className="text-red-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-red-600 text-lg mb-4">Error loading posts</p>
              <p className="text-gray-500">Please try again later</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-500 text-lg mb-4">No posts found.</p>
              <p className="text-gray-400">Be the first to create one!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <article key={post._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  {getImageUrl(post.thumbnail) ? (
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={getImageUrl(post.thumbnail) || ''} 
                        alt={post.title || 'Post thumbnail'}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://via.placeholder.com/400x200?text=No+Image';
                        }}
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        post.status === 'published' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {post.status?.charAt(0).toUpperCase() + (post.status?.slice(1) || '')}
                      </span>
                      <span className="text-sm text-gray-500">
                        {post.createdAt ? new Date(post.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        }) : 'No date'}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2 hover:text-blue-600 transition-colors">
                      <a href={`/posts/${post.slug || post._id}`} className="hover:no-underline">
                        {post.title || 'Untitled Post'}
                      </a>
                    </h3>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt || (post.content ? post.content.replace(/<[^>]*>/g, '').substring(0, 150) : 'No content available')}
                    </p>
                    
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.slice(0, 3).map((tag, index) => (
                          <span 
                            key={index} 
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {tag}
                          </span>
                        ))}
                        {post.tags.length > 3 && (
                          <span className="text-xs text-gray-500 self-center">
                            +{post.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                    
                    <a 
                      href={`/${post.slug || post._id}`}
                      className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
                    >
                      Read more
                      <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </a>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}
import { useQuery } from '@tanstack/react-query';
import { getToken } from '@/src/services/auth-storage';
import { getMyBlog } from '@/src/services/blogs';
import { getTenantPublicPosts } from '@/src/services/post';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/src/component/DashboardLayout';
import { Post } from '@/src/types/posts';
import PopularSidebar from '@/src/component/PopularSidebar';
import EditorsPick from '@/src/component/EditorsPick';
import Link from 'next/link';
import { Heart, MessageSquare } from 'lucide-react';

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

  const { data: postsData, isLoading: postsLoading } = useQuery({
    queryKey: ['public-posts'],
    queryFn: () => getTenantPublicPosts({ limit: 10, page: 1 }),
    enabled: !!token,
  });

  const posts: Post[] = postsData?.data?.posts || [];

  const getImageUrl = (thumbnail: string | undefined): string => {
    if (!thumbnail || thumbnail.trim() === '') return 'https://via.placeholder.com/400x250?text=Blog+Post';
    if (thumbnail.startsWith('http')) return thumbnail;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    return thumbnail.startsWith('/') ? `${apiUrl}${thumbnail}` : `${apiUrl}/${thumbnail}`;
  };

  const getCategoryColor = (tag: string) => {
    const t = tag?.toLowerCase();
    if (t === 'coding') return 'bg-purple-100 text-purple-700';
    if (t === 'style') return 'bg-blue-100 text-blue-700';
    if (t === 'travel') return 'bg-rose-100 text-rose-700';
    if (t === 'culture') return 'bg-orange-100 text-orange-700';
    return 'bg-gray-100 text-gray-700';
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
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Top Categories Section */}
        <section className="w-full overflow-x-auto pb-4">
          <div className="flex md:grid md:grid-cols-6 gap-5 min-w-max md:min-w-full">
            {categories.map((cat) => (
              <button 
                key={cat.name} 
                className={`flex items-center gap-3 p-3 rounded-xl transition-all hover:-translate-y-1 hover:shadow-md ${cat.color}`}
              >
                <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border-2 border-white shadow-sm">
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                </div>
                <span className="font-semibold text-gray-800 text-sm">{cat.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Main Grid: Content + Sidebars */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-30">
          
          {/* Left Column: Recent Posts Feed */}
          <div className="lg:col-span-8 space-y-12">
            <div className="border-b border-gray-100 pb-4">
              <h2 className="text-3xl font-bold text-gray-900">Recent Posts</h2>
            </div>

            <div className="space-y-16">
              {posts.map((post) => (
                <article key={post._id} className="flex flex-col md:flex-row gap-8 group">
                  {/* Thumbnail */}
                  <Link 
                    href={`/posts/${post.slug || post._id}`} 
                    className="w-full md:w-[45%] aspect-[16/10] rounded-2xl overflow-hidden shadow-sm shrink-0 bg-gray-100"
                  >
                    <img 
                      src={getImageUrl(post.thumbnail)} 
                      alt={post.title} 
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" 
                    />
                  </Link>

                  {/* Content */}
                  <div className="flex-1 py-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-3 text-sm">
                        <span className="text-gray-500 font-medium">
                          {new Date(post.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span className="text-gray-300">•</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide ${getCategoryColor(post.tags?.[0])}`}>
                          {post.tags?.[0] || 'General'}
                        </span>
                      </div>
                      
                      <Link href={`/posts/${post.slug || post._id}`}>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-blue-600 transition-colors">
                          {post.title}
                        </h3>
                      </Link>
                      
                      <p className="text-gray-500 leading-relaxed mb-4 line-clamp-3 text-base">
                        {post.excerpt || (post.content ? post.content.replace(/<[^>]*>/g, '').substring(0, 120) : '')}
                      </p>
                    </div>
                    
                    {/* Meta Info */}
                    <div className="flex items-center gap-4 mt-2">
                       <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-[10px] font-bold text-white">
                             {post.author?.displayName?.charAt(0) || 'U'}
                          </div>
                          <span className="text-xs font-medium text-gray-900">{post.author?.displayName}</span>
                       </div>
                       
                       <span className="text-gray-300">|</span>
                       
                       <div className="flex items-center gap-3 text-gray-500">
                           <div className="flex items-center gap-1.5" title="Likes">
                              <Heart size={16} className="text-gray-400" />
                              <span className="text-xs font-medium">{post.likes || 0}</span>
                           </div>
                           <div className="flex items-center gap-1.5">
                              <MessageSquare size={16} className="text-gray-400" />
                              <span className="text-xs font-medium">0</span>
                           </div>
                       </div>

                       <span className="text-gray-300">|</span>

                       <Link href={`/posts/${post.slug || post._id}`} className="text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                        Read Article
                       </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Right Column: Sidebar (Popular & Featured) */}
          <div className="lg:col-span-4 space-y-12">
            <div className="sticky top-6 space-y-12">
                <PopularSidebar />
                <EditorsPick />

                {/* Newsletter Box */}
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                   <h3 className="font-bold text-gray-900 mb-2">Weekly Newsletter</h3>
                   <p className="text-sm text-gray-500 mb-4 leading-relaxed">Get the latest stories and insights delivered straight to your inbox.</p>
                   <input 
                    type="email" 
                    placeholder="Email address" 
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm mb-2 focus:ring-1 focus:ring-blue-500 outline-none" 
                   />
                   <button className="w-full bg-black text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                     Subscribe
                   </button>
                </div>
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
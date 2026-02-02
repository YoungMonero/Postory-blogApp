import { useRouter } from 'next/router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, useRef } from 'react';
import { getMyBlog, uploadBlogImage, updateMyBlogImages } from '@/src/services/blogs';
import { getUserPosts } from '@/src/services/post';
import { useAuth } from '@/src/hooks/useAuth';
import Link from 'next/link';
import { Bell, Check, PlusCircle, Info, Search, Camera, Share2, Settings, Heart, Eye } from 'lucide-react';
import { format } from 'date-fns';


export default function BlogChannelView() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState<'home' | 'about'>('home');

  const coverInputRef = useRef<HTMLInputElement>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);

  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const { data: blog, isLoading: blogLoading } = useQuery({
    queryKey: ['my-blog'],
    queryFn: async () => (token ? await getMyBlog(token) : null),
    enabled: !!token,
    retry: false,
  });

  const { data: postsResponse, isLoading: postsLoading } = useQuery({
    queryKey: ['user-posts', token],
    queryFn: async () => (token ? await getUserPosts(token) : null),
    enabled: !!token && !!blog,
    retry: false,
  });

  const handleImageUpload = async (file: File, type: 'coverImage' | 'profileImage') => {
    if (!token) return;
    setUploading(true);
    try {
      const previewURL = URL.createObjectURL(file);
      if (type === 'coverImage') setCoverPreview(previewURL);
      else setProfilePreview(previewURL);
      const uploaded = await uploadBlogImage(file, token);
      await updateMyBlogImages({ [type]: uploaded.url }, token);
      queryClient.invalidateQueries({ queryKey: ['my-blog'] });
    } catch (err) {
      alert('Failed to upload image.');
    } finally {
      setUploading(false);
    }
  };

  if (blogLoading || postsLoading || !token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const posts = postsResponse?.data || [];

  return (
    
    
    <div className="min-h-screen bg-white font-sans">
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-[26px] font-black tracking-tight text-gray-900 flex items-center group">
              WORD
              <span className="relative flex items-center text-indigo-600 ml-0.5">
                o
                <span className="-ml-1.5 transition-transform duration-300 ease-out group-hover:translate-x-0.5">
                  o
                </span>

                {/* Brand accent dot */}
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5
                     bg-indigo-500 rounded-full
                     opacity-0 group-hover:opacity-100
                     transition-all duration-300 ease-out">
                </span>
              </span>
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <Search className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600" />
            <div className="w-8 h-8 rounded-full bg-gray-200 border border-gray-100 overflow-hidden">
              {/* User Profile Thumbnail could go here */}
            </div>
          </div>
        </div>
      </nav>


      <div
        className="relative w-full h-[320px] md:h-[450px] bg-gray-100 overflow-hidden group cursor-pointer"
        onClick={() => coverInputRef.current?.click()}
      >
        <img
          src={coverPreview || blog?.coverImage || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1600&q=80'}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          alt="Cover"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all flex items-center justify-center">
          <Camera className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={30} />
        </div>
        <input ref={coverInputRef} type="file" hidden onChange={(e) => e.target.files && handleImageUpload(e.target.files[0], 'coverImage')} />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* 2. PROFILE HEADER - RESTORED DESCRIPTION */}
        <div className="relative flex flex-col md:flex-row items-start gap-8 pb-10 border-b border-gray-100">
          <div className="relative -mt-24 z-20">
            <div
              className="w-40 h-40 md:w-48 md:h-48 rounded-full bg-white p-1.5 shadow-2xl overflow-hidden cursor-pointer group"
              onClick={() => profileInputRef.current?.click()}
            >
              <img
                src={profilePreview || blog?.coverImage || `https://ui-avatars.com/api/?name=${blog?.title}&background=random`}
                className="w-full h-full object-cover rounded-full"
                alt="Profile"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-full">
                <Camera className="text-white" size={24} />
              </div>
            </div>
            <input ref={profileInputRef} type="file" hidden onChange={(e) => e.target.files && handleImageUpload(e.target.files[0], 'profileImage')} />
          </div>

          <div className="flex-1 pt-6">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
              <div className="max-w-3xl">
                <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                  {blog?.title}
                  <Check size={20} className="bg-blue-500 text-white rounded-full p-1" />
                </h1>
                <div className="flex items-center gap-4 mt-3 text-sm font-bold text-gray-400 uppercase tracking-widest">
                  <span className="text-gray-900">@{blog?.slug}</span>
                  <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                  <span>{posts.length} Posts</span>
                </div>
                {/* Description Restored Here */}
                <p className="mt-5 text-gray-500 text-lg leading-relaxed font-light">
                  {blog?.description || "Curating the finest insights and stories for the modern reader."}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button className="bg-black text-white px-8 py-3.5 rounded-full font-bold text-sm hover:bg-zinc-800 transition-all shadow-lg flex items-center gap-2">
                  <Bell size={18} /> Subscribe
                </button>
                <button className="p-3.5 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors">
                  <Share2 size={20} />
                </button>
                <button className="p-3.5 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors">
                  <Settings size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 3. TABS + NEW POST BUTTON */}
        <div className="flex items-center justify-between border-b border-gray-100">
          <div className="flex items-center gap-10">
            {['Home', 'About'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase() as any)}
                className={`text-xs font-black py-6 border-b-2 transition-all tracking-[0.2em] uppercase ${activeTab === tab.toLowerCase() ? 'border-black text-black' : 'border-transparent text-gray-300 hover:text-gray-500'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <Link
            href="/dashboard/create-post"
            className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest hover:bg-indigo-100 transition-all border border-indigo-100"
          >
            <PlusCircle size={16} /> New Post
          </Link>
        </div>

        {/* 4. CONTENT AREA */}
        <div className="py-12">
          {activeTab === 'home' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {posts.map((post) => (
                <article
                  key={post._id}
                  className="group flex flex-col cursor-pointer"
                  onClick={() => router.push(`/post/${post.slug || post._id}`)}
                >
                  <div className="relative aspect-[16/10] rounded-[2rem] overflow-hidden mb-5 bg-gray-50 shadow-sm group-hover:shadow-xl transition-all duration-500">
                    <img src={post.thumbnail} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={post.title} />
                  </div>
                  <div className="space-y-3 px-2">
                    <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-gray-400">
                      <span className="text-indigo-600 font-black">{post.status}</span>
                      <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                      <span>{format(new Date(post.createdAt), 'MMM d, yyyy')}</span>
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 line-clamp-2 leading-snug group-hover:text-indigo-600 transition-colors">
                      {post.title}
                    </h4>
                    <div className="flex items-center gap-4 pt-2 text-gray-400">
                      <span className="flex items-center gap-1 text-xs font-bold"><Eye size={14} /> {post.views || 0}</span>
                      <span className="flex items-center gap-1 text-xs font-bold"><Heart size={14} /> {post.likes || 0}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {activeTab === 'about' && (
            <div className="max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-16">
              <div className="md:col-span-2 space-y-8">
                <h3 className="text-2xl font-black text-gray-900 tracking-tight uppercase tracking-[0.1em]">Description</h3>
                <div className="text-gray-500 text-lg leading-relaxed space-y-6 font-light">
                  {blog?.content || blog?.description || "No description provided."}
                </div>
              </div>
              <div className="bg-zinc-50 p-8 rounded-[2rem] h-fit border border-zinc-100">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-6">Stats</h4>
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between items-center border-b border-zinc-200 pb-3">
                    <span className="text-xs font-bold text-zinc-400 uppercase">Joined</span>
                    <span className="text-sm font-black">{format(new Date(blog?.createdAt), 'MMM yyyy')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-zinc-400 uppercase">Total Views</span>
                    <span className="text-sm font-black">{posts.reduce((s, p) => s + (p.views || 0), 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
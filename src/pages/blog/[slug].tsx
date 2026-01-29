
import { useRouter } from 'next/router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, useRef } from 'react';
import { getMyBlog, uploadBlogImage, updateMyBlogImages } from '@/src/services/blogs';
import { useAuth } from '@/src/hooks/useAuth';
import Link from 'next/link';
import { Bell, Check, PlusCircle, Info, Search, Camera } from 'lucide-react';


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

  const { data: blog, isLoading, error } = useQuery({
    queryKey: ['my-blog'],
    queryFn: async () => (token ? await getMyBlog(token) : null),
    enabled: !!token,
    retry: false,
  });

  const handleImageUpload = async (
    file: File,
    type: 'coverImage' | 'profileImage'
  ) => {
    if (!token) return;
    setUploading(true);

    try {
      const previewURL = URL.createObjectURL(file);
      if (type === 'coverImage') setCoverPreview(previewURL);
      else setProfilePreview(previewURL);

      // Upload image
      const uploaded = await uploadBlogImage(file, token);

      // Update blog with new image URL
      await updateMyBlogImages({ [type]: uploaded.url }, token);

      // Refresh blog data
      queryClient.invalidateQueries({ queryKey: ['my-blog'] });
    } catch (err) {
      console.error('Image upload failed:', err);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  if (isLoading || !token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center p-6">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-2">
          <Info size={32} />
        </div>
        <p className="text-gray-700 font-bold text-xl">Channel Not Found</p>
        <button
          onClick={() => router.push('/')}
          className="bg-indigo-600 text-white px-6 py-2 rounded-full shadow-md hover:bg-indigo-700 transition"
        >
          Return to Home
        </button>
      </div>
    );
  }

  const blogData = blog;

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
        className={`w-full h-48 md:h-64 relative cursor-pointer group ${
          uploading ? 'opacity-70 pointer-events-none' : ''
        }`}
        onClick={() => coverInputRef.current?.click()}
      >
        <img
          src={coverPreview || blog.coverImage || '/placeholder-cover.jpg'}
          className="w-full h-full object-cover"
          alt="Cover"
        />

        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
          <Camera className="text-white" />
        </div>

        <input
          ref={coverInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) =>
            e.target.files && handleImageUpload(e.target.files[0], 'coverImage')
          }
        />
      </div>


 <div className="-mt-16 ml-8 relative w-32 h-32 md:w-36 md:h-36">
        <div
          onClick={() => profileInputRef.current?.click()}
          className="group w-full h-full rounded-full overflow-hidden border-4 border-white cursor-pointer shadow-xl relative"
        >
          {profilePreview || blog.profileImage ? (
            <img
              src={profilePreview || blog.profileImage}
              className="w-full h-full object-cover"
              alt="Profile"
            />
          ) : (
            <div className="w-full h-full bg-indigo-50 flex items-center justify-center text-4xl font-black text-indigo-600 uppercase">
              {blogData?.title?.charAt(0)}
            </div>
          )}

          {/* overlay moved INSIDE clickable container */}
          <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
            <Camera className="text-white" />
          </div>
        </div>

        <input
          ref={profileInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) =>
            e.target.files && handleImageUpload(e.target.files[0], 'profileImage')
          }
        />
      </div>






      <div className="max-w-[1200px] mx-auto px-4 md:px-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-6 border-b border-gray-100">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 -mt-10 md:-mt-8 relative z-10">
            {/* Profile is now shown above; no initial placeholder needed here */}
            <div className="mt-2 md:mt-10">
              <h1 className="text-3xl font-black text-gray-900 mb-1 flex items-center gap-2">
                {blogData?.title}
                <Check size={16} className="bg-blue-500 text-white rounded-full p-0.5" />
              </h1>
              <div className="text-gray-500 text-sm font-medium flex gap-3 mb-3">
                <span>@{blogData?.slug}</span>
                <span>•</span>
                <span>0 posts</span>
                <span>•</span>
                <span>0 subscribers</span>
              </div>
              <p className="text-gray-600 text-sm max-w-xl line-clamp-2 leading-relaxed">
                {blogData?.description || `Welcome to the official channel of ${blogData?.title}.`}
              </p>
            </div>
          </div>
          <div className="mt-4 md:mt-12 flex gap-3">
            <button className="bg-black text-white px-8 py-2.5 rounded-full font-bold text-sm hover:bg-gray-800 transition shadow-sm flex items-center gap-2">
              <Bell size={16} /> Subscribe
            </button>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="flex items-center gap-8 border-b border-gray-100 mb-8 overflow-x-auto">
          {['Home', 'About'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase() as any)}
              className={`uppercase text-xs font-bold py-4 border-b-2 transition-all whitespace-nowrap tracking-widest ${
                activeTab === tab.toLowerCase()
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content (unchanged) */}
        <div className="pb-20">
          {activeTab === 'home' && (
            <div className="flex flex-col items-center justify-center py-20 px-6 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 text-center">
              <div className="w-20 h-20 flex items-center justify-center text-indigo-600 mb-6 border border-gray-100">
                <PlusCircle size={40} strokeWidth={1.5} />
              </div>
              <h2 className="text-2xl font-black text-gray-900 mb-2">Create your first post</h2>
              <p className="text-gray-500 max-w-sm mb-8">
                Start sharing your journey, stories, and ideas with the community.
              </p>
              <Link
                href="/dashboard/create-post"
                className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:scale-105 transition-all flex items-center gap-2"
              >
                <PlusCircle size={18} />
                Create Post
              </Link>
            </div>
          )}
          {activeTab === 'about' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="md:col-span-2 space-y-8">
                <div>
                  <h3 className="text-lg font-black text-gray-900 mb-4">Description</h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-lg">
                    {blogData?.content || blogData?.description || 'No detailed description provided yet.'}
                  </p>
                </div>
              </div>
              <div className="bg-gray-50 p-6 rounded-2xl h-fit border border-gray-100">
                <h3 className="text-gray-900 font-black text-sm uppercase tracking-widest mb-6">Stats</h3>
                <div className="space-y-4 text-sm font-medium">
                  <div className="flex items-center justify-between text-gray-500 border-b border-gray-200 pb-3">
                    <span>Joined</span>
                    <span className="text-gray-900">Jan 2026</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-500">
                    <span>Total views</span>
                    <span className="text-gray-900">0 views</span>
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


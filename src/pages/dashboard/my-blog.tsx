import { useRouter } from 'next/router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, useRef } from 'react';
import { getMyBlog, uploadBlogImage, updateMyBlogImages } from '@/src/services/blogs';
import { getUserPosts, updatePost, deletePost } from '@/src/services/post';
import { useAuth } from '@/src/hooks/useAuth';
import Link from 'next/link';
import { Bell, Check, PlusCircle, Search, Camera, Share2, Settings, Heart, Eye, Archive, Clock } from 'lucide-react';
import { format } from 'date-fns';
import PostActionsDropdown from '@/src/component/PostActionsDropdown';

export default function MyBlogManager() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { token, user } = useAuth();
  const [activeTab, setActiveTab] = useState<'home' | 'about'>('home');
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);

  const coverInputRef = useRef<HTMLInputElement>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);

  // 1. Fetch private blog data using Token
  const { data: blog, isLoading: blogLoading } = useQuery({
    queryKey: ['my-blog'],
    queryFn: async () => (token ? await getMyBlog(token) : null),
    enabled: !!token,
  });

  // 2. Fetch private posts (including drafts) using Token
  const { data: postsResponse, isLoading: postsLoading } = useQuery({
    queryKey: ['user-posts', token],
    queryFn: async () => (token ? await getUserPosts(token) : null),
    enabled: !!token && !!blog,
  });

  const handleImageUpload = async (file: File, type: 'coverImage' | 'profileImage') => {
    if (!token) return;
    try {
      const previewURL = URL.createObjectURL(file);
      if (type === 'coverImage') setCoverPreview(previewURL);
      else setProfilePreview(previewURL);
      const uploaded = await uploadBlogImage(file, token);
      await updateMyBlogImages({ [type]: uploaded.url }, token);
      queryClient.invalidateQueries({ queryKey: ['my-blog'] });
    } catch (err) {
      alert('Upload failed');
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!token || !window.confirm('Move to trash?')) return;
    try {
      await deletePost(postId, token);
      queryClient.invalidateQueries({ queryKey: ['user-posts', token] });
    } catch (err) { console.error(err); }
  };

  if (blogLoading || postsLoading || !token) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full" /></div>;

  const posts = postsResponse?.data || [];

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Navbar with link to Public View */}
      <nav className="sticky top-0 z-50 bg-white border-b px-6 h-14 flex items-center justify-between">
        <Link href="/dashboard" className="font-black text-xl">WORDOO <span className="text-indigo-600">Admin</span></Link>
        <div className="flex items-center gap-4">
            <Link href={`/blogs/${blog?.slug}`} className="text-sm font-bold text-indigo-600 hover:underline">View Public Blog</Link>
            <div className="w-8 h-8 rounded-full bg-gray-100" />
        </div>
      </nav>

      {/* Cover Image Editor */}
      <div className="relative h-[300px] bg-gray-100 group cursor-pointer" onClick={() => coverInputRef.current?.click()}>
        <img src={coverPreview || blog?.coverImage || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643'} className="w-full h-full object-cover" alt="" />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 flex items-center justify-center transition-all">
          <Camera className="text-white opacity-0 group-hover:opacity-100" />
        </div>
        <input ref={coverInputRef} type="file" hidden onChange={(e) => e.target.files && handleImageUpload(e.target.files[0], 'coverImage')} />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="relative -mt-20 flex flex-col md:flex-row gap-8 pb-10 border-b">
          <div className="w-40 h-40 rounded-full border-4 border-white overflow-hidden relative group cursor-pointer" onClick={() => profileInputRef.current?.click()}>
            <img src={profilePreview || blog?.profileImage || `https://ui-avatars.com/api/?name=${blog?.title}`} className="w-full h-full object-cover" alt="" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all"><Camera className="text-white" /></div>
            <input ref={profileInputRef} type="file" hidden onChange={(e) => e.target.files && handleImageUpload(e.target.files[0], 'profileImage')} />
          </div>

          <div className="flex-1 pt-4">
            <h1 className="text-4xl font-black">{blog?.title || "Untitled Blog"}</h1>
            <p className="text-gray-500">@{blog?.slug}</p>
            <div className="flex gap-2 mt-4">
                <Link href="/dashboard/create-post" className="bg-black text-white px-6 py-2 rounded-full font-bold text-sm">New Post</Link>
                <button className="p-2 border rounded-full"><Settings size={20} /></button>
            </div>
          </div>
        </div>

        {/* Post Grid with Trash/Edit buttons */}
        <div className="py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post: any) => (
            <article key={post._id} className="group relative border rounded-2xl p-4">
              <div className="absolute top-2 right-2 z-10">
                <PostActionsDropdown 
                    postId={post._id} 
                    isOwner={true} 
                    onDelete={() => handleDeletePost(post._id)} 
                    onEdit={() => router.push(`/dashboard/edit-post/${post._id}`)}
                />
              </div>
              <img src={post.thumbnail || 'https://via.placeholder.com/400'} className="aspect-video object-cover rounded-xl mb-4" alt="" />
              <h4 className="font-bold text-lg">{post.title}</h4>
              <div className="flex justify-between mt-2 text-xs text-gray-400 font-bold">
                <span>{post.status}</span>
                <span>{format(new Date(post.createdAt), 'MMM d, yyyy')}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
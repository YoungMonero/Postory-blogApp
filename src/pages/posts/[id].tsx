import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getPublicPostDetail } from '@/src/services/post';
import { Post } from '@/src/types/posts';
import CommentSection from '@/src/component/CommentSection';
import { useAuth } from '@/src/hooks/useAuth';

export default function PostDetailPage() {
  const router = useRouter();
  const { id } = router.query; 

  const { token } = useAuth();

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!router.isReady || !id) return;

    const fetchPost = async () => {
      try {
        setLoading(true);
        // Use the new public fetcher to avoid 403 errors
        const response = await getPublicPostDetail(id as string);
        if (response.success) {
          setPost(response.data);
        }
      } catch (err) {
        console.error("Failed to load post content");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, router.isReady]);

  if (loading) return <div className="p-20 text-center animate-pulse">Loading Story...</div>;
  if (!post) return <div className="p-20 text-center">Post not found.</div>;

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <header className="mb-10 text-center">
        <h1 className="text-5xl font-black mb-6 text-gray-900 leading-tight">
          {post.title}
        </h1>
        <div className="flex items-center justify-center gap-3 text-gray-600">
          {post.author?.profilePicture && (
            <img src={post.author.profilePicture} className="w-10 h-10 rounded-full" alt="" />
          )}
          <span className="font-bold underline decoration-indigo-500">
            {post.author?.displayName || 'Author'}
          </span>
          <span>•</span>
          <span>{post.readingTime} min read</span>
        </div>
      </header>

      {post.thumbnail && (
        <div className="mb-12">
          <img 
            src={post.thumbnail} 
            className="w-full h-[450px] object-cover rounded-[2rem] shadow-2xl" 
            alt={post.title} 
          />
        </div>
      )}

      {/* This renders the full HTML content of your post */}
      <article 
        className="prose prose-lg lg:prose-xl prose-indigo max-w-none text-gray-800 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: post.content }} 
      />
      
      <div className="mt-16 pt-8 border-t border-gray-100 italic text-gray-400 text-sm text-center">
        Published in {post.blog?.name}
      </div>
      
      <CommentSection 
       postId={post.id || post._id} // Use the database ID
        token={token} 
      />
    </main>
  );
}
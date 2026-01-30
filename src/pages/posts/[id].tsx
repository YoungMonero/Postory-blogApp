import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getPublicPostDetail } from '@/src/services/post';
import { Post } from '@/src/types/posts';
import CommentSection from '@/src/component/CommentSection';
import { commentService } from '@/src/services/comment';
import { useAuth } from '@/src/hooks/useAuth';
import { Heart } from 'lucide-react';
import { MessageSquare, Share2, ArrowLeft } from 'lucide-react';

export default function PostDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { token, user } = useAuth();

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  // State for interactive elements
  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const handleBack = () => {
    router.push('/dashboard');
  };

  useEffect(() => {
    if (!router.isReady || !id) return;

    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await getPublicPostDetail(id as string);
        
        if (response && response.data) {
          const postData = response.data;
          setPost(postData); 
          setLikesCount(postData.likes || 0);
          

          const currentUserId = user?.id || user?.sub || user?._id;
          
          if (currentUserId && postData.likedBy) {
            const hasLiked = postData.likedBy.some(
              (likedId: string) => String(likedId) === String(currentUserId)
            );
            setIsLiked(hasLiked);
          }
        }
      } catch (err) {
        console.error("Failed to load post content", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, router.isReady, user]); // Re-run when user object is loaded

  const handleLike = async () => {
    const targetId = post?._id || post?.id;
    if (!targetId || !token) {
      alert("Please log in to like this post");
      return;
    }

    try {
      const result = await commentService.toggleLike(targetId);
      
      // Update state immediately based on backend response
      setLikesCount(result.likes);
      setIsLiked(result.liked);
    } catch (err) {
      console.error("Like failed:", err);
    }
  };

  if (loading) return <div className="p-20 text-center animate-pulse text-indigo-600 font-bold">Loading Story...</div>;
  if (!post) return <div className="p-20 text-center">Post not found.</div>;

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
<nav className="fixed top-8 left-8 z-50 hidden lg:block">
        <button
          onClick={handleBack}
          className="group flex items-center justify-center w-12 h-12 bg-white border border-gray-100 rounded-full shadow-sm hover:shadow-md hover:border-indigo-100 transition-all duration-300"
          title="Back to Dashboard"
        >
          <ArrowLeft 
            size={20} 
            className="text-gray-400 group-hover:text-indigo-600 transition-colors group-hover:-translate-x-1 duration-300" 
          />
        </button>
      </nav>

      {post.thumbnail && (
        <div className="mb-12">
          <img
            src={post.thumbnail}
            className="w-full h-[450px] object-cover rounded-[2rem] shadow-sm"
            alt={post.title}
          />
        </div>
      )}

      <article
        className="prose prose-lg prose-indigo max-w-none text-gray-800 leading-relaxed font-serif"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* MODERN INTERACTION BAR */}
      <div className="sticky bottom-8 left-0 right-0 flex justify-center z-50 mt-12">
        <div className="flex items-center gap-6 bg-white/80 backdrop-blur-md border border-gray-200 px-6 py-3 rounded-full shadow-xl shadow-gray-200/50">
          
          {/* Like Button */}
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 transition-all active:scale-90 ${
              isLiked ? 'text-red-500' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Heart
              size={20}
              fill={isLiked ? "currentColor" : "none"}
              className={isLiked ? "animate-bounce" : ""}
            />
            <span className="text-sm font-bold">{likesCount}</span>
          </button>

          <div className="w-px h-4 bg-gray-200" />

          {/* Comment Shortcut */}
          <button 
            onClick={() => document.getElementById('discussion')?.scrollIntoView({ behavior: 'smooth' })}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-all"
          >
            <MessageSquare size={20} />
            <span className="text-sm font-bold">Discuss</span>
          </button>

          <div className="w-px h-4 bg-gray-200" />

          {/* Share Shortcut */}
          <button className="text-gray-500 hover:text-gray-900 transition-all">
            <Share2 size={20} />
          </button>
        </div>
      </div>

      <div id="discussion">
        <CommentSection postId={post._id || post.id} token={token} />
      </div>
    </main>
  );
}
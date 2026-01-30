import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getPublicPostDetail } from '@/src/services/post';
import { Post } from '@/src/types/posts';
import CommentSection from '@/src/component/CommentSection';
import { commentService } from '@/src/services/comment';
import { useAuth } from '@/src/hooks/useAuth';
import { Heart } from 'lucide-react';

export default function PostDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { token, user } = useAuth();

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  // State for interactive elements
  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

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
          
          // CRITICAL FIX: Match the user ID against the likedBy array
          // We check multiple possible ID fields and convert to String for safety
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
    <main className="max-w-4xl mx-auto px-6 py-12">
      <header className="mb-10 text-center">
        <h1 className="text-5xl font-black mb-6 text-gray-900 leading-tight">
          {post.title}
        </h1>
        <div className="flex items-center justify-center gap-3 text-gray-600">
          {post.author?.profilePicture && (
            <img src={post.author.profilePicture} className="w-10 h-10 rounded-full object-cover" alt="" />
          )}
          <span className="font-bold underline decoration-indigo-500">
            {post.author?.displayName || 'Author'}
          </span>
          <span>•</span>
          <span>{post.readingTime || 5} min read</span>
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

      <article
        className="prose prose-lg lg:prose-xl prose-indigo max-w-none text-gray-800 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Interactive Like Section */}
      <div className="flex flex-col items-center py-12 border-t border-gray-100 mt-10">
        <button
          onClick={handleLike}
          className={`group flex items-center gap-3 px-8 py-3 rounded-full border-2 transition-all duration-300 ${isLiked
            ? 'bg-red-50 border-red-200 text-red-500'
            : 'bg-white border-gray-200 text-gray-400 hover:border-red-100 hover:text-red-400'
            }`}
        >
          <Heart
            size={24}
            fill={isLiked ? "currentColor" : "none"}
            className={isLiked ? "animate-heart-pop" : "group-hover:scale-110 transition-transform"}
          />
          <span className="text-lg font-black">{likesCount} Likes</span>
        </button>
        <p className="text-gray-400 text-sm mt-3 font-medium">
          {isLiked ? "You liked this story" : "Click to show appreciation for this story"}
        </p>
      </div>

      <CommentSection
        postId={post._id || post.id}
        token={token}
      />
    </main>
  );
}
import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { commentService } from '@/src/services/comment';
import Cookies from 'js-cookie'; 

interface LikeButtonProps {
  post: any;
  token: string | null;
  openAuthModal: () => void;
}

const LikeButton = ({ post, token, openAuthModal }: LikeButtonProps) => {
  const [likesCount, setLikesCount] = useState(post.likes || 0);
  const [isLiked, setIsLiked] = useState(post.isLikedByUser || false);
  const [isAnimating, setIsAnimating] = useState(false);


  useEffect(() => {
    const postId = post?._id || post?.id;
    const savedLike = Cookies.get(`liked_${postId}`);
    
    if (savedLike === 'true') {
      setIsLiked(true);
    } else {
      setIsLiked(post.isLikedByUser || false);
    }
    setLikesCount(post.likes || 0);
  }, [post]);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const targetId = post?._id || post?.id;

    if (!targetId || !token) {
      openAuthModal();
      return;
    }

    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 100);

    try {
      const result = await commentService.toggleLike(targetId);
      
      // 2. Update states
      setLikesCount(result.likes);
      setIsLiked(result.liked);

      // 3. Save to cookies so it persists after refresh
      if (result.liked) {
        Cookies.set(`liked_${targetId}`, 'true', { expires: 7 }); // Stores for 7 days
      } else {
        Cookies.remove(`liked_${targetId}`);
      }
      
    } catch (err) {
      console.error('Like failed:', err);
    }
  };

  return (
    <button
      onClick={handleLike}
      className={`flex items-center gap-1.5 group/like transition-all active:scale-90 ${
        isLiked ? 'text-red-500' : 'text-gray-500 hover:text-gray-900'
      }`}
    >
      <Heart
        size={18}
        fill={isLiked ? 'currentColor' : 'none'}
        className={`${isLiked ? '' : 'group-hover/like:text-red-400'}`}
      />
      <span className={`text-xs font-bold ${isLiked ? 'text-gray-900' : 'text-gray-500'}`}>
        {likesCount}
      </span>
    </button>
  );
};

export default LikeButton;
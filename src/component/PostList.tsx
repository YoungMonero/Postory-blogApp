'use client';

import React, { useEffect, useCallback } from 'react';
import { usePosts } from '@/src/hooks/usePosts';
import { Post } from '@/src/types/posts';
import { useAuth } from '@/src/hooks/useAuth';
import Link from 'next/link';

interface PostCardProps {
  post: Post;
  onDelete: () => void;
  canDelete: boolean;
}

const PostsList: React.FC = () => {
  const { posts, loading, error, fetchPosts, deleteExistingPost } = usePosts();
  const { token } = useAuth(); 
  
  const loadPosts = useCallback(async () => {
    await fetchPosts('polog', {
      limit: 10,
      status: 'published',
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
  }, [fetchPosts]);

  useEffect(() => { loadPosts(); }, [loadPosts]);

  const handleDeletePost = async (postId: string) => {
    if (!token) return alert('You must be logged in to delete posts');
    if (window.confirm('Are you sure?')) {
      const success = await deleteExistingPost(postId, token);
      if (success) alert('Post deleted');
    }
  };

  if (loading) return <div className="flex justify-center p-10 animate-pulse text-indigo-600 font-bold">Loading Posts...</div>;
  if (error) return <div className="text-center p-10 text-red-500 font-bold">Error: {error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Latest Stories</h1>
        <button 
          onClick={loadPosts} 
          className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg font-bold text-sm hover:bg-indigo-100 transition-colors"
        >
          Refresh
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post: Post) => (
          <PostCard 
            key={post.id || post._id} 
            post={post} 
            // Delete always needs the database ID
            onDelete={() => handleDeletePost((post.id || post._id) as string)}
            canDelete={token !== null} 
          />
        ))}
      </div>
    </div>
  );
};

const PostCard: React.FC<PostCardProps> = ({ post, onDelete, canDelete }) => {
  // CRITICAL CHANGE: Use the slug for the URL to match your new public endpoint
  // Fallback to _id if slug is missing for some reason
  const identifier = post.slug || post.id || post._id;
  const detailHref = `/posts/${identifier}`;
  
  return (
    <article className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col h-full">
      <Link href={detailHref}>
        <div className="h-52 bg-gray-100 overflow-hidden relative">
          {post.thumbnail ? (
            <img 
              src={post.thumbnail} 
              alt={post.title} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-300 font-medium">No Thumbnail</div>
          )}
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-600 shadow-sm">
            {post.status}
          </div>
        </div>
      </Link>
      
      <div className="p-6 flex flex-col flex-grow">
        <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 leading-snug">
          <Link href={detailHref} className="hover:text-indigo-600 transition-colors">
            {post.title}
          </Link>
        </h2>
        
        <p className="text-gray-500 text-sm mb-6 line-clamp-3 flex-grow">
          {post.excerpt || post.content.replace(/<[^>]*>/g, '').substring(0, 120) + '...'}
        </p>
        
        <div className="flex justify-between items-center pt-4 border-t border-gray-50 mt-auto">
          <Link 
            href={detailHref} 
            className="text-indigo-600 font-black text-xs uppercase tracking-tighter hover:translate-x-1 flex items-center transition-all"
          >
            Read Story →
          </Link>
          
          {canDelete && (
            <button 
              onClick={(e) => {
                e.preventDefault(); 
                onDelete();
              }} 
              className="text-gray-300 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-full"
              title="Delete Post"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

export default PostsList;
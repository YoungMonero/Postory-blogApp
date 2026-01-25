'use client';

import React, { useEffect, useCallback } from 'react';
import { usePosts } from '@/src/hooks/usePosts';
import { Post } from '@/src/types/posts';
import { useAuth } from '@/src/hooks/useAuth'; 

const PostsList: React.FC = () => {
  const { posts, loading, error, fetchPosts, deleteExistingPost } = usePosts();
  const { token } = useAuth(); 

  const loadPosts = useCallback(async () => {
    await fetchPosts({ 
      limit: 10, 
      status: 'published',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
  }, [fetchPosts]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const handleDeletePost = async (postId: string) => {
    if (!token) {
      alert('You must be logged in to delete posts');
      return;
    }

    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        const success = await deleteExistingPost(postId, token);
        if (success) {
          alert('Post deleted successfully');
        }
      } catch (error) {
        console.error('Failed to delete post:', error);
        alert('Failed to delete post');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <span className="text-red-500">✕</span>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
            <button
              onClick={loadPosts}
              className="mt-2 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Latest Posts</h1>
        <button
          onClick={loadPosts}
          className="px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
        >
          Refresh
        </button>
      </div>
      
      {posts.length === 0 ? (
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
          {posts.map((post: Post) => (
            <PostCard 
              key={post._id} 
              post={post} 
              onDelete={() => handleDeletePost(post._id)}
              canDelete={token !== null} // Only show delete if logged in
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface PostCardProps {
  post: Post;
  onDelete: () => void;
  canDelete: boolean;
}

const PostCard: React.FC<PostCardProps> = ({ post, onDelete, canDelete }) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation
    e.stopPropagation(); // Prevent event bubbling
    onDelete();
  };

  return (
    <article className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      {post.thumbnail ? (
        <div className="h-48 overflow-hidden">
          <img 
            src={post.thumbnail} 
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              // Fallback if image fails to load
              const target = e.target as HTMLImageElement;
              target.src = 'https://via.placeholder.com/400x200?text=No+Image';
            }}
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
          <div className="flex items-center">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
              post.status === 'published' 
                ? 'bg-green-100 text-green-800'
                : post.status === 'draft'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {post.status?.charAt(0).toUpperCase() + post.status?.slice(1)}
            </span>
            <span className="ml-2 text-sm text-gray-500">
              {new Date(post.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
          </div>
          
          {canDelete && (
            <button
              onClick={handleDelete}
              className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"
              title="Delete post"
              aria-label="Delete post"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
        
        <h2 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
          <a 
            href={`/posts/${post.slug || post._id}`}
            className="hover:no-underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
          >
            {post.title}
          </a>
        </h2>
        
        <p className="text-gray-600 mb-4 line-clamp-3">
          {post.content.replace(/<[^>]*>/g, '')} {/* Remove HTML tags if any */}
        </p>
        
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.slice(0, 3).map((tag) => (
              <span 
                key={tag} 
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
        
        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <a 
            href={`/posts/${post.slug || post._id}`}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors group/link"
          >
            Read more
            <svg className="ml-1 w-4 h-4 transform group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
          
          <div className="flex items-center text-sm text-gray-500">
            {post.author ? (
              <>
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                  {typeof post.author === 'string' ? post.author.charAt(0).toUpperCase() : post.author.name.charAt(0).toUpperCase()}
                </div>
                <span>{typeof post.author === 'string' ? post.author : post.author.name}</span>
              </>
            ) : (
              <span>By Anonymous</span>
            )}
          </div>
        </div>
        
        {/* Post stats */}
        <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            {(post.likes || post.likes === 0) && (
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
                {post.likes}
              </span>
            )}
            {(post.views || post.views === 0) && (
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {post.views}
              </span>
            )}
          </div>
          
          {post.updatedAt !== post.createdAt && (
            <span className="text-xs" title={`Updated: ${new Date(post.updatedAt).toLocaleDateString()}`}>
              Edited
            </span>
          )}
        </div>
      </div>
    </article>
  );
};

export default PostsList;
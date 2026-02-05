import { useState, useCallback } from 'react';
import { Post, CreatePostDto, ApiResponse, CreatePostResponse } from '@/src/types/posts';
import { getTenantPublicPosts, createPost, deletePost } from '@/src/services/post';

export interface FetchPostsParams {
  limit?: number;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
}

interface UsePostsReturn {
  posts: Post[];
  loading: boolean;
  error: string | null;
  fetchPosts: (tenantSlug: string, options?: FetchPostsParams) => Promise<void>;
  createNewPost: (postData: CreatePostDto, token: string) => Promise<Post | null>;
  deleteExistingPost: (postId: string, token: string) => Promise<boolean>;
}

export function usePosts(): UsePostsReturn {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async (tenantSlug: string, options?: FetchPostsParams) => {
    setLoading(true);
    setError(null);

    try {
      const response: ApiResponse<{ posts: Post[] }> = await getTenantPublicPosts(options);

      if (response.success && response.data) {
        setPosts(response.data.posts);
      } else {
        setError(response.message || 'Failed to fetch posts');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteExistingPost = useCallback(async (postId: string, token: string) => {
    try {
      const response = await deletePost(postId, token);

      if (response.success) {
        setPosts(prev => prev.filter(p => p._id !== postId));
        return true;
      } else {
        setError(response.message || 'Delete failed');
        return false;
      }
    } catch (err: any) {
      setError(err.message || 'Delete failed');
      return false;
    }
  }, []);

  const createNewPost = useCallback(async (postData: CreatePostDto, token: string) => {
    setLoading(true);
    setError(null);

    try {
      const response: CreatePostResponse = await createPost(postData, token);

      if (response.success && response.data) {
        setPosts(prev => [response.data, ...prev]);
        return response.data;
      } else {
        setError(response.message || 'Create failed');
        return null;
      }
    } catch (err: any) {
      setError(err.message || 'Create failed');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    posts,
    loading,
    error,
    fetchPosts,
    createNewPost,
    deleteExistingPost,
  };
}

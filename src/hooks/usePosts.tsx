import { useState, useCallback } from 'react';
import {  
  Post, 
  CreatePostDto,
  ApiResponse,
  CreatePostResponse
} from '@/src/types/posts';
import { 
  getPublicPosts, 
  createPost,
  deletePost 
} from '@/src/services/post';

interface UsePostsReturn {
  posts: Post[];
  loading: boolean;
  error: string | null;
  fetchPosts: (options?: any) => Promise<void>;
  createNewPost: (postData: CreatePostDto, token: string) => Promise<Post | null>;
  deleteExistingPost: (postId: string, token: string) => Promise<boolean>;
}

export function usePosts(): UsePostsReturn {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async (options?: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const response: ApiResponse<Post[]> = await getPublicPosts(options);
      
      if (response.success && response.data) {
        setPosts(response.data);
      } else {
        setError(response.message || 'Failed to fetch posts');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteExistingPost = useCallback(async (postId: string, token: string): Promise<boolean> => {
    try {
      const response = await deletePost(postId, token);
      
      if (response.success) {
        setPosts(prev => prev.filter(post => post._id !== postId));
        return true;
      } else {
        setError(response.message || 'Failed to delete post');
        return false;
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete post');
      return false;
    }
  }, []);

  const createNewPost = useCallback(async (
    postData: CreatePostDto, 
    token: string
  ): Promise<Post | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response: CreatePostResponse = await createPost(postData, token);
      const newPost = response.post;
      
      setPosts(prev => [newPost, ...prev]);
      
      return newPost;
    } catch (err: any) {
      setError(err.message || 'Failed to create post');
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
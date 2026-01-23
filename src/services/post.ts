import { CreatePostDto, Post } from '@/src/types/posts';
import axios from 'axios';


const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('temp_token') || sessionStorage.getItem('temp_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


export async function getPublicPosts(): Promise<Post[]> {
  try {

    const response = await api.get<Post[]>('/posts/public');
    
    return response.data;
  } catch (error) {
    console.error('Error fetching public posts:', error);
    

    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch posts');
    }
    throw new Error('Network error');
  }
}


export async function getUserPosts(token?: string): Promise<Post[]> {
  try {
    const config = token ? {
      headers: { Authorization: `Bearer ${token}` }
    } : {};
    
    const response = await api.get<Post[]>('/posts/user', config);
    return response.data;
  } catch (error) {
    console.error('Error fetching user posts:', error);
    throw error;
  }
}


export async function createPost(
  postData: CreatePostDto, 
  token?: string
): Promise<Post> {
  try {
 
    const config = token ? {
      headers: { Authorization: `Bearer ${token}` }
    } : {};

    const response = await api.post<Post>('/posts', postData, config);
    return response.data;
  } catch (error) {
    console.error('Error creating post:', error);
    
    if (axios.isAxiosError(error)) {

      if (error.response?.status === 401) {
        throw new Error('Unauthorized - Please login again');
      }
      if (error.response?.status === 400) {
        throw new Error(error.response?.data?.message || 'Invalid post data');
      }
    }
    throw new Error('Failed to create post');
  }
}


export async function getPostById(id: string): Promise<Post> {
  try {
    const response = await api.get<Post>(`/posts/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching post ${id}:`, error);
    throw error;
  }
}


export async function updatePost(
  postId: string, 
  updateData: Partial<CreatePostDto>, 
  token: string
): Promise<Post> {
  try {
    const response = await api.put<Post>(
      `/posts/${postId}`,
      updateData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating post ${postId}:`, error);
    throw error;
  }
}


export async function deletePost(postId: string, token: string): Promise<void> {
  try {
    await api.delete(`/posts/${postId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  } catch (error) {
    console.error(`Error deleting post ${postId}:`, error);
    throw error;
  }
}

export { api };
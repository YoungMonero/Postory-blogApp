import axios, { AxiosError, AxiosResponse } from 'axios';
import {
  CreatePostDto,
  Post,
  ApiResponse,
  CreatePostResponse,
  ErrorResponse
} from '@/src/types/posts';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';


const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, 
});


api.interceptors.request.use(
  (config) => {
 
    const token = typeof window !== 'undefined' 
      ? sessionStorage.getItem('access_token')
      : null;
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError<ErrorResponse>) => {
    const originalRequest = error.config as any;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Attempt to refresh token
        const refreshResponse = await axios.post<{ accessToken: string }>(
          `${API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        
        if (refreshResponse.data.accessToken) {
          // Store new token
          sessionStorage.setItem('access_token', refreshResponse.data.accessToken);
          
          // Retry original request
          originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, clear storage and redirect
        sessionStorage.removeItem('access_token');
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

/**
 * Get public posts with pagination and filtering
 */
export async function getPublicPosts(
  options?: {
    page?: number;
    limit?: number;
    status?: 'published' | 'draft';
    sortBy?: 'createdAt' | 'publishedAt' | 'likes';
    sortOrder?: 'asc' | 'desc';
  }
): Promise<ApiResponse<Post[]>> {
  try {
    const params = new URLSearchParams();
    
    if (options?.page) params.append('page', options.page.toString());
    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.status) params.append('status', options.status);
    if (options?.sortBy) params.append('sortBy', options.sortBy);
    if (options?.sortOrder) params.append('sortOrder', options.sortOrder);
    
    const response = await api.get<ApiResponse<Post[]>>(
      `/posts/public${params.toString() ? `?${params.toString()}` : ''}`
    );
    
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    throw {
      success: false,
      message: axiosError.response?.data?.message || 'Failed to fetch posts',
      error: axiosError.message,
      statusCode: axiosError.response?.status || 500,
    };
  }
}

/**
 * Get a single post by ID or slug
 */
export async function getPostById(
  identifier: string
): Promise<ApiResponse<Post>> {
  try {
    const response = await api.get<ApiResponse<Post>>(`/posts/${identifier}`);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    throw {
      success: false,
      message: axiosError.response?.data?.message || 'Post not found',
      error: axiosError.message,
      statusCode: axiosError.response?.status || 404,
    };
  }
}

/**
 * Create a new post with proper TypeScript typing
 */
export async function createPost(
  postData: CreatePostDto,
  token?: string
): Promise<CreatePostResponse> {
  try {
    const config = token 
      ? { headers: { Authorization: `Bearer ${token}` } }
      : {};
    
    const response = await api.post<CreatePostResponse>(
      '/posts',
      postData,
      config
    );
    
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse & { details?: any }>;
    
    // Handle validation errors
    if (axiosError.response?.status === 422) {
      const validationErrors = axiosError.response.data.details;
      throw {
        message: 'Validation failed',
        statusCode: 422,
        details: validationErrors,
      };
    }
    
    throw {
      message: axiosError.response?.data?.message || 'Failed to create post',
      statusCode: axiosError.response?.status || 500,
    };
  }
}

/**
 * Update an existing post
 */
export async function updatePost(
  postId: string,
  updateData: Partial<CreatePostDto>,
  token: string
): Promise<ApiResponse<Post>> {
  try {
    const response = await api.patch<ApiResponse<Post>>(
      `/posts/${postId}`,
      updateData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    throw {
      success: false,
      message: axiosError.response?.data?.message || 'Failed to update post',
      error: axiosError.message,
    };
  }
}

/**
 * Delete a post
 */
export async function deletePost(
  postId: string,
  token: string
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await api.delete<{ success: boolean; message: string }>(
      `/posts/${postId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    throw {
      success: false,
      message: axiosError.response?.data?.message || 'Failed to delete post',
      error: axiosError.message,
    };
  }
}

/**
 * Get posts by user
 */
export async function getUserPosts(
  userId: string,
  token?: string
): Promise<ApiResponse<Post[]>> {
  try {
    const config = token 
      ? { headers: { Authorization: `Bearer ${token}` } }
      : {};
    
    const response = await api.get<ApiResponse<Post[]>>(
      `/users/${userId}/posts`,
      config
    );
    
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    throw {
      success: false,
      message: axiosError.response?.data?.message || 'Failed to fetch user posts',
      error: axiosError.message,
    };
  }
}

// Utility function to generate slug from title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .replace(/--+/g, '-')     // Replace multiple hyphens with single
    .trim();
}

// Add this function to your post.ts service
export async function uploadPostThumbnail(
  file: File,
  token: string
): Promise<{ url: string; publicId: string }> {
  try {
    const formData = new FormData();
    formData.append('thumbnail', file);
    
    const response = await api.post<{
      success: boolean;
      data: { url: string; publicId: string };
      message: string;
    }>('/posts/upload-thumbnail', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }
    });
    
    return response.data.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    throw {
      message: axiosError.response?.data?.message || 'Failed to upload thumbnail',
      statusCode: axiosError.response?.status || 500,
    };
  }
}

// Export the typed api instance
export { api };
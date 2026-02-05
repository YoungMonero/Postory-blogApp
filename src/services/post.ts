import axios, { AxiosError, AxiosResponse } from 'axios';
import {
  CreatePostDto,
  Post,
  ApiResponse,
  CreatePostResponse,
  ErrorResponse
} from '@/src/types/posts';

const API_URL = process.env.NEXT_PUBLIC_API_URL ;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});


api.interceptors.request.use(
  (config) => {
    const token =
      typeof window !== 'undefined'
        ? sessionStorage.getItem('access_token')
        : null;

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError<ErrorResponse>) => {
    const originalRequest = error.config as any;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await axios.post<{ accessToken: string }>(
          `${API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        if (refreshResponse.data.accessToken) {
          sessionStorage.setItem(
            'access_token',
            refreshResponse.data.accessToken
          );

          originalRequest.headers.Authorization =
            `Bearer ${refreshResponse.data.accessToken}`;

          return api(originalRequest);
        }
      } catch {
        sessionStorage.removeItem('access_token');
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const getPublicPopular = async () => {
  const res = await fetch(`${BASE_URL}/public/popular`); 
  if (!res.ok) throw new Error('Failed to load popular posts');
  return res.json();
};

export const getPublicFeatured = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/public/featured`);
    if (!res.ok) throw new Error('Failed to fetch editor picks');
    return res.json();
  } catch (error) {
    console.error("Featured Fetch Error:", error);
    return { data: [] }; 
  }
};


export async function getPublicPostDetail(slug: string): Promise<ApiResponse<Post>> {
  try {
   
    const response = await api.get<ApiResponse<Post>>(`/public/post/${slug}`);
    return response.data;
  } catch (error) {
    console.error("Public Fetch Error:", error);
    throw error;
  }
}


export async function getTenantPublicPosts(
  options?: { page?: number; limit?: number }
): Promise<ApiResponse<{ posts: Post[] }>> { 
  try {
    const params = new URLSearchParams();
    if (options?.page) params.append('page', options.page.toString());
    if (options?.limit) params.append('limit', options.limit.toString());

    const response = await api.get<ApiResponse<{ posts: Post[] }>>(
      `/public${params.toString() ? `?${params.toString()}` : ''}`
    );

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    throw {
      success: false,
      message: axiosError.response?.data?.message || 'Failed to fetch public posts',
      error: axiosError.message,
      statusCode: axiosError.response?.status || 500,
    };
  }
}



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

    if (axiosError.response?.status === 422) {
      throw {
        message: 'Validation failed',
        statusCode: 422,
        details: axiosError.response.data.details,
      };
    }

    throw {
      message:
        axiosError.response?.data?.message || 'Failed to create post',
      statusCode: axiosError.response?.status || 500,
    };
  }
}

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
      message:
        axiosError.response?.data?.message || 'Failed to update post',
      error: axiosError.message,
    };
  }
}


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
      message:
        axiosError.response?.data?.message || 'Failed to delete post',
      error: axiosError.message,
    };
  }
}


export async function getUserPosts(
  token: string
): Promise<ApiResponse<Post[]>> {
  try {
    const response = await api.get<ApiResponse<Post[]>>('posts', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;

    throw new Error(
      axiosError.response?.data?.message || 'Failed to fetch posts'
    );
  }
}


export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
}



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
    }>(
      '/posts/thumbnail',
      formData, 
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    throw {
      message:
        axiosError.response?.data?.message ||
        'Failed to upload thumbnail',
      statusCode: axiosError.response?.status || 500,
    };
  }
}
export { api };

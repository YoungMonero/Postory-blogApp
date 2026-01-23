// src/types/posts.ts
export interface CreatePostDto {
  title: string;
  content: string;
  slug?: string; // Make optional, can generate on backend
  status?: 'draft' | 'published' | 'archived'; // Use union type
  thumbnail?: string; // Optional
  tags?: string[]; // Consider adding tags
}

export interface Post {
  _id: string; // Changed from number to string (MongoDB)
  title: string;
  content: string;
  slug: string;
  status: 'draft' | 'published' | 'archived';
  thumbnail?: string;
  tenantId?: string | number;
  authorId: string | number;
  author?: { // Consider adding author details
    id: string | number;
    name: string;
    email?: string;
  };
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  likes?: number;
  views?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreatePostResponse {
  post: Post;
  message: string;
}

export interface ErrorResponse {
  message: string;
  statusCode: number;
  error?: string;
  details?: Record<string, string[]>;
}
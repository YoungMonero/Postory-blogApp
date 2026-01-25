export interface Post {
  _id: string;
  title: string;
  content: string;
  slug: string;
  status: 'draft' | 'published';
  author?: string | { name: string; email?: string };
  thumbnail?: string;
  tags?: string[];
  excerpt?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
  likes?: number;
  views?: number;
}

export interface CreatePostDto {
  title: string;
  content: string;
  slug?: string;
  status: 'draft' | 'published';
  thumbnail?: string;
  tags?: string[];
  excerpt?: string;
  seoDescription?: string;
}

export interface ErrorResponse {
  success: boolean;
  message: string;
  error?: string;
}

export interface CreatePostResponse {
  success: boolean;
  message: string;
  data: Post; 
  seoDescription?: string;
  excerpt?: string;
}

export interface ApiResponse<T = any> {
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
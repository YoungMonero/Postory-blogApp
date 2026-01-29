import { api } from './post'; // Reuse your existing axios instance
import { Comment, CreateCommentDto } from '@/src/types/comment';

export const commentService = {
  // GET /posts/:postId/comments
  async getComments(postId: string): Promise<Comment[]> {
    const response = await api.get(`/posts/${postId}/comments`);
    return response.data;
  },

  // POST /posts/:postId/comments
  async addComment(postId: string, content: string): Promise<Comment> {
    const response = await api.post(`/posts/${postId}/comments`, { content });
    return response.data;
  },

  // POST /posts/:postId/like
  async toggleLike(postId: string): Promise<{ liked: boolean }> {
    const response = await api.post(`/posts/${postId}/like`);
    return response.data;
  }
};
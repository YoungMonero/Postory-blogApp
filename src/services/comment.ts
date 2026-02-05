import api from './api';
import { Comment } from '@/src/types/comment';

export const commentService = {
  async getComments(postId: string): Promise<Comment[]> {
    const response = await api.get(`/posts/${postId}/comments`);
    return response.data;
  },

  async addComment(postId: string, content: string): Promise<Comment> {
    const response = await api.post(`/posts/${postId}/comments`, { content });
    return response.data;
  },

  async toggleLike(postId: string): Promise<{ liked: boolean; likes: number }> {
    const response = await api.post(`/posts/${postId}/like`);
    return response.data;
  }
};
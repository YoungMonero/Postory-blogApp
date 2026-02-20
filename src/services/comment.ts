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

  async toggleLikeComment(postId: string, commentId: string): Promise<{ liked: boolean; likes: number }> {
    const response = await api.post(`/posts/${postId}/comments/${commentId}/like`);
    return response.data;
  },

  async deleteComment(postId: string, commentId: string): Promise<{ success: boolean; message: string }> {
    console.log("Full Request URL:", `${api.defaults.baseURL}/posts/${postId}/comments/${commentId}`);
    const response = await api.delete(`/posts/${postId}/comments/${commentId}`);
    return response.data;
  },

  async addReply(postId: string, commentId: string, content: string): Promise<Comment> {
    const response = await api.post(`/posts/${postId}/comments`, { 
      content, 
      parentCommentId: commentId 
    });
    return response.data;
  }
};
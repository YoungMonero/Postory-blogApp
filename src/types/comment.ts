export interface Comment {
  _id: string;
  postId: string;
  userId: string;
  authorName: string;
  authorRole: 'reader' | 'author'; 
  content: string;
  likes: number;
  likedBy: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommentDto {
  content: string;
}
export interface CreatePostDto{
    title: string;
    content: string;
    slug: string; 
    status: string;
    thumbnail: string
}

export interface Post {
    title: string;
    content: string;
    tenantId: number;
    authorId: number;
    publishedAt: string;
    createdAt: string;
    slug: string;
    _id: number
}
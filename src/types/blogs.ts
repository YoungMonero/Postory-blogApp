export interface CreateBlogDto {
  title: string;
  description: string;
}

export interface Blog {
  _id: string;
  title: string;
  slug: string;
  description: string;
  content?: string;
  coverImage?: string;   
  status?: string;      
  tags?: string[];       
  tenantId: string;
  authorId?: string;     
  createdAt: string;
  profileImage?: string;
}
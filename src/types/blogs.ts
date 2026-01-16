export interface CreateBlogDto {
  title: string;
  slug: string;
  description: string;
}

export interface Blog {
  _id: string;
  title: string;
  slug: string;
  description: string;
  tenantId: string;
  createdAt: string;
}

import { Blog, CreateBlogDto } from '@/src/types/blogs';

const API_URL = 'http://localhost:4000';

export async function getMyBlog(token: string): Promise<Blog | null> {
  const res = await fetch(`${API_URL}/blogs/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to fetch blog');
  }

  const data = await res.json().catch(() => null);
  return data?.blog ?? null;
}


export async function getBlogBySlug(slug: string, token: string): Promise<Blog | null> {

  const res = await fetch(`${API_URL}/tenants/slug/${slug}`, {
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json' 
    },
  });

  if (!res.ok) return null;

  const data = await res.json();
  return data?.blog ?? null; 
}

// export async function getPublicBlogBySlug(slug: string): Promise<Blog | null> {
//   const res = await fetch(`${API_URL}/tenants/slug/${slug}`, {
//     headers: { 
//       'Content-Type': 'application/json' 
//     },
//   });

//   if (!res.ok) return null;

//   const data = await res.json();
//   return data?.blog ?? null; 
// }


export async function createBlog(data: CreateBlogDto, token: string): Promise<Blog> {
  const res = await fetch(`${API_URL}/blogs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to create blog');
  }

  return res.json();
}
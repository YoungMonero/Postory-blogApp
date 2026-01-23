// // src/services/blogs.ts
// // import { Blog, CreateBlogDto } from '@/types/blogs';
// import { Blog, CreateBlogDto } from '@/types/blogs';

// const API_URL = 'http://localhost:4000';

// // Get the current user's blog
// export async function getMyBlog(token: string): Promise<Blog | null> {
//   const res = await fetch(`${API_URL}/blogs/me`, {
//     headers: { Authorization: `Bearer ${token}` },
//   });

//   if (res.status === 404) return null;
//   if (!res.ok) throw new Error('Failed to fetch blog');

//   return res.json();
// }

// // Create a new blog
// export async function createBlog(data: CreateBlogDto, token: string): Promise<Blog> {
//   const res = await fetch(`${API_URL}/blogs`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: `Bearer ${token}`,
//     },
//     body: JSON.stringify(data),
//   });

//   if (!res.ok) throw new Error('Failed to create blog');

//   return res.json();
// }


import { Blog, CreateBlogDto } from '@/types/blogs';

const API_URL = 'http://localhost:4000';

// Get the current user's blog
export async function getMyBlog(token: string): Promise<Blog | null> {
  const res = await fetch(`${API_URL}/blogs/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    // Try to parse error body if available
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to fetch blog');
  }

  // ✅ Always parse JSON safely
  const data = await res.json().catch(() => null);

  // Backend returns { blog: null } or { blog: {...} }
  return data?.blog ?? null;
}

// Create a new blog
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

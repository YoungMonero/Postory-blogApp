import React, { useState } from 'react';
import { CreatePostDto } from '@/src/types/posts';
import { generateSlug } from '@/src/services/post';
import { usePosts } from '@/src/hooks/usePosts'; // Import the hook

interface CreatePostFormProps {
  token: string | null; // Accept token to perform the action
}

const CreatePostForm: React.FC<CreatePostFormProps> = ({ token }) => {
  const { createNewPost, loading, error } = usePosts();
  const [formData, setFormData] = useState<CreatePostDto>({
    title: '',
    content: '',
    status: 'draft',
    thumbnail: '',
    slug: '',
    tags: [],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'title') {
      setFormData(prev => ({ ...prev, slug: generateSlug(value) }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    
    const success = await createNewPost(formData, token);
    if (success) {
      setFormData({ title: '', content: '', status: 'draft', thumbnail: '', slug: '', tags: [] });
      alert('Post created successfully!');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <input
        name="title"
        placeholder="Post Title"
        value={formData.title}
        onChange={handleInputChange}
        className="w-full p-2 border rounded"
        required
      />
      <textarea
        name="content"
        placeholder="Write your content..."
        value={formData.content}
        onChange={handleInputChange}
        className="w-full p-2 border rounded h-32"
        required
      />
      <button 
        type="submit" 
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-blue-300"
      >
        {loading ? 'Posting...' : 'Create Post'}
      </button>
    </form>
  );
};

export default CreatePostForm;
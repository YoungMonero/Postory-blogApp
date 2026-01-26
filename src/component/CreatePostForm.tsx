import React, { useState } from 'react';
import { CreatePostDto } from '@/src/types/posts';
import { usePosts } from '@/src/hooks/usePosts';
import { generateSlug } from '@/src/services/post';

interface CreatePostFormProps {
  token: string | null;
  onSuccess?: () => void;
}

const CreatePostForm: React.FC<CreatePostFormProps> = ({ token, onSuccess }) => {
  const { createNewPost, loading, error } = usePosts();
  const [formData, setFormData] = useState<CreatePostDto>({
    title: '',
    content: '',
    status: 'draft',
    thumbnail: '',
    slug: '',
    tags: [],
    excerpt: '',
    seoDescription: '',
  });
  
  const [tagInput, setTagInput] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: CreatePostDto) => ({ ...prev, [name]: value }));
    

    if (name === 'title') {
      const slug = generateSlug(value);
      setFormData((prev: CreatePostDto) => ({ ...prev, slug }));
    }
    

    if (name === 'content' && !formData.excerpt) {
      const excerpt = value.substring(0, 200).replace(/<[^>]*>/g, '').trim();
      setFormData((prev: CreatePostDto) => ({ ...prev, excerpt }));
    }
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !formData.tags?.includes(tag)) {
      setFormData((prev: CreatePostDto) => ({
        ...prev,
        tags: [...(prev.tags || []), tag]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev: CreatePostDto) => ({
      ...prev,
      tags: prev.tags?.filter((tag: string) => tag !== tagToRemove) || []
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Validate file type and size
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(selectedFile.type)) {
        alert('Please select a valid image file (JPEG, PNG, GIF, WebP)');
        return;
      }
      
      if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
        alert('File size must be less than 5MB');
        return;
      }
      
      setFile(selectedFile);
      

      const previewUrl = URL.createObjectURL(selectedFile);
      setFormData((prev: CreatePostDto) => ({ ...prev, thumbnail: previewUrl }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      alert('Please log in to create a post');
      return;
    }
    
    // Validate required fields
    if (!formData.title.trim()) {
      alert('Title is required');
      return;
    }
    
    if (!formData.content.trim()) {
      alert('Content is required');
      return;
    }
    
    setUploading(true);
    
    try {
      let thumbnailUrl = formData.thumbnail && formData.thumbnail.startsWith('http') ? formData.thumbnail : '';
      
      // If file is selected, upload it to backend
      if (file) {
        const fileFormData = new FormData();
        fileFormData.append('file', file);
        
        const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/uploads`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: fileFormData,
        });
        
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          thumbnailUrl = uploadData.url || uploadData.data?.url || '';
        } else {
          console.warn('File upload failed, proceeding without thumbnail');
        }
      }
      
      // Prepare final form data
      const finalFormData: CreatePostDto = {
        ...formData,
        thumbnail: thumbnailUrl,
        tags: formData.tags || [],
        // Auto-generate excerpt if empty, ensure it's at least 10 characters
        excerpt: formData.excerpt || formData.content.substring(0, 200).replace(/<[^>]*>/g, '').trim().substring(0, 500),
        seoDescription: formData.seoDescription || formData.content.substring(0, 160).replace(/<[^>]*>/g, '').trim(),
      };
      
      const result = await createNewPost(finalFormData, token);
      
      if (result) {
        // Reset form on success
        setFormData({
          title: '',
          content: '',
          status: 'draft',
          thumbnail: '',
          slug: '',
          tags: [],
          excerpt: '',
          seoDescription: '',
        });
        setTagInput('');
        setFile(null);
        
        if (onSuccess) {
          onSuccess();
        } else {
          alert('Post created successfully!');
        }
      } else {
        alert('Failed to create post. Please try again.');
      }
    } catch (error: any) {
      console.error('Error creating post:', error);
      alert(`Error: ${error?.message || 'Failed to create post'}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Create New Post</h2>
      
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
          <p className="font-medium">Error:</p>
          <p className="text-sm">{error}</p>
        </div>
      )}
      
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title *
        </label>
        <input
          name="title"
          type="text"
          placeholder="Enter post title"
          value={formData.title}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          required
        />
      </div>
      
      {/* Slug (auto-generated, editable) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Slug
        </label>
        <input
          name="slug"
          type="text"
          placeholder="Post URL slug"
          value={formData.slug}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        />
        <p className="mt-1 text-sm text-gray-500">
          This will be used in the post URL. Auto-generated from title.
        </p>
      </div>
      
      {/* Status */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Status
        </label>
        <div className="flex gap-4">
          {['draft', 'published'].map((status) => (
            <label key={status} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="status"
                value={status}
                checked={formData.status === status}
                onChange={handleInputChange}
                className="mr-2 text-blue-600 focus:ring-blue-500"
              />
              <span className="capitalize">{status}</span>
            </label>
          ))}
        </div>
      </div>
      
      {/* Thumbnail Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Thumbnail Image (optional)
        </label>
        <div className="space-y-3">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          <p className="text-xs text-gray-500">
            Note: File uploads are for preview only. To use a thumbnail, please provide a valid image URL in the field below.
          </p>
          
          {/* Thumbnail URL Input */}
          <input
            type="url"
            name="thumbnail"
            placeholder="https://example.com/image.jpg"
            value={formData.thumbnail && !formData.thumbnail.startsWith('blob') ? formData.thumbnail : ''}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md text-sm"
          />
          
          {/* Thumbnail Preview */}
          {formData.thumbnail && (
            <div className="mt-2">
              <p className="text-sm text-gray-600 mb-2">Preview:</p>
              <div className="relative w-48 h-32 border rounded-md overflow-hidden">
                <img 
                  src={formData.thumbnail} 
                  alt="Thumbnail preview" 
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setFormData((prev: CreatePostDto) => ({ ...prev, thumbnail: '' }));
                    setFile(null);
                  }}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tags
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            placeholder="Add a tag (press Enter or comma)"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagInputKeyDown}
            className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
          <button
            type="button"
            onClick={addTag}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            Add
          </button>
        </div>
        
        {/* Tags Display */}
        {formData.tags && formData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.tags.map((tag: string, index: number) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
      
      {/* Excerpt */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Excerpt
          <span className="ml-1 text-xs text-gray-500">(optional)</span>
        </label>
        <textarea
          name="excerpt"
          placeholder="Short summary of your post"
          value={formData.excerpt}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors h-24"
        />
        <p className="mt-1 text-sm text-gray-500">
          {formData.excerpt ? `${formData.excerpt.length}/500 characters` : 'Auto-generated from content if empty'}
        </p>
      </div>
      
      {/* SEO Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          SEO Description
          <span className="ml-1 text-xs text-gray-500">(optional)</span>
        </label>
        <textarea
          name="seoDescription"
          placeholder="Description for search engines"
          value={formData.seoDescription}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors h-24"
        />
        <p className="mt-1 text-sm text-gray-500">
          {formData.seoDescription ? `${formData.seoDescription.length}/160 characters` : 'Auto-generated from content if empty'}
        </p>
      </div>
      
      {/* Content */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Content *
        </label>
        <textarea
          name="content"
          placeholder="Write your post content here..."
          value={formData.content}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors min-h-[200px]"
          required
        />
      </div>
      
      {/* Submit Button */}
      <div className="pt-4 border-t border-gray-200">
        <button 
          type="submit" 
          disabled={loading || uploading || !token}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          {loading || uploading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {uploading ? 'Uploading...' : 'Creating Post...'}
            </span>
          ) : 'Create Post'}
        </button>
        
        {!token && (
          <p className="mt-2 text-sm text-red-600 text-center">
            You must be logged in to create a post.
          </p>
        )}
      </div>
    </form>
  );
};

export default CreatePostForm;
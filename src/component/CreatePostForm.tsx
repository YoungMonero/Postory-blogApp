import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { CreatePostDto } from '@/src/types/posts';
import { usePosts } from '@/src/hooks/usePosts';
import { generateSlug } from '@/src/services/post';
import { 
  ArrowLeft, Globe, Settings, Image as ImageIcon, 
  Tag, FileText, CheckCircle, Bold, Italic, 
  List, Heading1, Heading2, Quote, Save, Eye
} from 'lucide-react';

interface CreatePostFormProps {
  token: string | null;
  onSuccess?: () => void;
}

const CreatePostForm: React.FC<CreatePostFormProps> = ({ token, onSuccess }) => {
  const { createNewPost, loading, error: backendError } = usePosts();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  const [formData, setFormData] = useState<CreatePostDto>({
    title: '',
    content: '',
    status: 'draft',
    thumbnail: '',
    slug: '',
    tags: ['General'],
    excerpt: '',
    seoDescription: '',
  });

  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[500px] px-6 py-8 text-gray-700',
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const plainText = editor.getText().trim();
      setFormData(prev => ({ 
        ...prev, 
        content: html,
        excerpt: prev.excerpt.length < 5 ? plainText.substring(0, 150) : prev.excerpt,
        seoDescription: prev.seoDescription.length < 5 ? plainText.substring(0, 160) : prev.seoDescription
      }));
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'title') {
      setFormData(prev => ({ ...prev, slug: generateSlug(value) }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setFormData(prev => ({ ...prev, thumbnail: URL.createObjectURL(selectedFile) }));
    }
  };

  const handleSubmit = async (publishStatus: 'draft' | 'published') => {
    if (!token) return alert('Please log in');

    const finalTags = formData.tags && formData.tags.length > 0 
  ? formData.tags 
  : ['General'];
    
    const latestContent = editor?.getHTML() || "";
    const plainText = editor?.getText() || "";

    if (!formData.title.trim()) return alert("Title is required");
    if (!latestContent || latestContent === '<p></p>') return alert("Content is required");

    setUploading(true);
    try {
      let finalThumbnail = "";

      if (file) {
        const fileFormData = new FormData();
        fileFormData.append('file', file);
        const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/uploads`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: fileFormData,
        });
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          finalThumbnail = uploadData.url || uploadData.data?.url;
        }
      } else if (formData.thumbnail && formData.thumbnail.startsWith('http')) {
        finalThumbnail = formData.thumbnail;
      }

      let finalSeo = formData.seoDescription.trim();
      if (finalSeo.length < 20) {
        finalSeo = `${formData.title}: ${plainText}`.substring(0, 160);
      }

      const payload: CreatePostDto = { 
        ...formData, 
        status: publishStatus,
        content: latestContent,
        tags: finalTags,
        thumbnail: finalThumbnail || undefined, // FIX: Logic preserved
        excerpt: formData.excerpt || plainText.substring(0, 150),
        seoDescription: finalSeo
      };

      const result = await createNewPost(payload, token);
      
      if (result) {
        setLastSaved(new Date());
        if (publishStatus === 'published') {
            alert("Success! Post is live.");
            setFormData({ title: '', content: '', status: 'draft', thumbnail: '', slug: '', tags: [], excerpt: '', seoDescription: '' });
            editor?.commands.setContent('');
            setFile(null);
            if (onSuccess) onSuccess();
        }
      }
    } catch (err) {
      console.error("Publishing Error:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Restored Header with full Save/Publish logic */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200 h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <button className="p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div className="h-6 w-px bg-gray-200 hidden sm:block"></div>
          <div>
             <h1 className="text-sm font-bold text-gray-900 leading-none">{formData.title || 'New Draft'}</h1>
             <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                {lastSaved ? `Saved ${lastSaved.toLocaleTimeString()}` : 'Unsaved changes'}
                {(loading || uploading) && <span className="animate-pulse text-indigo-500 ml-1 font-medium italic">Saving...</span>}
             </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => handleSubmit('draft')} 
            className="hidden sm:flex text-sm font-semibold text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-lg transition-colors"
          >
            Save Draft
          </button>
          <button 
            onClick={() => handleSubmit('published')} 
            disabled={loading || uploading} 
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg text-sm font-bold shadow-sm transition-all active:scale-95"
          >
            {formData.status === 'published' ? 'Update' : 'Publish'}
            {formData.status === 'published' ? <CheckCircle size={16} /> : <Globe size={16} />}
          </button>
        </div>
      </header>

      <div className="flex-1 max-w-[1600px] mx-auto w-full p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
          
          {/* Main Editor Card */}
          <div className="lg:col-span-8 flex flex-col gap-6">
             <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col min-h-[calc(100vh-200px)]">
                
                {/* Cover Image Area */}
                <div className="relative group bg-gray-50 border-b border-gray-100 min-h-[60px]">
                    {formData.thumbnail ? (
                        <div className="relative aspect-[21/9] w-full overflow-hidden">
                            <img src={formData.thumbnail} className="w-full h-full object-cover" alt="Cover" />
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <label className="bg-white text-gray-900 px-4 py-2 rounded-lg text-xs font-bold cursor-pointer hover:bg-gray-50 transition-colors">
                                    Change Cover
                                    <input type="file" className="hidden" onChange={handleFileChange} />
                                </label>
                            </div>
                        </div>
                    ) : (
                       <div className="p-4 flex justify-start">
                          <label className="flex items-center gap-2 text-gray-400 hover:text-gray-600 px-3 py-1.5 rounded-md hover:bg-gray-100 transition-all text-sm font-medium cursor-pointer">
                             <ImageIcon size={16} />
                             Add Cover Image
                             <input type="file" className="hidden" onChange={handleFileChange} />
                          </label>
                       </div>
                    )}
                </div>

                <div className="px-6 pt-8 pb-2">
                    <input 
                      type="text" 
                      name="title" 
                      value={formData.title} 
                      onChange={handleInputChange} 
                      placeholder="Post Title" 
                      className="w-full text-4xl md:text-5xl font-extrabold text-gray-900 placeholder-gray-200 border-none p-0 focus:ring-0 bg-transparent leading-tight tracking-tight" 
                    />
                </div>

                {/* Full Restored Toolbar */}
                <div className="flex items-center gap-1 border-y border-gray-100 px-6 py-2 bg-white sticky top-0 z-20">
                    <ToolbarButton onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()} active={editor?.isActive('heading', { level: 1 })} icon={<Heading1 size={18}/>} />
                    <ToolbarButton onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} active={editor?.isActive('heading', { level: 2 })} icon={<Heading2 size={18}/>} />
                    <div className="w-px h-6 bg-gray-200 mx-2" />
                    <ToolbarButton onClick={() => editor?.chain().focus().toggleBold().run()} active={editor?.isActive('bold')} icon={<Bold size={18}/>} />
                    <ToolbarButton onClick={() => editor?.chain().focus().toggleItalic().run()} active={editor?.isActive('italic')} icon={<Italic size={18}/>} />
                    <ToolbarButton onClick={() => editor?.chain().focus().toggleBulletList().run()} active={editor?.isActive('bulletList')} icon={<List size={18}/>} />
                    <ToolbarButton onClick={() => editor?.chain().focus().toggleBlockquote().run()} active={editor?.isActive('blockquote')} icon={<Quote size={18}/>} />
                </div>

                <EditorContent editor={editor} className="flex-1" />
             </div>
          </div>

          {/* Sidebar Settings */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 space-y-6">
                <h3 className="font-bold text-gray-900 flex items-center gap-2 pb-3 border-b border-gray-100">
                    <Settings size={18} />
                    Post Settings
                </h3>

                {/* Restored Full Category List */}
                <div className="space-y-3">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Tag size={14} /> Category
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {['General', 'Coding', 'Technology', 'Lifestyle', 'Food', 'Travel', 'Sports'].map((cat) => (
                            <button 
                                key={cat} 
                                type="button" 
                                onClick={() => setFormData(p => ({...p, tags: [cat]}))} 
                                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                                    formData.tags?.includes(cat) 
                                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Globe size={14} /> URL Slug
                    </label>
                    <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus-within:ring-1 focus-within:ring-indigo-500 transition-all">
                        <span className="text-gray-400 text-xs mr-1">/blog/</span>
                        <input name="slug" value={formData.slug} onChange={handleInputChange} className="bg-transparent border-none p-0 text-sm text-gray-600 focus:ring-0 w-full font-medium" />
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <CheckCircle size={14} /> SEO Snippet
                    </label>
                    <textarea 
                        name="seoDescription" 
                        value={formData.seoDescription} 
                        onChange={handleInputChange} 
                        rows={3} 
                        className="w-full rounded-lg border-gray-200 text-sm p-3 bg-gray-50/50 focus:bg-white focus:ring-1 focus:ring-indigo-500 transition-all" 
                        placeholder="Meta description for search results..." 
                    />
                    <p className={`text-[10px] font-bold text-right ${formData.seoDescription.length < 20 ? 'text-red-400' : 'text-green-500'}`}>
                        {formData.seoDescription.length} / Min 20 chars
                    </p>
                </div>
            </div>

            {/* Restored Preview Card Mockup */}
            <div className="bg-indigo-50 rounded-xl border border-indigo-100 p-5">
                <h4 className="font-bold text-indigo-900 mb-2">Ready to share?</h4>
                <p className="text-sm text-indigo-700 mb-4">
                    Your post is currently a <strong>draft</strong>.
                </p>
                <button className="w-full bg-white text-indigo-600 hover:bg-indigo-50 border-indigo-200 border py-2 px-4 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm">
                    <Eye size={16} /> Preview Post
                </button>
            </div>

            {backendError && (
              <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-xs font-bold text-red-600 uppercase flex items-center gap-2">
                <Save size={14} /> Sync Error: {backendError}
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
};

const ToolbarButton = ({ onClick, active, icon }: any) => (
  <button 
    type="button" 
    onClick={onClick} 
    className={`p-2 rounded-md transition-all ${active ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-900'}`}
  >
    {icon}
  </button>
);

export default CreatePostForm;
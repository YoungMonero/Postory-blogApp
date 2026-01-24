import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { DashboardLayout } from '@/src/component/DashboardLayout';
import { Button } from '@/src/component/ui/button';
import { getToken } from '@/src/services/auth-storage';
import { useMutation } from '@tanstack/react-query';
import { Image as ImageIcon, Send } from 'lucide-react';

export default function CreatePostPage() {
    const router = useRouter();
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const t = getToken();
        if (!t) router.push('/login');
        else setToken(t);
    }, [router]);

    const [form, setForm] = useState({
        title: '',
        content: '',
        category: 'Coding',
    });

    const mutation = useMutation({
        mutationFn: async (data: typeof form) => {
            // Placeholder for your post creation service
            console.log("Creating post...", data);
            return { success: true };
        },
        onSuccess: () => {
            router.push('/dashboard');
        }
    });

    return (
        <DashboardLayout>
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-black tracking-tighter text-gray-900">
                        CREATE <span className="text-primary">POST</span>
                    </h1>
                    <Button 
                        onClick={() => mutation.mutate(form)}
                        isLoading={mutation.isPending}
                        className="rounded-full px-8"
                    >
                        Publish
                    </Button>
                </div>

                <div className="space-y-6">
                    {/* Title Input */}
                    <input
                        type="text"
                        placeholder="New post title here..."
                        className="w-full text-4xl font-bold placeholder:text-gray-200 outline-none border-none focus:ring-0 bg-transparent"
                        value={form.title}
                        onChange={(e) => setForm({...form, title: e.target.value})}
                    />

                    {/* Category Selector */}
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {['Coding', 'Style', 'Food', 'Travel'].map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setForm({...form, category: cat})}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                                    form.category === cat 
                                    ? 'bg-primary text-white' 
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Content Area */}
                    <textarea
                        placeholder="Write your story..."
                        className="w-full min-h-[400px] text-lg text-gray-700 placeholder:text-gray-300 outline-none border-none focus:ring-0 bg-transparent resize-none"
                        value={form.content}
                        onChange={(e) => setForm({...form, content: e.target.value})}
                    />
                </div>
            </div>
        </DashboardLayout>
    );
}
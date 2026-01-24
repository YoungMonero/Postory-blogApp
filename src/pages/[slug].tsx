import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import { getBlogBySlug } from '@/src/services/blogs';
import { DashboardLayout } from '@/src/component/DashboardLayout';
import { useAuth } from '../hooks/useAuth';
import { User, Calendar, Share2 } from 'lucide-react';

export default function PublicBlogProfile() {
  const router = useRouter();
  const { slug } = router.query;
  const { token } = useAuth();

  const { data: blog, isLoading, isError } = useQuery({
    queryKey: ['public-blog', slug],
    queryFn: () => getBlogBySlug(slug as string, token as string),
    enabled: !!slug && !!token,
  });

  if (isLoading) return <DashboardLayout><p className="animate-pulse text-gray-400">Loading Wordoo Profile...</p></DashboardLayout>;
  
  if (isError || !blog) return (
    <DashboardLayout>
      <div className="text-center py-20">
        <h1 className="text-2xl font-black text-gray-900 tracking-tighter">BLOG NOT FOUND</h1>
        <p className="text-gray-500 mt-2">The Wordoo profile you're looking for doesn't exist.</p>
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>

        <div className="max-w-5xl mx-auto">
             <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">{blog.title}</h1>
             <p className="mt-4 text-gray-600 text-lg leading-relaxed">{blog.description}</p>
        </div>
    </DashboardLayout>
  );
}
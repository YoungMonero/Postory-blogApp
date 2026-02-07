import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import { getPostById } from '@/src/services/post'; 
import CreatePostForm from '@/src/component/CreatePostForm';
import { DashboardLayout } from '@/src/component/DashboardLayout';
import { useAuth } from '@/src/hooks/useAuth';

export default function EditPostPage() {
  const router = useRouter();
  const { token } = useAuth(); 
  const { id } = router.query;

  const { data: post, isLoading } = useQuery({
    queryKey: ['post', id],
    queryFn: () => getPostById(id as string),
    enabled: !!id && !!token, 
  });

  if (isLoading || !token) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto py-10">
        <h1 className="text-2xl font-black text-gray-900 mb-6 uppercase tracking-tight">Edit Draft</h1>
        <CreatePostForm 
          token={token} 
          initialData={post} 
          isEditing={true} 
        />
      </div>
    </DashboardLayout>
  );
}
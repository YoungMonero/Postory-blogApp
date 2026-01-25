import { useQuery } from '@tanstack/react-query';
import { getToken } from '@/src/services/auth-storage';
import { getMyBlog } from '@/src/services/blogs';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/src/component/DashboardLayout';

export default function DashboardPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const t = getToken();
    if (!t) {
      router.push('/login');
    } else {
      setToken(t);
    }
  }, [router]);


  const getCategoryColor = (cat: string | undefined) => {
    switch(cat?.toLowerCase()) {
      case 'coding': return 'bg-purple-100 text-purple-700 hover:bg-purple-200';
      case 'style': return 'bg-blue-100 text-blue-700 hover:bg-blue-200';
      case 'food': return 'bg-green-100 text-green-700 hover:bg-green-200';
      case 'culture': return 'bg-orange-100 text-orange-700 hover:bg-orange-200';
      case 'travel': return 'bg-rose-100 text-rose-700 hover:bg-rose-200';
      case 'fashion': return 'bg-pink-100 text-pink-700 hover:bg-pink-200';
      default: return 'bg-gray-100 text-gray-700 hover:bg-gray-200';
    }
  };

const categories = [
    { name: 'Fashion', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=100&q=80', color: 'bg-pink-50' },
    { name: 'Food', image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=100&q=80', color: 'bg-green-50' },
    { name: 'Coding', image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=100&q=80', color: 'bg-purple-50' },
    { name: 'Style', image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=100&q=80', color: 'bg-blue-50' }, 
    { name: 'Travel', image: 'https://images.unsplash.com/photo-1541849546-216549ae216d?auto=format&fit=crop&w=100&q=80', color: 'bg-rose-50' },
    { name: 'Culture', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=100&q=80', color: 'bg-orange-50' },
  ];

  const { data: blog, isLoading, isError } = useQuery({
    queryKey: ['my-blog'],
    queryFn: () => getMyBlog(token as string),
    enabled: !!token,
  });

  if (!token || isLoading) {
    return (
      <DashboardLayout>
        <p className="text-gray-500">Loading...</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-12">
        
        {/* Top Categories Section (Added exactly as sent) */}
        <section className="mb-16 w-full max-w-8xl">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-5 max-w-8xl">
            {categories.map((cat) => (
              <button 
                key={cat.name} 
                className={`flex items-center gap-3 p-3 rounded-xl transition-all hover:-translate-y-1 hover:shadow-md ${cat.color}`}
              >
                <div className=" w-10 h-10 rounded-full overflow-hidden shrink-0 border-2 border-white shadow-sm">
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                </div>
                <span className="font-semibold text-gray-800 text-sm">{cat.name}</span>
              </button>
            ))}
          </div>
        </section>

       
        <div className="max-w-4xl mx-auto">
          
        </div>

      </div>
    </DashboardLayout>
  );
}
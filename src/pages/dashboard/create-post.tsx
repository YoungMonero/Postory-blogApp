import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { DashboardLayout } from '@/src/component/DashboardLayout';
import { getToken } from '@/src/services/auth-storage';
import CreatePostForm from '@/src/component/CreatePostForm';

export default function CreatePostPage() {
    const router = useRouter();
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const t = getToken();
        if (!t) router.push('/login');
        else setToken(t);
    }, [router]);

    return (
        <DashboardLayout>
            <CreatePostForm 
                token={token} 
                onSuccess={() => router.push('/dashboard')} 
            />
        </DashboardLayout>
    );
}
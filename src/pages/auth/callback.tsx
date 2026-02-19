import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth'; // Double check this path matches your folder structure

export default function AuthCallback() {
  const router = useRouter();
  const { login } = useAuth(); // Grab the login function from Context

  useEffect(() => {
    // 1. Wait for Next.js router to be ready
    if (!router.isReady) return;

    // 2. Get the token from the URL
    const { token } = router.query;

    if (token && typeof token === 'string') {
      console.log("Authentication successful, initializing session...");
      
      // 3. This calls your service's setToken (Cookies) AND updates Context state
      login(token); 

      // 4. Redirect to dashboard
      router.replace('/dashboard');
    } else {
      console.error("No token found in callback URL");
      router.replace('/login?error=no_token');
    }
  }, [router.isReady, router.query, login]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      <p className="mt-4 text-gray-600 font-medium">Finalizing your login...</p>
    </div>
  );
}
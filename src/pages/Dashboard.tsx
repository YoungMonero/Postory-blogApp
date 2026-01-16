// pages/dashboard.tsx
import { useAuth } from '../hooks/useAuth';

export default function Dashboard() {
  const { userName, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">
        Welcome back, {userName} 👋
      </h1>

      <button
        onClick={logout}
        className="px-4 py-2 bg-red-500 text-white rounded"
      >
        Logout
      </button>
    </div>
  );
}

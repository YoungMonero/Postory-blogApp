// src/pages/index.tsx
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-4xl font-bold mb-8">Welcome to Postory Blog</h1>
      <div className="space-x-4">
        <Link href="/register">
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Register
          </button>
        </Link>
        <Link href="/login">
          <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
            Login
          </button>
        </Link>
      </div>
    </div>
  );
}

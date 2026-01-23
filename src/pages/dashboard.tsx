// src/pages/dashboard/index.tsx
import { DashboardLayout } from '@/src/component/DashboardLayout';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <header>
          <h1 className="text-3xl font-bold text-gray-900">Your Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage your blog and posts</p>
        </header>

        <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center">
          <h3 className="text-lg font-medium text-gray-900">No blog found</h3>
          <p className="text-gray-500 mb-6">You haven't set up your blog yet. Create one to start writing!</p>
          <Link
            href="/dashboard/create-blog"
            className="inline-block bg-primary text-white px-6 py-2.5 rounded-full font-medium shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
          >
            Create My Blog
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
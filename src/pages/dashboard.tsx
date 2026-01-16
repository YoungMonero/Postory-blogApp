import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="max-w-4xl mx-auto mt-10 p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <Link
        href="/dashboard/create-blog"
        className="inline-block bg-blue-600 text-white px-4 py-2 rounded"
      >
        Create Blog
      </Link>
    </div>
  );
}

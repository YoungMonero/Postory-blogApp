'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { getPublicFeatured } from '@/src/services/post';

const EditorsPick = () => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPublicFeatured()
      .then(res => {
        setFeatured(res.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading || featured.length === 0) return null;

  return (
    <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-xl">
      <h3 className="flex items-center gap-2 font-black uppercase text-[10px] tracking-[0.2em] mb-4 text-indigo-200">
        <Star size={14} className="fill-indigo-300 text-indigo-300" /> 
        Editor's Pick
      </h3>
      
      <div className="space-y-5">
        {featured.map((post: any) => (
          <Link 
            key={post.id} 
            href={`/posts/${post.slug}`} 
            className="block group border-b border-indigo-500/50 pb-4 last:border-0 last:pb-0"
          >
            <h4 className="font-bold text-sm leading-snug group-hover:text-indigo-200 transition-colors">
              {post.title}
            </h4>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[10px] font-medium text-indigo-300">
                By {post.author?.displayName}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default EditorsPick;
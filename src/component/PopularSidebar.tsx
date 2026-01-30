'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Post } from '@/src/types/posts';
import { getPublicPopular} from '@/src/services/post'; 

const PopularSidebar: React.FC = () => {
  const [popular, setPopular] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  setLoading(true);
  getPublicPopular()
    .then((response) => {
      console.log("Popular Data Received:", response);
      setPopular(response.data || []);
      setLoading(false); 
    })
    .catch((err) => {
      console.error("Popular Fetch Error:", err);
      setLoading(false); 
    });
}, []);

  if (loading) return <div className="p-6 text-gray-400 text-xs font-bold animate-pulse">Loading Popular...</div>;
  if (popular.length === 0) return null; 

  return (
    <aside className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      <h3 className="font-black uppercase text-xs tracking-widest mb-6 text-gray-900 flex items-center gap-2">
        <span className="text-orange-500">🔥</span> Most Popular
      </h3>
      
      <div className="space-y-6">
        {popular.map((post, index) => {
          const identifier = post.slug || post.id || post._id;
          return (
            <Link 
              href={`/posts/${identifier}`} 
              key={(post.id || post._id) as string} 
              className="group flex gap-4 items-start"
            >
              {/* Ranking Number */}
              <span className="text-3xl font-black text-gray-100 group-hover:text-indigo-100 transition-colors leading-none">
                {index + 1 < 10 ? `0${index + 1}` : index + 1}
              </span>
              
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-gray-800 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-tight">
                  {post.title}
                </h4>
                <div className="flex items-center gap-2">
                   <span className="text-[10px] text-gray-400 font-black uppercase tracking-tighter">
                    {post.likes || 0} Likes
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </aside>
  );
};

export default PopularSidebar;
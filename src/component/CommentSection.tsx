"use client";
import React, { useState, useEffect } from 'react';
import { commentService } from '@/src/services/comment';
import { Comment } from '@/src/types/comment';
import { MessageSquare, Send, User, Heart } from 'lucide-react';
import { format } from 'date-fns';
export default function CommentSection({ postId, token }: { postId: string, token: string | null }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState('');
  

  // Load comments on mount
  useEffect(() => {
    const fetchComments = async () => {
      if (!postId) return;
      try {
        const data = await commentService.getComments(postId);
        setComments(data);
      } catch (err) { 
        console.error("Error fetching comments:", err); 
      }
    };
    fetchComments();
  }, [postId]);

  const handlePost = async () => {
    if (!text.trim() || !token) return;
    try {
      const newComment = await commentService.addComment(postId, text);
      // Backend returns the new comment object, add it to the top of the list
      setComments([newComment, ...comments]); 
      setText('');
    } catch (err) { 
      alert("Failed to post comment. Make sure you are logged in."); 
    }
  };

  return (
    <div className="mt-20 max-w-2xl mx-auto space-y-10 border-t border-gray-100 pt-16">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-black text-gray-900 tracking-tight">
          Comments ({comments.length})
        </h3>
      </div>

      {token ? (
        <div className="flex gap-4 items-start bg-gray-50 p-4 rounded-2xl border border-gray-100 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
           <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white shrink-0 font-bold">
            {/* Replace with actual user initials if available */}
            <User size={18} />
          </div>
          <div className="flex-1 space-y-3">
            <textarea 
              value={text} 
              onChange={(e) => setText(e.target.value)}
              className="w-full bg-transparent border-none focus:ring-0 text-gray-700 placeholder-gray-400 text-sm resize-none outline-none"
              placeholder="What are your thoughts?"
              rows={2}
            />
            <div className="flex justify-end">
              <button 
                onClick={handlePost} 
                disabled={!text.trim()}
                className="bg-black text-white px-5 py-2 rounded-full text-xs font-bold hover:bg-zinc-800 disabled:opacity-30 transition-all"
              >
                Respond
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-gray-50 rounded-xl text-center border border-dashed border-gray-200">
          <p className="text-gray-500 text-sm">Sign in to leave a response</p>
        </div>
      )}

      {/* COMMENT FEED */}
      <div className="space-y-8">
        {comments.map((c) => (
          <div key={c._id} className="group">
            <div className="flex gap-4">
              <div className="w-9 h-9 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                {c.authorName?.[0]}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900 text-sm">{c.authorName}</span>
                  <span className="text-xs text-gray-400">
                    {format(new Date(c.createdAt), 'MMM d')}
                  </span>
                </div>
                <p className="text-gray-700 text-[15px] leading-relaxed font-light">{c.content}</p>
                <div className="pt-2 flex items-center gap-4">
                    <button className="text-gray-400 hover:text-gray-900 transition-colors">
                        <Heart size={14} />
                    </button>
                    <button className="text-xs font-bold text-gray-400 hover:text-gray-900">Reply</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
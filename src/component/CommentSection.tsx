"use client";
import React, { useState, useEffect } from 'react';
import { commentService } from '@/src/services/comment';
import { Comment } from '@/src/types/comments';
import { MessageSquare, Send, User } from 'lucide-react';

export default function CommentSection({ postId, token }: { postId: string, token: string | null }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState('');

  // Load comments on mount
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const data = await commentService.getComments(postId);
        setComments(data);
      } catch (err) { console.error(err); }
    };
    fetchComments();
  }, [postId]);

  const handlePost = async () => {
    if (!text.trim() || !token) return;
    try {
      const newComment = await commentService.addComment(postId, text);
      setComments([newComment, ...comments]); // Update list immediately
      setText('');
    } catch (err) { alert("Failed to post comment"); }
  };

  return (
    <div className="mt-12 space-y-8">
      <h3 className="text-xl font-bold flex items-center gap-2">
        <MessageSquare size={20} /> Discussion
      </h3>

      {token ? (
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
          <textarea 
            value={text} 
            onChange={(e) => setText(e.target.value)}
            className="w-full bg-transparent border-none focus:ring-0 text-sm"
            placeholder="Write a comment..."
          />
          <button onClick={handlePost} className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 ml-auto">
            Post Comment <Send size={14} />
          </button>
        </div>
      ) : (
        <p className="text-sm text-gray-500 italic">Please login to comment.</p>
      )}

      <div className="space-y-6">
        {comments.map((c) => (
          <div key={c._id} className="flex gap-4">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"><User size={16}/></div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm">{c.authorName}</span>
                <span className="text-[10px] text-gray-400">{new Date(c.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="text-gray-600 text-sm mt-1">{c.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
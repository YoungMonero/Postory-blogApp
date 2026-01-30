"use client";
import React, { useState, useEffect } from 'react';
import { commentService } from '@/src/services/comment';
import { Comment } from '@/src/types/comment';
import { MessageSquare, Send, User } from 'lucide-react';

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
    <div className="mt-12 space-y-8 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
      <h3 className="text-2xl font-black text-gray-900 flex items-center gap-2">
        <MessageSquare className="text-indigo-600" /> Discussion
      </h3>

      {token ? (
        <div className="space-y-4">
          <textarea 
            value={text} 
            onChange={(e) => setText(e.target.value)}
            className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl transition-all text-sm outline-none"
            placeholder="What are your thoughts?"
            rows={3}
          />
          <div className="flex justify-end">
            <button 
              onClick={handlePost} 
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 transition-all shadow-md shadow-indigo-100"
            >
              Post Comment <Send size={16} />
            </button>
          </div>
        </div>
      ) : (
        <div className="p-6 bg-indigo-50 rounded-2xl border border-indigo-100 text-center">
          <p className="text-indigo-900 font-bold text-sm">Log in to join the conversation!</p>
        </div>
      )}

      <div className="space-y-6 pt-6">
        {comments.length === 0 ? (
          <p className="text-gray-400 text-center py-4 italic text-sm">No comments yet.</p>
        ) : (
          comments.map((c) => (
            <div key={c._id} className="flex gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors">
              <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-black">
                {c.authorName?.[0] || 'U'}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-gray-900 text-sm">{c.authorName}</span>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{c.content}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
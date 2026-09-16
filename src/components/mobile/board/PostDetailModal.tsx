import React, { useEffect, useState } from 'react';
import type { Post, PostComment } from '../../../types';
import { useApp } from '../../../context/AppContext';
import { supabaseBoard } from '../../../lib/supabase';
import { Heart, MessageSquare, Send, Sparkles, X, User } from 'lucide-react';

interface PostDetailModalProps {
  post: Post | null;
  onClose: () => void;
  onPostUpdated: () => void;
}

export const PostDetailModal: React.FC<PostDetailModalProps> = ({ post, onClose, onPostUpdated }) => {
  const { user } = useApp();
  const [comments, setComments] = useState<PostComment[]>([]);
  const [newCommentText, setNewCommentText] = useState('');

  useEffect(() => {
    if (post) {
      const fetched = supabaseBoard.getComments(post.id);
      setComments(fetched);
    }
  }, [post]);

  if (!post) return null;

  const handleToggleLike = () => {
    supabaseBoard.toggleLike(post.id);
    onPostUpdated();
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const updated = supabaseBoard.addComment(post.id, {
      postId: post.id,
      authorId: user.id,
      authorNickname: user.nickname,
      authorDepartment: user.department,
      authorAvatar: user.profileImage,
      content: newCommentText,
    });

    setComments(updated);
    setNewCommentText('');
    onPostUpdated();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col relative max-h-[90vh] overflow-y-auto animate-scaleUp">
        {/* Top Sticky Header */}
        <div className="sticky top-0 z-10 p-4 bg-white border-b border-slate-100 flex items-center justify-between">
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
            {post.categoryName}
          </span>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4">
          {/* Author Meta */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-700 overflow-hidden shrink-0 flex items-center justify-center text-white">
              {post.authorAvatar ? (
                <img src={post.authorAvatar} alt={post.authorNickname} className="w-full h-full object-cover" />
              ) : (
                <User className="w-5 h-5" />
              )}
            </div>

            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-xs text-slate-800">{post.authorNickname}</span>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold">
                  {post.authorGrade}
                </span>
              </div>
              <span className="text-[11px] text-slate-400 block">
                {post.authorUniversity} {post.authorDepartment}
              </span>
            </div>
          </div>

          {/* Eco Challenge Tag Pill (if present) */}
          {post.challengeTag && (
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs font-bold text-emerald-900">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                {post.challengeTag}
              </span>
              {post.carbonSavedTag && (
                <span className="font-mono text-emerald-700">-{post.carbonSavedTag}kg CO₂e</span>
              )}
            </div>
          )}

          {/* Title & Body Text */}
          <div className="space-y-2">
            <h2 className="text-base font-extrabold text-slate-900 leading-snug">{post.title}</h2>
            <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">{post.content}</p>
          </div>

          {/* Photo Image */}
          {post.imageUrl && (
            <div className="w-full rounded-2xl overflow-hidden border border-slate-200 aspect-video bg-slate-100">
              <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
            </div>
          )}

          {/* Likes & Comments Bar */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
            <button
              onClick={handleToggleLike}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
                post.isLiked
                  ? 'bg-rose-50 text-rose-600 border border-rose-200 scale-105'
                  : 'bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>좋아요 {post.likesCount}</span>
            </button>

            <span className="text-slate-400 font-medium flex items-center gap-1">
              <MessageSquare className="w-4 h-4" />
              댓글 {comments.length}개
            </span>
          </div>

          {/* Comments Section */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-extrabold text-slate-800">댓글 리스트</h4>

            {comments.length === 0 ? (
              <p className="text-[11px] text-slate-400 text-center py-3 bg-slate-50 rounded-xl">
                아직 작성된 댓글이 없습니다. 첫 댓글을 남겨보세요!
              </p>
            ) : (
              <div className="space-y-2">
                {comments.map((c) => (
                  <div key={c.id} className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">{c.authorNickname}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{c.authorDepartment}</span>
                    </div>
                    <p className="text-slate-700 text-[11px]">{c.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add Comment Input Form */}
          <form onSubmit={handleAddComment} className="flex items-center space-x-2 pt-2">
            <input
              type="text"
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              placeholder="따뜻한 응원이나 친환경 의견을 남겨주세요..."
              className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            />
            <button
              type="submit"
              disabled={!newCommentText.trim()}
              className={`p-2.5 rounded-xl font-bold transition-all ${
                newCommentText.trim()
                  ? 'bg-emerald-600 text-white shadow-md cursor-pointer'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

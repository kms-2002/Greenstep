import React, { useState } from 'react';
import type { Post, PostCategory } from '../../../types';
import { supabaseBoard } from '../../../lib/supabase';
import { WritePostModal } from '../board/WritePostModal';
import { PostDetailModal } from '../board/PostDetailModal';
import { Search, Heart, MessageSquare, Plus, Sparkles, User, MapPin } from 'lucide-react';

export const BoardTab: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>(() => supabaseBoard.getPosts());
  const [selectedCategory, setSelectedCategory] = useState<PostCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'latest' | 'popular'>('latest');

  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const categoryTabs: { id: PostCategory; label: string; icon: string }[] = [
    { id: 'all', label: '전체', icon: '🌟' },
    { id: 'verification', label: '인증글', icon: '📸' },
    { id: 'tip', label: '꿀팁', icon: '💡' },
    { id: 'free', label: '자유수다', icon: '💬' },
    { id: 'dept', label: '경영대 소식', icon: '🏫' },
  ];

  const refreshPosts = () => {
    setPosts(supabaseBoard.getPosts());
  };

  const handleToggleLike = (e: React.MouseEvent, postId: string) => {
    e.stopPropagation();
    const updated = supabaseBoard.toggleLike(postId);
    setPosts(updated);
  };

  // Filter & Sort Logic
  const filteredPosts = posts
    .filter((p) => {
      const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
      const matchesSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.authorNickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.authorDepartment.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'popular') {
        return b.likesCount - a.likesCount;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  return (
    <div className="p-4 space-y-4 pb-24 animate-fadeIn relative min-h-full">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-teal-800 via-emerald-800 to-slate-900 text-white p-5 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="relative z-10 space-y-1">
          <div className="inline-flex items-center space-x-1 bg-emerald-700/80 border border-emerald-500/50 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-emerald-200">
            <MapPin className="w-3 h-3 text-emerald-300" />
            <span>Supabase + Next.js App Router 게시판</span>
          </div>

          <h2 className="text-xl font-extrabold tracking-tight pt-1">
            친환경 소통 커뮤니티 💬
          </h2>
          <p className="text-xs text-emerald-200">
            진주시 & 경상국립대 학우들과 실천 인증과 친환경 꿀팁을 공유하세요!
          </p>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="제목, 내용, 작성자, 경영대 학과 검색..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none shadow-sm transition-all"
        />
      </div>

      {/* Category Tabs & Sort Switcher */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-1.5 overflow-x-auto pb-1 no-scrollbar flex-1 mr-2">
          {categoryTabs.map((tab) => {
            const isActive = selectedCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 flex items-center space-x-1 transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm scale-105'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Sort Pills */}
        <div className="flex bg-slate-100 p-0.5 rounded-xl shrink-0">
          <button
            onClick={() => setSortBy('latest')}
            className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
              sortBy === 'latest' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-500'
            }`}
          >
            최신순
          </button>
          <button
            onClick={() => setSortBy('popular')}
            className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
              sortBy === 'popular' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-500'
            }`}
          >
            인기순
          </button>
        </div>
      </div>

      {/* Post List Cards */}
      <div className="space-y-3">
        {filteredPosts.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-3xl border border-slate-100 text-slate-400">
            <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-xs font-bold">작성된 게시글이 없습니다. 첫 글을 남겨보세요!</p>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <div
              key={post.id}
              onClick={() => setSelectedPost(post)}
              className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer space-y-2.5"
            >
              {/* Author & Category Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-700 overflow-hidden shrink-0 flex items-center justify-center text-white">
                    {post.authorAvatar ? (
                      <img src={post.authorAvatar} alt={post.authorNickname} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <span className="font-extrabold text-xs text-slate-800 block leading-tight">
                      {post.authorNickname}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-medium">
                      {post.authorUniversity} {post.authorDepartment}
                    </span>
                  </div>
                </div>

                <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-md">
                  {post.categoryName}
                </span>
              </div>

              {/* Challenge Tag (if verification) */}
              {post.challengeTag && (
                <div className="p-2 bg-emerald-50 rounded-xl flex items-center justify-between text-[11px] font-bold text-emerald-900 border border-emerald-100">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    {post.challengeTag}
                  </span>
                  {post.carbonSavedTag && (
                    <span className="font-mono text-emerald-700">-{post.carbonSavedTag}kg CO₂e</span>
                  )}
                </div>
              )}

              {/* Title & Snippet */}
              <div>
                <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 leading-snug line-clamp-1">
                  {post.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                  {post.content}
                </p>
              </div>

              {/* Thumbnail Image (if present) */}
              {post.imageUrl && (
                <div className="w-full h-32 rounded-xl overflow-hidden bg-slate-100 border border-slate-100">
                  <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
                </div>
              )}

              {/* Bottom Likes & Comments Bar */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                <button
                  onClick={(e) => handleToggleLike(e, post.id)}
                  className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg font-bold transition-all ${
                    post.isLiked
                      ? 'bg-rose-50 text-rose-600 border border-rose-200'
                      : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${post.isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                  <span>{post.likesCount}</span>
                </button>

                <div className="flex items-center space-x-3 text-slate-400 font-medium">
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                    {post.commentsCount}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Floating Action Button (FAB) for Writing New Post */}
      <button
        onClick={() => setIsWriteModalOpen(true)}
        className="fixed bottom-20 right-6 z-40 bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-3.5 rounded-full shadow-xl shadow-emerald-600/30 hover:scale-105 transition-transform flex items-center justify-center cursor-pointer"
        title="글쓰기"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Write Post Modal */}
      <WritePostModal
        isOpen={isWriteModalOpen}
        onClose={() => setIsWriteModalOpen(false)}
        onPostCreated={refreshPosts}
      />

      {/* Post Detail Modal */}
      <PostDetailModal
        post={selectedPost}
        onClose={() => setSelectedPost(null)}
        onPostUpdated={() => {
          refreshPosts();
          if (selectedPost) {
            const updated = supabaseBoard.getPosts().find((p) => p.id === selectedPost.id);
            if (updated) setSelectedPost(updated);
          }
        }}
      />
    </div>
  );
};

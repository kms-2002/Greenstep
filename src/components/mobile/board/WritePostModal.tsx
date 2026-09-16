import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import type { PostCategory } from '../../../types';
import { supabaseBoard } from '../../../lib/supabase';
import { Camera, Image as ImageIcon, Sparkles, X, MessageSquarePlus } from 'lucide-react';

interface WritePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: () => void;
}

export const WritePostModal: React.FC<WritePostModalProps> = ({ isOpen, onClose, onPostCreated }) => {
  const { user, challenges } = useApp();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<PostCategory>('verification');
  const [content, setContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedChallengeTag, setSelectedChallengeTag] = useState<string>(challenges[0]?.title || '');

  if (!isOpen) return null;

  const categoryOptions: { id: PostCategory; label: string }[] = [
    { id: 'verification', label: '🌟 실천 인증글' },
    { id: 'tip', label: '💡 친환경 꿀팁' },
    { id: 'free', label: '💬 자유수다' },
    { id: 'dept', label: '🏫 경영대학 소식' },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const samplePhotos = [
    'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=600',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 모두 입력해 주세요.');
      return;
    }

    const catObj = categoryOptions.find((c) => c.id === category);

    supabaseBoard.createPost({
      authorId: user.id,
      authorNickname: user.nickname,
      authorUniversity: user.university,
      authorDepartment: user.department,
      authorGrade: user.grade,
      authorAvatar: user.profileImage,
      category,
      categoryName: catObj ? catObj.label : '자유수다',
      title,
      content,
      imageUrl: selectedImage || samplePhotos[0],
      challengeTag: category === 'verification' ? selectedChallengeTag : undefined,
      carbonSavedTag: category === 'verification' ? 0.3 : undefined,
    });

    onPostCreated();
    onClose();
    setTitle('');
    setContent('');
    setSelectedImage(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col relative max-h-[90vh] overflow-y-auto animate-scaleUp">
        {/* Header */}
        <div className="p-4 bg-emerald-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageSquarePlus className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-sm tracking-tight">친환경 커뮤니티 글쓰기</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-emerald-800 flex items-center justify-center text-emerald-200 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          {/* Category Pills */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">카테고리 선택</label>
            <div className="grid grid-cols-2 gap-2">
              {categoryOptions.map((c) => (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => setCategory(c.id)}
                  className={`py-2 px-3 rounded-xl font-bold border transition-all text-left truncate ${
                    category === c.id
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Eco Challenge Tag Select (if verification) */}
          {category === 'verification' && (
            <div>
              <label className="block font-bold text-slate-700 mb-1">연관 챌린지 태그</label>
              <select
                value={selectedChallengeTag}
                onChange={(e) => setSelectedChallengeTag(e.target.value)}
                className="w-full px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-xl font-bold text-emerald-900 outline-none"
              >
                {challenges.map((ch) => (
                  <option key={ch.id} value={ch.title}>
                    {ch.categoryIcon} {ch.title} (-{ch.carbonReduction}kg)
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Post Title Input */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">글 제목</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: 경영대 카페에서 텀블러 할인 받았어요!"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            />
          </div>

          {/* Content Textarea */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">글 내용</label>
            <textarea
              rows={4}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="진주시 & 경상국립대 학우들과 나눌 친환경 실천 후기나 이야기를 자유롭게 작성해주세요..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            />
          </div>

          {/* Photo Preview / Upload */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">사진 첨부</label>
            {selectedImage ? (
              <div className="relative w-full h-36 rounded-2xl overflow-hidden border border-slate-200">
                <img src={selectedImage} alt="첨부 이미지" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-2 right-2 p-1 bg-black/60 text-white rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <label className="flex items-center justify-center space-x-2 py-2.5 bg-emerald-50 text-emerald-700 font-bold rounded-xl border border-emerald-200 cursor-pointer">
                    <Camera className="w-4 h-4" />
                    <span>사진 업로드</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>

                  <label className="flex items-center justify-center space-x-2 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl border border-slate-200 cursor-pointer">
                    <ImageIcon className="w-4 h-4" />
                    <span>갤러리</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>

                <div className="flex space-x-1.5 overflow-x-auto pt-1">
                  {samplePhotos.map((url, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setSelectedImage(url)}
                      className="w-12 h-12 rounded-xl overflow-hidden border border-slate-200 shrink-0 hover:border-emerald-500"
                    >
                      <img src={url} alt="샘플" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm rounded-2xl shadow-lg shadow-emerald-600/30 flex items-center justify-center space-x-1.5 transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>게시글 등록하기</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

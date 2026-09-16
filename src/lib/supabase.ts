import type { Post, PostComment } from '../types';

// Supabase Mock Client Data Store (Simulates Supabase Client & Server Actions in Next.js App Router)
const SUPABASE_STORAGE_KEY = 'greenstep_supabase_board_posts_v1';

export const INITIAL_POSTS: Post[] = [
  {
    id: 'post-101',
    authorId: 'u-101',
    authorNickname: '지구지키미',
    authorUniversity: '경상국립대학교',
    authorDepartment: '경영정보학과',
    authorGrade: '3학년',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    category: 'verification',
    categoryName: '🌟 실천 인증글',
    title: '경영대학 도서관에서 텀블러 할인받고 커피 마셨습니다! 🥤',
    content: '가좌캠 도서관 1층 카페에서 텀블러 지참 할인 300원도 받고 탄소절감 0.1kg도 달성했어요! 다들 일회용 컵 대신 텀블러 꼭 지참해보세요. 경영정보학과 탄소절감 1위 가봅시다! 🔥',
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=600',
    challengeTag: 'GNU 캠퍼스 텀블러 지참',
    carbonSavedTag: 0.1,
    likesCount: 24,
    commentsCount: 5,
    isLiked: false,
    createdAt: '2026-09-16T15:30:00Z',
  },
  {
    id: 'post-102',
    authorId: 'u-102',
    authorNickname: '박지구',
    authorUniversity: '경상국립대학교',
    authorDepartment: '경영학부',
    authorGrade: '2학년',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    category: 'verification',
    categoryName: '🌟 실천 인증글',
    title: '오늘 남강 자전거길 라이딩해서 등교 완료! 🚲',
    content: '날씨가 너무 좋아서 승용차 대신 진주 남강 자전거 전용도로 타고 가좌캠 경영대학까지 다녀왔습니다. 남강 풍경 보면서 타니 스트레스도 풀리고 탄소 감축 0.8kg도 성공했습니다!',
    imageUrl: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&q=80&w=600',
    challengeTag: '진주 남강 자전거길 라이딩',
    carbonSavedTag: 0.8,
    likesCount: 38,
    commentsCount: 8,
    isLiked: true,
    createdAt: '2026-09-16T12:10:00Z',
  },
  {
    id: 'post-103',
    authorId: 'u-103',
    authorNickname: '이세이버',
    authorUniversity: '경상국립대학교',
    authorDepartment: '회계세무학부',
    authorGrade: '4학년',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
    category: 'verification',
    categoryName: '🌟 실천 인증글',
    title: 'GNU 가좌캠 학식 잔반 제로 인증합니다 🍚',
    content: '오늘 학생식당 점심 메뉴 싹 비웠어요! 잔반 감축으로 탄소절감 0.5kg 획득했습니다. 음식물 쓰레기 수거 비용도 아끼고 지구도 지키는 학식 잔반 제로 동참해주세요!',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600',
    challengeTag: 'GNU 가좌캠 학식 잔반 제로',
    carbonSavedTag: 0.5,
    likesCount: 19,
    commentsCount: 3,
    isLiked: false,
    createdAt: '2026-09-16T09:45:00Z',
  },
  {
    id: 'post-104',
    authorId: 'u-104',
    authorNickname: '최에코',
    authorUniversity: '경상국립대학교',
    authorDepartment: '스마트유통물류학과',
    authorGrade: '1학년',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
    category: 'tip',
    categoryName: '💡 친환경 꿀팁',
    title: '진주시 투명 페트병 라벨 제대로 떼는 법 & 무인 회수기 위치 팁 ♻️',
    content: '가좌동 주민센터 및 캠퍼스 근처 투명 페트병 배출 시 비닐 라벨 뜯고 찌그러뜨려서 배출하면 재활용률이 3배 높아집니다! 폐건전지는 행정복지센터 가져가면 새 건전지로 교환해주는 이벤트도 있으니 꼭 참고하세요!',
    imageUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=600',
    likesCount: 45,
    commentsCount: 12,
    isLiked: false,
    createdAt: '2026-09-15T18:20:00Z',
  },
];

export const INITIAL_COMMENTS: Record<string, PostComment[]> = {
  'post-101': [
    {
      id: 'c-1',
      postId: 'post-101',
      authorId: 'u-102',
      authorNickname: '박지구',
      authorDepartment: '경영학부',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
      content: '텀블러 지참 할인 진짜 쏠쏠해요! 저도 오늘 경영대 도서관 가면서 챙겨갔습니다 ☕',
      createdAt: '2026-09-16T15:40:00Z',
    },
    {
      id: 'c-2',
      postId: 'post-101',
      authorId: 'u-103',
      authorNickname: '이세이버',
      authorDepartment: '회계세무학부',
      authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
      content: '경영정보학과 절감 수치 엄청나네요! 회계세무학부도 바짝 추격하겠습니다 ㅎㅎ',
      createdAt: '2026-09-16T16:05:00Z',
    },
  ],
};

export const supabaseBoard = {
  getPosts: (): Post[] => {
    const saved = localStorage.getItem(SUPABASE_STORAGE_KEY);
    return saved ? JSON.parse(saved) : INITIAL_POSTS;
  },

  savePosts: (posts: Post[]) => {
    localStorage.setItem(SUPABASE_STORAGE_KEY, JSON.stringify(posts));
  },

  toggleLike: (postId: string): Post[] => {
    const posts = supabaseBoard.getPosts();
    const updated = posts.map((p) => {
      if (p.id === postId) {
        const nextLiked = !p.isLiked;
        return {
          ...p,
          isLiked: nextLiked,
          likesCount: nextLiked ? p.likesCount + 1 : Math.max(0, p.likesCount - 1),
        };
      }
      return p;
    });
    supabaseBoard.savePosts(updated);
    return updated;
  },

  createPost: (newPostData: Omit<Post, 'id' | 'likesCount' | 'commentsCount' | 'isLiked' | 'createdAt'>): Post[] => {
    const posts = supabaseBoard.getPosts();
    const newPost: Post = {
      ...newPostData,
      id: `post-${Date.now()}`,
      likesCount: 0,
      commentsCount: 0,
      isLiked: false,
      createdAt: new Date().toISOString(),
    };
    const updated = [newPost, ...posts];
    supabaseBoard.savePosts(updated);
    return updated;
  },

  getComments: (postId: string): PostComment[] => {
    const saved = localStorage.getItem(`${SUPABASE_STORAGE_KEY}_comments_${postId}`);
    return saved ? JSON.parse(saved) : INITIAL_COMMENTS[postId] || [];
  },

  addComment: (postId: string, commentData: Omit<PostComment, 'id' | 'createdAt'>): PostComment[] => {
    const comments = supabaseBoard.getComments(postId);
    const newComment: PostComment = {
      ...commentData,
      id: `c-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [...comments, newComment];
    localStorage.setItem(`${SUPABASE_STORAGE_KEY}_comments_${postId}`, JSON.stringify(updated));

    const posts = supabaseBoard.getPosts();
    const updatedPosts = posts.map((p) => (p.id === postId ? { ...p, commentsCount: p.commentsCount + 1 } : p));
    supabaseBoard.savePosts(updatedPosts);

    return updated;
  },
};

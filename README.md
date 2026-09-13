# 🌱 GreenStep (그린스텝) - 대학생 친환경 탄소절감 챌린지 플랫폼

> **"작은 실천은 AI가, 탄소절감은 GREENSTEP이."**
> 경상국립대학교 경영대학 & 진주시 탄소중립 실천 챌린지 플랫폼 🌿

![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?style=for-the-badge&logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-06B6D4?style=for-the-badge&logo=tailwindcss)

---

## 📱 프로젝트 소개

**GreenStep**은 대학생을 대상으로 일상 속 친환경 행동(텀블러 사용, 대중교통 이용, 잔반 제로, 분리배출, 남강변 줍깅 등)을 유도하고, **사진 인증 및 AI 객체 검수**를 통해 탄소절감량 계산, 포인트 획득, **가상 나무 성장**, **학과별 랭킹 경쟁**을 제공하는 친환경 챌린지 플랫폼입니다.

진주시의 대표 환경 정책(자전거 도시, 남강 줍깅, 폐건전지 수거) 및 **경상국립대학교(GNU) 경영대학 5개 학과** 특화 데이터를 결합하여 실제 대학생들이 즐겁게 동참할 수 있도록 설계되었습니다.

---

## ✨ 핵심 기능

### 1. 🌸 경상국립대학교 경영대학 5개 학과 맞춤 연동
- **지정 학과**: 경영학부, 경영정보학과, 회계세무학부, 국제통상학과, 스마트유통물류학과
- 가입 시 소속 학과를 선택하면 학과별 누적 탄소절감량 리더보드에 실시간 반영

### 2. 🍃 진주시 × GNU 특화 친환경 챌린지 12종
- **이동 🚍**: 진주 시내버스 & GNU 통학버스 이용, 진주 남강 자전거길 라이딩, 가좌캠 도보 이동
- **생활 🥤**: GNU 캠퍼스 텀블러 지참 (음료 할인), 진주 상권 에코백 사용, 경영대 강의실 소등
- **음식 🍚**: GNU 가좌캠 학식 잔반 제로, 진주 로컬푸드 & 채식 한 끼, 가좌동 배달 수저 안 받기
- **자원 ♻️**: 진주 남강변 줍깅 (플로깅), 투명 페트병 라벨 떼고 분리배출, 폐건전지/종이팩 수거함 이용

### 3. 📸 AI 사진 인증 & 리워드 시스템
- 챌린지 실천 사진 업로드 시 **AI 이미지 분석 연출 (98.4%)**
- 성공 시 포인트(`+10P ~ +40P`), 탄소절감량(`+0.1 ~ +1.5kg CO₂e`), 연속 실천일 수치 자동 누적

### 4. 🪴 가상 나무 성장 시스템 (Virtual Tree System)
- 누적 탄소절감량에 따라 가상의 나무가 자동 성장:
  - `Lv.1 🌱 (새싹)` → `Lv.5 🌿 (어린 줄기)` → `Lv.9 🪴 (성장하는 나무)` → `Lv.12 🌳 (풍성한 나무)` → `Lv.20 🌲 (울창한 탄소숲)`

### 5. 🏆 개인 & 학과 리더보드
- 개인별/친구별/학과별 누적 탄소절감량 실시간 순위 및 TOP 3 시상대 Visualizer

---

## 🛠️ 기술 스택

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: TailwindCSS v4, Lucide Icons, Canvas Confetti
- **Charts**: Recharts
- **State & Storage**: React Context API, LocalStorage Sync

---

## 📂 프로젝트 구조

```
greenstep/
├── index.html
├── package.json
├── vite.config.ts
└── src/
    ├── App.tsx                    # 스마트폰 폰 프레임 & 메인 앱 레이아웃
    ├── components/
    │   └── mobile/
    │       ├── LandingScreen.tsx  # GNU 지누 마스코트 시작 화면
    │       ├── Header.tsx         # 모바일 상단 브랜드 헤더
    │       ├── BottomNav.tsx      # 하단 5개 고정 네비게이션 바
    │       ├── VirtualTree.tsx    # 가상 나무 성장 비주얼
    │       ├── AuthModal.tsx      # 경상국립대 5개 학과 회원가입 모달
    │       ├── VerificationModal.tsx # AI 스캔 사진 인증 모달
    │       └── tabs/              # 홈, 챌린지, 랭킹, 나의 활동, 마이페이지
    ├── context/AppContext.tsx     # 전역 상태 및 캐시 관리
    ├── mock/initialData.ts        # 진주시 x GNU 데이터 세트
    └── utils/carbonCalculator.ts  # 공식 탄소배출계수 & 레벨 계산 엔진
```

---

## 🚀 로컬 실행 방법

```bash
# 1. 레포지토리 클론
git clone https://github.com/kms-2002/Greenstep.git

# 2. 프로젝트 디렉토리 이동
cd Greenstep

# 3. 패키지 설치
npm install

# 4. 개발 서버 실행
npm run dev
```

브라우저에서 `http://localhost:5173/` 접속하여 확인합니다.

---

## 📄 라이선스

This project is licensed under the MIT License.

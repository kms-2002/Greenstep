import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { IScannerControls } from '@zxing/browser/esm/common/IScannerControls';
import { Camera, Copy, QrCode, Search, UserPlus, Users, X } from 'lucide-react';
import type { User } from '../../../types';
import { Avatar } from '../../common/Avatar';

type Friend = Pick<User, 'id' | 'nickname' | 'university' | 'department' | 'profileAvatarId'> & { followedAt: string };
type FriendTab = 'friends' | 'find';

const STORAGE_KEY = 'greenstep_friends_v1';

const campusSuggestions: Omit<Friend, 'followedAt'>[] = [
  { id: 'gnu-friend-101', nickname: '박지구', university: '경상국립대학교', department: '경영학부', profileAvatarId: 'avatar-sprout' },
  { id: 'gnu-friend-102', nickname: '이세이버', university: '경상국립대학교', department: '회계세무학부', profileAvatarId: 'avatar-tumbler' },
  { id: 'gnu-friend-103', nickname: '최에코', university: '경상국립대학교', department: '스마트유통물류학과', profileAvatarId: 'avatar-rider' },
  { id: 'gnu-friend-104', nickname: '정클린', university: '경상국립대학교', department: '국제통상학과', profileAvatarId: 'avatar-tree' },
];

const getFriendPayload = (value: string) => {
  try {
    const url = new URL(value);
    const id = url.searchParams.get('friendId');
    const nickname = url.searchParams.get('friendName');
    const university = url.searchParams.get('school') || 'GreenStep 사용자';
    if (id && nickname) return { id, nickname, university, department: '', profileAvatarId: 'avatar-sprout' };
  } catch {
    // Also accept a friend ID pasted from the invite sheet.
    if (value.trim()) return { id: value.trim(), nickname: `GreenStep 친구 ${value.trim().slice(-4)}`, university: 'GreenStep 사용자', department: '', profileAvatarId: 'avatar-sprout' };
  }
  return null;
};

export const FriendsPanel: React.FC<{ user: User }> = ({ user }) => {
  const [friends, setFriends] = useState<Friend[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) as Friend[] : [
        { ...campusSuggestions[0], followedAt: new Date().toISOString() },
        { ...campusSuggestions[1], followedAt: new Date().toISOString() },
      ];
    } catch {
      return [];
    }
  });
  const [tab, setTab] = useState<FriendTab>('friends');
  const [query, setQuery] = useState('');
  const [showInvite, setShowInvite] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [scanMessage, setScanMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerControlsRef = useRef<IScannerControls | null>(null);

  useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(friends)), [friends]);

  useEffect(() => {
    if (!showScanner || !videoRef.current) return;
    let cancelled = false;
    let activeControls: IScannerControls | null = null;
    setScanMessage('카메라 권한을 요청하고 있어요.');
    const startScanning = async () => {
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          setScanMessage('이 브라우저에서 카메라 기능을 사용할 수 없어요. localhost 또는 HTTPS에서 열어주세요.');
          return;
        }
        const { BrowserQRCodeReader } = await import('@zxing/browser');
        if (cancelled || !videoRef.current) return;
        const reader = new BrowserQRCodeReader();
        activeControls = await reader.decodeFromVideoDevice(undefined, videoRef.current, (result, error, controls) => {
          scannerControlsRef.current = controls;
          if (cancelled) {
            controls.stop();
            return;
          }
          if (result) {
            controls.stop();
            scannerControlsRef.current = null;
            setShowScanner(false);
            addFromCode(result.getText());
            return;
          }
          if (error?.name === 'NotAllowedError' || error?.name === 'PermissionDeniedError') {
            setScanMessage('카메라 권한이 거부됐어요. 주소창의 카메라 권한을 허용한 뒤 다시 시도해주세요.');
          } else if (error?.name === 'NotFoundError' || error?.name === 'DevicesNotFoundError') {
            setScanMessage('사용할 수 있는 카메라를 찾지 못했어요. 카메라가 연결되어 있는지 확인해주세요.');
          } else if (error?.name === 'NotReadableError' || error?.name === 'TrackStartError') {
            setScanMessage('카메라가 다른 앱에서 사용 중일 수 있어요. 다른 앱을 닫고 다시 시도해주세요.');
          }
        });
        scannerControlsRef.current = activeControls;
        if (!cancelled) setScanMessage('친구의 QR을 카메라 화면 안에 맞춰주세요.');
        else activeControls.stop();
      } catch (error: unknown) {
        if (cancelled) return;
        const name = error instanceof DOMException ? error.name : '';
        if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
          setScanMessage('카메라 권한이 거부됐어요. 주소창의 카메라 권한을 허용한 뒤 다시 시도해주세요.');
        } else if (name === 'NotFoundError' || name === 'DevicesNotFoundError') {
          setScanMessage('사용할 수 있는 카메라를 찾지 못했어요. 카메라가 연결되어 있는지 확인해주세요.');
        } else if (name === 'NotReadableError' || name === 'TrackStartError') {
          setScanMessage('카메라가 다른 앱에서 사용 중일 수 있어요. 다른 앱을 닫고 다시 시도해주세요.');
        } else {
          setScanMessage('카메라를 시작하지 못했어요. 권한을 확인한 뒤 다시 시도해주세요.');
        }
      }
    };
    void startScanning();

    return () => {
      cancelled = true;
      activeControls?.stop();
      scannerControlsRef.current?.stop();
      scannerControlsRef.current = null;
    };
  }, [showScanner]);

  const inviteUrl = useMemo(() => {
    const url = new URL(window.location.href);
    url.searchParams.set('friendId', user.id);
    url.searchParams.set('friendName', user.nickname);
    url.searchParams.set('school', user.university);
    return url.toString();
  }, [user.id, user.nickname, user.university]);
  const qrImage = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=12&data=${encodeURIComponent(inviteUrl)}`;

  const addFriend = (candidate: Omit<Friend, 'followedAt'>) => {
    if (candidate.id === user.id || friends.some((friend) => friend.id === candidate.id)) return;
    setFriends((current) => [{ ...candidate, followedAt: new Date().toISOString() }, ...current]);
    setTab('friends');
    setQuery('');
    setShowInvite(false);
    setShowScanner(false);
    setScanMessage('친구가 추가됐어요!');
  };

  const addFromCode = (raw: string) => {
    const friend = getFriendPayload(raw);
    if (!friend) {
      setScanMessage('올바른 GreenStep 친구 QR 또는 친구 코드를 입력해주세요.');
      return;
    }
    if (friend.id === user.id) {
      setScanMessage('내 QR 코드는 친구로 추가할 수 없어요.');
      return;
    }
    if (friends.some((item) => item.id === friend.id)) {
      setScanMessage('이미 친구로 추가되어 있어요.');
      return;
    }
    addFriend(friend);
  };

  const openScanner = async () => {
    setShowScanner(true);
  };

  const closeScanner = () => {
    scannerControlsRef.current?.stop();
    scannerControlsRef.current = null;
    setShowScanner(false);
  };

  const filteredSuggestions = campusSuggestions.filter((candidate) =>
    !friends.some((friend) => friend.id === candidate.id)
    && `${candidate.nickname} ${candidate.department}`.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-1.5 text-sm font-extrabold text-slate-800"><Users className="h-4 w-4 text-emerald-600" />친구 <span className="text-emerald-700">{friends.length}</span></h3>
          <p className="mt-1 text-[11px] text-slate-500">친구와 서로의 친환경 실천을 응원해요.</p>
        </div>
        <button onClick={() => setShowInvite(true)} className="flex items-center gap-1 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700"><UserPlus className="h-3.5 w-3.5" />친구 추가</button>
      </div>

      <div className="grid grid-cols-2 rounded-xl bg-slate-100 p-1 text-xs font-bold">
        <button onClick={() => setTab('friends')} className={`rounded-lg py-2 ${tab === 'friends' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500'}`}>내 친구 {friends.length}</button>
        <button onClick={() => setTab('find')} className={`rounded-lg py-2 ${tab === 'find' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500'}`}>친구 찾기</button>
      </div>

      {tab === 'friends' ? (
        friends.length ? <div className="divide-y divide-slate-100">
          {friends.map((friend) => <div key={friend.id} className="flex items-center gap-3 py-3 first:pt-1 last:pb-1">
            <Avatar avatarId={friend.profileAvatarId || 'avatar-sprout'} size="md" />
            <div className="min-w-0 flex-1"><p className="truncate text-xs font-extrabold text-slate-800">{friend.nickname}</p><p className="mt-0.5 truncate text-[10px] text-slate-500">{friend.university}{friend.department ? ` · ${friend.department}` : ''}</p></div>
            <button onClick={() => setFriends((items) => items.filter((item) => item.id !== friend.id))} className="rounded-lg px-2.5 py-1.5 text-[10px] font-bold text-slate-500 hover:bg-slate-100">팔로잉</button>
          </div>)}
        </div> : <div className="rounded-xl bg-slate-50 py-6 text-center text-xs text-slate-500">아직 친구가 없어요. QR로 친구를 추가해보세요.</div>
      ) : (
        <div className="space-y-2">
          <label className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2"><Search className="h-4 w-4 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="닉네임 또는 학과 검색" className="w-full bg-transparent text-xs outline-none placeholder:text-slate-400" /></label>
          {filteredSuggestions.length ? filteredSuggestions.map((candidate) => <div key={candidate.id} className="flex items-center gap-3 py-2">
            <Avatar avatarId={candidate.profileAvatarId || 'avatar-sprout'} size="md" />
            <div className="min-w-0 flex-1"><p className="truncate text-xs font-extrabold text-slate-800">{candidate.nickname}</p><p className="truncate text-[10px] text-slate-500">{candidate.department}</p></div>
            <button onClick={() => addFriend(candidate)} className="rounded-lg bg-emerald-50 px-2.5 py-1.5 text-[10px] font-extrabold text-emerald-700 hover:bg-emerald-100">추가</button>
          </div>) : <p className="py-4 text-center text-xs text-slate-500">검색 결과가 없어요.</p>}
        </div>
      )}

      {scanMessage && !showInvite && !showScanner && <p className="text-center text-[11px] font-bold text-emerald-700">{scanMessage}</p>}

      {showInvite && <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
        <div className="relative w-full max-w-sm space-y-4 rounded-3xl bg-white p-5 shadow-2xl">
          <button onClick={() => { setShowInvite(false); setScanMessage(''); }} className="absolute right-4 top-4 rounded-full p-1 text-slate-400 hover:bg-slate-100" aria-label="닫기"><X className="h-5 w-5" /></button>
          <div><h3 className="flex items-center gap-2 text-base font-extrabold text-slate-900"><QrCode className="h-5 w-5 text-emerald-600" />친구 추가</h3><p className="mt-1 text-xs text-slate-500">친구가 QR을 스캔하면 서로의 친구 목록에 추가할 수 있어요.</p></div>
          <div className="flex flex-col items-center rounded-2xl bg-emerald-50 p-4">
            <img src={qrImage} alt={`${user.nickname} 친구 추가 QR 코드`} className="h-48 w-48 rounded-xl bg-white p-2" />
            <p className="mt-2 text-sm font-extrabold text-slate-800">{user.nickname}</p>
            <p className="text-[11px] text-slate-500">{user.university}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={async () => { await navigator.clipboard?.writeText(inviteUrl); setCopied(true); window.setTimeout(() => setCopied(false), 1800); }} className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 py-3 text-xs font-bold text-slate-700"><Copy className="h-4 w-4" />{copied ? '복사 완료' : '초대 링크 복사'}</button>
            <button onClick={openScanner} className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-3 text-xs font-bold text-white"><Camera className="h-4 w-4" />QR 스캔</button>
          </div>
          <div className="flex gap-2"><input value={manualCode} onChange={(event) => setManualCode(event.target.value)} placeholder="친구 초대 링크 또는 코드" className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-2.5 text-xs outline-none focus:border-emerald-500" /><button onClick={() => addFromCode(manualCode)} className="rounded-xl border border-emerald-200 px-3 text-xs font-bold text-emerald-700">추가</button></div>
          {scanMessage && <p className="text-center text-[11px] font-bold text-emerald-700">{scanMessage}</p>}
        </div>
      </div>}

      {showScanner && <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm">
        <div className="relative w-full max-w-sm space-y-4 rounded-3xl bg-white p-5 shadow-2xl">
          <button onClick={closeScanner} className="absolute right-4 top-4 rounded-full p-1 text-slate-400 hover:bg-slate-100" aria-label="스캐너 닫기"><X className="h-5 w-5" /></button>
          <h3 className="font-extrabold text-slate-900">친구 QR 스캔</h3>
          <video ref={videoRef} muted playsInline className="aspect-square w-full rounded-2xl bg-slate-950 object-cover" />
          <p className="text-center text-xs text-slate-600">{scanMessage}</p>
          <button onClick={closeScanner} className="w-full rounded-xl bg-slate-100 py-3 text-xs font-bold text-slate-700">닫기</button>
        </div>
      </div>}
    </section>
  );
};

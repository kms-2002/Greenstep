import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Camera, Image as ImageIcon, CheckCircle, Scan, Sparkles, X, AlertCircle } from 'lucide-react';

export const VerificationModal: React.FC = () => {
  const { isVerificationOpen, setIsVerificationOpen, challengeToVerify, completeCertification } = useApp();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);

  if (!isVerificationOpen || !challengeToVerify) return null;

  // Preset sample photo options for fast testing
  const samplePhotos: { label: string; url: string }[] = [
    {
      label: '🥤 텀블러/다회용컵',
      url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=600',
    },
    {
      label: '🚍 대중교통/교통카드',
      url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=600',
    },
    {
      label: '🍚 잔반 제로 식판',
      url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600',
    },
    {
      label: '♻️ 페트병 분리수거',
      url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=600',
    },
  ];

  const handleSelectSample = (url: string) => {
    setSelectedImage(url);
    runSimulatedAIScan();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
        runSimulatedAIScan();
      };
      reader.readAsDataURL(file);
    }
  };

  const runSimulatedAIScan = () => {
    setIsScanning(true);
    setScanComplete(false);
    setTimeout(() => {
      setIsScanning(false);
      setScanComplete(true);
    }, 1500);
  };

  const handleConfirm = () => {
    if (!selectedImage) return;
    completeCertification(challengeToVerify.id, selectedImage);
    setSelectedImage(null);
    setScanComplete(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-4 bg-emerald-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl">{challengeToVerify.categoryIcon}</span>
            <div>
              <h3 className="font-bold text-sm tracking-tight">{challengeToVerify.title}</h3>
              <p className="text-[11px] text-emerald-200">실천 모습을 사진으로 인증해주세요</p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsVerificationOpen(false);
              setSelectedImage(null);
            }}
            className="w-8 h-8 rounded-full bg-emerald-800 flex items-center justify-center text-emerald-200 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4">
          {/* Main Photo Area / Scanner Visualizer */}
          <div className="relative w-full aspect-video rounded-2xl bg-slate-100 border-2 border-dashed border-slate-300 overflow-hidden flex flex-col items-center justify-center">
            {selectedImage ? (
              <>
                <img
                  src={selectedImage}
                  alt="인증 사진"
                  className="w-full h-full object-cover"
                />

                {/* AI Scanning overlay animation */}
                {isScanning && (
                  <div className="absolute inset-0 bg-emerald-950/70 backdrop-blur-sm flex flex-col items-center justify-center text-white">
                    <Scan className="w-10 h-10 text-emerald-400 animate-spin" />
                    <p className="text-xs font-bold mt-2 text-emerald-200 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                      AI 이미지 판별 진행 중... (98.4%)
                    </p>
                    <div className="w-48 bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
                      <div className="bg-emerald-400 h-full animate-pulse w-3/4" />
                    </div>
                  </div>
                )}

                {/* Scan Complete Verified Badge */}
                {scanComplete && (
                  <div className="absolute bottom-3 left-3 right-3 bg-emerald-900/90 backdrop-blur-md border border-emerald-500/50 text-white p-2.5 rounded-xl flex items-center justify-between text-xs shadow-lg animate-fadeIn">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                      <div>
                        <span className="font-bold text-emerald-200">AI 판별 성공!</span>
                        <p className="text-[10px] text-emerald-100/90">
                          {challengeToVerify.categoryName} 관련 행동 객체 검증됨
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] bg-emerald-700 text-emerald-100 font-mono px-2 py-0.5 rounded">
                      +{(challengeToVerify.carbonReduction).toFixed(1)}kg CO₂e
                    </span>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center p-4">
                <Camera className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-600">인증할 사진을 선택하세요</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  직접 촬영하거나 샘플 사진을 선택할 수 있습니다.
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons: Camera / Gallery */}
          <div className="grid grid-cols-2 gap-3">
            <label className="flex items-center justify-center space-x-2 py-2.5 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs rounded-xl cursor-pointer border border-emerald-200 transition-colors">
              <Camera className="w-4 h-4" />
              <span>사진 촬영</span>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            <label className="flex items-center justify-center space-x-2 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer border border-slate-200 transition-colors">
              <ImageIcon className="w-4 h-4" />
              <span>갤러리 선택</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Fast Sample Photos Selector */}
          <div>
            <span className="block text-[11px] font-bold text-slate-500 mb-1.5">
              💡 빠른 테스트용 샘플 사진 선택:
            </span>
            <div className="grid grid-cols-2 gap-2">
              {samplePhotos.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectSample(s.url)}
                  className="text-left text-[11px] font-medium bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 p-2 rounded-xl border border-slate-200 flex items-center space-x-2 transition-all truncate"
                >
                  <img src={s.url} alt={s.label} className="w-7 h-7 rounded-lg object-cover" />
                  <span className="truncate">{s.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Verification Status Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-2.5 flex items-start space-x-2 text-[11px] text-amber-800">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">AI 자율 정밀 검수 시스템 확장 지원</span>
              <p className="text-[10px] text-amber-700 mt-0.5">
                현재 프로토타입 버전에서는 사진 선택 시 AI 자동 검수 로직이 실행되어 즉시 포인트와 탄소절감량이 반영됩니다.
              </p>
            </div>
          </div>

          {/* Final Submit Button */}
          <button
            disabled={!selectedImage || isScanning}
            onClick={handleConfirm}
            className={`w-full py-3.5 rounded-2xl font-bold text-sm shadow-lg flex items-center justify-center space-x-2 transition-all ${
              selectedImage && !isScanning
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-500 hover:to-teal-500 shadow-emerald-600/30 cursor-pointer active:scale-95'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            <span>실천 인증 완료하기</span>
          </button>
        </div>
      </div>
    </div>
  );
};

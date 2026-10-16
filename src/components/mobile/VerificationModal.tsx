import React, { useEffect, useState } from 'react';
import { estimateCarbon, supportsWasteMeasurement } from '../../lib/carbonEstimate';
import { useApp } from '../../context/AppContext';
import { Camera, Image as ImageIcon, CheckCircle, Scan, Sparkles, X, AlertCircle } from 'lucide-react';

export const VerificationModal: React.FC = () => {
  const { isVerificationOpen, setIsVerificationOpen, challengeToVerify, completeCertification } = useApp();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [baseline, setBaseline] = useState('');
  const [actual, setActual] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  useEffect(() => {
    setBaseline(''); setActual(''); setSelectedImage(null); setScanComplete(false);
  }, [isVerificationOpen, challengeToVerify?.id]);

  if (!isVerificationOpen || !challengeToVerify) return null;
  const hasMeasurement = supportsWasteMeasurement(challengeToVerify);
  const measurement = hasMeasurement && (baseline !== '' || actual !== '')
    ? { baselineGrams: Number(baseline), actualGrams: Number(actual) } : undefined;
  let measurementError = '';
  let preview: number | null = null;
  if (measurement) {
    if (baseline === '' || actual === '') measurementError = '두 무게를 모두 입력하거나 모두 비워주세요.';
    else {
      try { preview = estimateCarbon(challengeToVerify, measurement).estimatedKgCO2e; }
      catch (error) { measurementError = (error as Error).message; }
    }
  }

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

  const handleConfirm = async () => {
    if (!selectedImage || measurementError) return;
    if (saving) return;
    setSaving(true); setSaveError('');
    try {
      await completeCertification(challengeToVerify.id, selectedImage, measurement);
      setSelectedImage(null); setScanComplete(false);
    } catch (error) { setSaveError(error instanceof Error ? error.message : '저장하지 못했어요. 다시 시도해주세요.'); }
    finally { setSaving(false); }
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
                      인증 사진 준비 중... (시연)
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
                        <span className="font-bold text-emerald-200">사진 준비 완료</span>
                        <p className="text-[10px] text-emerald-100/90">
                          실천 내용과 입력 무게를 확인해주세요
                        </p>
                      </div>
                    </div>
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

          {hasMeasurement && (
            <section className="rounded-xl bg-emerald-50 p-3 space-y-2 text-xs text-emerald-900">
              <h4 className="font-bold">음식물쓰레기 감축 무게 (선택)</h4>
              <p>같은 식사량·조건에서 평소 남기는 무게와 이번에 남긴 무게를 측정해 입력해주세요. 먹은 음식의 무게가 아니에요.</p>
              <label className="block">비교 기준 잔반 (g)
                <input type="number" min="0" step="any" value={baseline} onChange={e => setBaseline(e.target.value)} className="mt-1 w-full rounded-lg bg-white border p-2" placeholder="예: 200" />
              </label>
              <label className="block">실천 후 잔반 (g)
                <input type="number" min="0" step="any" value={actual} onChange={e => setActual(e.target.value)} className="mt-1 w-full rounded-lg bg-white border p-2" placeholder="예: 50" />
              </label>
              {measurementError ? <p role="alert" className="text-red-700">{measurementError}</p> : preview !== null ? <p role="status">감축 추정량: {preview} kg CO₂e</p> : <p>무게를 입력하지 않으면 CO₂는 계산하지 않고 포인트만 반영해요.</p>}
              <p className="text-[10px]">감축 무게(kg) × 1.65. 제공된 창원시 자료의 추정치이며 진주시 공인 실적이 아닙니다.</p>
            </section>
          )}
          {/* Verification Status Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-2.5 flex items-start space-x-2 text-[11px] text-amber-800">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">시범 인증 안내</span>
              <p className="text-[10px] text-amber-700 mt-0.5">
                사진 확인은 시연용입니다. 무게는 사진으로 판별하지 않으며, 측정값과 적용 가능한 계수가 있을 때만 CO₂ 추정량을 기록합니다.
              </p>
            </div>
          </div>

          {/* Final Submit Button */}
          {saveError && <p role="alert" className="text-xs text-red-700">{saveError}</p>}
          <button
            disabled={saving || !selectedImage || isScanning || !!measurementError}
            onClick={handleConfirm}
            className={`w-full py-3.5 rounded-2xl font-bold text-sm shadow-lg flex items-center justify-center space-x-2 transition-all ${
              selectedImage && !isScanning
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-500 hover:to-teal-500 shadow-emerald-600/30 cursor-pointer active:scale-95'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            <span>{saving ? '계정에 저장 중...' : '실천 인증 완료하기'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

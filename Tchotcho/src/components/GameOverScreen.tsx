import { useEffect, useRef, useState } from 'react';
import { audioEngine } from '../utils/audio';
import { setBestScore, addToLeaderboard, getBestScore } from '../utils/storage';

interface GameOverScreenProps {
  score: number;
  onRetry: () => void;
  onHome: () => void;
}

export default function GameOverScreen({ score, onRetry, onHome }: GameOverScreenProps) {
  const [isNewRecord, setIsNewRecord] = useState(false);
  const [best, setBest] = useState(0);
  const recordedRef = useRef(false);

  useEffect(() => {
    if (recordedRef.current) return;
    recordedRef.current = true;

    const wasRecord = setBestScore(score);
    addToLeaderboard(score);
    setIsNewRecord(wasRecord);
    setBest(getBestScore());
    if (wasRecord && score > 0) {
      const t = window.setTimeout(() => audioEngine.playNewRecord(), 350);
      return () => window.clearTimeout(t);
    }
  }, [score]);

  const handleRetry = () => {
    audioEngine.playClick();
    onRetry();
  };

  const handleHome = () => {
    audioEngine.playClick();
    onHome();
  };

  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{ zIndex: 50, background: 'rgba(0,0,0,0.35)' }}
    >
      <div
        className="pop-in mx-6 w-full max-w-sm rounded-2xl border-4 border-[#1B4D14] bg-[#FFF6E0] px-6 py-7 text-center shadow-2xl"
        style={{ boxShadow: '0 10px 0 rgba(0,0,0,0.25), 0 14px 30px rgba(0,0,0,0.35)' }}
      >
        <h2
          className="font-pixel-ar mb-1 text-3xl text-[#E0522A]"
          style={{ WebkitTextStroke: '1px #6b1f0f', textShadow: '0 3px 0 rgba(0,0,0,0.2)' }}
        >
          انتهت اللعبة
        </h2>

        {isNewRecord && score > 0 && (
          <p className="font-pixel-ar mb-3 text-sm text-[#D89A00] animate-pulse">
            🏆 رقم قياسي جديد!
          </p>
        )}

        <div className="my-5 flex items-center justify-around">
          <div className="flex flex-col items-center">
            <span className="font-pixel-ar text-xs text-[#6b5a3a]">النقاط</span>
            <span className="font-pixel-en mt-1 text-3xl text-[#1B4D14]">{score}</span>
          </div>
          <div className="h-12 w-[2px] bg-[#d8c9a0]" />
          <div className="flex flex-col items-center">
            <span className="font-pixel-ar text-xs text-[#6b5a3a]">الأفضل</span>
            <span className="font-pixel-en mt-1 text-3xl text-[#D89A00]">{best}</span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleRetry}
            className="font-pixel-ar rounded-xl border-3 border-[#1B4D14] bg-[#5BC744] py-3 text-lg text-white shadow-md transition-transform active:scale-95"
            style={{ boxShadow: '0 4px 0 #2E7D24' }}
          >
            ▶ أعد المحاولة
          </button>
          <button
            onClick={handleHome}
            className="font-pixel-ar rounded-xl border-3 border-[#1B4D14] bg-white py-3 text-lg text-[#1B4D14] shadow-md transition-transform active:scale-95"
            style={{ boxShadow: '0 4px 0 #cbb98a' }}
          >
            🏠 القائمة الرئيسية
          </button>
        </div>
      </div>
    </div>
  );
}

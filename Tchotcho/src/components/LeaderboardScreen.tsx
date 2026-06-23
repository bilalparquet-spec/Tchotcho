import { useEffect, useState } from 'react';
import { getLeaderboard, clearLeaderboard, getBestScore } from '../utils/storage';
import type { ScoreEntry } from '../utils/storage';
import { audioEngine } from '../utils/audio';

interface LeaderboardScreenProps {
  onBack: () => void;
}

export default function LeaderboardScreen({ onBack }: LeaderboardScreenProps) {
  const [entries, setEntries] = useState<ScoreEntry[]>([]);
  const [best, setBest] = useState(0);

  useEffect(() => {
    setEntries(getLeaderboard());
    setBest(getBestScore());
  }, []);

  const handleBack = () => {
    audioEngine.playClick();
    onBack();
  };

  const handleClear = () => {
    audioEngine.playClick();
    clearLeaderboard();
    setEntries([]);
    setBest(0);
  };

  return (
    <div className="absolute inset-0 overflow-hidden">
      <img
        src="/bg/splash_screen.jpg"
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: 'blur(3px) brightness(0.7)' }}
      />
      <div className="absolute inset-0 flex items-center justify-center px-6">
        <div
          className="pop-in w-full max-w-sm rounded-2xl border-4 border-[#1B4D14] bg-[#FFF6E0] px-6 py-6 shadow-2xl"
          style={{ boxShadow: '0 10px 0 rgba(0,0,0,0.25), 0 14px 30px rgba(0,0,0,0.35)' }}
        >
          <h2 className="font-pixel-ar mb-4 text-center text-2xl text-[#1B4D14]">
            🏆 الأرقام القياسية
          </h2>

          <div className="mb-4 rounded-xl bg-[#E0522A] py-3 text-center">
            <span className="font-pixel-ar text-sm text-white">أفضل نتيجة</span>
            <div className="font-pixel-en mt-1 text-2xl text-white">{best}</div>
          </div>

          <div className="max-h-64 overflow-y-auto rounded-lg border-2 border-[#d8c9a0] bg-white/60">
            {entries.length === 0 ? (
              <p className="font-pixel-ar py-8 text-center text-sm text-[#6b5a3a]">
                لا توجد نتائج بعد، العب أول مرة!
              </p>
            ) : (
              <ul>
                {entries.map((e, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between border-b border-[#eee0c0] px-4 py-2.5 last:border-0"
                  >
                    <span className="font-pixel-ar text-sm text-[#6b5a3a]">
                      {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                    </span>
                    <span className="font-pixel-en text-base text-[#1B4D14]">{e.score}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mt-5 flex flex-col gap-3">
            <button
              onClick={handleBack}
              className="font-pixel-ar rounded-xl border-3 border-[#1B4D14] bg-[#5BC744] py-3 text-base text-white shadow-md transition-transform active:scale-95"
              style={{ boxShadow: '0 4px 0 #2E7D24' }}
            >
              رجوع
            </button>
            {entries.length > 0 && (
              <button
                onClick={handleClear}
                className="font-pixel-ar rounded-xl border-2 border-[#c0392b]/40 bg-transparent py-2 text-xs text-[#c0392b] transition-transform active:scale-95"
              >
                مسح السجل
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

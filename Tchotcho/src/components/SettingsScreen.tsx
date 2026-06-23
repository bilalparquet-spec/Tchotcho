import { useState } from 'react';
import { getSettings, saveSettings } from '../utils/storage';
import { audioEngine } from '../utils/audio';

interface SettingsScreenProps {
  onBack: () => void;
}

export default function SettingsScreen({ onBack }: SettingsScreenProps) {
  const [settings, setSettings] = useState(getSettings());

  const toggleMusic = () => {
    const next = { ...settings, music: !settings.music };
    setSettings(next);
    saveSettings(next);
    audioEngine.setMusicEnabled(next.music);
    audioEngine.playClick();
  };

  const toggleSfx = () => {
    const next = { ...settings, sfx: !settings.sfx };
    setSettings(next);
    saveSettings(next);
    audioEngine.setSfxEnabled(next.sfx);
    if (next.sfx) audioEngine.playClick();
  };

  const handleBack = () => {
    audioEngine.playClick();
    onBack();
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
          <h2 className="font-pixel-ar mb-5 text-center text-2xl text-[#1B4D14]">
            ⚙️ الإعدادات
          </h2>

          <div className="flex flex-col gap-3">
            <button
              onClick={toggleMusic}
              className="flex items-center justify-between rounded-xl border-2 border-[#1B4D14] bg-white px-4 py-3.5 transition-transform active:scale-95"
            >
              <span className="font-pixel-ar text-base text-[#1B4D14]">🎵 الموسيقى</span>
              <span
                className={`font-pixel-ar rounded-full px-4 py-1 text-sm text-white ${
                  settings.music ? 'bg-[#5BC744]' : 'bg-[#999]'
                }`}
              >
                {settings.music ? 'تشغيل' : 'إيقاف'}
              </span>
            </button>

            <button
              onClick={toggleSfx}
              className="flex items-center justify-between rounded-xl border-2 border-[#1B4D14] bg-white px-4 py-3.5 transition-transform active:scale-95"
            >
              <span className="font-pixel-ar text-base text-[#1B4D14]">🔊 المؤثرات الصوتية</span>
              <span
                className={`font-pixel-ar rounded-full px-4 py-1 text-sm text-white ${
                  settings.sfx ? 'bg-[#5BC744]' : 'bg-[#999]'
                }`}
              >
                {settings.sfx ? 'تشغيل' : 'إيقاف'}
              </span>
            </button>
          </div>

          <button
            onClick={handleBack}
            className="font-pixel-ar mt-6 w-full rounded-xl border-3 border-[#1B4D14] bg-[#5BC744] py-3 text-base text-white shadow-md transition-transform active:scale-95"
            style={{ boxShadow: '0 4px 0 #2E7D24' }}
          >
            رجوع
          </button>
        </div>
      </div>
    </div>
  );
}

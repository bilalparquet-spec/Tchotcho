import { audioEngine } from '../utils/audio';

interface SplashScreenProps {
  onPlay: () => void;
  onLeaderboard: () => void;
  onSettings: () => void;
}

// الإحداثيات مأخوذة بدقة من تحليل بكسلي لصورة splash_screen الأصلية (941x1672)
const BTN = {
  left: '29.76%',
  width: '37.4%',
  play: { top: '69.26%', height: '6.22%' },
  leaderboard: { top: '77.03%', height: '5.63%' },
  settings: { top: '84.21%', height: '5.26%' },
};

export default function SplashScreen({ onPlay, onLeaderboard, onSettings }: SplashScreenProps) {
  const handle = (fn: () => void) => () => {
    audioEngine.init();
    audioEngine.playClick();
    audioEngine.startMusic();
    fn();
  };

  return (
    <div className="absolute inset-0 overflow-hidden select-none">
      <img
        src="/bg/splash_screen.jpg"
        alt="تشوتشو مالح"
        draggable={false}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* زر اللعب */}
      <button
        aria-label="ابدأ اللعب"
        onClick={handle(onPlay)}
        className="absolute active:scale-95 transition-transform"
        style={{
          left: BTN.left,
          width: BTN.width,
          top: BTN.play.top,
          height: BTN.play.height,
        }}
      />

      {/* زر لوحة المتصدرين */}
      <button
        aria-label="لوحة الأرقام القياسية"
        onClick={handle(onLeaderboard)}
        className="absolute active:scale-95 transition-transform"
        style={{
          left: BTN.left,
          width: BTN.width,
          top: BTN.leaderboard.top,
          height: BTN.leaderboard.height,
        }}
      />

      {/* زر الإعدادات */}
      <button
        aria-label="الإعدادات"
        onClick={handle(onSettings)}
        className="absolute active:scale-95 transition-transform"
        style={{
          left: BTN.left,
          width: BTN.width,
          top: BTN.settings.top,
          height: BTN.settings.height,
        }}
      />
    </div>
  );
}

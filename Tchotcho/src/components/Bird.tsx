import { memo, useEffect, useRef, useState } from 'react';

// عرض الطائر الثابت في اللعبة (px) — الارتفاع يتحسب تلقائياً من نسبة الصورة
const BIRD_RENDER_WIDTH = 68;

// إطارات الأنيميشن
const FLAP_FRAMES = [
  '/sprites/fly_down_1.png',
  '/sprites/fly_down_2.png',
  '/sprites/fly_up_1.png',
  '/sprites/fly_up_2.png',
];

interface BirdProps {
  y: number;
  rotation: number;
  status: 'ready' | 'playing' | 'dead';
  velocity: number;
}

function BirdComponent({ y, rotation, status, velocity }: BirdProps) {
  const [frame, setFrame] = useState(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (status === 'dead') {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = window.setInterval(() => setFrame(f => f + 1), 100);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [status]);

  // اختيار الـ sprite بناءً على الحالة والسرعة
  let src: string;
  if (status === 'dead') {
    src = '/sprites/hit.png';
  } else if (velocity < -80) {
    // يصعد — أجنحة للأعلى
    src = '/sprites/fly_up_1.png';
  } else if (velocity > 250) {
    // يهبط بسرعة — أجنحة للأسفل
    src = '/sprites/fall_1.png';
  } else {
    // طيران عادي — يتناوب
    src = FLAP_FRAMES[frame % FLAP_FRAMES.length];
  }

  return (
    <div
      className="absolute"
      style={{
        left: `calc(32% - ${BIRD_RENDER_WIDTH / 2}px)`,
        top: y - 30,   // 30 تقريباً نصف الارتفاع المتوسط للطائر
        width: BIRD_RENDER_WIDTH,
        zIndex: 20,
        transform: `rotate(${rotation}deg)`,
        transformOrigin: 'center center',
        willChange: 'transform, top',
        filter: 'drop-shadow(1px 2px 3px rgba(0,0,0,0.3))',
        pointerEvents: 'none',
      }}
    >
      <img
        src={src}
        alt="طائر"
        draggable={false}
        style={{
          width: '100%',
          height: 'auto',
          imageRendering: 'pixelated',
          display: 'block',
        }}
      />
    </div>
  );
}

export const Bird = memo(BirdComponent);

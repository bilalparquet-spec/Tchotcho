import { memo, useEffect, useState } from 'react';
import { GAME } from '../game/constants';

// إطارات الطيران العادي (تبديل بين الأجنحة لأسفل وأعلى أثناء التحليق المستمر)
const FLY_FRAMES = [
  '/sprites/fly_down_1.png',
  '/sprites/fly_up_1.png',
  '/sprites/fly_down_2.png',
  '/sprites/fly_up_2.png',
];

const RISE_FRAMES = ['/sprites/rise_1.png', '/sprites/rise_2.png'];
const FALL_FRAMES = ['/sprites/fall_1.png', '/sprites/fall_2.png'];

interface BirdProps {
  y: number;
  rotation: number;
  status: 'ready' | 'playing' | 'dead';
  isFlapping: boolean; // true لفترة وجيزة بعد كل ضغطة
  velocity: number;
}

function BirdComponent({ y, rotation, status, isFlapping, velocity }: BirdProps) {
  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    if (status === 'dead') return;
    const id = window.setInterval(() => {
      setFrameIndex((i) => i + 1);
    }, GAME.FLAP_ANIM_SPEED);
    return () => window.clearInterval(id);
  }, [status]);

  let sprite: string;
  if (status === 'dead') {
    sprite = '/sprites/hit.png';
  } else if (status === 'ready') {
    sprite = FLY_FRAMES[frameIndex % FLY_FRAMES.length];
  } else if (isFlapping || velocity < -60) {
    sprite = RISE_FRAMES[frameIndex % RISE_FRAMES.length];
  } else if (velocity > 220) {
    sprite = FALL_FRAMES[frameIndex % FALL_FRAMES.length];
  } else {
    sprite = FLY_FRAMES[frameIndex % FLY_FRAMES.length];
  }

  return (
    <div
      className="absolute"
      style={{
        left: `${GAME.BIRD_X * 100}%`,
        top: y,
        width: GAME.BIRD_WIDTH,
        height: GAME.BIRD_HEIGHT,
        transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
        transition: status === 'playing' ? 'transform 0.08s linear' : undefined,
        willChange: 'transform, top',
        zIndex: 20,
        filter: 'drop-shadow(0 3px 4px rgba(0,0,0,0.25))',
      }}
    >
      <img
        src={sprite}
        alt=""
        draggable={false}
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
      />
    </div>
  );
}

export const Bird = memo(BirdComponent);

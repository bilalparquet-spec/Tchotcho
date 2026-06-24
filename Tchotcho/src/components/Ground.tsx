import { memo } from 'react';
import { GAME } from '../game/constants';

interface GroundProps {
  offset: number; // إزاحة بكسل للحركة
}

function GroundComponent({ offset }: GroundProps) {
  return (
    <div
      className="absolute bottom-0 left-0 right-0"
      style={{
        height: GAME.GROUND_HEIGHT,
        zIndex: 15,
        backgroundImage: 'url(/bg/ground_strip.jpg)',
        backgroundRepeat: 'repeat-x',
        backgroundSize: 'auto 100%',
        backgroundPositionX: -offset,
      }}
    />
  );
}

export const Ground = memo(GroundComponent);

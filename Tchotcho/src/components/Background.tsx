import { memo } from 'react';

function BackgroundComponent() {
  return (
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: 'url(/bg/bg_gameplay.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        filter: 'blur(2.5px)',
        transform: 'scale(1.04)', // لإخفاء حواف البلور
        zIndex: 0,
      }}
    />
  );
}

export const Background = memo(BackgroundComponent);

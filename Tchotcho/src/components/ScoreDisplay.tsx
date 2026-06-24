import { memo } from 'react';

interface ScoreDisplayProps {
  score: number;
}

function ScoreDisplayComponent({ score }: ScoreDisplayProps) {
  return (
    <div
      className="absolute left-1/2 pop-in"
      style={{ top: '6%', transform: 'translateX(-50%)', zIndex: 30 }}
      key={score}
    >
      <span
        className="font-pixel-en text-white"
        style={{
          fontSize: 'clamp(36px, 11vw, 56px)',
          WebkitTextStroke: '2px #1B4D14',
          textShadow: '0 4px 0 #1B4D14, 0 6px 8px rgba(0,0,0,0.3)',
          letterSpacing: '2px',
        }}
      >
        {score}
      </span>
    </div>
  );
}

export const ScoreDisplay = memo(ScoreDisplayComponent);

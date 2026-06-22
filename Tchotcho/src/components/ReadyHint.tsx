import { memo } from 'react';

function ReadyHintComponent() {
  return (
    <div
      className="absolute left-1/2 flex flex-col items-center gap-2"
      style={{ top: '32%', transform: 'translateX(-50%)', zIndex: 25 }}
    >
      <div
        className="font-pixel-ar rounded-xl border-3 border-[#1B4D14] bg-white/90 px-5 py-2.5 text-base text-[#1B4D14] shadow-lg"
        style={{ animation: 'bounce-hint 1.4s ease-in-out infinite' }}
      >
        👆 اضغط للطيران
      </div>
    </div>
  );
}

export const ReadyHint = memo(ReadyHintComponent);

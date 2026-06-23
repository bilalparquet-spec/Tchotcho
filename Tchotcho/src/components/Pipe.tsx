import { memo } from 'react';
import { GAME } from '../game/constants';

interface PipeProps {
  x: number;
  topHeight: number;  // ارتفاع الأنبوب العلوي (من أعلى الشاشة حتى بداية الفراغ)
  gapEnd: number;     // نهاية الفراغ (بداية الأنبوب السفلي)
  groundY: number;    // موقع سطح الأرض
}

const W = GAME.PIPE_WIDTH;
const CAP_H = 28;    // ارتفاع رأس الأنبوب
const BODY_INSET = 8; // الجسم أضيق من الرأس

// ألوان الأنبوب
const BODY_DARK   = '#2D8B1C';
const BODY_MID    = '#4AB830';
const BODY_LIGHT  = '#7AE050';
const BODY_SHINE  = '#A8F07A';
const CAP_DARK    = '#1F6B12';
const CAP_MID     = '#3EA828';
const CAP_LIGHT   = '#6BD845';
const CAP_SHINE   = '#A8F07A';
const BORDER      = '#174D0A';

/**
 * أنبوب علوي: رأسه في الأسفل (عند نهاية الأنبوب)، جسمه يمتد للأعلى
 * height = ارتفاع الأنبوب الكلي (من أعلى الشاشة حتى الفراغ)
 */
function TopPipeSVG({ height }: { height: number }) {
  if (height <= 0) return null;
  const bodyH = Math.max(height - CAP_H, 0);
  const bx = BODY_INSET;
  const bw = W - BODY_INSET * 2;

  return (
    <svg
      width={W}
      height={height}
      viewBox={`0 0 ${W} ${height}`}
      style={{ display: 'block' }}
      shapeRendering="crispEdges"
    >
      {/* جسم الأنبوب - من الأعلى حتى بداية الرأس */}
      {bodyH > 0 && (
        <>
          {/* خلفية الجسم */}
          <rect x={bx} y={0} width={bw} height={bodyH} fill={BODY_MID} />
          {/* ظل يسار */}
          <rect x={bx} y={0} width={6} height={bodyH} fill={BODY_DARK} />
          {/* لمعان يمين */}
          <rect x={bx + 10} y={0} width={8} height={bodyH} fill={BODY_LIGHT} />
          <rect x={bx + 14} y={0} width={4} height={bodyH} fill={BODY_SHINE} opacity="0.5" />
          {/* حدود */}
          <rect x={bx} y={0} width={1} height={bodyH} fill={BORDER} />
          <rect x={bx + bw - 1} y={0} width={1} height={bodyH} fill={BORDER} />
        </>
      )}

      {/* رأس الأنبوب - في الأسفل */}
      <rect x={0} y={bodyH} width={W} height={CAP_H} fill={CAP_MID} />
      <rect x={0} y={bodyH} width={6} height={CAP_H} fill={CAP_DARK} />
      <rect x={10} y={bodyH} width={10} height={CAP_H} fill={CAP_LIGHT} />
      <rect x={15} y={bodyH} width={5} height={CAP_H} fill={CAP_SHINE} opacity="0.5" />
      {/* حدود الرأس */}
      <rect x={0} y={bodyH} width={W} height={1} fill={BORDER} />
      <rect x={0} y={bodyH + CAP_H - 1} width={W} height={1} fill={BORDER} />
      <rect x={0} y={bodyH} width={1} height={CAP_H} fill={BORDER} />
      <rect x={W - 1} y={bodyH} width={1} height={CAP_H} fill={BORDER} />
    </svg>
  );
}

/**
 * أنبوب سفلي: رأسه في الأعلى (عند بداية الأنبوب)، جسمه يمتد للأسفل حتى الأرض
 * height = ارتفاع الأنبوب الكلي (من نهاية الفراغ حتى الأرض)
 */
function BottomPipeSVG({ height }: { height: number }) {
  if (height <= 0) return null;
  const bodyH = Math.max(height - CAP_H, 0);
  const bx = BODY_INSET;
  const bw = W - BODY_INSET * 2;

  return (
    <svg
      width={W}
      height={height}
      viewBox={`0 0 ${W} ${height}`}
      style={{ display: 'block' }}
      shapeRendering="crispEdges"
    >
      {/* رأس الأنبوب - في الأعلى */}
      <rect x={0} y={0} width={W} height={CAP_H} fill={CAP_MID} />
      <rect x={0} y={0} width={6} height={CAP_H} fill={CAP_DARK} />
      <rect x={10} y={0} width={10} height={CAP_H} fill={CAP_LIGHT} />
      <rect x={15} y={0} width={5} height={CAP_H} fill={CAP_SHINE} opacity="0.5" />
      {/* حدود الرأس */}
      <rect x={0} y={0} width={W} height={1} fill={BORDER} />
      <rect x={0} y={CAP_H - 1} width={W} height={1} fill={BORDER} />
      <rect x={0} y={0} width={1} height={CAP_H} fill={BORDER} />
      <rect x={W - 1} y={0} width={1} height={CAP_H} fill={BORDER} />

      {/* جسم الأنبوب - من بعد الرأس حتى الأسفل */}
      {bodyH > 0 && (
        <>
          <rect x={bx} y={CAP_H} width={bw} height={bodyH} fill={BODY_MID} />
          <rect x={bx} y={CAP_H} width={6} height={bodyH} fill={BODY_DARK} />
          <rect x={bx + 10} y={CAP_H} width={8} height={bodyH} fill={BODY_LIGHT} />
          <rect x={bx + 14} y={CAP_H} width={4} height={bodyH} fill={BODY_SHINE} opacity="0.5" />
          <rect x={bx} y={CAP_H} width={1} height={bodyH} fill={BORDER} />
          <rect x={bx + bw - 1} y={CAP_H} width={1} height={bodyH} fill={BORDER} />
        </>
      )}
    </svg>
  );
}

function PipeComponent({ x, topHeight, gapEnd, groundY }: PipeProps) {
  const bottomHeight = Math.max(groundY - gapEnd, 0);

  return (
    <div
      className="absolute top-0"
      style={{
        left: x,
        width: W,
        height: groundY,
        willChange: 'left',
        zIndex: 10,
      }}
    >
      {/* الأنبوب العلوي - رأسه في الأسفل، جسمه يمتد للأعلى */}
      {topHeight > 0 && (
        <div
          className="absolute top-0"
          style={{ left: 0, width: W, height: topHeight }}
        >
          <TopPipeSVG height={topHeight} />
        </div>
      )}

      {/* الأنبوب السفلي - رأسه في الأعلى، مثبت بالأرض */}
      {bottomHeight > 0 && (
        <div
          className="absolute"
          style={{ left: 0, top: gapEnd, width: W, height: bottomHeight }}
        >
          <BottomPipeSVG height={bottomHeight} />
        </div>
      )}
    </div>
  );
}

export const Pipe = memo(PipeComponent);

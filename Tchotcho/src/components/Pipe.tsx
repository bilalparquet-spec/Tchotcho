import { memo } from 'react';
import { GAME } from '../game/constants';

interface PipeProps {
  x: number;
  topHeight: number; // ارتفاع الجزء العلوي
  gapEnd: number;
  groundY: number; // موقع بداية الأرض (نهاية المساحة القابلة للعب)
}

// أنبوب بستايل Flappy Bird الأصلي: أخضر مع حافة (cap) وحواف داكنة وخط لمعان
function PipeSVG({ height, flipped }: { height: number; flipped: boolean }) {
  const capHeight = 26;
  const bodyHeight = Math.max(height - capHeight, 0);

  return (
    <svg
      width={GAME.PIPE_WIDTH}
      height={height}
      viewBox={`0 0 ${GAME.PIPE_WIDTH} ${height}`}
      style={{
        display: 'block',
        transform: flipped ? 'scaleY(-1)' : undefined,
        filter: 'drop-shadow(2px 0 0 rgba(0,0,0,0.15))',
      }}
      shapeRendering="crispEdges"
    >
      <defs>
        <linearGradient id={`pipeBody-${flipped}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#3FA12E" />
          <stop offset="14%" stopColor="#5BC744" />
          <stop offset="38%" stopColor="#8EEB6E" />
          <stop offset="55%" stopColor="#5BC744" />
          <stop offset="100%" stopColor="#2E7D24" />
        </linearGradient>
        <linearGradient id={`pipeCap-${flipped}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#3FA12E" />
          <stop offset="12%" stopColor="#65D24C" />
          <stop offset="40%" stopColor="#9BF57E" />
          <stop offset="58%" stopColor="#65D24C" />
          <stop offset="100%" stopColor="#256B1C" />
        </linearGradient>
      </defs>

      {/* جسم الأنبوب */}
      <rect
        x="6"
        y={capHeight}
        width={GAME.PIPE_WIDTH - 12}
        height={bodyHeight}
        fill={`url(#pipeBody-${flipped})`}
        stroke="#1B4D14"
        strokeWidth="3"
      />

      {/* رأس الأنبوب (الجزء البارز) */}
      <rect
        x="0"
        y="0"
        width={GAME.PIPE_WIDTH}
        height={capHeight}
        rx="2"
        fill={`url(#pipeCap-${flipped})`}
        stroke="#1B4D14"
        strokeWidth="3"
      />

      {/* خط لمعان داخلي على الرأس */}
      <rect x="10" y="6" width="9" height={capHeight - 12} fill="#C8FFB0" opacity="0.55" />
      {/* خط لمعان على الجسم */}
      <rect x="13" y={capHeight + 8} width="9" height={Math.max(bodyHeight - 16, 0)} fill="#C8FFB0" opacity="0.4" />
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
        width: GAME.PIPE_WIDTH,
        height: groundY,
        willChange: 'left',
        zIndex: 10,
      }}
    >
      {/* الأنبوب العلوي - مقلوب */}
      <div
        className="absolute top-0"
        style={{ left: 0, width: GAME.PIPE_WIDTH, height: topHeight, overflow: 'hidden' }}
      >
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: GAME.PIPE_WIDTH }}>
          <PipeSVG height={topHeight} flipped={true} />
        </div>
      </div>

      {/* الأنبوب السفلي */}
      <div className="absolute" style={{ left: 0, top: gapEnd, width: GAME.PIPE_WIDTH, height: bottomHeight, overflow: 'hidden' }}>
        <PipeSVG height={bottomHeight} flipped={false} />
      </div>
    </div>
  );
}

export const Pipe = memo(PipeComponent);

import { memo } from 'react';
import { GAME } from '../game/constants';

interface PipeProps {
  x: number;
  topHeight: number;
  gapEnd: number;
  screenHeight: number; // الارتفاع الكلي للشاشة (الأنبوب يمتد حتى هنا تحت الأرض)
}

const W = GAME.PIPE_WIDTH;
const CAP_H = 30;
const BODY_INSET = 8;

const C = {
  bodyDark:  '#2A8019',
  bodyMid:   '#44B82E',
  bodyLight: '#72DD4A',
  bodyShine: '#A0F070',
  capDark:   '#1E6412',
  capMid:    '#3AA826',
  capLight:  '#68D840',
  capShine:  '#A0F070',
  border:    '#163D0A',
};

/* أنبوب علوي: رأسه في الأسفل، جسمه يمتد للأعلى من السقف */
function TopPipeSVG({ height }: { height: number }) {
  if (height <= 0) return null;
  const bH = Math.max(height - CAP_H, 0);
  const bx = BODY_INSET;
  const bw = W - BODY_INSET * 2;
  return (
    <svg width={W} height={height} viewBox={`0 0 ${W} ${height}`} style={{ display: 'block' }} shapeRendering="crispEdges">
      {/* جسم */}
      {bH > 0 && <>
        <rect x={bx} y={0} width={bw} height={bH} fill={C.bodyMid}/>
        <rect x={bx} y={0} width={5} height={bH} fill={C.bodyDark}/>
        <rect x={bx+9} y={0} width={7} height={bH} fill={C.bodyLight}/>
        <rect x={bx+13} y={0} width={4} height={bH} fill={C.bodyShine} opacity="0.5"/>
        <rect x={bx} y={0} width={1} height={bH} fill={C.border}/>
        <rect x={bx+bw-1} y={0} width={1} height={bH} fill={C.border}/>
      </>}
      {/* رأس في الأسفل */}
      <rect x={0} y={bH} width={W} height={CAP_H} fill={C.capMid}/>
      <rect x={0} y={bH} width={5} height={CAP_H} fill={C.capDark}/>
      <rect x={9} y={bH} width={9} height={CAP_H} fill={C.capLight}/>
      <rect x={14} y={bH} width={4} height={CAP_H} fill={C.capShine} opacity="0.5"/>
      <rect x={0} y={bH} width={W} height={1} fill={C.border}/>
      <rect x={0} y={bH+CAP_H-1} width={W} height={1} fill={C.border}/>
      <rect x={0} y={bH} width={1} height={CAP_H} fill={C.border}/>
      <rect x={W-1} y={bH} width={1} height={CAP_H} fill={C.border}/>
    </svg>
  );
}

/* أنبوب سفلي: رأسه في الأعلى، جسمه يمتد للأسفل حتى خارج الشاشة */
function BottomPipeSVG({ height }: { height: number }) {
  if (height <= 0) return null;
  const bH = Math.max(height - CAP_H, 0);
  const bx = BODY_INSET;
  const bw = W - BODY_INSET * 2;
  return (
    <svg width={W} height={height} viewBox={`0 0 ${W} ${height}`} style={{ display: 'block' }} shapeRendering="crispEdges">
      {/* رأس في الأعلى */}
      <rect x={0} y={0} width={W} height={CAP_H} fill={C.capMid}/>
      <rect x={0} y={0} width={5} height={CAP_H} fill={C.capDark}/>
      <rect x={9} y={0} width={9} height={CAP_H} fill={C.capLight}/>
      <rect x={14} y={0} width={4} height={CAP_H} fill={C.capShine} opacity="0.5"/>
      <rect x={0} y={0} width={W} height={1} fill={C.border}/>
      <rect x={0} y={CAP_H-1} width={W} height={1} fill={C.border}/>
      <rect x={0} y={0} width={1} height={CAP_H} fill={C.border}/>
      <rect x={W-1} y={0} width={1} height={CAP_H} fill={C.border}/>
      {/* جسم */}
      {bH > 0 && <>
        <rect x={bx} y={CAP_H} width={bw} height={bH} fill={C.bodyMid}/>
        <rect x={bx} y={CAP_H} width={5} height={bH} fill={C.bodyDark}/>
        <rect x={bx+9} y={CAP_H} width={7} height={bH} fill={C.bodyLight}/>
        <rect x={bx+13} y={CAP_H} width={4} height={bH} fill={C.bodyShine} opacity="0.5"/>
        <rect x={bx} y={CAP_H} width={1} height={bH} fill={C.border}/>
        <rect x={bx+bw-1} y={CAP_H} width={1} height={bH} fill={C.border}/>
      </>}
    </svg>
  );
}

function PipeComponent({ x, topHeight, gapEnd, screenHeight }: PipeProps) {
  // الأنبوب السفلي يمتد 200px تحت الشاشة للضمان الكامل أنه ملتصق بالأرض
  const bottomHeight = Math.max(screenHeight + 200 - gapEnd, 0);

  return (
    <div className="absolute top-0" style={{ left: x, width: W, height: screenHeight + 200, willChange: 'left', zIndex: 10, overflow: 'visible' }}>
      {/* أنبوب علوي */}
      {topHeight > 0 && (
        <div className="absolute top-0" style={{ left: 0, width: W, height: topHeight, overflow: 'hidden' }}>
          <TopPipeSVG height={topHeight} />
        </div>
      )}
      {/* أنبوب سفلي - يمتد حتى نهاية الشاشة كاملاً */}
      {bottomHeight > 0 && (
        <div className="absolute" style={{ left: 0, top: gapEnd, width: W, height: bottomHeight }}>
          <BottomPipeSVG height={bottomHeight} />
        </div>
      )}
    </div>
  );
}

export const Pipe = memo(PipeComponent);

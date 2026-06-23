import { useEffect, useRef, useState, useCallback } from 'react';
import { Background } from './Background';
import { Bird } from './Bird';
import { Pipe } from './Pipe';
import { Ground } from './Ground';
import { ScoreDisplay } from './ScoreDisplay';
import { ReadyHint } from './ReadyHint';
import { useGameEngine } from '../game/useGameEngine';
import { GAME } from '../game/constants';
import { audioEngine } from '../utils/audio';

interface GameScreenProps {
  phase: 'ready' | 'playing';
  onStartPlaying: () => void;
  onGameOver: (score: number) => void;
  resetSignal: number;
}

export default function GameScreen({ phase, onStartPlaying, onGameOver, resetSignal }: GameScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setDims({ width: el.clientWidth, height: el.clientHeight });
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const engine = useGameEngine({
    width: dims.width,
    height: dims.height,
    active: phase === 'playing',
    onGameOver,
  });

  // إعادة الضبط عند تغير resetSignal (لعبة جديدة)
  useEffect(() => {
    engine.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetSignal, dims.width, dims.height]);

  const handleTap = useCallback(() => {
    audioEngine.init();
    if (phase === 'ready') {
      onStartPlaying();
      engine.flap();
    } else if (phase === 'playing') {
      engine.flap();
    }
  }, [phase, onStartPlaying, engine]);

  // دعم لوحة المفاتيح (مسافة) لتجربة سطح المكتب
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        handleTap();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleTap]);

  const groundY = dims.height - GAME.GROUND_HEIGHT;
  const idleBirdY = dims.height > 0 ? dims.height / 2 : 0;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden cursor-pointer"
      onPointerDown={handleTap}
    >
      <Background />

      {phase === 'playing' &&
        engine.pipes.map((p) => (
          <Pipe
            key={p.id}
            x={p.x}
            topHeight={p.topHeight}
            gapEnd={p.topHeight + GAME.PIPE_GAP}
            groundY={groundY}
          />
        ))}

      <Ground offset={phase === 'playing' ? engine.groundOffset : 0} />

      <Bird
        y={phase === 'playing' ? engine.birdY : idleBirdY}
        rotation={phase === 'playing' ? engine.rotation : 0}
        status={phase === 'playing' ? (engine.crashed ? 'dead' : 'playing') : 'ready'}
        isFlapping={engine.isFlapping}
        velocity={phase === 'playing' ? engine.velocity : 0}
      />

      {phase === 'playing' && <ScoreDisplay score={engine.score} />}
      {phase === 'ready' && <ReadyHint />}

      <div className="absolute bottom-0 left-0 w-full" style={{ height: dims.height - groundY }} />
    </div>
  );
}

import { useCallback, useEffect, useRef, useState } from 'react';
import { GAME } from '../game/constants';
import type { PipePair } from '../game/constants';
import { audioEngine } from '../utils/audio';

interface UseGameEngineProps {
  width: number;
  height: number;
  active: boolean; // فقط true عندما نكون في حالة 'playing'
  onGameOver: (score: number) => void;
}

let pipeIdCounter = 0;

export function useGameEngine({ width, height, active, onGameOver }: UseGameEngineProps) {
  const [birdY, setBirdY] = useState(height / 2);
  const [rotation, setRotation] = useState(0);
  const [pipes, setPipes] = useState<PipePair[]>([]);
  const [score, setScore] = useState(0);
  const [groundOffset, setGroundOffset] = useState(0);
  const [isFlapping, setIsFlapping] = useState(false);
  const [crashed, setCrashed] = useState(false);

  const velocityRef = useRef(0);
  const birdYRef = useRef(height / 2);
  const lastTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastPipeSpawnRef = useRef(0);
  const flapFlashTimeoutRef = useRef<number | null>(null);
  const scoreRef = useRef(0);
  const pipesRef = useRef<PipePair[]>([]);
  const groundOffsetRef = useRef(0);
  const endedRef = useRef(false);

  const groundY = height - GAME.GROUND_HEIGHT;

  // إعادة الضبط عند بداية لعبة جديدة
  const reset = useCallback(() => {
    const startY = height / 2;
    birdYRef.current = startY;
    velocityRef.current = 0;
    scoreRef.current = 0;
    pipesRef.current = [];
    groundOffsetRef.current = 0;
    lastPipeSpawnRef.current = 0;
    lastTimeRef.current = null;
    endedRef.current = false;
    pipeIdCounter = 0;

    setBirdY(startY);
    setRotation(0);
    setPipes([]);
    setScore(0);
    setGroundOffset(0);
    setCrashed(false);
  }, [height]);

  const flap = useCallback(() => {
    if (endedRef.current) return;
    velocityRef.current = GAME.FLAP_VELOCITY;
    setIsFlapping(true);
    audioEngine.playFlap();
    if (flapFlashTimeoutRef.current) window.clearTimeout(flapFlashTimeoutRef.current);
    flapFlashTimeoutRef.current = window.setTimeout(() => setIsFlapping(false), 110);
  }, []);

  const spawnPipe = useCallback(() => {
    const minTop = GAME.PIPE_MIN_TOP;
    const maxTop = groundY - GAME.PIPE_MIN_BOTTOM_GAP - GAME.PIPE_GAP;
    const topHeight = Math.random() * (maxTop - minTop) + minTop;
    pipeIdCounter += 1;
    return {
      id: pipeIdCounter,
      x: width + 20,
      topHeight,
      passed: false,
    } as PipePair;
  }, [width, groundY]);

  const checkCollision = useCallback(
    (birdYPos: number, currentPipes: PipePair[]) => {
      const birdLeft = width * GAME.BIRD_X - GAME.BIRD_WIDTH / 2 + GAME.HITBOX_PADDING;
      const birdRight = width * GAME.BIRD_X + GAME.BIRD_WIDTH / 2 - GAME.HITBOX_PADDING;
      const birdTop = birdYPos - GAME.BIRD_HEIGHT / 2 + GAME.HITBOX_PADDING;
      const birdBottom = birdYPos + GAME.BIRD_HEIGHT / 2 - GAME.HITBOX_PADDING;

      // الأرض والسقف
      if (birdBottom >= groundY) return true;
      if (birdTop <= 0) return true;

      for (const pipe of currentPipes) {
        const pipeLeft = pipe.x;
        const pipeRight = pipe.x + GAME.PIPE_WIDTH;
        if (birdRight > pipeLeft && birdLeft < pipeRight) {
          const gapTop = pipe.topHeight;
          const gapBottom = pipe.topHeight + GAME.PIPE_GAP;
          if (birdTop < gapTop || birdBottom > gapBottom) {
            return true;
          }
        }
      }
      return false;
    },
    [width, groundY]
  );

  const endGame = useCallback(() => {
    if (endedRef.current) return;
    endedRef.current = true;
    setCrashed(true);
    audioEngine.playHit();
    window.setTimeout(() => audioEngine.playFall(), 150);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    window.setTimeout(() => {
      onGameOver(scoreRef.current);
    }, 700);
  }, [onGameOver]);

  // حلقة اللعبة الرئيسية
  useEffect(() => {
    if (!active || width === 0 || height === 0) {
      lastTimeRef.current = null;
      return;
    }

    const loop = (time: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = time;
        lastPipeSpawnRef.current = time;
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      let dt = (time - lastTimeRef.current) / 1000;
      dt = Math.min(dt, GAME.FRAME_DT_CAP / 1000);
      lastTimeRef.current = time;

      if (!endedRef.current) {
        // فيزياء الطائر
        velocityRef.current = Math.min(
          velocityRef.current + GAME.GRAVITY * dt,
          GAME.MAX_FALL_SPEED
        );
        birdYRef.current += velocityRef.current * dt;

        const targetRotation =
          velocityRef.current < 0
            ? GAME.ROTATION_UP
            : Math.min(
                (velocityRef.current / GAME.MAX_FALL_SPEED) * GAME.ROTATION_DOWN,
                GAME.ROTATION_DOWN
              );
        setRotation(targetRotation);

        // الأنابيب
        if (time - lastPipeSpawnRef.current >= GAME.PIPE_SPAWN_INTERVAL) {
          lastPipeSpawnRef.current = time;
          pipesRef.current = [...pipesRef.current, spawnPipe()];
        }

        const birdCenterX = width * GAME.BIRD_X;
        pipesRef.current = pipesRef.current
          .map((p) => {
            const newX = p.x - GAME.PIPE_SPEED * dt;
            let passed = p.passed;
            if (!passed && newX + GAME.PIPE_WIDTH < birdCenterX) {
              passed = true;
              scoreRef.current += 1;
              setScore(scoreRef.current);
              audioEngine.playScore();
            }
            return { ...p, x: newX, passed };
          })
          .filter((p) => p.x > -GAME.PIPE_WIDTH - 20);

        setPipes(pipesRef.current);

        // حركة الأرض
        groundOffsetRef.current = (groundOffsetRef.current + GAME.GROUND_SPEED * dt) % 2000;
        setGroundOffset(groundOffsetRef.current);

        setBirdY(birdYRef.current);

        // فحص الاصطدام
        if (checkCollision(birdYRef.current, pipesRef.current)) {
          endGame();
        }
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastTimeRef.current = null;
    };
  }, [active, width, height, checkCollision, endGame, spawnPipe]);

  return {
    birdY,
    rotation,
    pipes,
    score,
    groundOffset,
    isFlapping,
    velocity: velocityRef.current,
    crashed,
    flap,
    reset,
  };
}

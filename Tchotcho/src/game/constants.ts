// ثوابت وإعدادات اللعبة الأساسية

export const GAME = {
  GRAVITY: 1350,
  FLAP_VELOCITY: -390,
  MAX_FALL_SPEED: 620,
  ROTATION_UP: -22,
  ROTATION_DOWN: 80,

  BIRD_WIDTH: 52,
  BIRD_HEIGHT: 38,
  BIRD_X: 0.32,
  HITBOX_PADDING: 7,

  PIPE_WIDTH: 72,
  PIPE_GAP: 200,            // فراغ أكبر بين الأنبوبين
  PIPE_SPEED: 155,          // سرعة أبطأ شوية
  PIPE_SPAWN_INTERVAL: 2000, // مسافة أكبر بين الأنابيب
  PIPE_MIN_TOP: 80,         // أقل ارتفاع للأنبوب العلوي
  PIPE_MIN_BOTTOM_GAP: 80,  // أقل مسافة من الأرض للحافة السفلية

  GROUND_HEIGHT: 90,
  GROUND_SPEED: 155,

  FLAP_ANIM_SPEED: 60,
  FRAME_DT_CAP: 1000 / 30,
} as const;

export type GameState = 'splash' | 'ready' | 'playing' | 'dead' | 'leaderboard' | 'settings';

export interface PipePair {
  id: number;
  x: number;
  topHeight: number; // ارتفاع الأنبوب العلوي من أعلى الشاشة
  passed: boolean;
}

export interface BirdState {
  y: number;
  velocity: number;
  rotation: number;
}

// ثوابت وإعدادات اللعبة الأساسية

export const GAME = {
  GRAVITY: 1350,           // px/s^2
  FLAP_VELOCITY: -390,     // px/s دفعة الطيران لأعلى
  MAX_FALL_SPEED: 620,     // px/s أقصى سرعة سقوط
  ROTATION_UP: -22,        // أقصى زاوية ميل لأعلى عند القفز
  ROTATION_DOWN: 80,       // أقصى زاوية ميل لأسفل عند السقوط

  BIRD_WIDTH: 52,
  BIRD_HEIGHT: 38,
  BIRD_X: 0.32,            // نسبة من عرض الشاشة لموقع الطائر الأفقي
  HITBOX_PADDING: 7,       // تصغير صندوق الاصطدام شوية لتجربة عادلة

  PIPE_WIDTH: 78,
  PIPE_GAP: 190,           // الفراغ بين الأنبوبين
  PIPE_SPEED: 165,         // px/s
  PIPE_SPAWN_INTERVAL: 1500, // ms بين كل أنبوب وآخر
  PIPE_MIN_TOP: 60,        // أقل ارتفاع للأنبوب العلوي
  PIPE_MIN_BOTTOM_GAP: 110, // أقل مسافة من الأرض للحافة السفلية

  GROUND_HEIGHT: 90,
  GROUND_SPEED: 165,       // px/s نفس سرعة الأنابيب

  FLAP_ANIM_SPEED: 60,     // ms بين كل إطار من إطارات الطيران

  FRAME_DT_CAP: 1000 / 30, // أقصى دلتا وقت لكل فريم (تفادي قفزات عند ضعف الأداء)
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

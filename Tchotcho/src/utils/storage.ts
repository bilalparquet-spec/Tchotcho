// نظام حفظ النتائج محلياً عبر localStorage

const BEST_SCORE_KEY = 'tchoutchou_best_score';
const LEADERBOARD_KEY = 'tchoutchou_leaderboard';
const SETTINGS_KEY = 'tchoutchou_settings';

export interface ScoreEntry {
  score: number;
  date: string;
}

export interface Settings {
  music: boolean;
  sfx: boolean;
}

export function getBestScore(): number {
  try {
    const v = localStorage.getItem(BEST_SCORE_KEY);
    return v ? parseInt(v, 10) : 0;
  } catch {
    return 0;
  }
}

export function setBestScore(score: number): boolean {
  // ترجع true إذا كان رقم قياسي جديد
  try {
    const current = getBestScore();
    if (score > current) {
      localStorage.setItem(BEST_SCORE_KEY, String(score));
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export function getLeaderboard(): ScoreEntry[] {
  try {
    const v = localStorage.getItem(LEADERBOARD_KEY);
    if (!v) return [];
    const arr = JSON.parse(v) as ScoreEntry[];
    return arr.sort((a, b) => b.score - a.score).slice(0, 10);
  } catch {
    return [];
  }
}

export function addToLeaderboard(score: number) {
  try {
    const list = getLeaderboard();
    list.push({ score, date: new Date().toISOString() });
    const sorted = list.sort((a, b) => b.score - a.score).slice(0, 10);
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(sorted));
  } catch {
    // localStorage غير متاح - نتجاهل بصمت
  }
}

export function getSettings(): Settings {
  try {
    const v = localStorage.getItem(SETTINGS_KEY);
    if (!v) return { music: true, sfx: true };
    return JSON.parse(v);
  } catch {
    return { music: true, sfx: true };
  }
}

export function saveSettings(settings: Settings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // تجاهل
  }
}

export function clearLeaderboard() {
  try {
    localStorage.removeItem(LEADERBOARD_KEY);
    localStorage.removeItem(BEST_SCORE_KEY);
  } catch {
    // تجاهل
  }
}

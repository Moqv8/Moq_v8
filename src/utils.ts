/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LeaderboardEntry, Difficulty } from './types';

const LB_STORAGE_KEY = 'tadabbur_leaderboard_v3';

// Pre-seeded high scores for an engaging multi-user look right out of the box
const DEFAULT_LEADERBOARD: LeaderboardEntry[] = [
  { name: 'سارة أحمد', score: 1480, difficulty: 'hard', timestamp: Date.now() - 3600000 * 2 },
  { name: 'عبد الرحمن', score: 1250, difficulty: 'medium', timestamp: Date.now() - 3600000 * 5 },
  { name: 'فاطمة الزهراء', score: 980, difficulty: 'easy', timestamp: Date.now() - 3600000 * 12 },
  { name: 'عمر الخطيب', score: 1210, difficulty: 'medium', timestamp: Date.now() - 3600000 * 24 },
  { name: 'يوسف القدسي', score: 1350, difficulty: 'hard', timestamp: Date.now() - 3600000 * 48 },
  { name: 'آية الغزاوية', score: 1600, difficulty: 'hard', timestamp: Date.now() - 3600000 * 1 },
  { name: 'محمود الصابر', score: 850, difficulty: 'easy', timestamp: Date.now() - 3600000 * 3 },
];

/**
 * Fetch leaderboard from LocalStorage, falling back to pre-seeded entries.
 */
export function getLeaderboard(): LeaderboardEntry[] {
  try {
    const stored = localStorage.getItem(LB_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as LeaderboardEntry[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.sort((a, b) => b.score - a.score);
      }
    }
  } catch (e) {
    console.error('Error reading leaderboard:', e);
  }
  // Store default ones on first launch
  saveLeaderboard(DEFAULT_LEADERBOARD);
  return [...DEFAULT_LEADERBOARD].sort((a, b) => b.score - a.score);
}

/**
 * Save leaderboard to LocalStorage safely.
 */
export function saveLeaderboard(lb: LeaderboardEntry[]): void {
  try {
    localStorage.setItem(LB_STORAGE_KEY, JSON.stringify(lb));
  } catch (e) {
    console.error('Error saving leaderboard:', e);
  }
}

/**
 * Add a new score or update an existing player's score if it is higher.
 */
export function addScore(name: string, score: number, difficulty: Difficulty): LeaderboardEntry[] {
  let lb = getLeaderboard();
  const existingIdx = lb.findIndex(x => x.name.trim().toLowerCase() === name.trim().toLowerCase() && x.difficulty === difficulty);

  if (existingIdx >= 0) {
    // Keep highest score
    if (score > lb[existingIdx].score) {
      lb[existingIdx].score = score;
      lb[existingIdx].timestamp = Date.now();
    }
  } else {
    lb.push({
      name: name.trim(),
      score,
      difficulty,
      timestamp: Date.now()
    });
  }

  lb.sort((a, b) => b.score - a.score);
  // Cap at top 15 entries
  lb = lb.slice(0, 15);
  saveLeaderboard(lb);
  return lb;
}

/**
 * Converts standard Latin numbers (1, 2, 3...) to Arabic Eastern numerals (١، ٢، ٣...).
 */
export function toArabicDigits(num: number | string): string {
  const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return num.toString().replace(/\d/g, d => arabicNumerals[parseInt(d, 10)]);
}

/**
 * Fisher-Yates shuffle algorithm to randomize array elements.
 * Returns a new shuffled array without mutating the original.
 */
export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Get difficulty translated name in Arabic
 */
export function getDifficultyArabic(difficulty: Difficulty): string {
  switch (difficulty) {
    case 'easy':
      return 'سهل';
    case 'medium':
      return 'متوسط';
    case 'hard':
      return 'صعب';
  }
}

/**
 * Get the timer duration (seconds) for each difficulty level
 */
export function getTimerDuration(difficulty: Difficulty): number {
  switch (difficulty) {
    case 'easy':
      return 15;
    case 'medium':
      return 12;
    case 'hard':
      return 10;
  }
}

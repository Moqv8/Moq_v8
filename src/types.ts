/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Question {
  text: string;
  ref: string;
  options: string[];
  correctIndex: number;
  feedback: string;
}

export interface LeaderboardEntry {
  name: string;
  score: number;
  difficulty: Difficulty;
  timestamp: number;
}

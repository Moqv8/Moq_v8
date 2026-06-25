/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { Difficulty, Question } from './types';
import { QUESTIONS_BY_DIFFICULTY } from './questions';
import { shuffleArray, addScore, toArabicDigits, getLeaderboard } from './utils';

import WelcomeScreen from './components/WelcomeScreen';
import QuizScreen from './components/QuizScreen';
import ResultScreen from './components/ResultScreen';

type ScreenState = 'welcome' | 'quiz' | 'result';

export default function App() {
  const [screen, setScreen] = useState<ScreenState>('welcome');
  const [playerName, setPlayerName] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);

  // Starts the quiz, preparing the difficulty-appropriate questions shuffled
  const handleStartGame = (name: string, selectedDifficulty: Difficulty) => {
    setPlayerName(name);
    setDifficulty(selectedDifficulty);
    
    const pool = QUESTIONS_BY_DIFFICULTY[selectedDifficulty];
    // Shuffle the 10 questions to ensure a randomized order on every game
    const randomizedQuestions = shuffleArray(pool);
    
    setQuestions(randomizedQuestions);
    setCurrentIdx(0);
    setScore(0);
    setCorrectCount(0);
    setScreen('quiz');
  };

  // Handles scoring, calculating points based on correctness and speed
  const handleAnswer = (isCorrect: boolean, timeLeft: number) => {
    if (isCorrect) {
      setCorrectCount((prev) => prev + 1);
      // Base points: 100, Speed bonus: timeLeft * 10
      const earned = 100 + timeLeft * 10;
      setScore((prev) => prev + earned);
    }
  };

  // Advances to the next question or commits the score to the leaderboard
  const handleNext = () => {
    const nextIdx = currentIdx + 1;
    if (nextIdx < questions.length) {
      setCurrentIdx(nextIdx);
    } else {
      // Save to leaderboard before showing result screen
      addScore(playerName, score, difficulty);
      setScreen('result');
    }
  };

  // Restarts the quiz with the same player name and selected difficulty level
  const handleRestart = () => {
    const pool = QUESTIONS_BY_DIFFICULTY[difficulty];
    const randomizedQuestions = shuffleArray(pool);
    
    setQuestions(randomizedQuestions);
    setCurrentIdx(0);
    setScore(0);
    setCorrectCount(0);
    setScreen('quiz');
  };

  // Exits back to the welcome screen
  const handleExit = () => {
    setScreen('welcome');
  };

  return (
    <div className="min-h-screen bg-[#070304] text-[#f5eae7] flex items-center justify-center p-0 md:p-4 select-none overflow-x-hidden">
      {/* Centered Dashboard Container */}
      <div className="w-full max-w-[1100px] lg:h-[780px] bg-[#0f090b] text-[#f5eae7] font-sans flex flex-col border border-[#3d191d] md:rounded-2xl overflow-hidden shadow-2xl shadow-brand-red/20 relative">
        {/* Subtle decorative background glow */}
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-brand-red/5 blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-brand-red-light/5 blur-[120px] pointer-events-none" />

        {/* Top Navigation Bar */}
        <header className="h-16 border-b border-[#2d1417] bg-[#160d10] flex items-center justify-between px-6 shrink-0 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-red text-white rounded flex items-center justify-center text-xl shadow-lg shadow-brand-red/20">
              📖
            </div>
            <div>
              <h1 className="text-base md:text-lg font-bold tracking-tight text-brand-gold font-serif leading-none mb-1">
                اختبار تدبر الآيات
              </h1>
              <span className="text-[9px] uppercase tracking-wider text-[#9a8688]">القرآن الكريم كمنهج حياة</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-[10px] uppercase tracking-widest text-[#9a8688]">اللاعب الحالي</span>
              <span className="text-xs md:text-sm font-semibold text-[#f5eae7]">
                {playerName || 'متسابق جديد'}
              </span>
            </div>
            <div className="h-8 w-px bg-[#3d191d]" />
            <div className="flex items-center gap-2 bg-[#240e11] px-4 py-1.5 rounded-full border border-brand-red-light/30">
              <span className="text-brand-gold text-sm md:text-base font-bold font-mono">
                {toArabicDigits(score)}
              </span>
              <span className="text-[10px] text-[#9a8688] font-bold">نقطة</span>
            </div>
          </div>
        </header>

        {/* Main Layout Area */}
        <main className="flex-grow flex flex-col lg:flex-row gap-6 p-4 md:p-6 overflow-y-auto lg:overflow-hidden relative z-10 bg-[#0a0506]">
          
          {/* Sidebar: Leaderboard & Stats */}
          <aside className="w-full lg:w-72 flex flex-col gap-6 shrink-0 lg:h-full">
            <div className="flex-grow bg-[#12090b] border border-[#2d1417] rounded-xl flex flex-col overflow-hidden min-h-[280px]">
              <div className="p-4 border-b border-[#2d1417] bg-[#1d0e11] flex items-center justify-between">
                <h2 className="text-xs font-bold text-[#a68689] uppercase tracking-wider">لوحة المتصدرين</h2>
                <span className="text-[10px] text-[#c0182b] font-bold animate-pulse">● مباشر</span>
              </div>
              <div className="flex-grow overflow-y-auto p-2 space-y-1.5 max-h-[250px] lg:max-h-none">
                {getLeaderboard().slice(0, 5).map((entry, idx) => {
                  const medals = ['🥇', '🥈', '🥉'];
                  const isCurrent = entry.name.trim().toLowerCase() === playerName.trim().toLowerCase() && 
                                    entry.difficulty === difficulty;
                  return (
                    <div
                      key={idx}
                      className={`flex items-center justify-between p-2.5 rounded-lg border transition-all ${
                        isCurrent 
                          ? 'bg-brand-red/20 border-brand-red/50 shadow-md' 
                          : 'bg-[#160d10] border-[#2d1417]/50 hover:border-brand-red/30'
                      }`}
                    >
                      <span className="w-6 text-sm text-center">
                        {medals[idx] || toArabicDigits(idx + 1)}
                      </span>
                      <span className="flex-grow px-2 text-xs font-semibold text-[#ecd6d9] truncate">
                        {entry.name}
                      </span>
                      <span className="text-xs font-mono font-bold text-brand-red-light">
                        {toArabicDigits(entry.score)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Daily Challenge Card */}
            <div className="h-32 bg-gradient-to-br from-[#7b0d1a] to-[#560711] rounded-xl p-4 flex flex-col justify-between shadow-lg shadow-brand-red/20 shrink-0 text-white">
              <span className="text-[10px] text-brand-gold font-bold uppercase tracking-widest">تحدي اليوم</span>
              <div className="text-xs leading-relaxed text-pink-50">
                أكمل آيات التدبّر بنجاح لتحصل على لقب "المتدبّر المتقن" وتكسب نقاطاً إضافية في لوحة الصدارة!
              </div>
            </div>
          </aside>

          {/* Central Active View */}
          <section className="flex-grow flex flex-col overflow-y-auto lg:h-full">
            <div className="bg-[#0f090b] border border-[#2d1417] rounded-xl flex-grow p-5 md:p-8 relative flex flex-col justify-center min-h-[400px] shadow-lg">
              <AnimatePresence mode="wait">
                {screen === 'welcome' && (
                  <WelcomeScreen
                    key="welcome"
                    onStartGame={handleStartGame}
                    initialName={playerName}
                    difficulty={difficulty}
                    onDifficultyChange={(level) => setDifficulty(level)}
                  />
                )}

                {screen === 'quiz' && (
                  <QuizScreen
                    key="quiz"
                    playerName={playerName}
                    difficulty={difficulty}
                    questions={questions}
                    currentIdx={currentIdx}
                    score={score}
                    onAnswer={handleAnswer}
                    onNext={handleNext}
                  />
                )}

                {screen === 'result' && (
                  <ResultScreen
                    key="result"
                    playerName={playerName}
                    difficulty={difficulty}
                    correctCount={correctCount}
                    totalCount={questions.length}
                    score={score}
                    onRestart={handleRestart}
                    onExit={handleExit}
                  />
                )}
              </AnimatePresence>
            </div>
          </section>

          {/* Right Sidebar: Difficulty Selector & Info */}
          <aside className="w-full lg:w-48 flex flex-col gap-6 shrink-0 lg:h-full">
            <div className="bg-[#12090b] border border-[#2d1417] rounded-xl p-4">
              <h3 className="text-[10px] font-bold text-[#9a8688] uppercase mb-4 text-center tracking-[0.2em]">
                مستوى الصعوبة
              </h3>
              <div className="space-y-2">
                {(['easy', 'medium', 'hard'] as Difficulty[]).map((level) => {
                  const isSelected = difficulty === level;
                  const isClickable = screen === 'welcome';
                  
                  let displayLabel = 'مبتدئ';
                  let activeStyle = '';
                  if (level === 'easy') {
                    displayLabel = 'مبتدئ';
                    activeStyle = 'border-emerald-500 bg-emerald-950/20 text-emerald-400 font-bold shadow-md';
                  } else if (level === 'medium') {
                    displayLabel = 'متوسط';
                    activeStyle = 'border-brand-red-light bg-brand-red/20 font-bold text-brand-gold shadow-md';
                  } else {
                    displayLabel = 'متقدم';
                    activeStyle = 'border-rose-500 bg-rose-950/20 text-rose-400 font-bold shadow-md';
                  }

                  return (
                    <button
                      key={level}
                      type="button"
                      disabled={!isClickable}
                      onClick={() => setDifficulty(level)}
                      className={`w-full p-2.5 text-center text-xs rounded-lg border transition-all ${
                        isSelected 
                          ? activeStyle 
                          : 'border-[#2d1417] text-[#9a8688] bg-[#160d10]'
                      } ${isClickable ? 'cursor-pointer hover:bg-[#1a0e11] hover:text-brand-red-light' : 'cursor-default opacity-60'}`}
                    >
                      {displayLabel}
                    </button>
                  );
                })}
              </div>
            </div>
            
            <div className="bg-[#12090b] border border-[#2d1417] rounded-xl p-4 flex-grow flex flex-col items-center justify-center text-center shrink-0 min-h-[140px]">
               <div className="w-12 h-12 rounded-full border-2 border-dashed border-[#7a6668]/40 flex items-center justify-center mb-3 text-brand-gold bg-[#160d10] shadow-md">
                 <span className="text-xl">❓</span>
               </div>
               <p className="text-[11px] text-[#9a8688] font-medium leading-relaxed">
                 تدبرك للآية ليس مجرد معرفة علمية، بل هو استشعار للعمل الصالح والأثر الطيب في حياتك وواقعك اليومي.
               </p>
            </div>
          </aside>

        </main>

        {/* Bottom Banner Footer */}
        <footer className="h-12 bg-[#12090b] border-t border-[#2d1417] flex items-center justify-center gap-4 px-6 md:px-8 shrink-0 relative z-10 text-xs text-[#9a8688]">
          <div className="flex items-center gap-2">
            <span className="text-base select-none">🇵🇸</span>
            <span className="text-[10px] md:text-[11px] font-bold text-[#ecd6d9]">اللهم انصر أهلنا في فلسطين وغزة</span>
          </div>
          <div className="w-px h-4 bg-[#2d1417]" />
          <div className="flex items-center gap-2">
            <span className="text-[10px]">إصدار التطبيق v2.4.0</span>
          </div>
        </footer>
      </div>
    </div>
  );
}


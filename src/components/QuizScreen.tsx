/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, Award, ChevronRight, User, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { Question, Difficulty } from '../types';
import { toArabicDigits, getTimerDuration } from '../utils';

interface QuizScreenProps {
  playerName: string;
  difficulty: Difficulty;
  questions: Question[];
  currentIdx: number;
  score: number;
  onAnswer: (isCorrect: boolean, timeLeft: number) => void;
  onNext: () => void;
  key?: string;
}

export default function QuizScreen({
  playerName,
  difficulty,
  questions,
  currentIdx,
  score,
  onAnswer,
  onNext,
}: QuizScreenProps) {
  const currentQuestion = questions[currentIdx];
  const totalQuestions = questions.length;
  const timeDuration = getTimerDuration(difficulty);

  const [timeLeft, setTimeLeft] = useState(timeDuration);
  const [answered, setAnswered] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isTimeUp, setIsTimeUp] = useState(false);

  // Generate randomized mapping of options indices
  // We compute this once whenever the question changes using useMemo
  const optionMapping = useMemo(() => {
    const indices = [0, 1, 2];
    // Fisher-Yates shuffle
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    return indices;
  }, [currentIdx]);

  // Handle timer countdown
  useEffect(() => {
    setTimeLeft(timeDuration);
    setAnswered(false);
    setSelectedIdx(null);
    setIsTimeUp(false);
  }, [currentIdx, timeDuration]);

  useEffect(() => {
    if (answered) return;

    if (timeLeft <= 0) {
      setIsTimeUp(true);
      setAnswered(true);
      onAnswer(false, 0); // No points on time out
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft, answered, onAnswer]);

  const handleOptionClick = (shuffledPos: number) => {
    if (answered) return;

    const originalIdx = optionMapping[shuffledPos];
    setSelectedIdx(shuffledPos);
    setAnswered(true);

    const isCorrect = originalIdx === currentQuestion.correctIndex;
    onAnswer(isCorrect, timeLeft);
  };

  const letters = ['أ', 'ب', 'ج'];
  const percentage = (timeLeft / timeDuration) * 100;
  const progressPercent = ((currentIdx + 1) / totalQuestions) * 100;

  // Find where the correct answer ended up in our shuffled options
  const correctShuffledPos = optionMapping.indexOf(currentQuestion.correctIndex);

  return (
    <div className="w-full text-right" id="screen-quiz">
      {/* Top Bar Indicators */}
      <div className="flex justify-between items-center mb-5 gap-4">
        <span className="text-sm font-bold text-[#a68689]">
          الآية {toArabicDigits(currentIdx + 1)} من {toArabicDigits(totalQuestions)}
        </span>
        
        {/* Points display */}
        <div className="flex items-center gap-1.5 bg-brand-red/20 border border-brand-red-light/30 text-brand-gold font-bold px-4 py-1.5 rounded-full text-sm">
          <Award className="w-4 h-4 text-brand-gold" />
          <span>النقاط: <span className="font-mono text-brand-gold font-bold">{toArabicDigits(score)}</span></span>
        </div>
      </div>

      {/* Player Badge */}
      <div className="flex items-center gap-1.5 text-xs text-[#a68689] mb-4">
        <User className="w-3.5 h-3.5" />
        <span>المتسابق الكريـم: <span className="text-brand-gold font-bold">{playerName}</span></span>
      </div>

      {/* Global Progress Track */}
      <div className="h-1 bg-[#12090b] border border-[#2d1417] rounded-full mb-6 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.3 }}
          className="h-full bg-gradient-to-l from-brand-red to-brand-red-light"
        />
      </div>

      {/* Countdown Timer Line */}
      <div className="mb-6">
        <div className="flex justify-between items-center text-xs mb-1.5">
          <span className="text-[#a68689] font-semibold">تحدي الوقت للتدبّر:</span>
          <span className={`font-mono font-bold flex items-center gap-1 ${
            timeLeft <= 3 ? 'text-rose-400 animate-pulse' : 'text-brand-gold'
          }`}>
            <Clock className="w-3.5 h-3.5" />
            <span>{toArabicDigits(timeLeft)} ثانية</span>
          </span>
        </div>
        <div className="h-1.5 bg-[#12090b] border border-[#2d1417] rounded-full overflow-hidden">
          <motion.div
            initial={{ width: '100%' }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.1, ease: 'linear' }}
            className={`h-full rounded-full transition-colors duration-300 ${
              timeLeft <= 3
                ? 'bg-gradient-to-l from-rose-500 to-red-600'
                : 'bg-gradient-to-l from-brand-red to-brand-red-light'
            }`}
          />
        </div>
      </div>

      {/* Verse Card (Ayah Card) */}
      <motion.div
        key={currentIdx}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-brand-red/[0.05] border border-brand-red/20 border-r-4 border-r-brand-red-light rounded-xl p-6 md:p-8 mb-6 shadow-md relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 text-[100px] leading-none text-brand-red/[0.08] select-none font-serif transform -translate-x-4 -translate-y-6">
          📖
        </div>
        <blockquote className="font-serif text-xl md:text-2xl text-[#f5eae7] text-center leading-loose mb-4">
          « {currentQuestion.text} »
        </blockquote>
        <div className="text-center text-xs text-[#9a8688] font-bold tracking-wider">
          سورة {currentQuestion.ref}
        </div>
      </motion.div>

      {/* Options Panel */}
      <div className="flex flex-col gap-3 mb-6">
        {optionMapping.map((originalIdx, shuffledPos) => {
          const optText = currentQuestion.options[originalIdx];
          const isSelected = selectedIdx === shuffledPos;
          const isCorrect = originalIdx === currentQuestion.correctIndex;

          let btnStyle = 'border-[#2d1417] bg-[#160d10] text-[#ecd6d9] hover:bg-brand-red/[0.05] hover:border-brand-red-light/40 hover:text-brand-gold';
          
          if (answered) {
            if (isSelected) {
              btnStyle = isCorrect
                ? 'bg-emerald-950/20 border-emerald-500 text-emerald-300 ring-1 ring-emerald-500/20'
                : 'bg-rose-950/20 border-rose-500 text-rose-300 ring-1 ring-rose-500/20';
            } else if (isCorrect) {
              // Highlight true choice in green
              btnStyle = 'bg-emerald-950/20 border-emerald-500 text-emerald-300 ring-1 ring-emerald-500/20';
            } else {
              btnStyle = 'border-[#2d1417]/40 bg-[#12090b] text-[#9a8688]/60 opacity-60';
            }
          }

          return (
            <motion.button
              key={shuffledPos}
              whileHover={!answered ? { scale: 1.005 } : {}}
              whileTap={!answered ? { scale: 0.995 } : {}}
              disabled={answered}
              onClick={() => handleOptionClick(shuffledPos)}
              className={`w-full text-right p-4 rounded-xl border text-sm md:text-base transition-all duration-150 flex items-start gap-3 cursor-pointer ${btnStyle}`}
            >
              <span className={`font-bold font-sans px-2 py-0.5 rounded text-xs shrink-0 ${
                answered
                  ? isCorrect
                    ? 'bg-emerald-950/40 text-emerald-300'
                    : isSelected
                      ? 'bg-rose-950/40 text-rose-300'
                      : 'bg-[#2d1417] text-[#9a8688]'
                  : 'bg-brand-red/20 text-brand-gold'
              }`}>
                {letters[shuffledPos]}.
              </span>
              <span className="leading-relaxed">{optText}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Answer Feedback & Reflection Block */}
      <AnimatePresence>
        {answered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-[#12090b] border border-[#2d1417] rounded-xl p-5 mb-6 shadow-inner"
            id="fb"
          >
            <div className="flex items-center gap-2 mb-3">
              {isTimeUp ? (
                <div className="flex items-center gap-1.5 text-rose-400 font-bold text-sm">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>انتهى الوقت المتاح للتدبّر!</span>
                </div>
              ) : selectedIdx !== null && optionMapping[selectedIdx] === currentQuestion.correctIndex ? (
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-sm">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>✓ أحسنت، تدبّر صحيح وإجابة موفقة!</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-rose-400 font-bold text-sm">
                  <XCircle className="w-4 h-4 text-rose-400" />
                  <span>✗ إجابة غير دقيقة — فكّر في الأثر العملي للآية.</span>
                </div>
              )}
            </div>

            <div className="border-t border-[#2d1417] pt-3 text-right">
              <span className="block text-xs text-[#9a8688] font-bold mb-1">
                درس التدبّر والعمل (أثر الآية في واقعك):
              </span>
              <p className="text-xs md:text-sm text-[#ecd6d9] leading-relaxed">
                {currentQuestion.feedback}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Next Question Navigation */}
      {answered && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={onNext}
          className="w-full bg-brand-red hover:bg-brand-red-light text-white font-bold py-3.5 px-6 rounded-lg text-center cursor-pointer transition-all flex items-center justify-center gap-2 shadow-lg border border-brand-red-light/20"
          id="nxt"
        >
          <span>
            {currentIdx + 1 >= totalQuestions ? 'عرض النتيجة النهائية' : 'الآية التالية'}
          </span>
          <ChevronRight className="w-5 h-5 rotate-180" />
        </motion.button>
      )}
    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { BookOpen, Trophy, Play, Star, Clock, AlertCircle } from 'lucide-react';
import { Difficulty } from '../types';
import { getLeaderboard, toArabicDigits, getDifficultyArabic, getTimerDuration } from '../utils';

interface WelcomeScreenProps {
  onStartGame: (name: string, difficulty: Difficulty) => void;
  initialName?: string;
  difficulty: Difficulty;
  onDifficultyChange: (difficulty: Difficulty) => void;
  key?: string;
}

export default function WelcomeScreen({
  onStartGame,
  initialName = '',
  difficulty,
  onDifficultyChange,
}: WelcomeScreenProps) {
  const [name, setName] = useState(initialName);
  const [error, setError] = useState('');

  const leaderboard = getLeaderboard().slice(0, 5);

  const handleStart = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError('فضلاً، أدخل اسمك الكريم للمتابعة');
      return;
    }
    if (trimmed.length > 20) {
      setError('الاسم طويل جداً (الحد الأقصى ٢٠ حرفاً)');
      return;
    }
    setError('');
    onStartGame(trimmed, difficulty);
  };

  const difficultyDetails = {
    easy: {
      title: 'سهل',
      desc: 'آيات مألوفة وتدبّر مباشر ومريح للبدء في رحلة الفهم.',
      color: 'border-[#2d1417] bg-[#160d10] text-emerald-400 hover:border-emerald-700/50',
      activeColor: 'border-emerald-500 bg-emerald-950/20 text-emerald-300 ring-2 ring-emerald-500/20 shadow-md font-bold',
      time: 15,
    },
    medium: {
      title: 'متوسط',
      desc: 'تدبّر أعمق لآيات ترتبط بالمعاملات والقرارات اليومية.',
      color: 'border-[#2d1417] bg-[#160d10] text-brand-gold hover:border-brand-red-light/50',
      activeColor: 'border-brand-red-light bg-[#2d0f13] text-brand-gold ring-2 ring-brand-red/40 shadow-md font-bold',
      time: 12,
    },
    hard: {
      title: 'صعب',
      desc: 'تفكر مكثّف وسريع في سنن الله بالحياة وأخلاقيات العمل الدقيقة.',
      color: 'border-[#2d1417] bg-[#160d10] text-rose-400 hover:border-rose-700/50',
      activeColor: 'border-rose-500 bg-rose-950/20 text-rose-300 ring-2 ring-rose-500/20 shadow-md font-bold',
      time: 10,
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
      className="w-full text-right"
      id="screen-name"
    >
      {/* App Logo / Heading */}
      <div className="text-center mb-8">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-brand-red/20 border border-brand-red-light/30 shadow-lg mb-4 text-brand-gold"
        >
          <BookOpen className="w-10 h-10" />
        </motion.div>
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-brand-gold tracking-wide mb-2">
          اختبار تدبر الآيات الكريمة
        </h1>
        <p className="text-sm md:text-base text-[#a68689] leading-relaxed max-w-lg mx-auto">
          اربط كلام الله تعالى بالواقع العملي والقرارات اليومية. كل آية هي منهج حياة متكامل ودعوة للتفكر والعمل الصالح.
        </p>
      </div>

      {/* Rules / Description */}
      <div className="bg-[#12090b] border border-[#2d1417] rounded-xl p-5 mb-6 text-sm text-[#ecd6d9] space-y-3 shadow-inner">
        <div className="flex items-center gap-2 text-brand-gold font-bold mb-1 border-b border-[#2d1417] pb-2">
          <Star className="w-4 h-4 text-brand-gold" />
          <span>طريقة كسب النقاط والتحدي:</span>
        </div>
        <p className="leading-relaxed">
          • سيعرض عليك الاختبار <span className="text-brand-gold font-bold">١٠ آيات كتلخيص للدرس العملي</span> وعليك تدبّرها واختيار التطبيق الواقعي الأصح.
        </p>
        <p className="leading-relaxed">
          • كل إجابة صحيحة تمنحك <span className="text-emerald-400 font-bold">١٠٠ نقطة أساسية</span> بالإضافة إلى <span className="text-brand-gold font-bold">نقاط إضافية بناءً على سرعتك</span> والمتبقي من الوقت!
        </p>
        <p className="leading-relaxed">
          • انتبه لتحدي العداد التنازلي المعتمد على مستوى الصعوبة المختار لزيادة الإثارة والتركيز.
        </p>
      </div>

      {/* Player Input & Difficulty Selector */}
      <div className="bg-[#12090b] border border-[#2d1417] rounded-xl p-6 mb-6 shadow-md">
        {/* Name input */}
        <div className="mb-6">
          <label htmlFor="player-name" className="block text-sm font-semibold text-[#f5eae7] mb-2">
            اسم اللاعب الكريم:
          </label>
          <div className="relative">
            <input
              id="player-name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleStart();
              }}
              placeholder="اكتب اسمك الكريم هنا..."
              maxLength={20}
              className="w-full bg-[#160d10] border border-[#2d1417] rounded-lg py-3 px-4 text-brand-gold placeholder-[#9a8688]/40 focus:outline-none focus:border-brand-red-light focus:ring-1 focus:ring-brand-red-light transition-all text-right shadow-inner font-medium"
            />
          </div>
          {error && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-1.5 text-rose-600 text-xs mt-2"
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{error}</span>
            </motion.div>
          )}
        </div>

        {/* Difficulty Selection */}
        <div className="mb-2">
          <span className="block text-sm font-semibold text-[#f5eae7] mb-3">
            اختر مستوى الصعوبة وتحدي الوقت:
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {(Object.keys(difficultyDetails) as Difficulty[]).map((level) => {
              const item = difficultyDetails[level];
              const isSelected = difficulty === level;
              return (
                <button
                  key={level}
                  type="button"
                  onClick={() => onDifficultyChange(level)}
                  className={`flex flex-col text-right p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected ? item.activeColor : item.color
                  }`}
                >
                  <div className="flex justify-between items-center w-full mb-1.5">
                    <span className="font-bold text-base">{item.title}</span>
                    <span className="flex items-center gap-1 text-xs opacity-90">
                      <Clock className="w-3.5 h-3.5 text-[#c29753]" />
                      <span>{toArabicDigits(item.time)} ثانية</span>
                    </span>
                  </div>
                  <p className="text-xs text-[#7a6668] leading-relaxed mt-1 font-normal">
                    {item.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Start Button */}
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={handleStart}
        className="w-full bg-brand-red hover:bg-brand-red-light text-white font-bold py-4 px-6 rounded-xl text-center cursor-pointer transition-all flex items-center justify-center gap-2 text-lg shadow-lg shadow-brand-red/10 border border-brand-red-light/20"
      >
        <Play className="w-5 h-5 fill-current" />
        <span>ابدأ اختبار التدبر والعمل</span>
      </motion.button>

      {/* Mini Leaderboard Preview */}
      <div className="mt-8 pt-6 border-t border-[#2d1417]">
        <div className="flex items-center gap-2 text-sm text-[#a68689] font-bold mb-4">
          <Trophy className="w-4 h-4 text-brand-gold" />
          <span>أبطال صدارة التدبر (أعلى الدرجات الحالية):</span>
        </div>
        
        {leaderboard.length === 0 ? (
          <div className="text-center py-4 bg-[#12090b] border border-[#2d1417] rounded-lg text-xs text-[#9a8688]">
            لا توجد سجلات بعد — كن أول من يتصدر القائمة!
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2">
            {leaderboard.map((entry, idx) => {
              const medals = ['🥇', '🥈', '🥉'];
              return (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-lg bg-[#160d10] border border-[#2d1417] hover:border-brand-red/30 transition-all text-xs shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-base min-w-[24px]">
                      {medals[idx] || toArabicDigits(idx + 1)}
                    </span>
                    <span className="font-bold text-[#ecd6d9]">{entry.name}</span>
                    <span className="bg-brand-red/10 text-brand-red-light px-2 py-0.5 rounded-full text-[10px] font-semibold">
                      {getDifficultyArabic(entry.difficulty)}
                    </span>
                  </div>
                  <span className="font-mono text-brand-red-light font-bold">
                    {toArabicDigits(entry.score)} نقطة
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}

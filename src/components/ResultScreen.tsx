/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Trophy, RefreshCw, LogOut, Award, Star, ThumbsUp } from 'lucide-react';
import { Difficulty } from '../types';
import { getLeaderboard, toArabicDigits, getDifficultyArabic } from '../utils';

interface ResultScreenProps {
  playerName: string;
  difficulty: Difficulty;
  correctCount: number;
  totalCount: number;
  score: number;
  onRestart: () => void;
  onExit: () => void;
  key?: string;
}

export default function ResultScreen({
  playerName,
  difficulty,
  correctCount,
  totalCount,
  score,
  onRestart,
  onExit,
}: ResultScreenProps) {
  // Fetch updated leaderboard listing from utility
  const leaderboard = getLeaderboard();

  // Custom evaluation messages based on correctness
  const getEvaluation = () => {
    if (correctCount >= 9) {
      return {
        text: 'ممتاز جداً — تدبرك عميق وربطك بالواقع العملي راسخ متين. أنت ممن يسعون للعمل بما يعلمون، جعلنا الله وإياكم منهم.',
        color: 'text-emerald-300',
        bg: 'border-emerald-500/20 bg-emerald-950/20',
      };
    } else if (correctCount >= 7) {
      return {
        text: 'جيد جداً — قاعدتك الإيمانية والتدبّرية قوية. بعض التوجيهات تحتاج منك لتأمل أعمق واستمرارية في التطبيق اليومي.',
        color: 'text-amber-300',
        bg: 'border-amber-500/20 bg-amber-950/20',
      };
    } else if (correctCount >= 5) {
      return {
        text: 'أداء جيد — هناك فهم حقيقي لروح الآيات، ولكنه يحتاج لمزيد من الممارسة والربط الوثيق بقراراتك وأخلاقك اليومية.',
        color: 'text-orange-300',
        bg: 'border-orange-500/20 bg-orange-950/20',
      };
    } else {
      return {
        text: 'تحتاج لتأمل وقراءة أكثر — الفهم العملي للآيات الكريمة يأتي بالمعايشة والمجاهدة والتطبيق العملي. لا تتردد في المحاولة مرة أخرى لتثبيت الفهم.',
        color: 'text-rose-300',
        bg: 'border-rose-500/20 bg-rose-950/20',
      };
    }
  };

  const evalInfo = getEvaluation();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="w-full text-right"
      id="screen-result"
    >
      {/* Trophy & Winner Name */}
      <div className="text-center mb-6">
        <motion.div
          initial={{ rotate: -10, scale: 0 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ type: 'spring', delay: 0.1, stiffness: 120 }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-red/20 border border-brand-red-light/30 text-brand-gold shadow-lg mb-3"
        >
          <Trophy className="w-8 h-8" />
        </motion.div>
        
        <div className="text-sm font-semibold text-[#a68689] mb-1" id="res-name">
          تقييم المتسابق الكريم: <span className="text-brand-gold font-bold">{playerName}</span>
        </div>
        
        <h2 className="font-serif text-3xl font-bold text-brand-gold">
          الحمد لله الذي بنعمته تتم الصالحات
        </h2>
      </div>

      {/* Big Score Reporting */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-[#12090b] border border-[#2d1417] rounded-xl p-4 text-center shadow-md">
          <span className="block text-xs text-[#9a8688] font-bold mb-1">النقاط الكلية:</span>
          <div className="font-mono text-3xl md:text-4xl font-extrabold text-brand-gold pop" id="res-big">
            {toArabicDigits(score)}
          </div>
          <span className="text-[10px] text-[#9a8688] font-medium">مجموع السرعة والإجابة</span>
        </div>

        <div className="bg-[#12090b] border border-[#2d1417] rounded-xl p-4 text-center shadow-md">
          <span className="block text-xs text-[#9a8688] font-bold mb-1">الإجابات الصحيحة:</span>
          <div className="font-serif text-3xl md:text-4xl font-bold text-brand-gold">
            {toArabicDigits(correctCount)} <span className="text-sm text-[#9a8688]">من {toArabicDigits(totalCount)}</span>
          </div>
          <span className="text-[10px] text-[#9a8688] font-medium">مستوى الصعوبة: {getDifficultyArabic(difficulty)}</span>
        </div>
      </div>

      {/* Spiritual Evaluation Block */}
      <div className={`border rounded-xl p-5 mb-6 text-sm leading-relaxed ${evalInfo.bg}`} id="res-eval">
        <div className="flex items-center gap-2 mb-2 font-bold">
          <ThumbsUp className={`w-4 h-4 ${evalInfo.color}`} />
          <span className={evalInfo.color}>التوجيه العملي التدبّري:</span>
        </div>
        <p className="text-[#ecd6d9] font-medium">
          {evalInfo.text}
        </p>
      </div>

      {/* Palestine / Gaza Dedication Block */}
      <div className="bg-[#12090b] border border-[#2d1417] rounded-xl p-5 mb-8 text-center relative overflow-hidden shadow-md">
        <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-emerald-600 via-[#2d1417] to-red-600" />
        <div className="text-xl md:text-2xl mb-2 tracking-widest select-none">🇵🇸 🕌 🇵🇸</div>
        <h3 className="font-serif text-lg font-bold text-brand-gold mb-1">
          اللهم فرّج عن أهل غزة وفلسطين وانصر المستضعفين في كل مكان
        </h3>
        <p className="text-xs text-[#a68689] leading-relaxed">
          هذا الاختبار مُهدى لأرواح شهداء فلسطين الأبرار، ولكل من صمد وصابر ولم يفرّط في دينه وقيمه وأرضه الطاهرة. نسأل الله لهم النصر والتمكين والفرج القريب.
        </p>
      </div>

      {/* Dynamic Interactive Leaderboard */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4 border-b border-[#2d1417] pb-2">
          <div className="flex items-center gap-2 text-sm text-[#a68689] font-bold">
            <Trophy className="w-4 h-4 text-brand-gold" />
            <span>لوحة صدارة المتنافسين بوضوح:</span>
          </div>
          <span className="text-[10px] text-[#a68689] font-mono">أعلى ١٥ درجة</span>
        </div>

        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {leaderboard.map((entry, idx) => {
            const medals = ['🥇', '🥈', '🥉'];
            const rankClass = ['text-brand-gold font-bold', 'text-[#ecd6d9] font-bold', 'text-amber-500 font-bold'];
            
            // Highlight current player
            const isMe = entry.name.trim().toLowerCase() === playerName.trim().toLowerCase() && 
                         entry.score === score && 
                         entry.difficulty === difficulty;

            return (
              <div
                key={idx}
                className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                  isMe
                    ? 'border-brand-red-light bg-brand-red/20 shadow-md'
                    : 'border-[#2d1417]/60 bg-[#160d10] hover:border-brand-red/30 shadow-md'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`text-base min-w-[28px] text-center ${rankClass[idx] || 'text-[#9a8688]'}`}>
                    {medals[idx] || toArabicDigits(idx + 1)}
                  </span>
                  <span className={`text-sm ${isMe ? 'text-brand-gold font-bold' : 'text-[#ecd6d9]'}`}>
                    {entry.name} {isMe && <span className="text-xs text-brand-gold font-normal mr-1">← أنت</span>}
                  </span>
                  <span className="bg-brand-red/10 text-brand-red-light px-2.5 py-0.5 rounded-full text-[10px] font-semibold">
                    {getDifficultyArabic(entry.difficulty)}
                  </span>
                </div>
                <span className="font-mono text-brand-red-light font-bold text-sm">
                  {toArabicDigits(entry.score)} نقطة
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Buttons Block */}
      <div className="flex flex-col sm:flex-row gap-3">
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={onRestart}
          className="flex-1 bg-brand-red hover:bg-brand-red-light text-white font-bold py-3 px-5 rounded-lg text-center cursor-pointer transition-all flex items-center justify-center gap-2 border border-brand-red-light/20"
        >
          <RefreshCw className="w-4 h-4" />
          <span>إعادة الاختبار بنفس الاسم</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={onExit}
          className="flex-1 bg-[#160d10] hover:bg-[#1d0e11] border border-[#2d1417] text-[#ecd6d9] hover:text-brand-gold font-bold py-3 px-5 rounded-lg text-center cursor-pointer transition-all flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          <span>تغيير اللاعب والرجوع</span>
        </motion.button>
      </div>
    </motion.div>
  );
}

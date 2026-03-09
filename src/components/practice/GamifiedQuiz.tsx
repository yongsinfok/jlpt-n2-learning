/**
 * 游戏化测验组件 - 让学习变得更有趣！
 * 包含连击系统、时间限制、动态分数计算、视觉反馈
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Flame, Zap, Clock, Trophy, Star } from 'lucide-react';

export interface GamifiedQuizProps {
  questions: Array<{
    question: string;
    options: string[];
    correct: string;
  }>;
  onAnswer?: (isCorrect: boolean) => void;
  onComplete?: (score: number) => void;
  showAchievement?: (achievement: string) => void;
}

export const GamifiedQuiz = ({
  questions,
  onAnswer,
  onComplete,
  showAchievement,
}: GamifiedQuizProps) => {
  // 游戏状态
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showCorrect, setShowCorrect] = useState(false);
  const [showIncorrect, setShowIncorrect] = useState(false);

  // 连击加成规则
  const comboMultiplier = useCallback(() => {
    if (combo >= 10) return 5;      // 超级连击
    if (combo >= 5) return 3;        // 强力连击
    if (combo >= 3) return 2;        // 连击
    return 1;                          // 普通
  }, [combo]);

  // 计算本次得分
  const calculateScore = useCallback((isCorrect: boolean) => {
    if (!isCorrect) {
      setCombo(0);
      setShowIncorrect(true);
      setTimeout(() => setShowIncorrect(false), 500);
      return;
    }

    const baseScore = 10;
    const comboBonus = combo * 5;
    const totalScore = baseScore + comboBonus;
    
    setScore(prev => prev + totalScore);
    setCombo(prev => prev + 1);
    setShowCorrect(true);
    
    // 检查成就
    if (combo + 1 > maxCombo) {
      setMaxCombo(combo + 1);
      if (combo + 1 >= 10) {
        showAchievement?.('combo_master');
      } else if (combo + 1 >= 5) {
        showAchievement?.('combo_strong');
      }
    }
    
    onAnswer?.(isCorrect);
    
    return totalScore;
  }, [combo, maxCombo, showAchievement, onAnswer]);

  // 当前问题
  const currentQuestion = questions[currentQuestionIndex];

  // 计算总题数
  const totalQuestions = questions.length;
  const progress = useMemo(() => (currentQuestionIndex + 1) / totalQuestions * 100, [currentQuestionIndex, totalQuestions]);

  // 自动进入下一题
  useEffect(() => {
    if (currentQuestionIndex >= totalQuestions - 1 && isPlaying) {
      onComplete?.(score);
      setIsPlaying(false);
    }
  }, [currentQuestionIndex, totalQuestions, isPlaying, score, onComplete]);

  // 倒计时
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;

    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => Math.max(0, prev - 1));
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying]);

  // 开始游戏
  const startGame = useCallback(() => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setCombo(0);
    setTimeLeft(60);
    setIsPlaying(true);
  }, []);

  // 暂停/继续游戏
  const togglePause = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  return (
    <div className="relative w-full max-w-4xl mx-auto p-8 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-3xl shadow-2xl">
      {/* 顶部状态栏 - 霓虹渐变 */}
      <div className="flex justify-between items-center mb-8 px-6 bg-white/10 backdrop-blur-md rounded-2xl py-4">
        {/* 左侧：XP 和连击 */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 bg-gradient-to-r from-yellow-400 to-orange-500 px-6 py-3 rounded-xl shadow-lg">
            <Trophy size={24} className="text-white" />
            <div className="ml-3">
              <div className="text-2xl font-bold text-white">{score}</div>
              <div className="text-xs text-yellow-100">XP</div>
            </div>
          </div>
          
          {/* 连击显示 */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              <Flame size={20} className={combo >= 3 ? 'text-orange-500' : 'text-gray-400'} />
              <div>
                <div className="text-sm text-gray-600">连击</div>
                <div className="text-3xl font-bold text-gray-800">{combo}</div>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              最高: {maxCombo}
            </div>
          </div>
        </div>

        {/* 右侧：时间 */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 px-6 py-3 rounded-xl shadow-lg">
            <Clock size={24} className="text-white" />
            <div className="ml-3">
              <div className="text-2xl font-bold text-white">{timeLeft}</div>
              <div className="text-xs text-red-100">秒</div>
            </div>
          </div>
          
          {/* 进度 */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>进度</span>
            <span className="font-bold text-gray-800">
              {currentQuestionIndex + 1} / {totalQuestions}
            </span>
          </div>
        </div>
      </div>

      {/* 主问题区域 */}
      <div className="relative mb-8">
        {/* 进度条 */}
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {!isPlaying ? (
          <button
            onClick={startGame}
            className="w-full py-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-2xl font-bold rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <Zap size={32} className="mb-2" />
            开始挑战
          </button>
        ) : (
          <div className="space-y-6">
            {/* 问题显示 */}
            <div className="text-center mb-6">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 leading-tight">
                {currentQuestion.question}
              </h2>
            </div>

            {/* 选项按钮 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQuestion.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => calculateScore(option === currentQuestion.correct)}
                  disabled={!isPlaying || showCorrect || showIncorrect}
                  className={`
                    p-6 text-xl font-semibold rounded-2xl transition-all duration-200
                    ${!isPlaying || showCorrect || showIncorrect
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-800 hover:scale-105 hover:shadow-xl border-2 border-gray-200'
                    }
                  `}
                >
                  {option}
                </button>
              ))}
            </div>

            {/* 暂停/继续按钮 */}
            <button
              onClick={togglePause}
              className="w-full py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-lg font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
            >
              {!isPlaying ? '▶️ 继续' : '⏸️ 暂停'}
            </button>
          </div>
        )}

        {/* 视觉反馈 - 正确/错误动画 */}
        {showCorrect && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 animate-fade-in">
            <div className="bg-green-500 text-white p-8 rounded-2xl text-center">
              <Star size={48} className="mx-auto mb-4 text-yellow-300" />
              <div className="text-2xl font-bold">正确!</div>
              <div className="text-sm">+{comboMultiplier()} 分</div>
            </div>
          </div>
        )}

        {showIncorrect && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 animate-fade-in">
            <div className="bg-red-500 text-white p-8 rounded-2xl text-center">
              <Zap size={48} className="mx-auto mb-4 text-red-200" />
              <div className="text-2xl font-bold">错误!</div>
              <div className="text-sm">连击重置</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * 首次使用引导页 - Japanese Onboarding Style
 * 多步骤引导用户完成初始设置
 */

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ChevronRight, Clock, Target, BookOpen, Sparkles } from 'lucide-react';

type OnboardingStep = 'welcome' | 'features' | 'goals' | 'time' | 'complete';

interface LearningGoal {
  id: string;
  title: string;
  titleJa: string;
  description: string;
  icon: React.ReactNode;
}

interface StudyTime {
  id: string;
  title: string;
  titleJa: string;
  minutes: number;
  icon: React.ReactNode;
}

const learningGoals: LearningGoal[] = [
  {
    id: 'casual',
    title: '轻松学习',
    titleJa: '気楽',
    description: '每天少量学习，保持兴趣',
    icon: <BookOpen size={24} />,
  },
  {
    id: 'regular',
    title: '稳步前进',
    titleJa: '着実',
    description: '持续学习，稳步提升',
    icon: <Target size={24} />,
  },
  {
    id: 'intensive',
    title: '全力冲刺',
    titleJa: '本気',
    description: '高强度学习，快速突破',
    icon: <Sparkles size={24} />,
  },
];

const studyTimes: StudyTime[] = [
  {
    id: '15',
    title: '15 分钟',
    titleJa: '15分',
    minutes: 15,
    icon: <Clock size={20} />,
  },
  {
    id: '30',
    title: '30 分钟',
    titleJa: '30分',
    minutes: 30,
    icon: <Clock size={20} />,
  },
  {
    id: '60',
    title: '60 分钟',
    titleJa: '60分',
    minutes: 60,
    icon: <Clock size={20} />,
  },
];

export function OnboardingPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [selectedGoal, setSelectedGoal] = useState<string>('regular');
  const [selectedTime, setSelectedTime] = useState<string>('30');

  const steps: { key: OnboardingStep; label: string }[] = [
    { key: 'welcome', label: '欢迎' },
    { key: 'features', label: '功能' },
    { key: 'goals', label: '目标' },
    { key: 'time', label: '时间' },
    { key: 'complete', label: '完成' },
  ];

  const currentStepIndex = steps.findIndex(s => s.key === currentStep);

  const handleNext = useCallback(() => {
    const stepOrder: OnboardingStep[] = ['welcome', 'features', 'goals', 'time', 'complete'];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1]);
    }
  }, [currentStep]);

  const handleBack = useCallback(() => {
    const stepOrder: OnboardingStep[] = ['welcome', 'features', 'goals', 'time', 'complete'];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1]);
    }
  }, [currentStep]);

  const handleComplete = useCallback(() => {
    // Save preferences to localStorage
    const preferences = {
      learningGoal: selectedGoal,
      dailyStudyTime: parseInt(selectedTime),
      onboardingCompleted: true,
      completedAt: new Date().toISOString(),
    };
    localStorage.setItem('userPreferences', JSON.stringify(preferences));

    // Navigate to home page
    navigate('/');
  }, [selectedGoal, selectedTime, navigate]);

  return (
    <div className="min-h-screen washi-bg">
      {/* Progress indicator */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-ai-100">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.key} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <button
                    onClick={() => setCurrentStep(step.key as OnboardingStep)}
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
                      ${index <= currentStepIndex
                        ? 'bg-ai text-white shadow-washi'
                        : 'bg-sumi-100 text-sumi-400'
                      }
                      ${index === currentStepIndex ? 'ring-4 ring-ai-100' : ''}
                    `}
                  >
                    {index < currentStepIndex ? (
                      <CheckCircle size={20} />
                    ) : (
                      <span className="text-sm font-medium">{index + 1}</span>
                    )}
                  </button>
                  <span className={`text-xs mt-1 font-maru ${index <= currentStepIndex ? 'text-ai' : 'text-sumi-400'}`}>
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 transition-colors duration-300 ${index < currentStepIndex ? 'bg-ai' : 'bg-sumi-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Step 1: Welcome */}
        {currentStep === 'welcome' && (
          <div className="animate-slide-up">
            <div className="japanese-card p-12 text-center">
              {/* Decorative vertical text */}
              <div className="hidden lg:block absolute -left-8 top-1/2 -translate-y-1/2 vertical-text text-sumi-200 text-sm">
                N2学習の旅へ
              </div>

              {/* Decorative elements */}
              <div className="text-6xl mb-6 animate-float">🎌</div>

              <h1 className="font-serif display-display-md text-sumi mb-4">
                ようこそ！
              </h1>
              <h2 className="font-serif text-3xl text-ai mb-6">
                欢迎来到 N2 学习之旅
              </h2>

              <p className="text-sumi-600 text-lg mb-8 leading-relaxed">
                系统化学习 JLPT N2 语法<br />
                日本語能力試験 N2 文法をマスターしよう
              </p>

              <div className="grid grid-cols-3 gap-6 my-12">
                <div className="text-center">
                  <div className="text-3xl font-serif font-bold text-ai mb-2">26</div>
                  <div className="text-sm text-sumi-500">课程</div>
                  <div className="text-xs text-sumi-400 font-maru">レッスン</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-serif font-bold text-matcha mb-2">138</div>
                  <div className="text-sm text-sumi-500">语法点</div>
                  <div className="text-xs text-sumi-400 font-maru">文法</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-serif font-bold text-kincha mb-2">500+</div>
                  <div className="text-sm text-sumi-500">例句</div>
                  <div className="text-xs text-sumi-400 font-maru">例文</div>
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={handleNext}
                  className="group bg-ai hover:bg-ai-600 text-white px-8 py-4 rounded-lg shadow-washi hover:shadow-washi-md transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-3"
                >
                  <span className="font-medium">开始设置</span>
                  <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Features */}
        {currentStep === 'features' && (
          <div className="animate-slide-up">
            <div className="japanese-card p-12">
              <h2 className="font-serif text-3xl text-sumi mb-3 text-center">
                平台功能
              </h2>
              <p className="text-sumi-500 text-center mb-10 font-maru">
                機能紹介
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-10">
                {/* Feature 1 */}
                <div className="bg-gradient-to-br from-ai-50 to-white p-6 rounded-xl border-2 border-ai-100 hover:border-ai-300 transition-all duration-300 hover:shadow-washi-sm">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-ai flex items-center justify-center text-white shrink-0">
                      <BookOpen size={24} />
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-sumi mb-2">
                        系统化学习
                      </h3>
                      <p className="text-sumi-600 text-sm">
                        26 个课程，循序渐进掌握 N2 语法要点
                      </p>
                      <p className="text-sumi-400 text-xs font-maru mt-1">
                        レッスン別に文法を学習
                      </p>
                    </div>
                  </div>
                </div>

                {/* Feature 2 */}
                <div className="bg-gradient-to-br from-matcha-50 to-white p-6 rounded-xl border-2 border-matcha-100 hover:border-matcha-300 transition-all duration-300 hover:shadow-washi-sm">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-matcha flex items-center justify-center text-white shrink-0">
                      <Target size={24} />
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-sumi mb-2">
                        智能练习
                      </h3>
                      <p className="text-sumi-600 text-sm">
                        多种练习模式，巩固所学知识
                      </p>
                      <p className="text-sumi-400 text-xs font-maru mt-1">
                        様々な練習モード
                      </p>
                    </div>
                  </div>
                </div>

                {/* Feature 3 */}
                <div className="bg-gradient-to-br from-kincha-50 to-white p-6 rounded-xl border-2 border-kincha-100 hover:border-kincha-300 transition-all duration-300 hover:shadow-washi-sm">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-kincha flex items-center justify-center text-white shrink-0">
                      <Clock size={24} />
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-sumi mb-2">
                        间隔复习
                      </h3>
                      <p className="text-sumi-600 text-sm">
                        基于遗忘曲线的科学复习系统
                      </p>
                      <p className="text-sumi-400 text-xs font-maru mt-1">
                        忘却曲線に基づいた復習
                      </p>
                    </div>
                  </div>
                </div>

                {/* Feature 4 */}
                <div className="bg-gradient-to-br from-shu-50 to-white p-6 rounded-xl border-2 border-shu-100 hover:border-shu-300 transition-all duration-300 hover:shadow-washi-sm">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-shu flex items-center justify-center text-white shrink-0">
                      <Sparkles size={24} />
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-sumi mb-2">
                        进度追踪
                      </h3>
                      <p className="text-sumi-600 text-sm">
                        可视化学习数据，了解自己的进步
                      </p>
                      <p className="text-sumi-400 text-xs font-maru mt-1">
                        学習 progress の可視化
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={handleBack}
                  className="px-6 py-3 text-sumi-600 hover:text-ai transition-colors flex items-center gap-2"
                >
                  返回
                </button>
                <button
                  onClick={handleNext}
                  className="group bg-ai hover:bg-ai-600 text-white px-8 py-3 rounded-lg shadow-washi hover:shadow-washi-md transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2"
                >
                  下一步
                  <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Learning Goals */}
        {currentStep === 'goals' && (
          <div className="animate-slide-up">
            <div className="japanese-card p-12">
              <h2 className="font-serif text-3xl text-sumi mb-3 text-center">
                选择学习目标
              </h2>
              <p className="text-sumi-500 text-center mb-10 font-maru">
                学習目標を選択
              </p>

              <div className="grid md:grid-cols-3 gap-6 mb-10">
                {learningGoals.map((goal) => (
                  <button
                    key={goal.id}
                    onClick={() => setSelectedGoal(goal.id)}
                    className={`
                      relative p-6 rounded-xl border-2 transition-all duration-300 text-left
                      ${selectedGoal === goal.id
                        ? 'border-ai bg-ai-50 shadow-washi-md scale-105'
                        : 'border-sumi-200 bg-white hover:border-ai-300 hover:shadow-washi-sm'
                      }
                    `}
                  >
                    <div className={`mb-4 ${selectedGoal === goal.id ? 'text-ai' : 'text-sumi-400'}`}>
                      {goal.icon}
                    </div>
                    <h3 className={`font-serif font-bold mb-2 ${selectedGoal === goal.id ? 'text-ai' : 'text-sumi'}`}>
                      {goal.title}
                    </h3>
                    <p className="text-xs text-sumi-400 font-maru mb-2">
                      {goal.titleJa}
                    </p>
                    <p className={`text-sm ${selectedGoal === goal.id ? 'text-ai-700' : 'text-sumi-600'}`}>
                      {goal.description}
                    </p>
                    {selectedGoal === goal.id && (
                      <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-ai flex items-center justify-center">
                        <CheckCircle size={16} className="text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <div className="flex justify-between">
                <button
                  onClick={handleBack}
                  className="px-6 py-3 text-sumi-600 hover:text-ai transition-colors flex items-center gap-2"
                >
                  返回
                </button>
                <button
                  onClick={handleNext}
                  className="group bg-ai hover:bg-ai-600 text-white px-8 py-3 rounded-lg shadow-washi hover:shadow-washi-md transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2"
                >
                  下一步
                  <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Study Time */}
        {currentStep === 'time' && (
          <div className="animate-slide-up">
            <div className="japanese-card p-12">
              <h2 className="font-serif text-3xl text-sumi mb-3 text-center">
                设置每日学习时间
              </h2>
              <p className="text-sumi-500 text-center mb-10 font-maru">
                1日の学習時間を設定
              </p>

              <div className="grid md:grid-cols-3 gap-6 mb-10">
                {studyTimes.map((time) => (
                  <button
                    key={time.id}
                    onClick={() => setSelectedTime(time.id)}
                    className={`
                      relative p-8 rounded-xl border-2 transition-all duration-300 text-center
                      ${selectedTime === time.id
                        ? 'border-ai bg-ai-50 shadow-washi-md scale-105'
                        : 'border-sumi-200 bg-white hover:border-ai-300 hover:shadow-washi-sm'
                      }
                    `}
                  >
                    <div className={`mb-4 inline-block ${selectedTime === time.id ? 'text-ai' : 'text-sumi-400'}`}>
                      {time.icon}
                    </div>
                    <div className={`font-serif text-4xl font-bold mb-2 ${selectedTime === time.id ? 'text-ai' : 'text-sumi'}`}>
                      {time.minutes}
                    </div>
                    <div className={`text-sm mb-1 ${selectedTime === time.id ? 'text-ai-700' : 'text-sumi-600'}`}>
                      分钟
                    </div>
                    <div className="text-xs text-sumi-400 font-maru">
                      {time.titleJa}
                    </div>
                    {selectedTime === time.id && (
                      <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-ai flex items-center justify-center">
                        <CheckCircle size={16} className="text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <div className="bg-sumi-50 rounded-lg p-4 mb-8 text-center">
                <p className="text-sumi-600 text-sm">
                  建议每天坚持学习，保持连续性比单次学习时长更重要
                </p>
                <p className="text-sumi-400 text-xs font-maru mt-1">
                  継続は力なり
                </p>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={handleBack}
                  className="px-6 py-3 text-sumi-600 hover:text-ai transition-colors flex items-center gap-2"
                >
                  返回
                </button>
                <button
                  onClick={handleNext}
                  className="group bg-ai hover:bg-ai-600 text-white px-8 py-3 rounded-lg shadow-washi hover:shadow-washi-md transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2"
                >
                  下一步
                  <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Complete */}
        {currentStep === 'complete' && (
          <div className="animate-slide-up">
            <div className="japanese-card p-12 text-center">
              {/* Decorative elements */}
              <div className="text-6xl mb-6">🎉</div>

              <h2 className="font-serif text-3xl text-sumi mb-3">
                设置完成！
              </h2>
              <p className="text-sumi-500 font-maru mb-8">
                設定完了
              </p>

              <div className="bg-gradient-to-r from-ai-50 to-matcha-50 rounded-xl p-6 mb-8 max-w-md mx-auto">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <CheckCircle size={24} className="text-matcha" />
                  <span className="font-serif font-bold text-sumi">您的学习计划</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-sumi-600">学习目标：</span>
                    <span className="font-medium text-sumi">
                      {learningGoals.find(g => g.id === selectedGoal)?.title}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sumi-600">每日时间：</span>
                    <span className="font-medium text-sumi">
                      {studyTimes.find(t => t.id === selectedTime)?.title}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-sumi-600 mb-8">
                让我们开始 N2 学习之旅吧！<br />
                <span className="text-sumi-400 font-maru text-sm">
                  N2学習の旅を始めましょう！
                </span>
              </p>

              <div className="flex justify-center gap-4">
                <button
                  onClick={handleBack}
                  className="px-6 py-3 text-sumi-600 hover:text-ai transition-colors"
                >
                  返回修改
                </button>
                <button
                  onClick={handleComplete}
                  className="group bg-ai hover:bg-ai-600 text-white px-10 py-4 rounded-lg shadow-washi hover:shadow-washi-md transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-3"
                >
                  <span className="font-medium">开始学习</span>
                  <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

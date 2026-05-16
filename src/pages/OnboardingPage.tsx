import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ChevronRight, Clock, Target, BookOpen, Sparkles } from 'lucide-react';

type OnboardingStep = 'welcome' | 'features' | 'goals' | 'time' | 'complete';
type FeatureTone = 'ai' | 'matcha' | 'kincha' | 'shu';

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

interface Feature {
  tone: FeatureTone;
  icon: React.ReactNode;
  title: string;
  description: string;
  titleJa: string;
}

const TONE_STYLES: Record<FeatureTone, { card: string; icon: string }> = {
  ai:     { card: 'bg-accent-pale border border-accent/20 hover:border-accent/50',  icon: 'bg-accent' },
  matcha: { card: 'bg-accent-pale border border-pine/20 hover:border-pine/50',      icon: 'bg-pine' },
  kincha: { card: 'bg-accent-pale border border-amber/20 hover:border-amber/50',    icon: 'bg-amber' },
  shu:    { card: 'bg-accent-pale border border-accent/20 hover:border-accent/50',  icon: 'bg-accent' },
};

const STEPS: { key: OnboardingStep; label: string }[] = [
  { key: 'welcome',  label: '欢迎' },
  { key: 'features', label: '功能' },
  { key: 'goals',    label: '目标' },
  { key: 'time',     label: '时间' },
  { key: 'complete', label: '完成' },
];

const STEP_KEYS = STEPS.map(s => s.key);

const features: Feature[] = [
  { tone: 'ai',     icon: <BookOpen size={24} />, title: '系统化学习', description: '26 个课程，循序渐进掌握 N2 语法要点', titleJa: 'レッスン別に文法を学習' },
  { tone: 'matcha', icon: <Target size={24} />,   title: '智能练习',   description: '多种练习模式，巩固所学知识',           titleJa: '様々な練習モード' },
  { tone: 'kincha', icon: <Clock size={24} />,    title: '间隔复习',   description: '基于遗忘曲线的科学复习系统',           titleJa: '忘却曲線に基づいた復習' },
  { tone: 'shu',    icon: <Sparkles size={24} />, title: '进度追踪',   description: '可视化学习数据，了解自己的进步',       titleJa: '学習進捗の可視化' },
];

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

  const currentStepIndex = STEP_KEYS.indexOf(currentStep);

  const handleNext = useCallback(() => {
    if (currentStepIndex < STEP_KEYS.length - 1) {
      setCurrentStep(STEP_KEYS[currentStepIndex + 1]);
    }
  }, [currentStepIndex]);

  const handleBack = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStep(STEP_KEYS[currentStepIndex - 1]);
    }
  }, [currentStepIndex]);

  const handleComplete = useCallback(() => {
    const preferences = {
      learningGoal: selectedGoal,
      dailyStudyTime: parseInt(selectedTime),
      onboardingCompleted: true,
      completedAt: new Date().toISOString(),
    };
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
    navigate('/');
  }, [selectedGoal, selectedTime, navigate]);

  return (
    <div className="min-h-screen bg-bg">
      <div className="sticky top-0 z-50 bg-surface/80 backdrop-blur-sm border-b border-accent/20">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => (
              <div key={step.key} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <button
                    onClick={() => setCurrentStep(step.key)}
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
                      ${index <= currentStepIndex
                        ? 'bg-accent text-white shadow-sm'
                        : 'bg-surface-dim text-ink-faint'
                      }
                      ${index === currentStepIndex ? 'ring-2 ring-accent/20' : ''}
                    `}
                  >
                    {index < currentStepIndex ? (
                      <CheckCircle size={20} />
                    ) : (
                      <span className="text-sm font-medium">{index + 1}</span>
                    )}
                  </button>
                  <span className={`text-xs mt-1 font-sans ${index <= currentStepIndex ? 'text-accent' : 'text-ink-faint'}`}>
                    {step.label}
                  </span>
                </div>
                {index < STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 transition-colors duration-300 ${index < currentStepIndex ? 'bg-accent' : 'bg-border-light'}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {currentStep === 'welcome' && (
          <div className="animate-slide-up">
            <div className="japanese-card p-12 text-center">
              <div className="hidden lg:block absolute -left-8 top-1/2 -translate-y-1/2 vertical-text text-ink-faint text-sm">
                N2学習の旅へ
              </div>

              <div className="text-6xl mb-6 animate-float">🎌</div>

              <h1 className="font-serif text-ink mb-4">
                ようこそ！
              </h1>
              <h2 className="font-serif text-3xl text-accent mb-6">
                欢迎来到 N2 学习之旅
              </h2>

              <p className="text-ink-soft text-lg mb-8 leading-relaxed">
                系统化学习 JLPT N2 语法<br />
                日本語能力試験 N2 文法をマスターしよう
              </p>

              <div className="grid grid-cols-3 gap-6 my-12">
                <div className="text-center">
                  <div className="text-3xl font-serif font-bold text-accent mb-2">26</div>
                  <div className="text-sm text-ink-mute">课程</div>
                  <div className="text-xs text-ink-faint font-sans">レッスン</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-serif font-bold text-pine mb-2">138</div>
                  <div className="text-sm text-ink-mute">语法点</div>
                  <div className="text-xs text-ink-faint font-sans">文法</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-serif font-bold text-amber mb-2">500+</div>
                  <div className="text-sm text-ink-mute">例句</div>
                  <div className="text-xs text-ink-faint font-sans">例文</div>
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={handleNext}
                  className="bg-accent hover:bg-accent text-white px-8 py-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-3"
                >
                  <span className="font-medium">开始设置</span>
                  <ChevronRight size={20} className="transition-transform" />
                </button>
              </div>
            </div>
          </div>
        )}

        {currentStep === 'features' && (
          <div className="animate-slide-up">
            <div className="japanese-card p-12">
              <h2 className="font-serif text-3xl text-ink mb-3 text-center">
                平台功能
              </h2>
              <p className="text-ink-mute text-center mb-10 font-sans">
                機能紹介
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-10">
                {features.map(({ tone, icon, title, description, titleJa }) => (
                  <div
                    key={title}
                    className={`${TONE_STYLES[tone].card} p-6 rounded-xl transition-all duration-300 hover:shadow-sm`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-lg ${TONE_STYLES[tone].icon} flex items-center justify-center text-white shrink-0`}>
                        {icon}
                      </div>
                      <div>
                        <h3 className="font-serif font-bold text-ink mb-2">{title}</h3>
                        <p className="text-ink-soft text-sm">{description}</p>
                        <p className="text-ink-faint text-xs font-sans mt-1">{titleJa}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between">
                <button
                  onClick={handleBack}
                  className="px-6 py-3 text-ink-soft hover:text-accent transition-colors flex items-center gap-2"
                >
                  返回
                </button>
                <button
                  onClick={handleNext}
                  className="bg-accent hover:bg-accent text-white px-8 py-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2"
                >
                  下一步
                  <ChevronRight size={20} className="transition-transform" />
                </button>
              </div>
            </div>
          </div>
        )}

        {currentStep === 'goals' && (
          <div className="animate-slide-up">
            <div className="japanese-card p-12">
              <h2 className="font-serif text-3xl text-ink mb-3 text-center">
                选择学习目标
              </h2>
              <p className="text-ink-mute text-center mb-10 font-sans">
                学習目標を選択
              </p>

              <div className="grid md:grid-cols-3 gap-6 mb-10">
                {learningGoals.map((goal) => (
                  <button
                    key={goal.id}
                    onClick={() => setSelectedGoal(goal.id)}
                    className={`
                      relative p-6 rounded-xl border transition-all duration-300 text-left
                      ${selectedGoal === goal.id
                        ? 'border-accent bg-accent-pale shadow-md scale-[1.02]'
                        : 'border-border bg-surface hover:border-accent/50 hover:shadow-sm'
                      }
                    `}
                  >
                    <div className={`mb-4 ${selectedGoal === goal.id ? 'text-accent' : 'text-ink-faint'}`}>
                      {goal.icon}
                    </div>
                    <h3 className={`font-serif font-bold mb-2 ${selectedGoal === goal.id ? 'text-accent' : 'text-ink'}`}>
                      {goal.title}
                    </h3>
                    <p className="text-xs text-ink-faint font-sans mb-2">
                      {goal.titleJa}
                    </p>
                    <p className={`text-sm ${selectedGoal === goal.id ? 'text-accent' : 'text-ink-soft'}`}>
                      {goal.description}
                    </p>
                    {selectedGoal === goal.id && (
                      <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-accent flex items-center justify-center">
                        <CheckCircle size={16} className="text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <div className="flex justify-between">
                <button
                  onClick={handleBack}
                  className="px-6 py-3 text-ink-soft hover:text-accent transition-colors flex items-center gap-2"
                >
                  返回
                </button>
                <button
                  onClick={handleNext}
                  className="bg-accent hover:bg-accent text-white px-8 py-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2"
                >
                  下一步
                  <ChevronRight size={20} className="transition-transform" />
                </button>
              </div>
            </div>
          </div>
        )}

        {currentStep === 'time' && (
          <div className="animate-slide-up">
            <div className="japanese-card p-12">
              <h2 className="font-serif text-3xl text-ink mb-3 text-center">
                设置每日学习时间
              </h2>
              <p className="text-ink-mute text-center mb-10 font-sans">
                1日の学習時間を設定
              </p>

              <div className="grid md:grid-cols-3 gap-6 mb-10">
                {studyTimes.map((time) => (
                  <button
                    key={time.id}
                    onClick={() => setSelectedTime(time.id)}
                    className={`
                      relative p-8 rounded-xl border transition-all duration-300 text-center
                      ${selectedTime === time.id
                        ? 'border-accent bg-accent-pale shadow-md scale-[1.02]'
                        : 'border-border bg-surface hover:border-accent/50 hover:shadow-sm'
                      }
                    `}
                  >
                    <div className={`mb-4 inline-block ${selectedTime === time.id ? 'text-accent' : 'text-ink-faint'}`}>
                      {time.icon}
                    </div>
                    <div className={`font-serif text-4xl font-bold mb-2 ${selectedTime === time.id ? 'text-accent' : 'text-ink'}`}>
                      {time.minutes}
                    </div>
                    <div className={`text-sm mb-1 ${selectedTime === time.id ? 'text-accent' : 'text-ink-soft'}`}>
                      分钟
                    </div>
                    <div className="text-xs text-ink-faint font-sans">
                      {time.titleJa}
                    </div>
                    {selectedTime === time.id && (
                      <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-accent flex items-center justify-center">
                        <CheckCircle size={16} className="text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <div className="bg-surface-dim rounded-lg p-4 mb-8 text-center">
                <p className="text-ink-soft text-sm">
                  建议每天坚持学习，保持连续性比单次学习时长更重要
                </p>
                <p className="text-ink-faint text-xs font-sans mt-1">
                  継続は力なり
                </p>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={handleBack}
                  className="px-6 py-3 text-ink-soft hover:text-accent transition-colors flex items-center gap-2"
                >
                  返回
                </button>
                <button
                  onClick={handleNext}
                  className="bg-accent hover:bg-accent text-white px-8 py-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2"
                >
                  下一步
                  <ChevronRight size={20} className="transition-transform" />
                </button>
              </div>
            </div>
          </div>
        )}

        {currentStep === 'complete' && (
          <div className="animate-slide-up">
            <div className="japanese-card p-12 text-center">
              <div className="text-6xl mb-6">🎉</div>

              <h2 className="font-serif text-3xl text-ink mb-3">
                设置完成！
              </h2>
              <p className="text-ink-mute font-sans mb-8">
                設定完了
              </p>

              <div className="bg-surface rounded-xl p-6 mb-8 max-w-md mx-auto">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <CheckCircle size={24} className="text-pine" />
                  <span className="font-serif font-bold text-ink">您的学习计划</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-ink-soft">学习目标：</span>
                    <span className="font-medium text-ink">
                      {learningGoals.find(g => g.id === selectedGoal)?.title}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-soft">每日时间：</span>
                    <span className="font-medium text-ink">
                      {studyTimes.find(t => t.id === selectedTime)?.title}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-ink-soft mb-8">
                让我们开始 N2 学习之旅吧！<br />
                <span className="text-ink-faint font-sans text-sm">
                  N2学習の旅を始めましょう！
                </span>
              </p>

              <div className="flex justify-center gap-4">
                <button
                  onClick={handleBack}
                  className="px-6 py-3 text-ink-soft hover:text-accent transition-colors"
                >
                  返回修改
                </button>
                <button
                  onClick={handleComplete}
                  className="bg-accent hover:bg-accent text-white px-10 py-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-3"
                >
                  <span className="font-medium">开始学习</span>
                  <ChevronRight size={20} className="transition-transform" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

# Claude Code 开发指令 - Phase 1: 项目骨架搭建

## 项目背景

我要开发一个 JLPT N2 学习网站。请仔细阅读以下 PRD：

[在这里粘贴完整的 PRD - 就是之前生成的那份]

## 你的任务：Phase 1 - 搭建项目骨架

### 目标
创建一个可运行的项目骨架，包含：
1. 完整的项目结构
2. IndexedDB 配置
3. CSV 数据加载功能
4. 基础路由和空组件
5. 类型定义
6. 状态管理框架

### 具体要求

#### 1. 项目初始化
```bash
# 创建 Vite + React + TypeScript 项目
npm create vite@latest jlpt-n2-learning -- --template react-ts
cd jlpt-n2-learning
npm install

# 安装依赖
npm install react-router-dom zustand dexie dexie-react-hooks papaparse lucide-react
npm install -D @types/papaparse tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

#### 2. 配置 Tailwind CSS
修改 `tailwind.config.js`:
```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3B82F6',
          hover: '#2563EB',
          light: '#DBEAFE',
        },
        success: {
          DEFAULT: '#10B981',
          light: '#D1FAE5',
        },
        warning: {
          DEFAULT: '#F59E0B',
          light: '#FEF3C7',
        },
        error: {
          DEFAULT: '#EF4444',
          light: '#FEE2E2',
        },
      },
    },
  },
  plugins: [],
}
```

在 `src/index.css` 添加:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    font-family: 'Noto Sans JP', 'Hiragino Sans', sans-serif;
  }
}
```

#### 3. 创建完整的文件结构

按照 PRD 中的项目结构创建所有目录和空文件：

```
src/
├── components/
│   ├── layout/
│   │   ├── Header.tsx (创建空组件)
│   │   ├── Footer.tsx (创建空组件)
│   │   └── Sidebar.tsx (创建空组件)
│   ├── study/
│   │   ├── LessonMap.tsx (创建空组件)
│   │   ├── LessonCard.tsx (创建空组件)
│   │   ├── GrammarIntro.tsx (创建空组件)
│   │   ├── StudyCard.tsx (创建空组件)
│   │   └── AudioPlayer.tsx (创建空组件)
│   ├── practice/
│   │   ├── FillBlankQuiz.tsx (创建空组件)
│   │   ├── MultipleChoiceQuiz.tsx (创建空组件)
│   │   ├── QuizResult.tsx (创建空组件)
│   │   └── QuestionCard.tsx (创建空组件)
│   ├── progress/
│   │   ├── ProgressDashboard.tsx (创建空组件)
│   │   ├── DailyGoal.tsx (创建空组件)
│   │   ├── WeeklyChart.tsx (创建空组件)
│   │   ├── ReviewReminder.tsx (创建空组件)
│   │   ├── AchievementBadge.tsx (创建空组件)
│   │   └── StudyStreak.tsx (创建空组件)
│   └── common/
│       ├── Button.tsx (实现基础按钮组件)
│       ├── ProgressBar.tsx (实现进度条组件)
│       ├── Modal.tsx (实现模态框组件)
│       ├── LoadingSpinner.tsx (实现加载动画)
│       └── EmptyState.tsx (实现空状态组件)
├── pages/
│   ├── HomePage.tsx (创建空页面)
│   ├── OnboardingPage.tsx (创建空页面)
│   ├── LessonListPage.tsx (创建空页面)
│   ├── LessonDetailPage.tsx (创建空页面)
│   ├── StudyPage.tsx (创建空页面)
│   ├── GrammarDetailPage.tsx (创建空页面)
│   ├── PracticePage.tsx (创建空页面)
│   ├── QuizPage.tsx (创建空页面)
│   ├── ReviewPage.tsx (创建空页面)
│   ├── ProgressPage.tsx (创建空页面)
│   ├── WrongAnswersPage.tsx (创建空页面)
│   ├── AchievementsPage.tsx (创建空页面)
│   └── SettingsPage.tsx (创建空页面)
├── hooks/ (创建空文件，只写类型定义)
│   ├── useAudio.ts
│   ├── useProgress.ts
│   ├── useReviewSchedule.ts
│   ├── useStudySession.ts
│   ├── useQuiz.ts
│   └── useIndexedDB.ts
├── stores/ (创建 Zustand stores)
│   ├── userStore.ts
│   ├── studyStore.ts
│   ├── quizStore.ts
│   └── settingsStore.ts
├── utils/ (创建工具函数)
│   ├── csvParser.ts
│   ├── reviewAlgorithm.ts
│   ├── quizGenerator.ts
│   ├── dataProcessor.ts
│   ├── dateHelper.ts
│   └── constants.ts
├── types/ (创建所有类型定义)
│   ├── sentence.ts
│   ├── lesson.ts
│   ├── grammar.ts
│   ├── progress.ts
│   ├── quiz.ts
│   └── achievement.ts
├── db/ (创建 IndexedDB 配置)
│   ├── schema.ts
│   ├── migrations.ts
│   └── operations.ts
├── App.tsx
├── main.tsx
└── router.tsx
```

#### 4. 实现类型定义（完整实现）

按照 PRD 第 4 节的数据模型，在 `src/types/` 中定义所有类型。

**src/types/sentence.ts**:
```typescript
export interface Sentence {
  id: string;
  lessonNumber: number;
  grammarPoint: string;
  sentence: string;
  furigana: string;
  translation: string;
  audioPath: string;
  grammarConnection: string;
  grammarExplanation: string;
  wordByWord: string;
  tags: string[];
}
```

**src/types/lesson.ts**:
```typescript
export interface Lesson {
  id: number;
  grammarPoints: string[];
  sentenceCount: number;
  isUnlocked: boolean;
  isCompleted: boolean;
  completionRate: number;
}
```

**src/types/grammar.ts**:
```typescript
export interface GrammarPoint {
  id: string;
  lessonNumber: number;
  sentenceIds: string[];
  sentenceCount: number;
  grammarConnection: string;
  grammarExplanation: string;
  isLearned: boolean;
}
```

**src/types/progress.ts**:
```typescript
export interface LearnedGrammar {
  grammarId: string;
  firstLearnedDate: Date;
  lastReviewedDate: Date;
  nextReviewDate: Date;
  reviewCount: number;
  masteryLevel: number;
}

export interface UserProgress {
  id: string;
  currentLessonId: number;
  currentGrammarPoint: string;
  learnedSentences: string[];
  learnedGrammar: LearnedGrammar[];
  completedLessons: number[];
  totalStudyTime: number;
  studyStreak: number;
  lastStudyDate: Date;
}

export interface DailyGoal {
  id: string;
  date: Date;
  targetSentences: number;
  targetGrammarPoints: number;
  completedSentences: number;
  completedGrammarPoints: number;
  studyTime: number;
  isCompleted: boolean;
}
```

**src/types/quiz.ts**:
```typescript
export interface QuizQuestion {
  id: string;
  sentenceId: string;
  sentence: string;
  grammarPoint: string;
  translation: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface ExerciseRecord {
  id: string;
  sentenceId: string;
  grammarPoint: string;
  questionType: 'fill' | 'choice';
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  timestamp: Date;
}

export interface WrongAnswer {
  id: string;
  sentenceId: string;
  grammarPoint: string;
  wrongCount: number;
  lastWrongDate: Date;
  resolved: boolean;
  correctStreak: number;
}
```

**src/types/achievement.ts**:
```typescript
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: string;
  isUnlocked: boolean;
  unlockedDate?: Date;
}
```

#### 5. 实现 IndexedDB 配置（完整实现）

**src/db/schema.ts**:
```typescript
import Dexie, { Table } from 'dexie';
import type { 
  Sentence, 
  Lesson, 
  GrammarPoint, 
  UserProgress, 
  DailyGoal, 
  ExerciseRecord, 
  WrongAnswer, 
  Achievement 
} from '@/types';

export class JLPTN2Database extends Dexie {
  sentences!: Table<Sentence, string>;
  lessons!: Table<Lesson, number>;
  grammarPoints!: Table<GrammarPoint, string>;
  userProgress!: Table<UserProgress, string>;
  dailyGoals!: Table<DailyGoal, string>;
  exerciseHistory!: Table<ExerciseRecord, string>;
  wrongAnswers!: Table<WrongAnswer, string>;
  achievements!: Table<Achievement, string>;

  constructor() {
    super('JLPTN2DB');
    
    this.version(1).stores({
      sentences: 'id, lessonNumber, grammarPoint',
      lessons: 'id',
      grammarPoints: 'id, lessonNumber',
      userProgress: 'id',
      dailyGoals: 'id, date',
      exerciseHistory: 'id, sentenceId, timestamp, isCorrect',
      wrongAnswers: 'id, grammarPoint, resolved',
      achievements: 'id, isUnlocked',
    });
  }
}

export const db = new JLPTN2Database();
```

#### 6. 实现 CSV 解析和数据加载（完整实现）

**src/utils/csvParser.ts**:
```typescript
import Papa from 'papaparse';
import { db } from '@/db/schema';
import type { Sentence, Lesson, GrammarPoint } from '@/types';

export async function loadCSVData(): Promise<void> {
  try {
    // 1. 检查是否已加载数据
    const existingCount = await db.sentences.count();
    if (existingCount > 0) {
      console.log('数据已存在，跳过加载');
      return;
    }

    console.log('开始加载 CSV 数据...');

    // 2. 加载 CSV 文件
    const response = await fetch('/data/notes.csv');
    const csvText = await response.text();

    // 3. 解析 CSV
    const { data } = Papa.parse<any>(csvText, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false, // 保持为字符串，手动转换
    });

    console.log(`解析到 ${data.length} 条数据`);

    // 4. 转换数据格式
    const sentences: Sentence[] = data.map((row, index) => ({
      id: `sentence_${index + 1}`,
      lessonNumber: parseInt(row['课号']) || 0,
      grammarPoint: (row['语法点'] || '').trim(),
      sentence: (row['例句'] || '').trim(),
      furigana: (row['假名标注'] || '').trim(),
      translation: (row['中文翻译'] || '').trim(),
      audioPath: extractAudioPath(row['音频'] || ''),
      grammarConnection: (row['语法接续'] || '').trim(),
      grammarExplanation: (row['语法解释'] || '').trim(),
      wordByWord: (row['逐词精解'] || '').trim(),
      tags: (row['标签'] || '').split(',').map(t => t.trim()).filter(Boolean),
    }));

    // 5. 批量插入例句数据
    await db.sentences.bulkAdd(sentences);
    console.log('例句数据已导入');

    // 6. 生成课程和语法点数据
    await generateLessonsAndGrammar(sentences);
    console.log('课程和语法点数据已生成');

    // 7. 初始化用户进度
    await initializeUserProgress();
    console.log('用户进度已初始化');

    // 8. 初始化成就系统
    await initializeAchievements();
    console.log('成就系统已初始化');

    console.log('数据加载完成！');
  } catch (error) {
    console.error('数据加载失败:', error);
    throw error;
  }
}

function extractAudioPath(audioField: string): string {
  // 处理 "[sound:example_002.mp3]" 格式
  const match = audioField.match(/\[sound:(.+?)\]/);
  return match ? `/audio/${match[1]}` : '';
}

async function generateLessonsAndGrammar(sentences: Sentence[]): Promise<void> {
  // 按课号分组
  const lessonMap = new Map<number, Sentence[]>();
  sentences.forEach(s => {
    if (!lessonMap.has(s.lessonNumber)) {
      lessonMap.set(s.lessonNumber, []);
    }
    lessonMap.get(s.lessonNumber)!.push(s);
  });

  // 生成课程数据
  const lessons: Lesson[] = [];
  lessonMap.forEach((sents, lessonNum) => {
    const grammarPoints = [...new Set(sents.map(s => s.grammarPoint))];
    lessons.push({
      id: lessonNum,
      grammarPoints,
      sentenceCount: sents.length,
      isUnlocked: lessonNum === 1, // 第一课默认解锁
      isCompleted: false,
      completionRate: 0,
    });
  });
  await db.lessons.bulkAdd(lessons);

  // 生成语法点数据
  const grammarMap = new Map<string, Sentence[]>();
  sentences.forEach(s => {
    if (!grammarMap.has(s.grammarPoint)) {
      grammarMap.set(s.grammarPoint, []);
    }
    grammarMap.get(s.grammarPoint)!.push(s);
  });

  const grammarPoints: GrammarPoint[] = [];
  grammarMap.forEach((sents, grammar) => {
    const firstSentence = sents[0];
    grammarPoints.push({
      id: grammar,
      lessonNumber: firstSentence.lessonNumber,
      sentenceIds: sents.map(s => s.id),
      sentenceCount: sents.length,
      grammarConnection: firstSentence.grammarConnection,
      grammarExplanation: firstSentence.grammarExplanation,
      isLearned: false,
    });
  });
  await db.grammarPoints.bulkAdd(grammarPoints);
}

async function initializeUserProgress(): Promise<void> {
  const progress: UserProgress = {
    id: 'user_progress',
    currentLessonId: 1,
    currentGrammarPoint: '',
    learnedSentences: [],
    learnedGrammar: [],
    completedLessons: [],
    totalStudyTime: 0,
    studyStreak: 0,
    lastStudyDate: new Date(),
  };
  await db.userProgress.add(progress);
}

async function initializeAchievements(): Promise<void> {
  const achievements: Achievement[] = [
    {
      id: 'first_grammar',
      name: '🎯 开始学习',
      description: '完成第1个语法点',
      icon: '🎯',
      condition: 'complete_1_grammar',
      isUnlocked: false,
    },
    {
      id: 'first_lesson',
      name: '📚 第一课',
      description: '完成第1课',
      icon: '📚',
      condition: 'complete_lesson_1',
      isUnlocked: false,
    },
    {
      id: 'streak_7',
      name: '🔥 连续7天',
      description: '连续学习7天',
      icon: '🔥',
      condition: 'streak_7_days',
      isUnlocked: false,
    },
    {
      id: 'perfect_quiz',
      name: '💯 满分测试',
      description: '课后测试获得满分',
      icon: '💯',
      condition: 'quiz_perfect',
      isUnlocked: false,
    },
    // ... 其他成就
  ];
  await db.achievements.bulkAdd(achievements);
}
```

#### 7. 实现基础路由（完整实现）

**src/router.tsx**:
```typescript
import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import HomePage from './pages/HomePage';
import OnboardingPage from './pages/OnboardingPage';
import LessonListPage from './pages/LessonListPage';
import LessonDetailPage from './pages/LessonDetailPage';
import StudyPage from './pages/StudyPage';
import PracticePage from './pages/Practice Page';
import QuizPage from './pages/QuizPage';
import ReviewPage from './pages/ReviewPage';
import ProgressPage from './pages/ProgressPage';
import WrongAnswersPage from './pages/WrongAnswersPage';
import AchievementsPage from './pages/AchievementsPage';
import SettingsPage from './pages/SettingsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'onboarding', element: <OnboardingPage /> },
      { path: 'lessons', element: <LessonListPage /> },
      { path: 'lessons/:lessonId', element: <LessonDetailPage /> },
      { path: 'study/:grammarPoint', element: <StudyPage /> },
      { path: 'practice', element: <PracticePage /> },
      { path: 'quiz/:type', element: <QuizPage /> },
      { path: 'review', element: <ReviewPage /> },
      { path: 'progress', element: <ProgressPage /> },
      { path: 'wrong-answers', element: <WrongAnswersPage /> },
      { path: 'achievements', element: <AchievementsPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
]);
```

#### 8. 实现基础 Zustand Stores（完整实现）

**src/stores/userStore.ts**:
```typescript
import { create } from 'zustand';
import type { UserProgress } from '@/types';

interface UserStore {
  progress: UserProgress | null;
  isLoading: boolean;
  loadProgress: () => Promise<void>;
  updateProgress: (updates: Partial<UserProgress>) => Promise<void>;
}

export const useUserStore = create<UserStore>((set, get) => ({
  progress: null,
  isLoading: false,
  
  loadProgress: async () => {
    // 实现留空，后续填充
  },
  
  updateProgress: async (updates) => {
    // 实现留空，后续填充
  },
}));
```

类似地创建 `studyStore.ts`, `quizStore.ts`, `settingsStore.ts`

#### 9. 实现 App.tsx 和 main.tsx

**src/App.tsx**:
```typescript
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import LoadingSpinner from './components/common/LoadingSpinner';
import { loadCSVData } from './utils/csvParser';
import { useState } from 'react';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCSVData()
      .then(() => setIsLoading(false))
      .catch(err => {
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
        <p className="ml-4 text-gray-600">正在加载数据...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">数据加载失败: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded"
          >
            重新加载
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default App;
```

**src/main.tsx**:
```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
```

#### 10. 创建 public 目录结构

```
public/
├── data/
│   └── notes.csv (从源项目复制)
└── audio/
    └── *.mp3 (从源项目复制)
```

#### 11. 实现通用 UI 组件（完整实现）

实现 `Button`, `ProgressBar`, `Modal`, `LoadingSpinner`, `EmptyState` 等基础组件。

参考 PRD 中的组件样式设计。

### 验收标准

完成后，项目应该：
- ✅ 能够成功启动 `npm run dev`
- ✅ 能够加载 CSV 数据到 IndexedDB
- ✅ 所有路由都能访问（虽然是空页面）
- ✅ 没有 TypeScript 错误
- ✅ 基础 UI 组件可用
- ✅ 数据库中有数据（打开浏览器开发者工具 > Application > IndexedDB 查看）

### 注意事项

1. **不要实现具体的页面逻辑**，只创建空组件占位
2. **类型定义要完整**，后续开发会依赖这些类型
3. **IndexedDB 和 CSV 解析必须完整实现**，这是核心基础
4. **所有文件路径使用 `@/` 别名**（需要配置 vite.config.ts 和 tsconfig.json）
5. **确保 CSV 和音频文件路径正确**

### 完成后提交

完成后，执行：
```bash
git init
git add .
git commit -m "feat: Phase 1 - 项目骨架搭建完成"
git branch -M main
```

然后告诉我完成情况，我会开始 Phase 2 的并行开发。
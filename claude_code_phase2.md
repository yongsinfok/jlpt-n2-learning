# Claude Code 开发指令 - Phase 2: 学习功能模块

## 前置条件

✅ Phase 1 已完成（项目骨架已搭建）  
✅ 你已经切换到新分支：`git checkout -b feature/study`

## 项目背景

继续参考之前的完整 PRD。C:\Users\joshua\Desktop\vibe\Phase2\jlpt-n2-learning\jlpt_n2_prd_final.md

## 你的任务：实现学习功能模块

### 职责范围

你**只负责**以下文件的开发：

✅ **允许修改/实现的文件**：
- `src/pages/LessonListPage.tsx`
- `src/pages/LessonDetailPage.tsx`
- `src/pages/StudyPage.tsx`
- `src/pages/GrammarDetailPage.tsx`
- `src/components/study/LessonMap.tsx`
- `src/components/study/LessonCard.tsx`
- `src/components/study/GrammarIntro.tsx`
- `src/components/study/StudyCard.tsx`
- `src/components/study/AudioPlayer.tsx`
- `src/hooks/useAudio.ts`
- `src/hooks/useStudySession.ts`
- `src/stores/studyStore.ts`
- `src/db/operations.ts` (只添加学习相关的操作函数)

❌ **不要修改的文件**：
- `src/db/schema.ts`
- `src/types/` 下的任何文件
- `src/router.tsx`
- 其他模块的文件（practice, progress等）

### 具体任务

#### 1. 实现 StudyStore（Zustand 状态管理）

**src/stores/studyStore.ts**:
```typescript
import { create } from 'zustand';
import type { Sentence, GrammarPoint } from '@/types';

interface StudyStore {
  // 当前学习状态
  currentLesson: number | null;
  currentGrammar: string | null;
  currentSentenceIndex: number;
  sentences: Sentence[];
  grammarPoint: GrammarPoint | null;
  
  // 显示控制
  showFurigana: boolean;
  showTranslation: boolean;
  showAnalysis: boolean;
  
  // 方法
  loadLesson: (lessonId: number) => Promise<void>;
  loadGrammar: (grammarId: string) => Promise<void>;
  nextSentence: () => void;
  prevSentence: () => void;
  markAsLearned: (sentenceId: string) => Promise<void>;
  toggleFurigana: () => void;
  toggleTranslation: () => void;
  toggleAnalysis: () => void;
  reset: () => void;
}

export const useStudyStore = create<StudyStore>((set, get) => ({
  // ... 实现所有状态和方法
}));
```

#### 2. 实现数据库操作函数

**src/db/operations.ts**:
```typescript
import { db } from './schema';
import type { Lesson, GrammarPoint, Sentence, UserProgress } from '@/types';

// 课程相关
export async function getAllLessons(): Promise<Lesson[]> {
  return await db.lessons.toArray();
}

export async function getLessonById(id: number): Promise<Lesson | undefined> {
  return await db.lessons.get(id);
}

export async function updateLesson(id: number, updates: Partial<Lesson>): Promise<void> {
  await db.lessons.update(id, updates);
}

// 语法点相关
export async function getGrammarPointById(id: string): Promise<GrammarPoint | undefined> {
  return await db.grammarPoints.get(id);
}

export async function getGrammarPointsByLesson(lessonId: number): Promise<GrammarPoint[]> {
  return await db.grammarPoints.where('lessonNumber').equals(lessonId).toArray();
}

// 例句相关
export async function getSentencesByGrammar(grammarId: string): Promise<Sentence[]> {
  return await db.sentences.where('grammarPoint').equals(grammarId).toArray();
}

export async function getSentenceById(id: string): Promise<Sentence | undefined> {
  return await db.sentences.get(id);
}

// 用户进度相关
export async function getUserProgress(): Promise<UserProgress | undefined> {
  return await db.userProgress.get('user_progress');
}

export async function updateUserProgress(updates: Partial<UserProgress>): Promise<void> {
  await db.userProgress.update('user_progress', updates);
}

export async function markSentenceAsLearned(sentenceId: string): Promise<void> {
  const progress = await getUserProgress();
  if (!progress) return;
  
  if (!progress.learnedSentences.includes(sentenceId)) {
    progress.learnedSentences.push(sentenceId);
    await updateUserProgress({ learnedSentences: progress.learnedSentences });
  }
}

export async function markGrammarAsLearned(grammarId: string): Promise<void> {
  const progress = await getUserProgress();
  if (!progress) return;
  
  const existing = progress.learnedGrammar.find(g => g.grammarId === grammarId);
  if (!existing) {
    const now = new Date();
    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + 1); // 1天后首次复习
    
    progress.learnedGrammar.push({
      grammarId,
      firstLearnedDate: now,
      lastReviewedDate: now,
      nextReviewDate: nextReview,
      reviewCount: 0,
      masteryLevel: 1,
    });
    
    await updateUserProgress({ learnedGrammar: progress.learnedGrammar });
  }
}

// 解锁下一课
export async function unlockNextLesson(currentLessonId: number): Promise<void> {
  const nextLesson = await db.lessons.get(currentLessonId + 1);
  if (nextLesson && !nextLesson.isUnlocked) {
    await updateLesson(currentLessonId + 1, { isUnlocked: true });
  }
}
```

#### 3. 实现 useAudio Hook

**src/hooks/useAudio.ts**:
```typescript
import { useState, useRef, useEffect } from 'react';

interface UseAudioReturn {
  isPlaying: boolean;
  duration: number;
  currentTime: number;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  setPlaybackRate: (rate: number) => void;
}

export function useAudio(audioPath: string): UseAudioReturn {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioPath) return;

    // 创建音频对象
    audioRef.current = new Audio(audioPath);
    
    // 监听加载完成
    audioRef.current.addEventListener('loadedmetadata', () => {
      setDuration(audioRef.current!.duration);
    });

    // 监听播放进度
    audioRef.current.addEventListener('timeupdate', () => {
      setCurrentTime(audioRef.current!.currentTime);
    });

    // 监听播放结束
    audioRef.current.addEventListener('ended', () => {
      setIsPlaying(false);
      setCurrentTime(0);
    });

    // 清理
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [audioPath]);

  const play = () => {
    audioRef.current?.play();
    setIsPlaying(true);
  };

  const pause = () => {
    audioRef.current?.pause();
    setIsPlaying(false);
  };

  const toggle = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const setPlaybackRate = (rate: number) => {
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };

  return {
    isPlaying,
    duration,
    currentTime,
    play,
    pause,
    toggle,
    setPlaybackRate,
  };
}
```

#### 4. 实现页面组件

**src/pages/LessonListPage.tsx**:
实现课程地图页面，显示所有课程，使用游戏关卡式的视觉设计。

功能要求：
- 显示50个课程卡片
- 显示锁定/解锁状态
- 显示完成度
- 点击已解锁课程跳转到详情页
- 点击锁定课程提示"请先完成前一课"

**src/pages/LessonDetailPage.tsx**:
实现课程详情页面，显示该课程的所有语法点。

功能要求：
- 显示课程标题和进度
- 列出所有语法点及其学习状态
- "继续学习"按钮跳转到第一个未完成的语法点
- "复习本课"按钮
- "课后测试"按钮（完成80%后解锁）

**src/pages/StudyPage.tsx**:
实现学习页面，显示例句学习卡片。

功能要求：
- 加载指定语法点的所有例句
- 显示 StudyCard 组件
- 实现上一句/下一句导航
- 完成所有例句后显示完成提示

**src/components/study/StudyCard.tsx**:
实现学习卡片组件（核心组件）。

功能要求：
- 显示日语例句（语法点高亮）
- 音频播放按钮
- 可折叠的假名、翻译、解析
- "我已理解"和"下一句"按钮
- 支持键盘快捷键（空格播放音频，方向键导航）

**src/components/study/AudioPlayer.tsx**:
实现音频播放器组件。

功能要求：
- 播放/暂停按钮
- 显示播放状态
- 播放速度调节（0.5x ~ 2.0x）
- 进度条显示

**src/components/study/LessonCard.tsx**:
实现课程卡片组件。

功能要求：
- 显示课程号、语法点数量、例句数量
- 显示锁定/解锁/完成状态
- 悬停显示详细信息
- 点击跳转

**src/components/study/GrammarIntro.tsx**:
实现语法点介绍页面。

功能要求：
- 显示语法点名称
- 显示接续方式
- 显示详细说明
- "开始学习例句"按钮

### 样式要求

使用 Tailwind CSS，参考 PRD 中的设计规范：
- 主色调：`bg-primary`, `text-primary`
- 成功状态：`bg-success`, `text-success`
- 锁定状态：`bg-gray-400`, `text-gray-400`
- 语法点高亮：`bg-yellow-200`, `border-yellow-500`

### 交互要求

1. **课程解锁逻辑**：只有完成前一课才能解锁下一课
2. **语法点完成检测**：学完所有例句后自动标记为已完成
3. **进度实时更新**：点击"我已理解"立即保存到IndexedDB
4. **键盘快捷键**：
   - 空格：播放/暂停音频
   - 方向键左/右：上一句/下一句
   - F：切换假名显示
   - T：切换翻译显示
   - A：切换解析显示

### 测试要点

完成后请测试：
- [ ] 课程列表正确显示所有课程
- [ ] 只有第一课是解锁状态
- [ ] 点击课程进入详情页
- [ ] 详情页显示所有语法点
- [ ] 点击"继续学习"进入学习页面
- [ ] 学习卡片正确显示例句
- [ ] 音频正常播放
- [ ] 假名/翻译/解析可以折叠展开
- [ ] 点击"我已理解"后进度保存
- [ ] 完成所有例句后显示完成提示
- [ ] 完成一课后下一课自动解锁

### 验收标准

- ✅ 所有组件无 TypeScript 错误
- ✅ 页面导航流畅
- ✅ 音频播放正常
- ✅ 进度正确保存到IndexedDB
- ✅ 课程解锁逻辑正确
- ✅ 响应式设计（移动端和桌面端都能用）

### 完成后

执行：
```bash
git add .
git commit -m "feat: 实现学习功能模块"
git push origin feature/study
```

然后告诉我已完成，等待与其他模块合并。
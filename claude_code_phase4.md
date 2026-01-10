# Claude Code 开发指令 - Phase 4: 复习与统计模块

## 前置条件

✅ Phase 1 已完成（项目骨架已搭建）  
✅ 你已经切换到新分支：`git checkout -b feature/review-stats`

## 你的任务：实现复习系统和统计功能

### 职责范围

你**只负责**以下文件的开发：

✅ **允许修改/实现的文件**：
- `src/pages/HomePage.tsx`
- `src/pages/ReviewPage.tsx`
- `src/pages/ProgressPage.tsx`
- `src/pages/AchievementsPage.tsx`
- `src/pages/SettingsPage.tsx`
- `src/components/progress/ProgressDashboard.tsx`
- `src/components/progress/DailyGoal.tsx`
- `src/components/progress/WeeklyChart.tsx`
- `src/components/progress/ReviewReminder.tsx`
- `src/components/progress/AchievementBadge.tsx`
- `src/components/progress/StudyStreak.tsx`
- `src/hooks/useProgress.ts`
- `src/hooks/useReviewSchedule.ts`
- `src/utils/reviewAlgorithm.ts`
- `src/utils/dateHelper.ts`

❌ **不要修改的文件**：
- `src/db/schema.ts`
- `src/types/` 下的任何文件
- `src/router.tsx`
- 其他模块的文件

### 具体任务

#### 1. 实现复习算法

**src/utils/reviewAlgorithm.ts**:
```typescript
export const REVIEW_INTERVALS = [1, 1, 3, 7, 15, 30]; // 天数

export interface ReviewSchedule {
  nextLevel: number;
  nextReviewDate: Date;
}

// 计算下次复习时间
export function calculateNextReview(
  currentLevel: number,
  wasCorrect: boolean
): ReviewSchedule {
  // 答对：等级+1（最高5）
  // 答错：等级-1（最低1）
  let nextLevel = wasCorrect
    ? Math.min(currentLevel + 1, 5)
    : Math.max(currentLevel - 1, 1);

  // 根据新等级计算复习间隔
  const daysToAdd = REVIEW_INTERVALS[nextLevel];
  
  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + daysToAdd);
  nextReviewDate.setHours(0, 0, 0, 0); // 设置为当天00:00

  return { nextLevel, nextReviewDate };
}

// 获取需要复习的语法点
export function getDueReviews(
  learnedGrammar: Array<{
    grammarId: string;
    nextReviewDate: Date;
  }>
): string[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return learnedGrammar
    .filter(item => {
      const reviewDate = new Date(item.nextReviewDate);
      reviewDate.setHours(0, 0, 0, 0);
      return reviewDate <= today;
    })
    .map(item => item.grammarId);
}

// 根据掌握等级获取描述
export function getMasteryDescription(level: number): string {
  const descriptions = [
    '未学习',
    '刚学习',
    '初步掌握',
    '基本掌握',
    '熟练掌握',
    '完全掌握',
  ];
  return descriptions[level] || '未知';
}
```

**src/utils/dateHelper.ts**:
```typescript
// 格式化日期
export function formatDate(date: Date): string {
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

// 格式化相对时间
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return '今天';
  if (days === 1) return '昨天';
  if (days < 7) return `${days}天前`;
  if (days < 30) return `${Math.floor(days / 7)}周前`;
  return `${Math.floor(days / 30)}个月前`;
}

// 获取今天的日期字符串（YYYY-MM-DD）
export function getTodayString(): string {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
}

// 获取本周的日期范围
export function getThisWeekDates(): Date[] {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 (Sunday) to 6 (Saturday)
  const monday = new Date(today);
  monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
  
  const dates: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    dates.push(date);
  }
  return dates;
}

// 计算连续学习天数
export function calculateStreak(lastStudyDate: Date): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const last = new Date(lastStudyDate);
  last.setHours(0, 0, 0, 0);
  
  const diffDays = Math.floor((today.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
  
  // 如果超过1天没学习，连续中断
  return diffDays > 1 ? 0 : diffDays;
}
```

#### 2. 实现 Hooks

**src/hooks/useProgress.ts**:
```typescript
import { useState, useEffect } from 'react';
import { db } from '@/db/schema';
import type { UserProgress } from '@/types';

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProgress();
  }, []);

  async function loadProgress() {
    try {
      const data = await db.userProgress.get('user_progress');
      setProgress(data || null);
    } catch (error) {
      console.error('加载进度失败:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function updateProgress(updates: Partial<UserProgress>) {
    try {
      await db.userProgress.update('user_progress', updates);
      await loadProgress(); // 重新加载
    } catch (error) {
      console.error('更新进度失败:', error);
    }
  }

  // 计算总体进度
  function getOverallProgress() {
    if (!progress) return { lessons: 0, grammar: 0, sentences: 0 };

    return {
      lessons: (progress.completedLessons.length / 50) * 100,
      grammar: (progress.learnedGrammar.length / 200) * 100,
      sentences: (progress.learnedSentences.length / 1000) * 100,
    };
  }

  return {
    progress,
    isLoading,
    loadProgress,
    updateProgress,
    getOverallProgress,
  };
}
```

**src/hooks/useReviewSchedule.ts**:
```typescript
import { useState, useEffect } from 'react';
import { db } from '@/db/schema';
import { getDueReviews } from '@/utils/reviewAlgorithm';

export function useReviewSchedule() {
  const [dueGrammarIds, setDueGrammarIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDueReviews();
  }, []);

  async function loadDueReviews() {
    try {
      const progress = await db.userProgress.get('user_progress');
      if (progress) {
        const dueIds = getDueReviews(progress.learnedGrammar);
        setDueGrammarIds(dueIds);
      }
    } catch (error) {
      console.error('加载复习计划失败:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function completeReview(grammarId: string, wasCorrect: boolean) {
    // 更新复习记录和掌握等级
    const progress = await db.userProgress.get('user_progress');
    if (!progress) return;

    const grammarIndex = progress.learnedGrammar.findIndex(g => g.grammarId === grammarId);
    if (grammarIndex === -1) return;

    const { nextLevel, nextReviewDate } = calculateNextReview(
      progress.learnedGrammar[grammarIndex].masteryLevel,
      wasCorrect
    );

    progress.learnedGrammar[grammarIndex] = {
      ...progress.learnedGrammar[grammarIndex],
      lastReviewedDate: new Date(),
      nextReviewDate,
      reviewCount: progress.learnedGrammar[grammarIndex].reviewCount + 1,
      masteryLevel: nextLevel,
    };

    await db.userProgress.update('user_progress', {
      learnedGrammar: progress.learnedGrammar,
    });

    await loadDueReviews();
  }

  return {
    dueGrammarIds,
    isLoading,
    loadDueReviews,
    completeReview,
  };
}
```

#### 3. 实现页面组件

**src/pages/HomePage.tsx**:
首页，显示学习建议和快速入口。

功能要求：
- 显示连续学习天数（StudyStreak组件）
- 显示今日学习建议
- 显示今日目标进度（DailyGoal组件）
- 显示复习提醒（ReviewReminder组件）
- 显示总体进度概览
- 快速操作按钮（开始学习、开始复习）

**src/pages/ReviewPage.tsx**:
复习页面。

功能要求：
- 显示需要复习的语法点列表
- 可以选择"快速浏览"或"测试"模式
- 快速浏览：显示例句卡片（使用StudyCard组件）
- 测试模式：生成测试题（使用QuizPage组件）
- 复习完成后更新掌握等级和下次复习时间
- 显示复习完成统计

**src/pages/ProgressPage.tsx**:
进度统计页面。

功能要求：
- 总体进度（课程、语法点、例句）
- 学习时长统计
- 练习统计（总题数、正确率）
- 本周学习图表（WeeklyChart组件）
- 掌握程度分布
- 薄弱知识点分析（正确率最低的语法点）
- "针对性练习"按钮

**src/pages/AchievementsPage.tsx**:
成就页面。

功能要求：
- 显示所有成就列表
- 已解锁的成就显示解锁日期
- 未解锁的成就显示解锁条件
- 成就分类（学习进度、练习成绩、坚持学习等）
- 成就进度条

**src/pages/SettingsPage.tsx**:
设置页面。

功能要求：
- 学习设置：每日目标（例句数、语法点数）
- 复习设置：开关复习提醒
- 音频设置：自动播放、播放速度
- 显示设置：主题（浅色/深色）、字体大小
- 数据管理：导出学习数据（JSON）、导入数据、重置数据
- 关于：版本信息、数据来源、许可证

#### 4. 实现组件

**src/components/progress/DailyGoal.tsx**:
每日目标组件。

功能：
- 显示今日目标和完成进度
- 进度条展示
- 完成提示

**src/components/progress/WeeklyChart.tsx**:
本周学习图表组件。

功能：
- 柱状图显示本周每天的学习量
- X轴：周一到周日
- Y轴：学习的语法点数量
- 今天特殊标记

**src/components/progress/ReviewReminder.tsx**:
复习提醒组件。

功能：
- 显示需要复习的语法点数量
- 显示预计复习时间
- "开始复习"和"推迟"按钮

**src/components/progress/StudyStreak.tsx**:
连续学习天数组件。

功能：
- 显示连续学习天数（🔥 图标）
- 激励文案
- 进度条（连续7天、30天等里程碑）

**src/components/progress/AchievementBadge.tsx**:
成就徽章组件。

功能：
- 显示成就图标和名称
- 已解锁：彩色显示
- 未解锁：灰色显示
- 悬停显示详细信息

#### 5. 成就系统逻辑

在用户完成特定操作时检测并解锁成就：

```typescript
// 检测成就解锁
export async function checkAchievements() {
  const progress = await db.userProgress.get('user_progress');
  if (!progress) return;

  const achievements = await db.achievements.toArray();
  
  for (const achievement of achievements) {
    if (achievement.isUnlocked) continue;

    let shouldUnlock = false;

    switch (achievement.condition) {
      case 'complete_1_grammar':
        shouldUnlock = progress.learnedGrammar.length >= 1;
        break;
      case 'complete_lesson_1':
        shouldUnlock = progress.completedLessons.includes(1);
        break;
      case 'streak_7_days':
        shouldUnlock = progress.studyStreak >= 7;
        break;
      case 'quiz_perfect':
        // 检查是否有满分测试记录
        const exercises = await db.exerciseHistory.toArray();
        // ... 实现逻辑
        break;
      // ... 其他成就条件
    }

    if (shouldUnlock) {
      await db.achievements.update(achievement.id, {
        isUnlocked: true,
        unlockedDate: new Date(),
      });
      // 显示成就解锁通知
      showAchievementNotification(achievement);
    }
  }
}
```

### 业务逻辑要求

1. **复习提醒**：
   - 每天打开网站时检查到期复习项目
   - 首页显示提醒
   - 可以推迟到明天

2. **每日目标**：
   - 每天自动创建新的每日目标记录
   - 学习时实时更新完成进度
   - 完成后显示祝贺

3. **连续学习**：
   - 每天首次学习时更新 `lastStudyDate`
   - 计算连续天数
   - 超过1天未学习则清零

4. **成就系统**：
   - 在关键操作后检测成就
   - 解锁时显示通知
   - 首页显示最近解锁的成就

### 测试要点

完成后请测试：
- [ ] 首页正确显示所有信息
- [ ] 复习提醒正确显示到期项目
- [ ] 复习完成后正确更新掌握等级
- [ ] 每日目标实时更新
- [ ] 连续学习天数正确计算
- [ ] 统计数据准确
- [ ] 本周图表正确显示
- [ ] 成就正确解锁
- [ ] 设置功能正常（导出/导入数据）

### 验收标准

- ✅ 复习系统完整可用
- ✅ 统计数据准确
- ✅ 成就系统正常
- ✅ 设置功能完整
- ✅ 没有TypeScript错误

### 完成后

执行：
```bash
git add .
git commit -m "feat: 实现复习系统和统计功能"
git push origin feature/review-stats
```

然后告诉我已完成。
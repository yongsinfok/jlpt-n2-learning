# Claude Code 开发指令 - Phase 3: 练习功能模块

## 前置条件

✅ Phase 1 已完成（项目骨架已搭建）  
✅ 你已经切换到新分支：`git checkout -b feature/practice`

## 你的任务：实现练习功能模块

### 职责范围

你**只负责**以下文件的开发：

✅ **允许修改/实现的文件**：
- `src/pages/PracticePage.tsx`
- `src/pages/QuizPage.tsx`
- `src/pages/WrongAnswersPage.tsx`
- `src/components/practice/FillBlankQuiz.tsx`
- `src/components/practice/MultipleChoiceQuiz.tsx`
- `src/components/practice/QuizResult.tsx`
- `src/components/practice/QuestionCard.tsx`
- `src/hooks/useQuiz.ts`
- `src/stores/quizStore.ts`
- `src/utils/quizGenerator.ts`

❌ **不要修改的文件**：
- `src/db/schema.ts`
- `src/types/` 下的任何文件
- `src/router.tsx`
- 其他模块的文件（study, progress等）

### 具体任务

#### 1. 实现题目生成器

**src/utils/quizGenerator.ts**:
```typescript
import { db } from '@/db/schema';
import type { Sentence, QuizQuestion } from '@/types';

// 生成填空题
export async function generateFillBlankQuestions(
  grammarPoint: string,
  count: number = 3
): Promise<QuizQuestion[]> {
  // 1. 获取该语法点的所有例句
  const sentences = await db.sentences
    .where('grammarPoint')
    .equals(grammarPoint)
    .toArray();

  if (sentences.length === 0) return [];

  // 2. 随机选择count个例句
  const selectedSentences = shuffleArray(sentences).slice(0, Math.min(count, sentences.length));

  // 3. 为每个例句生成题目
  const questions: QuizQuestion[] = [];
  
  for (const sentence of selectedSentences) {
    // 获取干扰项（相似的语法点）
    const distractors = await getSimilarGrammarPoints(grammarPoint, 3);
    
    questions.push({
      id: `quiz_${sentence.id}_${Date.now()}_${Math.random()}`,
      sentenceId: sentence.id,
      sentence: sentence.sentence.replace(grammarPoint, '______'),
      grammarPoint: grammarPoint,
      translation: sentence.translation,
      options: shuffleArray([grammarPoint, ...distractors]),
      correctAnswer: grammarPoint,
      explanation: sentence.grammarExplanation,
    });
  }

  return questions;
}

// 按课程生成混合题目
export async function generateLessonQuiz(
  lessonId: number,
  count: number = 12
): Promise<QuizQuestion[]> {
  // 1. 获取该课程的所有语法点
  const grammarPoints = await db.grammarPoints
    .where('lessonNumber')
    .equals(lessonId)
    .toArray();

  if (grammarPoints.length === 0) return [];

  // 2. 为每个语法点生成题目
  const questionsPerGrammar = Math.ceil(count / grammarPoints.length);
  const allQuestions: QuizQuestion[] = [];

  for (const grammar of grammarPoints) {
    const questions = await generateFillBlankQuestions(grammar.id, questionsPerGrammar);
    allQuestions.push(...questions);
  }

  // 3. 随机打乱并限制数量
  return shuffleArray(allQuestions).slice(0, count);
}

// 从学习范围生成练习题
export async function generatePracticeQuestions(
  lessonIds: number[],
  count: number = 10
): Promise<QuizQuestion[]> {
  const allQuestions: QuizQuestion[] = [];

  for (const lessonId of lessonIds) {
    const questions = await generateLessonQuiz(lessonId, count);
    allQuestions.push(...questions);
  }

  return shuffleArray(allQuestions).slice(0, count);
}

// 获取相似的语法点作为干扰项
async function getSimilarGrammarPoints(
  targetGrammar: string,
  count: number
): Promise<string[]> {
  const target = await db.grammarPoints.get(targetGrammar);
  if (!target) return [];

  // 获取同课或相近课程的其他语法点
  const similar = await db.grammarPoints
    .where('lessonNumber')
    .between(Math.max(1, target.lessonNumber - 2), target.lessonNumber + 2)
    .and(g => g.id !== targetGrammar)
    .limit(count * 3)
    .toArray();

  const similarIds = shuffleArray(similar.map(g => g.id)).slice(0, count);
  
  // 如果不够，随机添加其他语法点
  if (similarIds.length < count) {
    const additional = await db.grammarPoints
      .where('id')
      .notEqual(targetGrammar)
      .limit((count - similarIds.length) * 2)
      .toArray();
    
    similarIds.push(...shuffleArray(additional.map(g => g.id)).slice(0, count - similarIds.length));
  }

  return similarIds;
}

// 随机打乱数组
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
```

#### 2. 实现 QuizStore

**src/stores/quizStore.ts**:
```typescript
import { create } from 'zustand';
import type { QuizQuestion, ExerciseRecord } from '@/types';
import { db } from '@/db/schema';

interface QuizStore {
  // 当前测试状态
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  userAnswers: Map<string, string>;
  isSubmitted: boolean;
  startTime: Date | null;
  endTime: Date | null;
  
  // 测试类型
  quizType: 'mini' | 'lesson' | 'practice' | null;
  targetId: string | null; // 语法点ID或课程ID
  
  // 方法
  startQuiz: (questions: QuizQuestion[], type: string, targetId: string) => void;
  answerQuestion: (questionId: string, answer: string) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  submitQuiz: () => Promise<void>;
  reset: () => void;
  
  // 计算结果
  getScore: () => { correct: number; total: number; percentage: number };
}

export const useQuizStore = create<QuizStore>((set, get) => ({
  questions: [],
  currentQuestionIndex: 0,
  userAnswers: new Map(),
  isSubmitted: false,
  startTime: null,
  endTime: null,
  quizType: null,
  targetId: null,

  startQuiz: (questions, type, targetId) => {
    set({
      questions,
      quizType: type as any,
      targetId,
      currentQuestionIndex: 0,
      userAnswers: new Map(),
      isSubmitted: false,
      startTime: new Date(),
      endTime: null,
    });
  },

  answerQuestion: (questionId, answer) => {
    const { userAnswers } = get();
    const newAnswers = new Map(userAnswers);
    newAnswers.set(questionId, answer);
    set({ userAnswers: newAnswers });
  },

  nextQuestion: () => {
    const { currentQuestionIndex, questions } = get();
    if (currentQuestionIndex < questions.length - 1) {
      set({ currentQuestionIndex: currentQuestionIndex + 1 });
    }
  },

  prevQuestion: () => {
    const { currentQuestionIndex } = get();
    if (currentQuestionIndex > 0) {
      set({ currentQuestionIndex: currentQuestionIndex - 1 });
    }
  },

  submitQuiz: async () => {
    const { questions, userAnswers } = get();
    set({ isSubmitted: true, endTime: new Date() });

    // 保存练习记录到数据库
    const records: ExerciseRecord[] = questions.map(q => ({
      id: `record_${q.id}_${Date.now()}`,
      sentenceId: q.sentenceId,
      grammarPoint: q.grammarPoint,
      questionType: 'choice',
      userAnswer: userAnswers.get(q.id) || '',
      correctAnswer: q.correctAnswer,
      isCorrect: userAnswers.get(q.id) === q.correctAnswer,
      timestamp: new Date(),
    }));

    await db.exerciseHistory.bulkAdd(records);

    // 更新错题本
    for (const record of records) {
      if (!record.isCorrect) {
        await addToWrongAnswers(record);
      } else {
        await updateWrongAnswerStatus(record.sentenceId, true);
      }
    }
  },

  reset: () => {
    set({
      questions: [],
      currentQuestionIndex: 0,
      userAnswers: new Map(),
      isSubmitted: false,
      startTime: null,
      endTime: null,
      quizType: null,
      targetId: null,
    });
  },

  getScore: () => {
    const { questions, userAnswers } = get();
    const correct = questions.filter(q => userAnswers.get(q.id) === q.correctAnswer).length;
    return {
      correct,
      total: questions.length,
      percentage: questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0,
    };
  },
}));

// 辅助函数：添加到错题本
async function addToWrongAnswers(record: ExerciseRecord): Promise<void> {
  const existing = await db.wrongAnswers.get(record.sentenceId);
  
  if (existing) {
    await db.wrongAnswers.update(record.sentenceId, {
      wrongCount: existing.wrongCount + 1,
      lastWrongDate: new Date(),
      resolved: false,
      correctStreak: 0,
    });
  } else {
    await db.wrongAnswers.add({
      id: record.sentenceId,
      sentenceId: record.sentenceId,
      grammarPoint: record.grammarPoint,
      wrongCount: 1,
      lastWrongDate: new Date(),
      resolved: false,
      correctStreak: 0,
    });
  }
}

// 辅助函数：更新错题本状态
async function updateWrongAnswerStatus(sentenceId: string, isCorrect: boolean): Promise<void> {
  const wrong = await db.wrongAnswers.get(sentenceId);
  if (!wrong) return;

  if (isCorrect) {
    const newStreak = wrong.correctStreak + 1;
    if (newStreak >= 3) {
      // 连续答对3次，从错题本移除
      await db.wrongAnswers.update(sentenceId, { resolved: true });
    } else {
      await db.wrongAnswers.update(sentenceId, { correctStreak: newStreak });
    }
  } else {
    await db.wrongAnswers.update(sentenceId, { correctStreak: 0 });
  }
}
```

#### 3. 实现页面组件

**src/pages/PracticePage.tsx**:
练习模式选择页面。

功能要求：
- 4种练习模式卡片（填空、选择、听力、错题本）
- 练习范围筛选（课程、语法点）
- 点击开始进入相应练习

**src/pages/QuizPage.tsx**:
测试页面（通用）。

功能要求：
- 显示当前题目
- 显示答题进度（5/12）
- 倒计时（如果是课程测试）
- 提交按钮
- 提交后显示结果页

**src/pages/WrongAnswersPage.tsx**:
错题本页面。

功能要求：
- 按语法点分组显示错题
- 显示错误次数和最后答错时间
- "复习全部"和"按语法点复习"按钮
- 已掌握的题目（连续答对3次）显示为灰色或隐藏

**src/components/practice/QuestionCard.tsx**:
题目卡片组件。

功能要求：
- 显示题目（带空格的例句）
- 显示4个选项（单选）
- 提交前：选择答案
- 提交后：显示对错、正确答案、解析

**src/components/practice/QuizResult.tsx**:
测试结果页面。

功能要求：
- 显示总分和用时
- 显示每题的对错情况
- 按语法点统计正确率
- "复习错题"和"继续学习"按钮

### 业务逻辑要求

1. **课后小测**：
   - 完成语法点后自动触发
   - 3题，不限时
   - 不强制通过

2. **课程测试**：
   - 完成课程80%后解锁
   - 10-15题，限时10分钟
   - 70分以上通过，解锁下一课
   - 可以重考

3. **错题本**：
   - 答错的题自动加入
   - 连续答对3次移出错题本
   - 支持按语法点筛选

### 样式要求

- 正确答案：绿色背景 `bg-success-light`
- 错误答案：红色背景 `bg-error-light`
- 未提交选中：蓝色边框 `border-primary`
- 题目卡片：白色卡片带阴影

### 测试要点

完成后请测试：
- [ ] 能够生成题目
- [ ] 题目随机且干扰项合理
- [ ] 能够选择答案
- [ ] 提交后正确判断对错
- [ ] 错题正确加入错题本
- [ ] 错题本能够正确显示
- [ ] 连续答对3次后题目从错题本移除
- [ ] 课程测试通过后解锁下一课

### 验收标准

- ✅ 题目生成逻辑正确
- ✅ 答题和判断逻辑正确
- ✅ 错题本功能完整
- ✅ 测试结果统计准确
- ✅ 没有TypeScript错误

### 完成后

执行：
```bash
git add .
git commit -m "feat: 实现练习功能模块"
git push origin feature/practice
```

然后告诉我已完成。
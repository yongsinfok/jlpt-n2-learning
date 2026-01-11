# Claude 开发日志 - 练习功能模块

## 模块信息
- **分支**: feature/practice
- **负责人**: Claude Code #2
- **依赖**: Phase 1 必须完成
- **最后更新**: [自动更新]
- **当前状态**: ⏸️ 未开始

---

## 功能清单

### 3.1 题目生成器 (src/utils/quizGenerator.ts)
- [ ] generateFillBlankQuestions()
- [ ] generateLessonQuiz()
- [ ] generatePracticeQuestions()
- [ ] getSimilarGrammarPoints()
- [ ] shuffleArray()
- [ ] 测试生成器逻辑
- 提交: [commit hash]

### 3.2 QuizStore (src/stores/quizStore.ts)
- [ ] 定义状态接口
- [ ] 实现 startQuiz()
- [ ] 实现 answerQuestion()
- [ ] 实现 nextQuestion()
- [ ] 实现 prevQuestion()
- [ ] 实现 submitQuiz()
- [ ] 实现 getScore()
- [ ] 实现错题本逻辑
- [ ] 测试 Store
- 提交: [commit hash]

### 3.3 useQuiz Hook (src/hooks/useQuiz.ts)
- [ ] 实现测试会话管理
- [ ] 实现倒计时
- [ ] 实现自动保存
- 提交: [commit hash]

### 3.4 PracticePage (src/pages/PracticePage.tsx)
- [ ] 页面布局
- [ ] 4种练习模式卡片
- [ ] 范围筛选功能
- [ ] 点击开始跳转
- [ ] 测试页面
- 提交: [commit hash]

### 3.5 QuizPage (src/pages/QuizPage.tsx)
- [ ] 页面布局
- [ ] 显示当前题目
- [ ] 显示答题进度
- [ ] 倒计时显示（课程测试）
- [ ] 提交按钮
- [ ] 显示结果页
- [ ] 测试页面
- 提交: [commit hash]

### 3.6 WrongAnswersPage (src/pages/WrongAnswersPage.tsx)
- [ ] 页面布局
- [ ] 按语法点分组显示
- [ ] 显示错误统计
- [ ] "复习全部"按钮
- [ ] "按语法点复习"按钮
- [ ] 测试页面
- 提交: [commit hash]

### 3.7 QuestionCard (src/components/practice/QuestionCard.tsx)
- [ ] 组件结构
- [ ] 显示题目
- [ ] 4个选项单选
- [ ] 提交前状态
- [ ] 提交后状态（对错、解析）
- [ ] 测试组件
- 提交: [commit hash]

### 3.8 QuizResult (src/components/practice/QuizResult.tsx)
- [ ] 组件结构
- [ ] 显示总分和用时
- [ ] 显示每题对错
- [ ] 按语法点统计
- [ ] "复习错题"按钮
- [ ] "继续学习"按钮
- [ ] 测试组件
- 提交: [commit hash]

### 3.9 FillBlankQuiz (src/components/practice/FillBlankQuiz.tsx)
- [ ] 填空题组件
- [ ] 测试组件
- 提交: [commit hash]

### 3.10 MultipleChoiceQuiz (src/components/practice/MultipleChoiceQuiz.tsx)
- [ ] 选择题组件
- [ ] 测试组件
- 提交: [commit hash]

---

## 验收标准

### 功能测试
- [ ] 能够生成题目
- [ ] 题目随机且干扰项合理
- [ ] 能够选择答案
- [ ] 提交后正确判断对错
- [ ] 显示正确答案和解析
- [ ] 错题正确加入错题本
- [ ] 错题本能够正确显示
- [ ] 连续答对3次后题目从错题本移除
- [ ] 课程测试通过后解锁下一课
- [ ] 倒计时正常工作

### 数据测试
- [ ] 练习记录正确保存到 exerciseHistory
- [ ] 错题正确保存到 wrongAnswers
- [ ] 统计数据准确

---

## 文件清单

### 修改的文件
无（独立模块）

### 新增的文件
- [ ] src/utils/quizGenerator.ts
- [ ] src/stores/quizStore.ts
- [ ] src/hooks/useQuiz.ts
- [ ] src/pages/PracticePage.tsx
- [ ] src/pages/QuizPage.tsx
- [ ] src/pages/WrongAnswersPage.tsx
- [ ] src/components/practice/QuestionCard.tsx
- [ ] src/components/practice/QuizResult.tsx
- [ ] src/components/practice/FillBlankQuiz.tsx
- [ ] src/components/practice/MultipleChoiceQuiz.tsx

---

## 提交历史

[commit hash] - [时间] - feat(practice): [提交信息]


---

## 与其他模块的接口

### 被依赖的接口
- generateFillBlankQuestions() - 被 review 模块使用

### 依赖的接口
- getSentenceById() - 来自 study 模块
- getUserProgress() - 来自 study 模块
# Claude 开发日志 - 复习与统计模块

## 模块信息
- **分支**: feature/review-stats
- **负责人**: Claude Code #3
- **依赖**: Phase 1 必须完成
- **最后更新**: [自动更新]
- **当前状态**: ⏸️ 未开始

---

## 功能清单

### 4.1 复习算法 (src/utils/reviewAlgorithm.ts)
- [ ] calculateNextReview()
- [ ] getDueReviews()
- [ ] getMasteryDescription()
- [ ] 测试算法
- 提交: [commit hash]

### 4.2 日期辅助函数 (src/utils/dateHelper.ts)
- [ ] formatDate()
- [ ] formatRelativeTime()
- [ ] getTodayString()
- [ ] getThisWeekDates()
- [ ] calculateStreak()
- [ ] 测试函数
- 提交: [commit hash]

### 4.3 useProgress Hook (src/hooks/useProgress.ts)
- [ ] loadProgress()
- [ ] updateProgress()
- [ ] getOverallProgress()
- [ ] 测试 Hook
- 提交: [commit hash]

### 4.4 useReviewSchedule Hook (src/hooks/useReviewSchedule.ts)
- [ ] loadDueReviews()
- [ ] completeReview()
- [ ] 测试 Hook
- 提交: [commit hash]

### 4.5 HomePage (src/pages/HomePage.tsx)
- [ ] 页面布局
- [ ] 显示连续学习天数
- [ ] 显示今日学习建议
- [ ] 显示今日目标
- [ ] 显示复习提醒
- [ ] 显示总体进度
- [ ] 快速操作按钮
- [ ] 测试页面
- 提交: [commit hash]

### 4.6 ReviewPage (src/pages/ReviewPage.tsx)
- [ ] 页面布局
- [ ] 显示需要复习的项目
- [ ] 选择复习模式
- [ ] 快速浏览模式
- [ ] 测试模式
- [ ] 复习完成统计
- [ ] 测试页面
- 提交: [commit hash]

### 4.7 ProgressPage (src/pages/ProgressPage.tsx)
- [ ] 页面布局
- [ ] 总体进度展示
- [ ] 学习时长统计
- [ ] 练习统计
- [ ] 本周学习图表
- [ ] 掌握程度分布
- [ ] 薄弱知识点分析
- [ ] 测试页面
- 提交: [commit hash]

### 4.8 AchievementsPage (src/pages/AchievementsPage.tsx)
- [ ] 页面布局
- [ ] 显示所有成就
- [ ] 已解锁成就
- [ ] 未解锁成就
- [ ] 成就分类
- [ ] 测试页面
- 提交: [commit hash]

### 4.9 SettingsPage (src/pages/SettingsPage.tsx)
- [ ] 页面布局
- [ ] 学习设置
- [ ] 复习设置
- [ ] 音频设置
- [ ] 显示设置
- [ ] 数据管理（导出/导入/重置）
- [ ] 关于信息
- [ ] 测试页面
- 提交: [commit hash]

### 4.10 所有进度组件
- [ ] DailyGoal.tsx
- [ ] WeeklyChart.tsx
- [ ] ReviewReminder.tsx
- [ ] StudyStreak.tsx
- [ ] AchievementBadge.tsx
- [ ] ProgressDashboard.tsx
- 提交: [commit hash]

### 4.11 成就系统逻辑
- [ ] checkAchievements()
- [ ] 成就解锁检测
- [ ] 成就通知
- 提交: [commit hash]

---

## 验收标准

### 功能测试
- [ ] 首页正确显示所有信息
- [ ] 复习提醒正确显示到期项目
- [ ] 复习完成后正确更新掌握等级
- [ ] 每日目标实时更新
- [ ] 连续学习天数正确计算
- [ ] 统计数据准确
- [ ] 本周图表正确显示
- [ ] 成就正确解锁
- [ ] 设置功能正常
- [ ] 数据导出/导入正常

---

## 文件清单

### 新增的文件
[列出所有新增文件]

---

## 提交历史

[commit hash] - [时间] - feat(review): [提交信息]


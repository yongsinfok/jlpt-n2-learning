# UX Simplification Design — 13 Pages → 5 Pages

## Problem

Current app has 13 pages and 5 levels of navigation depth. Users get lost:
首页 → 课程列表 → 课程详情 → 学习页 → 语法详情 (5 hops just to start learning)

## Solution

Merge into a Duolingo-style single-session learning flow.

### New Page Structure (13 → 5)

| New Page | Route | Replaces |
|----------|-------|----------|
| HomeHub | `/` | HomePage + ProgressPage |
| LearnSession | `/learn` | LessonList + LessonDetail + StudyPage + GrammarDetail + ReviewPage |
| Practice | `/practice` | PracticePage + QuizPage + WrongAnswersPage |
| Achievements | `/achievements` | AchievementsPage (minimal changes) |
| Settings | `/settings` | SettingsPage (minimal changes) |

### LearnSession Flow

Linear flow within a single page — no page navigation needed:

1. **选课 (Step 1):** Horizontal scrollable lesson cards, locked/unlocked state
2. **学例句 (Step 2):** Card-based sentence learning with flip interaction (furigana/translation/analysis)
3. **微测验 (Step 3):** 3-5 questions per grammar point, immediately after learning it
4. **Loop Steps 2-3** for each grammar point in the lesson
5. **课后测试 (Step 4):** 10-question comprehensive test, ≥70% unlocks next lesson
6. **完成总结 (Step 5):** Summary card with stats + "继续下一课" button

Micro-quizzes (per grammar point) + comprehensive test (per lesson) — both supported.

### HomeHub

Minimal, actionable dashboard:

- Streak counter + date
- **"继续学习" primary CTA** — remembers last position, shows lesson + progress
- **Review prompt** — "X个语法点待复习" with one-click start (only shown when items are due)
- Today's goal progress (sentences + grammar points)
- Collapsible: recent achievements, overall progress

### Review Integration

- Not a separate page — triggered from HomeHub "开始复习" button
- Reuses LearnSession card + quiz flow
- Review questions mixed with learning questions seamlessly

### Bottom Navigation (4 tabs)

| Tab | Target |
|-----|--------|
| 今日 | HomeHub `/` |
| 学习 | LearnSession `/learn` |
| 练习 | Practice `/practice` |
| 更多 | Popup: 成就 + 设置 |

### Deleted Routes

`/lessons`, `/lesson/:id`, `/study`, `/grammar/:id`, `/review`, `/progress`, `/wrong-answers`, `/quiz`

## Implementation Notes

- LearnSession uses a state machine (steps 1→2→3→2→3→...→4→5)
- All learning state managed in a new `useLearnSession` hook
- QuizPage and FillBlankQuiz components reused inside LearnSession
- HomeHub fetches user progress + due reviews on mount
- Review items injected into LearnSession flow when triggered from HomeHub

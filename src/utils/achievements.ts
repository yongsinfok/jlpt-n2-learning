interface AchievementDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: string;
}

export const ACHIEVEMENTS: readonly AchievementDefinition[] = [
  {
    id: 'first_grammar',
    name: '开始学习',
    description: '完成第1个语法点',
    icon: '🎯',
    condition: '完成第1个语法点',
  },
  {
    id: 'first_lesson',
    name: '第一课',
    description: '完成第1课',
    icon: '📚',
    condition: '完成第1课',
  },
  {
    id: 'streak_7',
    name: '连续7天',
    description: '连续学习7天',
    icon: '🔥',
    condition: '连续学习7天',
  },
  {
    id: 'streak_30',
    name: '连续30天',
    description: '连续学习30天',
    icon: '🔥',
    condition: '连续学习30天',
  },
  {
    id: 'perfect_score',
    name: '满分测试',
    description: '课后测试获得满分',
    icon: '💯',
    condition: '课后测试获得满分',
  },
  {
    id: 'early_bird',
    name: '早起学习',
    description: '上午8点前学习',
    icon: '⏰',
    condition: '上午8点前学习',
  },
  {
    id: 'night_owl',
    name: '夜猫学习',
    description: '晚上10点后学习',
    icon: '🌙',
    condition: '晚上10点后学习',
  },
  {
    id: 'progress_10',
    name: '10%进度',
    description: '完成10%课程',
    icon: '⭐',
    condition: '完成5课',
  },
  {
    id: 'progress_25',
    name: '25%进度',
    description: '完成25%课程',
    icon: '⭐',
    condition: '完成13课',
  },
  {
    id: 'progress_50',
    name: '50%进度',
    description: '完成50%课程',
    icon: '🏆',
    condition: '完成25课',
  },
  {
    id: 'progress_75',
    name: '75%进度',
    description: '完成75%课程',
    icon: '🏆',
    condition: '完成38课',
  },
  {
    id: 'complete_all',
    name: '完成全部',
    description: '完成全部50课',
    icon: '🏆',
    condition: '完成全部50课',
  },
  {
    id: 'sentences_100',
    name: '100例句',
    description: '学习100个例句',
    icon: '📖',
    condition: '学习100个例句',
  },
  {
    id: 'sentences_500',
    name: '500例句',
    description: '学习500个例句',
    icon: '📖',
    condition: '学习500个例句',
  },
  {
    id: 'sentences_all',
    name: '全部例句',
    description: '学习全部例句',
    icon: '📖',
    condition: '学习全部例句',
  },
  {
    id: 'quiz_100',
    name: '练习100题',
    description: '完成100道练习题',
    icon: '✏️',
    condition: '完成100道练习题',
  },
  {
    id: 'quiz_500',
    name: '练习500题',
    description: '完成500道练习题',
    icon: '✏️',
    condition: '完成500道练习题',
  },
  {
    id: 'accuracy_90',
    name: '正确率90%',
    description: '练习正确率达到90%',
    icon: '🎯',
    condition: '练习正确率达到90%',
  },
  {
    id: 'daily_goal_30',
    name: '每日目标30天',
    description: '连续30天完成每日目标',
    icon: '💪',
    condition: '连续30天完成每日目标',
  },
  {
    id: 'master_all',
    name: '全部精通',
    description: '所有语法点达到Level 5',
    icon: '🧠',
    condition: '所有语法点达到Level 5',
  },
] as const;

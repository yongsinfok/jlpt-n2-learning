import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useUserStore } from '@/stores/userStore';
import { getUserProgress, getTodayGoal } from '@/db/operations';
import { getDueReviews } from '@/utils/reviewAlgorithm';
import { ROUTES } from '@/utils/constants';

interface ReviewItem {
  grammarId: string;
  daysOverdue: number;
}

const QUICK_LINKS = [
  { jp: 'レッスン', en: 'LESSONS · 课程',  to: ROUTES.LESSONS },
  { jp: '練習',     en: 'PRACTICE · 练习', to: ROUTES.PRACTICE },
  { jp: '復習',     en: 'REVIEW · 复习',   to: ROUTES.REVIEW },
  { jp: '進度',     en: 'PROGRESS · 进度', to: ROUTES.PROGRESS },
];

const SEASON_KANJI: Record<string, string> = { spring: '春', summer: '夏', autumn: '秋', winter: '冬' };

function getSeason(): 'spring' | 'summer' | 'autumn' | 'winter' {
  const m = new Date().getMonth() + 1;
  if (m >= 3 && m <= 5)  return 'spring';
  if (m >= 6 && m <= 8)  return 'summer';
  if (m >= 9 && m <= 11) return 'autumn';
  return 'winter';
}

function formatDateBilingual(d: Date) {
  const y = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const weekday = ['日', '月', '火', '水', '木', '金', '土'][d.getDay()];
  return `${y} · ${month}月 ${day}日 · ${weekday}曜日`;
}

export function HomePage() {
  const { userProgress, setUserProgress, setDailyGoal, dailyGoal } = useUserStore();
  const [reviewItems, setReviewItems] = useState<ReviewItem[]>([]);
  const [season] = useState(getSeason());

  useEffect(() => {
    document.documentElement.dataset.season = season;
  }, [season]);

  useEffect(() => { loadUserData(); }, []);

  const loadUserData = async () => {
    const progress = await getUserProgress();
    if (progress) {
      setUserProgress(progress);
      const dueGrammarIds = getDueReviews(progress.learnedGrammar);
      const items: ReviewItem[] = dueGrammarIds.map((id) => {
        const learned = progress.learnedGrammar.find((g) => g.grammarId === id);
        const days = learned
          ? Math.floor((Date.now() - new Date(learned.nextReviewDate).getTime()) / 86_400_000)
          : 0;
        return { grammarId: id, daysOverdue: days };
      });
      setReviewItems(items);
    }
    const todayGoal = await getTodayGoal();
    if (todayGoal) setDailyGoal(todayGoal);
  };

  const continueLink = userProgress?.currentLessonId
    ? `/lesson/${userProgress.currentLessonId}`
    : ROUTES.LESSONS;

  const streak = userProgress?.studyStreak ?? 0;
  const lessonsDone = userProgress?.completedLessons.length ?? 0;
  const grammarDone = userProgress?.learnedGrammar.length ?? 0;
  const sentencesDone = userProgress?.learnedSentences.length ?? 0;
  const today = new Date();

  // Streak dot row — 10 day rolling window
  const streakDots = Array.from({ length: 10 }, (_, i) => i < Math.min(streak, 10));

  return (
    <div className="page-shell">
      {/* ── Greeting + streak ─────────────────────────── */}
      <section className="relative overflow-hidden border-b border-hairline">
        <span
          aria-hidden
          className="pointer-events-none absolute -top-12 right-8 sm:right-16 font-mincho text-[18rem] sm:text-[22rem] leading-none text-sumi/[0.035] select-none"
        >
          {SEASON_KANJI[season]}
        </span>

        <div className="relative max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 py-14 sm:py-20 lg:py-24">
          <div className="font-mono text-[11px] tracking-[0.15em] text-sumi-mute uppercase mb-4">
            {formatDateBilingual(today)}
          </div>
          <h1 className="font-mincho text-4xl sm:text-5xl lg:text-6xl font-normal -tracking-[0.02em] leading-tight mb-3">
            おかえりなさい。
          </h1>
          <p className="text-base text-sumi-soft mb-12 sm:mb-14 tracking-wider">
            欢迎回来 — 继续您的 N2 学习之旅
          </p>

          <div className="flex items-baseline gap-8 sm:gap-12 pt-8 sm:pt-10 border-t border-hairline">
            <div className="hero-number text-[5.5rem] sm:text-[8rem] lg:text-[9rem]">
              {streak}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-mincho text-xl sm:text-2xl mb-1">日連続</div>
              <div className="font-mono text-[11px] tracking-[0.14em] text-sumi-mute">
                CONSECUTIVE DAYS · 已连续学习 {streak} 天
              </div>
              <div className="flex gap-1.5 mt-5">
                {streakDots.map((on, i) => (
                  <span
                    key={i}
                    className={`w-2 h-2 ${on ? 'bg-sumi border-sumi' : 'border border-hairline-strong'}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Three columns ──────────────────────────────── */}
      <section className="border-b border-hairline">
        <div className="grid grid-cols-1 lg:grid-cols-3 max-w-7xl mx-auto">
          {/* I — Today's plan (featured glass card) */}
          <div className="relative px-8 sm:px-12 py-10 sm:py-14 lg:border-r lg:border-hairline">
            <div className="featured-glass p-7 sm:p-9">
              <div className="section-eyebrow mb-3">— I</div>
              <div className="section-title-jp">今日の学習</div>
              <div className="section-title-meta mb-6">TODAY'S PLAN · 今日学习</div>

              <div className="font-mincho text-3xl sm:text-4xl font-normal -tracking-[0.005em] mb-2">
                {userProgress?.currentLessonId ? `レッスン ${userProgress.currentLessonId}` : '从第 1 课开始'}
              </div>
              <div className="text-[13px] text-sumi-soft italic mb-7">
                {dailyGoal && dailyGoal.targetSentences > 0
                  ? `今日目标：${dailyGoal.completedSentences}/${dailyGoal.targetSentences} 例句 · ${dailyGoal.completedGrammarPoints}/${dailyGoal.targetGrammarPoints} 语法点`
                  : '系统化掌握 N2 语法'}
              </div>

              {dailyGoal && dailyGoal.targetSentences > 0 && (
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex-1 h-1 bg-sumi/[0.08] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.min(100, (dailyGoal.completedSentences / Math.max(1, dailyGoal.targetSentences)) * 100)}%`,
                        background: 'linear-gradient(90deg, var(--bengara), var(--season))',
                      }}
                    />
                  </div>
                  <span className="font-mono text-[11px] text-sumi-soft tracking-wider">
                    {Math.round((dailyGoal.completedSentences / Math.max(1, dailyGoal.targetSentences)) * 100)}%
                  </span>
                </div>
              )}

              <Link to={continueLink} className="cta-link">
                {userProgress ? '続けて学ぶ' : '学習を始める'}
                <ArrowRight size={16} className="arrow" />
              </Link>
            </div>
          </div>

          {/* II — Due for review */}
          <div className="px-8 sm:px-12 py-10 sm:py-14 border-t border-hairline lg:border-t-0 lg:border-r lg:border-hairline">
            <div className="section-eyebrow mb-3">— II</div>
            <div className="section-title-jp">復習の予定</div>
            <div className="section-title-meta mb-7">
              DUE FOR REVIEW · 待复习 · {reviewItems.length} ITEMS
            </div>

            {reviewItems.length === 0 ? (
              <div className="py-6 text-sm text-sumi-mute italic">
                没有待复习的内容 — 继续保持。
              </div>
            ) : (
              <ol className="list-none">
                {reviewItems.slice(0, 3).map((item, i) => {
                  const due =
                    item.daysOverdue >= 1 ? 'now' :
                    item.daysOverdue >= 0 ? 'soon' : 'later';
                  const dueLabel =
                    due === 'now' ? 'NOW' :
                    due === 'soon' ? 'TODAY' :
                    `${Math.abs(item.daysOverdue)}D`;
                  return (
                    <li
                      key={item.grammarId}
                      className={`flex items-baseline gap-4 py-4 border-t border-hairline ${
                        i === Math.min(reviewItems.length, 3) - 1 ? 'border-b' : ''
                      }`}
                    >
                      <span className="font-mincho text-[13px] text-sumi-mute w-6">{i + 1}.</span>
                      <Link
                        to={`/grammar/${encodeURIComponent(item.grammarId)}`}
                        className="font-mincho text-lg flex-1 hover:text-bengara transition-colors min-w-0 truncate"
                      >
                        {item.grammarId}
                      </Link>
                      <span className={`due-pill ${due}`}>{dueLabel}</span>
                    </li>
                  );
                })}
              </ol>
            )}

            {reviewItems.length > 3 && (
              <div className="mt-5">
                <Link to={ROUTES.REVIEW} className="cta-link text-[13px]">
                  すべて表示 ({reviewItems.length})
                  <ArrowRight size={14} className="arrow" />
                </Link>
              </div>
            )}
          </div>

          {/* III — Progress */}
          <div className="px-8 sm:px-12 py-10 sm:py-14 border-t border-hairline lg:border-t-0">
            <div className="section-eyebrow mb-3">— III</div>
            <div className="section-title-jp">学習の歩み</div>
            <div className="section-title-meta mb-7">YOUR PROGRESS · 整体进度</div>

            <div className="flex flex-col gap-7">
              <div className="flex items-baseline justify-between border-b border-hairline pb-3">
                <span className="text-[13px] text-sumi-soft">
                  <span className="font-mincho mr-2">レッスン</span>课程
                </span>
                <span className="font-mincho text-[28px]">
                  {lessonsDone}<span className="text-sumi-mute text-base ml-1">/50</span>
                </span>
              </div>
              <div className="flex items-baseline justify-between border-b border-hairline pb-3">
                <span className="text-[13px] text-sumi-soft">
                  <span className="font-mincho mr-2">文法点</span>语法
                </span>
                <span className="font-mincho text-[28px]">
                  {grammarDone}<span className="text-sumi-mute text-base ml-1">/200</span>
                </span>
              </div>
              <div className="flex items-baseline justify-between border-b border-hairline pb-3">
                <span className="text-[13px] text-sumi-soft">
                  <span className="font-mincho mr-2">例文</span>例句
                </span>
                <span className="font-mincho text-[28px]">
                  {sentencesDone}<span className="text-sumi-mute text-base ml-1">/1000</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Quick access ──────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 pt-16 sm:pt-20">
        <div className="font-mincho text-[11px] tracking-[0.3em] text-sumi-mute mb-7">
          — QUICK ACCESS · 快捷入口
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {QUICK_LINKS.map((link, i) => (
            <Link
              key={link.to}
              to={link.to}
              className={`block px-7 py-9 sm:py-11 transition-colors duration-300 hover:bg-washi-dim border-t border-hairline ${
                i < QUICK_LINKS.length - 1 ? 'border-r border-hairline' : ''
              } ${i < 2 ? 'lg:border-r' : ''} group`}
              style={{ borderRightWidth: i === 1 ? '0' : undefined }}
            >
              <div className="font-mincho text-[26px] -tracking-[0.005em] mb-1">{link.jp}</div>
              <div className="font-mono text-[11px] tracking-[0.08em] text-sumi-mute">{link.en}</div>
              <div className="font-mincho text-base text-bengara mt-7 transition-transform group-hover:translate-x-1">→</div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Footer mark ───────────────────────────────── */}
      <div className="text-center py-16 font-mincho text-[11px] tracking-[0.3em] text-sumi-mute">
        — 和 紙 × 硝 子 —
      </div>
    </div>
  );
}

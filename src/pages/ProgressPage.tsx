/**
 * ProgressPage - Modern Clean Design
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/stores/userStore';
import { getRecentExerciseRecords } from '@/db/operations';
import { getWeekDates } from '@/utils/dateHelper';
import { ProgressDashboard } from '@/components/progress/ProgressDashboard';
import { WeeklyChart } from '@/components/progress/WeeklyChart';

export function ProgressPage() {
  const navigate = useNavigate();
  const { userProgress } = useUserStore();
  const [weeklyData, setWeeklyData] = useState<Array<{
    date: Date;
    grammarCount: number;
    sentenceCount: number;
    isToday: boolean;
  }>>([]);

  useEffect(() => {
    loadWeeklyData();
  }, []);

  const loadWeeklyData = async () => {
    const weekDates = getWeekDates();
    const today = new Date();

    const mockData = weekDates.map((date) => ({
      date,
      grammarCount: Math.floor(Math.random() * 10),
      sentenceCount: Math.floor(Math.random() * 30),
      isToday: date.toDateString() === today.toDateString(),
    }));

    setWeeklyData(mockData);
  };

  const getOverallProgress = () => {
    if (!userProgress) return { lessons: 0, grammar: 0, sentences: 0 };

    return {
      lessons: (userProgress.completedLessons.length / 50) * 100,
      grammar: (userProgress.learnedGrammar.length / 200) * 100,
      sentences: (userProgress.learnedSentences.length / 1000) * 100,
    };
  };

  const getStudyTimeStats = () => {
    if (!userProgress) return { total: 0, averageDaily: 0, thisWeek: 0 };

    const totalSeconds = userProgress.totalStudyTime;
    const daysSinceStart = userProgress.studyStreak || 1;
    const averageDaily = totalSeconds / Math.max(daysSinceStart, 1);
    const thisWeek = averageDaily * Math.min(7, daysSinceStart);

    return {
      total: totalSeconds,
      averageDaily: Math.round(averageDaily),
      thisWeek: Math.round(thisWeek),
    };
  };

  const getPracticeStats = async () => {
    const records = await getRecentExerciseRecords(1000);

    const totalQuestions = records.length;
    const correctRecords = records.filter((r) => r.isCorrect);
    const correctRate = totalQuestions > 0 ? (correctRecords.length / totalQuestions) * 100 : 0;

    const fillBlankRecords = records.filter((r) => r.questionType === 'fill');
    const choiceRecords = records.filter((r) => r.questionType === 'choice');

    const fillBlankRate =
      fillBlankRecords.length > 0
        ? (fillBlankRecords.filter((r) => r.isCorrect).length / fillBlankRecords.length) * 100
        : 0;

    const choiceRate =
      choiceRecords.length > 0
        ? (choiceRecords.filter((r) => r.isCorrect).length / choiceRecords.length) * 100
        : 0;

    return {
      totalQuestions,
      correctRate,
      fillBlankRate,
      choiceRate,
    };
  };

  const getMasteryDistribution = () => {
    if (!userProgress) {
      return { level1: 0, level2: 0, level3: 0, level4: 0, level5: 0 };
    }

    const distribution = { level1: 0, level2: 0, level3: 0, level4: 0, level5: 0 };

    userProgress.learnedGrammar.forEach((item) => {
      switch (item.masteryLevel) {
        case 1:
          distribution.level1++;
          break;
        case 2:
          distribution.level2++;
          break;
        case 3:
          distribution.level3++;
          break;
        case 4:
          distribution.level4++;
          break;
        case 5:
          distribution.level5++;
          break;
      }
    });

    return distribution;
  };

  const getWeakGrammarPoints = async () => {
    const records = await getRecentExerciseRecords(1000);

    const grammarStats = new Map<string, { correct: number; total: number }>();

    records.forEach((record) => {
      const existing = grammarStats.get(record.grammarPoint);
      if (existing) {
        existing.total++;
        if (record.isCorrect) existing.correct++;
      } else {
        grammarStats.set(record.grammarPoint, {
          correct: record.isCorrect ? 1 : 0,
          total: 1,
        });
      }
    });

    const weakPoints = Array.from(grammarStats.entries())
      .map(([grammarPoint, stats]) => ({
        grammarId: grammarPoint,
        grammarPoint,
        correctRate: (stats.correct / stats.total) * 100,
        totalCount: stats.total,
      }))
      .filter((item) => item.totalCount >= 3)
      .sort((a, b) => a.correctRate - b.correctRate)
      .slice(0, 5);

    return weakPoints;
  };

  const [practiceStats, setPracticeStats] = useState<any>(null);
  const [weakPoints, setWeakPoints] = useState<any[]>([]);

  useEffect(() => {
    const loadStats = async () => {
      const stats = await getPracticeStats();
      setPracticeStats(stats);

      const weak = await getWeakGrammarPoints();
      setWeakPoints(weak);
    };

    loadStats();
  }, [userProgress]);

  const overallProgress = getOverallProgress();
  const studyTimeStats = getStudyTimeStats();
  const masteryDistribution = getMasteryDistribution();

  const handlePracticeWeakPoints = () => {
    navigate('/practice');
  };

  if (!userProgress) {
    return (
      <div className="min-h-screen bg-neutral">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="card p-12 text-center">
            <h1 className="text-h1 md:text-2xl font-bold text-primary mb-2">还没有学习记录</h1>
            <p className="text-body text-neutral-dark mb-6">开始学习后，这里会显示你的学习进度</p>
            <Button variant="primary" asChild>
              <button onClick={() => navigate('/lessons')}>开始学习</button>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-h1 md:text-3xl font-bold text-primary mb-2">学习进度</h1>
          <p className="text-body text-neutral-dark">查看你的学习统计数据和进度</p>
        </div>

        {/* Weekly Chart */}
        <section className="mb-8">
          <WeeklyChart weeklyData={weeklyData} dataType="both" />
        </section>

        {/* Progress Dashboard */}
        <ProgressDashboard
          overallProgress={overallProgress}
          studyTimeStats={studyTimeStats}
          practiceStats={
            practiceStats || {
              totalQuestions: 0,
              correctRate: 0,
              fillBlankRate: 0,
              choiceRate: 0,
            }
          }
          masteryDistribution={masteryDistribution}
          weakGrammarPoints={weakPoints}
          onPracticeWeakPoints={handlePracticeWeakPoints}
        />
      </div>
    </div>
  );
}

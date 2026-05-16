/**
 * SettingsPage - Noren Warm Design
 */

import { useState } from 'react';
import { useUserStore } from '@/stores/userStore';
import { clearAllTables } from '@/db/operations';
import {
  Settings,
  Target,
  Bell,
  Volume2,
  Palette,
  Download,
  Upload,
  RotateCcw,
  AlertTriangle,
  Info,
  CheckCircle2,
} from 'lucide-react';
import type { UserSettings } from '@/stores/userStore';

type Section = 'learning' | 'review' | 'audio' | 'display' | 'data' | 'about';

export function SettingsPage() {
  const { settings, updateSettings, userProgress } = useUserStore();
  const [activeSection, setActiveSection] = useState<Section>('learning');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  const handleUpdateSettings = (updates: Partial<UserSettings>) => {
    updateSettings(updates);
  };

  const handleExportData = async () => {
    try {
      const data = {
        version: '1.0.0',
        exportDate: new Date().toISOString(),
        settings,
        userProgress,
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `jlpt-n2-learning-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);

        if (!data.version || !data.settings) {
          throw new Error('Invalid backup file');
        }

        updateSettings(data.settings);
        setImportError(null);
        alert('数据导入成功！');
      } catch (error) {
        setImportError('导入失败：无效的备份文件');
      }
    };

    reader.readAsText(file);
  };

  const handleResetData = async () => {
    try {
      await clearAllTables();
      localStorage.clear();
      window.location.reload();
    } catch (error) {
      console.error('Reset failed:', error);
      alert('重置失败，请刷新页面重试');
    }
  };

  const sections = [
    { id: 'learning' as Section, name: '学习设置', icon: Target },
    { id: 'review' as Section, name: '复习设置', icon: Bell },
    { id: 'audio' as Section, name: '音频设置', icon: Volume2 },
    { id: 'display' as Section, name: '显示设置', icon: Palette },
    { id: 'data' as Section, name: '数据管理', icon: Settings },
    { id: 'about' as Section, name: '关于', icon: Info },
  ];

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-h1 md:text-3xl font-bold text-ink mb-2">设置</h1>
          <p className="text-base text-ink-soft">管理你的学习偏好和应用设置</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar navigation */}
          <aside className="lg:w-64">
            <nav className="noren-card overflow-hidden">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                      activeSection === section.id
                        ? 'bg-bg-warm text-ink border-l-4 border-accent'
                        : 'text-ink-soft hover:bg-surface-hover'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{section.name}</span>
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Settings content */}
          <main className="flex-1">
            {/* Learning settings */}
            {activeSection === 'learning' && (
              <div className="noren-card p-6">
                <h2 className="text-h1 text-ink mb-6 flex items-center gap-2">
                  <Target className="w-6 h-6 text-accent" />
                  学习设置
                </h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-ink mb-4">每日目标</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-ink mb-2">目标例句数</label>
                        <select
                          value={settings.targetSentences}
                          onChange={(e) => handleUpdateSettings({ targetSentences: Number(e.target.value) })}
                          className="w-full px-4 py-2.5 bg-surface border border-border rounded-md text-ink text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                        >
                          <option value={5}>5 个例句/天</option>
                          <option value={10}>10 个例句/天</option>
                          <option value={15}>15 个例句/天</option>
                          <option value={20}>20 个例句/天</option>
                          <option value={30}>30 个例句/天</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm text-ink mb-2">目标语法点数</label>
                        <select
                          value={settings.targetGrammarPoints}
                          onChange={(e) => handleUpdateSettings({ targetGrammarPoints: Number(e.target.value) })}
                          className="w-full px-4 py-2.5 bg-surface border border-border rounded-md text-ink text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                        >
                          <option value={1}>1 个语法点/天</option>
                          <option value={2}>2 个语法点/天</option>
                          <option value={3}>3 个语法点/天</option>
                          <option value={5}>5 个语法点/天</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Review settings */}
            {activeSection === 'review' && (
              <div className="noren-card p-6">
                <h2 className="text-h1 text-ink mb-6 flex items-center gap-2">
                  <Bell className="w-6 h-6 text-amber" />
                  复习设置
                </h2>

                <div className="space-y-4">
                  <label className="flex items-center justify-between p-4 bg-surface-dim rounded-md cursor-pointer hover:bg-surface-hover">
                    <div>
                      <p className="font-medium text-ink">启用复习提醒</p>
                      <p className="text-xs text-ink-soft">当有语法点需要复习时显示提醒</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.reviewReminderEnabled}
                      onChange={(e) => handleUpdateSettings({ reviewReminderEnabled: e.target.checked })}
                      className="w-5 h-5 text-accent rounded focus:ring-accent/30"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 bg-surface-dim rounded-md cursor-pointer hover:bg-surface-hover">
                    <div>
                      <p className="font-medium text-ink">首页显示复习提醒</p>
                      <p className="text-xs text-ink-soft">在首页显示需要复习的内容</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.showReviewReminderOnHome}
                      onChange={(e) => handleUpdateSettings({ showReviewReminderOnHome: e.target.checked })}
                      className="w-5 h-5 text-accent rounded focus:ring-accent/30"
                    />
                  </label>
                </div>
              </div>
            )}

            {/* Audio settings */}
            {activeSection === 'audio' && (
              <div className="noren-card p-6">
                <h2 className="text-h1 text-ink mb-6 flex items-center gap-2">
                  <Volume2 className="w-6 h-6 text-accent" />
                  音频设置
                </h2>

                <div className="space-y-4">
                  <label className="flex items-center justify-between p-4 bg-surface-dim rounded-md cursor-pointer hover:bg-surface-hover">
                    <div>
                      <p className="font-medium text-ink">自动播放音频</p>
                      <p className="text-xs text-ink-soft">学习例句时自动播放日语发音</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.autoPlayAudio}
                      onChange={(e) => handleUpdateSettings({ autoPlayAudio: e.target.checked })}
                      className="w-5 h-5 text-accent rounded focus:ring-accent/30"
                    />
                  </label>

                  <div>
                    <label className="block text-sm text-ink mb-2">播放速度</label>
                    <select
                      value={settings.audioPlaybackRate}
                      onChange={(e) => handleUpdateSettings({ audioPlaybackRate: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 bg-surface border border-border rounded-md text-ink text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                    >
                      <option value={0.5}>0.5x 慢速</option>
                      <option value={0.75}>0.75x 较慢</option>
                      <option value={1.0}>1.0x 正常</option>
                      <option value={1.25}>1.25x 较快</option>
                      <option value={1.5}>1.5x 快速</option>
                      <option value={2.0}>2.0x 倍速</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Display settings */}
            {activeSection === 'display' && (
              <div className="noren-card p-6">
                <h2 className="text-h1 text-ink mb-6 flex items-center gap-2">
                  <Palette className="w-6 h-6 text-pine" />
                  显示设置
                </h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm text-ink mb-2">主题</label>
                    <div className="grid grid-cols-3 gap-3">
                      {(['light', 'dark', 'auto'] as const).map((theme) => (
                        <button
                          key={theme}
                          onClick={() => handleUpdateSettings({ theme })}
                          className={`p-4 rounded-md border-2 transition-all ${
                            settings.theme === theme
                              ? 'border-accent bg-bg-warm'
                              : 'border-border hover:border-ink-mute'
                          }`}
                        >
                          <span className="font-medium text-ink capitalize">{theme === 'light' ? '浅色' : theme === 'dark' ? '深色' : '自动'}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-ink mb-2">字体大小</label>
                    <div className="grid grid-cols-3 gap-3">
                      {(['small', 'medium', 'large'] as const).map((size) => (
                        <button
                          key={size}
                          onClick={() => handleUpdateSettings({ fontSize: size })}
                          className={`p-4 rounded-md border-2 transition-all ${
                            settings.fontSize === size
                              ? 'border-accent bg-bg-warm'
                              : 'border-border hover:border-ink-mute'
                          }`}
                        >
                          <span className={`font-medium text-ink ${
                            size === 'small' ? 'text-xs' : size === 'large' ? 'text-lg' : 'text-base'
                          }`}>
                            {size === 'small' ? '小' : size === 'large' ? '大' : '中'}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Data management */}
            {activeSection === 'data' && (
              <div className="noren-card p-6">
                <h2 className="text-h1 text-ink mb-6 flex items-center gap-2">
                  <Settings className="w-6 h-6 text-ink-soft" />
                  数据管理
                </h2>

                {/* Data stats */}
                <div className="bg-bg-warm rounded-md p-4 mb-6">
                  <h3 className="font-semibold text-ink mb-3">学习数据</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                    <div>
                      <p className="text-ink-soft">已学习例句</p>
                      <p className="text-xl font-bold text-ink">{userProgress?.learnedSentences.length || 0}</p>
                    </div>
                    <div>
                      <p className="text-ink-soft">已学语法点</p>
                      <p className="text-xl font-bold text-ink">{userProgress?.learnedGrammar.length || 0}</p>
                    </div>
                    <div>
                      <p className="text-ink-soft">已完成课程</p>
                      <p className="text-xl font-bold text-pine">{userProgress?.completedLessons.length || 0}</p>
                    </div>
                    <div>
                      <p className="text-ink-soft">学习时长</p>
                      <p className="text-xl font-bold text-amber">{Math.round((userProgress?.totalStudyTime || 0) / 60)} 分钟</p>
                    </div>
                  </div>
                </div>

                {/* Data operations */}
                <div className="space-y-4">
                  <button
                    onClick={handleExportData}
                    className="w-full flex items-center justify-between p-4 bg-accent/10 hover:bg-accent/20 border border-accent/20 rounded-md transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <Download className="w-5 h-5 text-accent" />
                      <div className="text-left">
                        <p className="font-medium text-ink">导出学习数据</p>
                        <p className="text-xs text-ink-soft">将数据备份为 JSON 文件</p>
                      </div>
                    </div>
                    <span className="text-accent group-hover:translate-x-1 transition-transform">→</span>
                  </button>

                  <label className="w-full flex items-center justify-between p-4 bg-pine/10 hover:bg-pine/20 border border-pine/20 rounded-md transition-colors group cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Upload className="w-5 h-5 text-pine" />
                      <div className="text-left">
                        <p className="font-medium text-ink">导入学习数据</p>
                        <p className="text-xs text-ink-soft">从备份文件恢复数据</p>
                      </div>
                    </div>
                    <input type="file" accept=".json" onChange={handleImportData} className="hidden" />
                    <span className="text-pine group-hover:translate-x-1 transition-transform">→</span>
                  </label>

                  {importError && (
                    <div className="p-3 bg-accent/10 border border-accent/20 rounded-md text-xs text-accent">
                      {importError}
                    </div>
                  )}

                  {exportSuccess && (
                    <div className="flex items-center gap-2 p-3 bg-pine/10 border border-pine/20 rounded-md text-xs text-pine">
                      <CheckCircle2 className="w-4 h-4" />
                      导出成功！
                    </div>
                  )}

                  <button
                    onClick={() => setShowResetConfirm(true)}
                    className="w-full flex items-center justify-between p-4 bg-accent/10 hover:bg-accent/20 border border-accent/20 rounded-md transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <RotateCcw className="w-5 h-5 text-accent" />
                      <div className="text-left">
                        <p className="font-medium text-ink">重置所有数据</p>
                        <p className="text-xs text-ink-soft">清除所有学习记录（不可恢复）</p>
                      </div>
                    </div>
                    <span className="text-accent group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                </div>

                {/* Reset confirmation dialog */}
                {showResetConfirm && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="noren-card p-6 max-w-md mx-4">
                      <div className="flex items-center gap-3 mb-4">
                        <AlertTriangle className="w-6 h-6 text-accent" />
                        <h3 className="text-h1 text-ink">确认重置</h3>
                      </div>
                      <p className="text-base text-ink mb-6">
                        此操作将清除所有学习数据，包括进度、设置和成就。此操作不可撤销。
                      </p>
                      <div className="flex gap-3">
                        <button
                          onClick={() => setShowResetConfirm(false)}
                          className="flex-1 px-4 py-2.5 border border-border bg-surface text-ink font-medium rounded-md transition-colors hover:bg-surface-hover"
                        >
                          取消
                        </button>
                        <button
                          onClick={handleResetData}
                          className="flex-1 bg-accent hover:bg-accent-hover text-white font-medium py-2.5 px-4 rounded-md transition-colors"
                        >
                          确认重置
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* About */}
            {activeSection === 'about' && (
              <div className="noren-card p-6">
                <h2 className="text-h1 text-ink mb-6 flex items-center gap-2">
                  <Info className="w-6 h-6 text-ink-soft" />
                  关于
                </h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-ink mb-2">JLPT N2 学习平台</h3>
                    <p className="text-xs text-ink-soft">版本: 1.0.0</p>
                    <p className="text-xs text-ink-soft mt-1">
                      一个系统化的 N2 语法学习工具，帮助你科学地掌握日语能力考试 N2 级别的语法知识。
                    </p>
                  </div>

                  <div className="border-t border-border pt-4">
                    <h3 className="font-semibold text-ink mb-2">数据来源</h3>
                    <p className="text-xs text-ink-soft">
                      学习数据来自开源项目{' '}
                      <a
                        href="https://github.com/mxggle/anki-jlpt-n2-grammar-example-sentences"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent hover:underline"
                      >
                        shin-kanzen N2 grammar
                      </a>
                    </p>
                    <p className="text-xs text-ink-soft mt-1">
                      数据许可: CC BY-NC 4.0 (知识共享 署名-非商业性使用 4.0)
                    </p>
                  </div>

                  <div className="border-t border-border pt-4">
                    <h3 className="font-semibold text-ink mb-2">开源许可</h3>
                    <p className="text-xs text-ink-soft">
                      本项目仅供个人学习使用，严禁商业用途。
                    </p>
                  </div>

                  <div className="border-t border-border pt-4">
                    <h3 className="font-semibold text-ink mb-2">反馈与支持</h3>
                    <div className="space-y-2">
                      <a
                        href="https://github.com/yongsinfok/jlpt-n2-learning/issues"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-xs text-accent hover:underline"
                      >
                        报告问题
                      </a>
                      <a
                        href="https://github.com/yongsinfok/jlpt-n2-learning"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-xs text-accent hover:underline"
                      >
                        查看源代码
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '@/utils/constants';
import {
  Home,
  BookOpen,
  Brain,
  TrendingUp,
  Award,
  XCircle,
  Settings,
  X,
  Flame,
} from 'lucide-react';

const navLinks = [
  { path: ROUTES.HOME, label: '首页', labelEn: 'Home', icon: Home },
  { path: ROUTES.LESSONS, label: '课程', labelEn: 'Lessons', icon: BookOpen },
  { path: ROUTES.PRACTICE, label: '练习', labelEn: 'Practice', icon: Brain },
  { path: ROUTES.PROGRESS, label: '进度', labelEn: 'Progress', icon: TrendingUp },
  { path: ROUTES.ACHIEVEMENTS, label: '成就', labelEn: 'Achievements', icon: Award },
  { path: ROUTES.WRONG_ANSWERS, label: '错题本', labelEn: 'Mistakes', icon: XCircle },
  { path: ROUTES.SETTINGS, label: '设置', labelEn: 'Settings', icon: Settings },
] as const;

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === ROUTES.HOME) {
      return location.pathname === ROUTES.HOME;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-ink/10 backdrop-blur-sm z-40 md:hidden animate-fade-in"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          fixed md:sticky top-0 left-0 h-screen w-72 z-50
          transform transition-transform duration-300 ease-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="h-full flex flex-col bg-bg border-r border-border">
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-accent-pale opacity-60" />

            <div className="relative px-6 pt-6 pb-8">
              <Link
                to={ROUTES.HOME}
                onClick={onClose}
                className="flex items-center gap-3 group"
              >
                <div className="relative flex items-center justify-center w-12 h-12 bg-accent-pale rounded-xl shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:scale-[1.02]">
                  <span className="text-2xl transition-transform duration-300 group-hover:scale-110">
                    🎌
                  </span>
                  <div className="absolute inset-0 bg-accent/0 rounded-xl transition-all duration-300 group-hover:bg-accent/10" />
                </div>

                <div className="flex flex-col">
                  <span className="font-display font-bold text-lg text-accent">
                    JLPT N2
                  </span>
                  <span className="text-[10px] text-ink-faint tracking-wider uppercase font-medium">
                    日本語学習
                  </span>
                </div>
              </Link>

              <button
                onClick={onClose}
                className="absolute top-6 right-6 md:hidden p-2 text-ink-faint hover:text-accent hover:bg-accent-pale rounded-xl transition-all duration-200"
                aria-label="关闭侧边栏"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto px-4 py-6">
            <ul className="space-y-1">
              {navLinks.map((link, index) => {
                const Icon = link.icon;
                const active = isActive(link.path);

                return (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      onClick={onClose}
                      className={`
                        relative flex items-center gap-3 px-4 py-3 rounded-xl
                        font-medium transition-all duration-200
                        group
                        ${active
                          ? 'bg-accent-pale text-accent shadow-sm'
                          : 'text-ink-mute hover:text-accent hover:bg-accent-pale'
                        }
                      `}
                      style={{
                        animationDelay: `${index * 50}ms`
                      }}
                    >
                      <div className={`
                        flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200
                        ${active
                          ? 'bg-accent-pale text-accent'
                          : 'bg-surface-dim text-ink-faint group-hover:bg-accent-pale group-hover:text-accent'
                        }
                      `}>
                        <Icon className="w-5 h-5" />
                      </div>

                      <div className="flex-1">
                        <span className="text-sm">{link.label}</span>
                        <span className={`text-[10px] ml-1.5 uppercase tracking-wider ${active ? 'text-accent/70' : 'text-ink-faint'}`}>
                          {link.labelEn}
                        </span>
                      </div>

                      {active && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-accent rounded-r-full" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="relative overflow-hidden">
            <div className="relative px-6 py-5 border-t border-border">
              <div className="flex items-center gap-2 mb-3">
                <Flame className="w-4 h-4 text-amber animate-float" />
                <p className="text-xs font-medium text-ink-mute">
                  坚持学习，每日进步
                </p>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-[10px] text-ink-faint">
                  JLPT N2 学习平台
                </p>
                <p className="text-[10px] text-ink-faint">
                  v1.0.0
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

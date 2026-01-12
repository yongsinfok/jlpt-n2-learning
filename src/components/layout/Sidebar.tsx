/**
 * 侧边栏导航组件 - Modern Japanese "Zen Glass" Design
 * Elegant slide-out navigation with Japanese aesthetic elements
 */

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

/**
 * 导航链接配置 - with enhanced metadata
 */
const navLinks = [
  { path: ROUTES.HOME, label: '首页', labelEn: 'Home', icon: Home },
  { path: ROUTES.LESSONS, label: '课程', labelEn: 'Lessons', icon: BookOpen },
  { path: ROUTES.PRACTICE, label: '练习', labelEn: 'Practice', icon: Brain },
  { path: ROUTES.PROGRESS, label: '进度', labelEn: 'Progress', icon: TrendingUp },
  { path: ROUTES.ACHIEVEMENTS, label: '成就', labelEn: 'Achievements', icon: Award },
  { path: ROUTES.WRONG_ANSWERS, label: '错题本', labelEn: 'Mistakes', icon: XCircle },
  { path: ROUTES.SETTINGS, label: '设置', labelEn: 'Settings', icon: Settings },
] as const;

/**
 * 侧边栏组件属性
 */
interface SidebarProps {
  /** 是否显示侧边栏 */
  isOpen: boolean;
  /** 关闭侧边栏的回调 */
  onClose: () => void;
}

/**
 * 侧边栏导航组件 - Modern Japanese Glassmorphism Design
 */
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
      {/* Backdrop overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-sumi-900/20 backdrop-blur-sm z-40 md:hidden animate-fade-in"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:sticky top-0 left-0 h-screen w-72 z-50
          transform transition-transform duration-300 ease-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="h-full flex flex-col bg-washi-texture border-r border-sumi-100/50">
          {/* Header Section */}
          <div className="relative overflow-hidden">
            {/* Decorative gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-ai-50 to-matcha-50 opacity-60" />
            <div className="absolute inset-0 bg-seigaiha-subtle opacity-40" />

            <div className="relative px-6 pt-6 pb-8">
              {/* Logo */}
              <Link
                to={ROUTES.HOME}
                onClick={onClose}
                className="flex items-center gap-3 group"
              >
                {/* Logo Container */}
                <div className="relative flex items-center justify-center w-12 h-12 bg-gradient-to-br from-ai-100 to-ai-50 rounded-xl shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:scale-105">
                  <span className="text-2xl transition-transform duration-300 group-hover:scale-110">
                    🎌
                  </span>
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-ai-DEFAULT/0 rounded-xl transition-all duration-300 group-hover:bg-ai-DEFAULT/10" />
                </div>

                {/* Logo Text */}
                <div className="flex flex-col">
                  <span className="font-display font-bold text-lg text-ai-700">
                    JLPT N2
                  </span>
                  <span className="text-[10px] text-sumi-400 tracking-wider uppercase font-medium">
                    日本語学習
                  </span>
                </div>
              </Link>

              {/* Close button - mobile only */}
              <button
                onClick={onClose}
                className="absolute top-6 right-6 md:hidden p-2 text-sumi-400 hover:text-ai-600 hover:bg-ai-50 rounded-xl transition-all duration-200"
                aria-label="关闭侧边栏"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation Links */}
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
                          ? 'bg-ai-50 text-ai-700 shadow-sm'
                          : 'text-sumi-500 hover:text-ai-600 hover:bg-ai-50/50'
                        }
                      `}
                      style={{
                        animationDelay: `${index * 50}ms`
                      }}
                    >
                      {/* Icon */}
                      <div className={`
                        flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200
                        ${active
                          ? 'bg-ai-100 text-ai-600'
                          : 'bg-sumi-50 text-sumi-400 group-hover:bg-ai-50 group-hover:text-ai-500'
                        }
                      `}>
                        <Icon className="w-5 h-5" />
                      </div>

                      {/* Label */}
                      <div className="flex-1">
                        <span className="text-sm">{link.label}</span>
                        <span className={`text-[10px] ml-1.5 uppercase tracking-wider ${active ? 'text-ai-400' : 'text-sumi-300'}`}>
                          {link.labelEn}
                        </span>
                      </div>

                      {/* Active indicator */}
                      {active && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-ai-500 rounded-r-full" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer Section */}
          <div className="relative overflow-hidden">
            {/* Decorative pattern */}
            <div className="absolute inset-0 bg-asanoha-pattern opacity-30" />

            <div className="relative px-6 py-5 border-t border-sumi-100/50">
              {/* Motivational text */}
              <div className="flex items-center gap-2 mb-3">
                <Flame className="w-4 h-4 text-kincha-500 animate-float" />
                <p className="text-xs font-medium text-sumi-500">
                  坚持学习，每日进步
                </p>
              </div>

              {/* Version info */}
              <div className="flex items-center justify-between">
                <p className="text-[10px] text-sumi-400">
                  JLPT N2 学习平台
                </p>
                <p className="text-[10px] text-sumi-300">
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

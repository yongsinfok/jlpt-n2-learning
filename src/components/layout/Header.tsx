/**
 * 顶部导航栏组件 - Japanese Editorial Style
 */

import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '@/utils/constants';
import { Home, BookOpen, Brain, TrendingUp, Settings, Menu } from 'lucide-react';

/**
 * 导航链接配置
 */
const navLinks = [
  { path: ROUTES.HOME, label: '首页', labelJa: 'ホーム', icon: Home },
  { path: ROUTES.LESSONS, label: '课程', labelJa: 'レッスン', icon: BookOpen },
  { path: ROUTES.PRACTICE, label: '练习', labelJa: '練習', icon: Brain },
  { path: ROUTES.PROGRESS, label: '进度', labelJa: '進度', icon: TrendingUp },
  { path: ROUTES.SETTINGS, label: '设置', labelJa: '設定', icon: Settings },
];

/**
 * 顶部导航栏组件 - Japanese Editorial Style
 */
export function Header() {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === ROUTES.HOME) {
      return location.pathname === ROUTES.HOME;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-washi sticky top-0 z-40 border-b border-ai-100">
      {/* Decorative top border with gradient */}
      <div className="h-0.5 bg-gradient-to-r from-transparent via-ai-DEFAULT to-transparent opacity-50" />

      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Japanese style */}
          <Link
            to={ROUTES.HOME}
            className="flex items-center gap-3 group"
          >
            {/* Japanese flag icon with subtle animation */}
            <div className="relative w-10 h-10 flex items-center justify-center">
              <div className="absolute inset-0 bg-ai-DEFAULT rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
              <span className="text-2xl transform group-hover:scale-110 transition-transform duration-300">
                🎌
              </span>
            </div>

            {/* Logo text with vertical accent */}
            <div className="flex flex-col">
              <span className="font-serif font-bold text-xl text-ai-DEFAULT tracking-tight">
                JLPT N2
              </span>
              <span className="text-[10px] text-sumi-400 font-maru tracking-wider">
                日本語能力試験
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link, index) => {
              const Icon = link.icon;
              const active = isActive(link.path);

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`
                    relative flex items-center gap-2 px-4 py-2 rounded-lg
                    transition-all duration-300 font-medium
                    ${active
                      ? 'text-ai-DEFAULT bg-ai-50 shadow-washi-sm'
                      : 'text-sumi-500 hover:text-ai-DEFAULT hover:bg-ai-50/50'
                    }
                  `}
                  style={{
                    animationDelay: `${index * 50}ms`,
                  }}
                >
                  {/* Icon with animation */}
                  <Icon className={`w-4 h-4 transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`} />

                  {/* Chinese label */}
                  <span className="hidden xl:inline">{link.label}</span>

                  {/* Japanese label - decorative */}
                  <span className="hidden lg:inline xl:hidden text-sm opacity-70">
                    {link.labelJa}
                  </span>

                  {/* Active indicator - brush stroke effect */}
                  {active && (
                    <span className="absolute -bottom-0.5 left-4 right-4 h-0.5 bg-gradient-to-r from-ai-DEFAULT via-shu-DEFAULT to-ai-DEFAULT rounded-full animate-brush-stroke" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 text-sumi-500 hover:text-ai-DEFAULT hover:bg-ai-50 rounded-lg transition-colors duration-200"
            aria-label="菜单"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Decorative seigaiha pattern at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-2 opacity-30 pointer-events-none overflow-hidden">
        <div className="w-full h-full bg-seigaiha" />
      </div>
    </header>
  );
}

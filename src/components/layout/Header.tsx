/**
 * 顶部导航栏组件
 */

import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '@/utils/constants';
import { Home, BookOpen, Brain, TrendingUp, Settings } from 'lucide-react';

/**
 * 导航链接配置
 */
const navLinks = [
  { path: ROUTES.HOME, label: '首页', icon: Home },
  { path: ROUTES.LESSONS, label: '课程', icon: BookOpen },
  { path: ROUTES.PRACTICE, label: '练习', icon: Brain },
  { path: ROUTES.PROGRESS, label: '进度', icon: TrendingUp },
  { path: ROUTES.SETTINGS, label: '设置', icon: Settings },
];

/**
 * 顶部导航栏组件
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
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={ROUTES.HOME} className="flex items-center gap-2">
            <span className="text-2xl">🎌</span>
            <span className="font-bold text-xl text-gray-900">JLPT N2</span>
          </Link>

          {/* 导航链接 */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    isActive(link.path)
                      ? 'bg-primary text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* 移动端菜单按钮 */}
          <button className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}

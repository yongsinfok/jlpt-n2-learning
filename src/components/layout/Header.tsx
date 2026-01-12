/**
 * 顶部导航栏组件 - Modern Japanese Design
 * 玻璃态 + 黏土态风格
 */

import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { ROUTES } from '@/utils/constants';
import { Home, BookOpen, Brain, TrendingUp, Settings, Menu, X, ChevronDown, Trophy, HelpCircle } from 'lucide-react';

/**
 * 导航链接配置
 */
const navLinks = [
  { path: ROUTES.HOME, label: '首页', labelJa: 'ホーム', icon: Home },
  { path: ROUTES.LESSONS, label: '课程', labelJa: 'レッスン', icon: BookOpen },
  { path: ROUTES.PRACTICE, label: '练习', labelJa: '練習', icon: Brain },
  { path: ROUTES.PROGRESS, label: '进度', labelJa: '進度', icon: TrendingUp },
];

/**
 * 设置菜单项
 */
const settingsMenuItems = [
  { path: ROUTES.SETTINGS, label: '系统设置', icon: Settings },
  { path: ROUTES.ACHIEVEMENTS, label: '我的成就', icon: Trophy },
  { path: ROUTES.ONBOARDING, label: '新手引导', icon: HelpCircle },
];

/**
 * 顶部导航栏组件
 */
export function Header() {
  const location = useLocation();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭设置菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setIsSettingsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 重置数据功能
  const handleResetData = () => {
    if (confirm('确定要重置所有学习数据吗？此操作不可撤销。')) {
      localStorage.clear();
      window.location.reload();
    }
    setIsSettingsOpen(false);
  };

  const isActive = (path: string) => {
    if (path === ROUTES.HOME) {
      return location.pathname === ROUTES.HOME;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-[1020] w-full">
      {/* 玻璃态背景 + 黏土态卡片 */}
      <div className="bg-white/90 backdrop-blur-xl border-b border-ai-100/50 shadow-washi-sm">
        {/* 顶部装饰条 */}
        <div className="h-0.5 bg-gradient-to-r from-transparent via-ai-DEFAULT to-transparent opacity-60" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo - Modern Japanese Style */}
            <Link
              to={ROUTES.HOME}
              className="flex items-center gap-3 group"
            >
              {/* Logo icon with subtle animation */}
              <div className="relative w-10 h-10 flex items-center justify-center bg-gradient-to-br from-ai-50 to-ai-100 rounded-xl shadow-washi-sm group-hover:shadow-washi transition-all duration-300">
                <span className="text-2xl transform group-hover:scale-110 transition-transform duration-300">
                  🎌
                </span>
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-ai-DEFAULT/0 group-hover:bg-ai-DEFAULT/10 rounded-xl transition-all duration-300" />
              </div>

              {/* Logo text */}
              <div className="flex flex-col">
                <span className="font-bold text-lg text-ai-DEFAULT tracking-tight leading-tight">
                  JLPT N2
                </span>
                <span className="text-[9px] text-sumi-400 tracking-wider uppercase">
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
                      transition-all duration-200 font-medium
                      ${active
                        ? 'text-ai-DEFAULT bg-ai-50 shadow-washi-sm'
                        : 'text-sumi-500 hover:text-ai-DEFAULT hover:bg-ai-50/50'
                      }
                    `}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <Icon className={`w-4 h-4 transition-transform duration-200 ${active ? 'scale-110' : ''}`} />
                    <span className="hidden xl:inline">{link.label}</span>
                    <span className="hidden lg:inline xl:hidden text-sm opacity-70">{link.labelJa}</span>

                    {/* Active indicator */}
                    {active && (
                      <span className="absolute -bottom-px left-4 right-4 h-0.5 bg-gradient-to-r from-ai-DEFAULT via-shu-DEFAULT to-ai-DEFAULT rounded-full animate-brush-stroke" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right side - Settings Menu */}
            <div className="flex items-center gap-2" ref={settingsRef}>
              {/* Settings Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-ai-50 text-sumi-500 hover:text-ai-DEFAULT transition-all duration-200"
                  aria-label="设置菜单"
                >
                  <Settings className={`w-5 h-5 transition-transform duration-300 ${isSettingsOpen ? 'rotate-90 text-ai-DEFAULT' : ''}`} />
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isSettingsOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu - Claymorphism Card */}
                {isSettingsOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-ai-100 py-2 animate-fade-in z-[1060]">
                    {/* Menu Header */}
                    <div className="px-4 py-3 border-b border-sumi-100 bg-gradient-to-r from-ai-50 to-transparent rounded-t-2xl">
                      <p className="text-sm font-bold text-ai-DEFAULT">快捷菜单</p>
                      <p className="text-xs text-sumi-400 mt-0.5">设置与工具</p>
                    </div>

                    {/* Menu Items */}
                    {settingsMenuItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setIsSettingsOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-sumi-600 hover:bg-ai-50 hover:text-ai-DEFAULT transition-all duration-200 group mx-2 rounded-xl"
                        >
                          <Icon className="w-4 h-4 transition-colors" />
                          <span className="flex-1">{item.label}</span>
                          <span className="text-xs text-sumi-300 group-hover:text-ai-400 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                        </Link>
                      );
                    })}

                    {/* Divider */}
                    <div className="my-2 border-t border-sumi-100" />

                    {/* Reset Data Button */}
                    <button
                      onClick={handleResetData}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-shu-600 hover:bg-shu-50 transition-all duration-200 group mx-2 rounded-xl"
                    >
                      <Settings className="w-4 h-4" />
                      <span className="flex-1">重置数据</span>
                      <span className="text-xs text-shu-400 group-hover:text-shu-500 opacity-0 group-hover:opacity-100 transition-opacity">!</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-sumi-500 hover:text-ai-DEFAULT hover:bg-ai-50 rounded-lg transition-colors duration-200"
                aria-label="菜单"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-ai-100 animate-slide-down">
          <nav className="px-4 py-4 space-y-1">
            {[...navLinks, ...settingsMenuItems].map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200
                    ${active
                      ? 'bg-ai-50 text-ai-DEFAULT shadow-washi-sm'
                      : 'text-sumi-500 hover:bg-ai-50/50'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {/* Mobile Reset Data */}
            <button
              onClick={handleResetData}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-shu-600 hover:bg-shu-50 transition-all duration-200"
            >
              <Settings className="w-5 h-5" />
              <span>重置数据</span>
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}

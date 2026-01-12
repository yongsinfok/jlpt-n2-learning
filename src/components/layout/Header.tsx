/**
 * 顶部导航栏 - Modern Japanese "Zen Glass" Design
 * Refined glassmorphism with Japanese aesthetic elements
 */

import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef, useCallback, memo } from 'react';
import { ROUTES } from '@/utils/constants';
import { Home, BookOpen, Brain, TrendingUp, Settings, Menu, X, ChevronDown, Trophy, HelpCircle } from 'lucide-react';

/**
 * Navigation links with Japanese labels
 */
const navLinks = [
  { path: ROUTES.HOME, label: '首页', labelJa: 'ホーム', icon: Home },
  { path: ROUTES.LESSONS, label: '课程', labelJa: 'レッスン', icon: BookOpen },
  { path: ROUTES.PRACTICE, label: '练习', labelJa: '練習', icon: Brain },
  { path: ROUTES.PROGRESS, label: '进度', labelJa: '進度', icon: TrendingUp },
] as const;

/**
 * Settings menu items
 */
const settingsMenuItems = [
  { path: ROUTES.SETTINGS, label: '系统设置', icon: Settings },
  { path: ROUTES.ACHIEVEMENTS, label: '我的成就', icon: Trophy },
  { path: ROUTES.ONBOARDING, label: '新手引导', icon: HelpCircle },
] as const;

/**
 * Header Component - Glassmorphism with Japanese minimalism
 * Uses memo to prevent unnecessary re-renders
 */
export const Header = memo(function Header() {
  const location = useLocation();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  // Handle scroll for glass effect enhancement
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Click outside to close settings menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setIsSettingsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset data functionality
  const handleResetData = useCallback(() => {
    if (confirm('确定要重置所有学习数据吗？此操作不可撤销。')) {
      localStorage.clear();
      window.location.reload();
    }
    setIsSettingsOpen(false);
  }, []);

  // Toggle handlers with useCallback
  const toggleSettings = useCallback(() => {
    setIsSettingsOpen(prev => !prev);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const handleSettingsClick = useCallback(() => {
    setIsSettingsOpen(false);
  }, []);

  // Check if path is active
  const isActive = useCallback((path: string) => {
    if (path === ROUTES.HOME) {
      return location.pathname === ROUTES.HOME;
    }
    return location.pathname.startsWith(path);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-[1000] w-full">
      {/* Glass Header */}
      <div
        className={`
          transition-all duration-300 ease-out
          ${isScrolled
            ? 'bg-white/90 backdrop-blur-xl border-b border-sumi-100/80 shadow-sm'
            : 'bg-transparent border-b border-transparent'
          }
        `}
      >
        {/* Subtle top gradient accent */}
        <div className={`h-px bg-gradient-to-r from-transparent via-ai-200 to-transparent transition-opacity duration-300 ${isScrolled ? 'opacity-60' : 'opacity-30'}`} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 md:h-18">
            {/* Logo - Modern Japanese Style */}
            <Link
              to={ROUTES.HOME}
              className="flex items-center gap-3 group"
              aria-label="JLPT N2 学习平台 - 返回首页"
            >
              {/* Logo Container with subtle animation */}
              <div
                className={`
                  relative flex items-center justify-center
                  w-10 h-10 md:w-11 md:h-11
                  bg-gradient-to-br from-ai-50 to-ai-100
                  rounded-xl shadow-sm
                  transition-all duration-300 ease-out
                  group-hover:shadow-md group-hover:scale-105
                `}
              >
                {/* Japanese flag emoji */}
                <span
                  className="text-xl md:text-2xl transition-transform duration-300 group-hover:scale-110"
                  role="img"
                  aria-label="日本国旗"
                >
                  🎌
                </span>
                {/* Subtle glow effect on hover */}
                <div className="absolute inset-0 bg-ai-DEFAULT/0 rounded-xl transition-all duration-300 group-hover:bg-ai-DEFAULT/10" />
              </div>

              {/* Logo Text */}
              <div className="flex flex-col">
                <span
                  className={`
                    font-display font-bold text-base md:text-lg text-ai-700
                    transition-colors duration-200
                    ${isScrolled ? 'text-ai-700' : 'text-ai-800'}
                  `}
                >
                  JLPT N2
                </span>
                <span className="text-[9px] md:text-[10px] text-sumi-400 tracking-wider uppercase font-medium">
                  日本語能力試験
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1" role="navigation" aria-label="主导航">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.path);

                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`
                      relative flex items-center gap-2 px-4 py-2.5 rounded-xl
                      font-medium transition-all duration-200 ease-out
                      ${active
                        ? 'text-ai-700 bg-ai-50 shadow-sm'
                        : 'text-sumi-500 hover:text-ai-600 hover:bg-ai-50/50'
                      }
                    `}
                    aria-current={active ? 'page' : undefined}
                  >
                    <Icon
                      className={`
                        w-4 h-4 transition-transform duration-200
                        ${active ? 'scale-110' : ''}
                      `}
                      aria-hidden="true"
                    />
                    <span className="hidden xl:inline text-sm">{link.label}</span>
                    <span className="hidden lg:inline xl:hidden text-sm opacity-80">{link.labelJa}</span>

                    {/* Active indicator - subtle line */}
                    {active && (
                      <span className="absolute -bottom-px left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-ai-400 to-ai-600 rounded-full" aria-hidden="true" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right Side - Settings & Mobile Toggle */}
            <div className="flex items-center gap-2" ref={settingsRef}>
              {/* Settings Dropdown */}
              <div className="relative">
                <button
                  onClick={toggleSettings}
                  className={`
                    flex items-center gap-2 px-3 py-2.5 rounded-xl
                    transition-all duration-200 ease-out
                    ${isSettingsOpen
                      ? 'bg-ai-50 text-ai-700'
                      : 'text-sumi-400 hover:text-ai-600 hover:bg-ai-50/50'
                    }
                  `}
                  aria-label="设置菜单"
                  aria-expanded={isSettingsOpen}
                  aria-haspopup="true"
                >
                  <Settings
                    className={`
                      w-5 h-5 transition-all duration-300
                      ${isSettingsOpen ? 'rotate-90' : ''}
                    `}
                    aria-hidden="true"
                  />
                  <ChevronDown
                    className={`
                      w-4 h-4 transition-transform duration-300 opacity-60
                      ${isSettingsOpen ? 'rotate-180' : ''}
                    `}
                    aria-hidden="true"
                  />
                </button>

                {/* Dropdown Menu - Glass Card */}
                {isSettingsOpen && (
                  <div
                    className="absolute right-0 mt-3 w-56 animate-scale-in origin-top-right"
                    role="menu"
                    aria-label="设置菜单"
                  >
                    <div className="glass-card p-2">
                      {/* Menu Header */}
                      <div className="px-3 py-3 border-b border-sumi-100/50 mb-2">
                        <p className="text-sm font-display font-semibold text-ai-800">快捷菜单</p>
                        <p className="text-xs text-sumi-400 mt-0.5">设置与工具</p>
                      </div>

                      {/* Menu Items */}
                      {settingsMenuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.path}
                            to={item.path}
                            onClick={handleSettingsClick}
                            className="
                              flex items-center gap-3 px-3 py-2.5
                              text-sm text-sumi-600
                              hover:bg-ai-50 hover:text-ai-700
                              rounded-lg transition-all duration-150
                              group
                            "
                            role="menuitem"
                          >
                            <Icon className="w-4 h-4 transition-colors" aria-hidden="true" />
                            <span className="flex-1">{item.label}</span>
                            <span
                              className="text-xs text-sumi-300 group-hover:text-ai-400
                              opacity-0 group-hover:opacity-100 transition-opacity"
                              aria-hidden="true"
                            >
                              →
                            </span>
                          </Link>
                        );
                      })}

                      {/* Divider */}
                      <div className="h-px bg-sumi-100/50 my-2" role="separator" />

                      {/* Reset Data Button */}
                      <button
                        onClick={handleResetData}
                        className="
                          w-full flex items-center gap-3 px-3 py-2.5
                          text-sm text-shu-600
                          hover:bg-shu-50
                          rounded-lg transition-all duration-150
                          group
                        "
                        role="menuitem"
                      >
                        <Settings className="w-4 h-4" aria-hidden="true" />
                        <span className="flex-1">重置数据</span>
                        <span
                          className="text-xs text-shu-400 group-hover:text-shu-500
                          opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-hidden="true"
                        >
                          !
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={toggleMobileMenu}
                className="lg:hidden p-2.5 text-sumi-400 hover:text-ai-600 hover:bg-ai-50/50 rounded-xl transition-colors duration-200"
                aria-label="菜单"
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Glass Slide Down */}
      {isMobileMenuOpen && (
        <div
          id="mobile-menu"
          className="lg:hidden glass-header border-t border-sumi-100/50 animate-fade-in"
          role="navigation"
          aria-label="移动端菜单"
        >
          <nav className="px-4 py-4 space-y-1 max-h-[70vh] overflow-y-auto">
            {[...navLinks, ...settingsMenuItems].map((item, index) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={closeMobileMenu}
                  className={`
                    flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium
                    transition-all duration-200
                    ${active
                      ? 'bg-ai-50 text-ai-700 shadow-sm'
                      : 'text-sumi-500 hover:bg-ai-50/50'
                    }
                  `}
                  style={{ animationDelay: `${index * 50}ms` }}
                  aria-current={active ? 'page' : undefined}
                >
                  <Icon className="w-5 h-5" aria-hidden="true" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {/* Mobile Reset Data */}
            <button
              onClick={handleResetData}
              className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium text-shu-600 hover:bg-shu-50 transition-all duration-200"
            >
              <Settings className="w-5 h-5" aria-hidden="true" />
              <span>重置数据</span>
            </button>
          </nav>

          {/* Decorative bottom pattern */}
          <div className="h-8 bg-asanoha-pattern opacity-50" aria-hidden="true" />
        </div>
      )}
    </header>
  );
});

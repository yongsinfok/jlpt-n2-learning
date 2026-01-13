/**
 * 顶部导航栏 - MODERN ZEN DESIGN
 * Clean. Elegant. Japanese-inspired.
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
 * Header Component - Modern Glassmorphism Design
 */
export const Header = memo(function Header() {
  const location = useLocation();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
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
    <header
      className={`
        sticky top-0 z-[1000] w-full transition-all duration-300
        ${isScrolled
          ? 'bg-white/80 backdrop-blur-xl shadow-lg shadow-black/5'
          : 'bg-transparent'
        }
      `}
    >
      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo - Modern Style */}
          <Link
            to={ROUTES.HOME}
            className="flex items-center gap-3 group"
            aria-label="JLPT N2 学习平台 - 返回首页"
          >
            {/* Logo Container - Glass effect */}
            <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-glow">
              <span
                className="text-lg md:text-xl"
                role="img"
                aria-label="日本国旗"
              >
                🎌
              </span>
            </div>

            {/* Logo Text */}
            <div className="flex flex-col">
              <span className="font-display font-bold text-base md:text-lg text-text-primary group-hover:gradient-text transition-all duration-300">
                JLPT N2
              </span>
              <span className="text-[9px] md:text-[10px] text-text-secondary tracking-wide">
                日本語能力試験
              </span>
            </div>
          </Link>

          {/* Desktop Navigation - Modern */}
          <nav className="hidden lg:flex items-center gap-1" role="navigation" aria-label="主导航">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300
                    ${active
                      ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-md'
                      : 'text-text-secondary hover:bg-white/50 hover:text-text-primary'
                    }
                  `}
                  aria-current={active ? 'page' : undefined}
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                  <span className="hidden xl:inline">{link.label}</span>
                  <span className="hidden lg:inline xl:hidden opacity-80">{link.labelJa}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Side - Settings & Mobile Toggle */}
          <div className="flex items-center gap-2" ref={settingsRef}>
            {/* Settings Dropdown - Modern */}
            <div className="relative">
              <button
                onClick={toggleSettings}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm transition-all duration-300
                  ${isSettingsOpen
                    ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-md'
                    : 'text-text-secondary hover:bg-white/50 hover:text-text-primary'
                  }
                  `}
                aria-label="设置菜单"
                aria-expanded={isSettingsOpen}
                aria-haspopup="true"
              >
                <Settings className="w-5 h-5" aria-hidden="true" />
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-300 ${isSettingsOpen ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                />
              </button>

              {/* Dropdown Menu - Glass Card */}
              {isSettingsOpen && (
                <div
                  className="absolute right-0 mt-3 w-56 animate-modern-scale origin-top-right z-50"
                  role="menu"
                  aria-label="设置菜单"
                >
                  <div className="glass-card-strong p-2">
                    {/* Menu Header */}
                    <div className="px-3 py-3 border-b border-gray-200 mb-2">
                      <p className="text-sm font-display font-semibold text-text-primary">快捷菜单</p>
                      <p className="text-xs text-text-secondary mt-0.5">设置与工具</p>
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
                            text-sm text-text-secondary font-medium rounded-lg
                            hover:bg-gradient-to-r hover:from-primary/10 hover:to-secondary/10 hover:text-text-primary
                            transition-all duration-200
                            group
                          "
                          role="menuitem"
                        >
                          <Icon className="w-4 h-4 text-primary group-hover:text-secondary" aria-hidden="true" />
                          <span className="flex-1">{item.label}</span>
                        </Link>
                      );
                    })}

                    {/* Divider */}
                    <div className="h-px bg-gray-200 my-2" role="separator" />

                    {/* Reset Data Button */}
                    <button
                      onClick={handleResetData}
                      className="
                        w-full flex items-center gap-3 px-3 py-2.5
                        text-sm text-error font-medium rounded-lg
                        hover:bg-error/10
                        transition-all duration-200
                        group
                      "
                      role="menuitem"
                    >
                      <Settings className="w-4 h-4" aria-hidden="true" />
                      <span className="flex-1">重置数据</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle - Modern */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 rounded-lg text-text-secondary hover:bg-white/50 hover:text-text-primary transition-all duration-300"
              aria-label="菜单"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Glass Card */}
      {isMobileMenuOpen && (
        <div
          id="mobile-menu"
          className="lg:hidden glass-card-strong mx-4 mb-4 animate-modern-fade"
          role="navigation"
          aria-label="移动端菜单"
        >
          <nav className="py-2 max-h-[70vh] overflow-y-auto">
            {[...navLinks, ...settingsMenuItems].map((item, index) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={closeMobileMenu}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg font-medium mx-1
                    transition-all duration-200
                    ${active
                      ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-md'
                      : 'text-text-secondary hover:bg-white/50 hover:text-text-primary'
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
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-text-secondary font-medium mx-1 hover:bg-error/10 hover:text-error transition-all duration-200"
            >
              <Settings className="w-5 h-5" aria-hidden="true" />
              <span>重置数据</span>
            </button>
          </nav>
        </div>
      )}
    </header>
  );
});

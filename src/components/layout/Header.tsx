/**
 * Header Component - Modern Clean Design
 */

import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef, useCallback, memo } from 'react';
import { ROUTES } from '@/utils/constants';
import { Home, BookOpen, Brain, TrendingUp, Settings, Menu, X, ChevronDown, Trophy, HelpCircle, Search, Heart } from 'lucide-react';

/**
 * Navigation links
 */
const navLinks = [
  { path: ROUTES.HOME, label: "TODAY'S JLPT", labelShort: 'TODAY', icon: Home },
  { path: ROUTES.LESSONS, label: 'レッスン', labelShort: 'レッスン', icon: BookOpen },
  { path: ROUTES.PRACTICE, label: '練習', labelShort: '練習', icon: Brain },
  { path: ROUTES.PROGRESS, label: '進度', labelShort: '進度', icon: TrendingUp },
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
 * Header Component - Modern Clean Design
 */
export const Header = memo(function Header() {
  const location = useLocation();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

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

  // Handle reset data functionality
  const handleResetData = useCallback(() => {
    if (confirm('确定要重置所有学习数据吗？此操作不可撤销。')) {
      localStorage.clear();
      window.location.reload();
    }
    setIsSettingsOpen(false);
  }, []);

  // Toggle handlers
  const toggleSettings = useCallback(() => setIsSettingsOpen(prev => !prev), []);
  const toggleMobileMenu = useCallback(() => setIsMobileMenuOpen(prev => !prev), []);
  const closeMobileMenu = useCallback(() => setIsMobileMenuOpen(false), []);
  const handleSettingsClick = useCallback(() => setIsSettingsOpen(false), []);

  // Check if path is active
  const isActive = useCallback((path: string) => {
    if (path === ROUTES.HOME) {
      return location.pathname === ROUTES.HOME;
    }
    return location.pathname.startsWith(path);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo + Tagline */}
          <Link
            to={ROUTES.HOME}
            className="flex items-center gap-3 group"
            aria-label="JLPT N2 学习平台 - 返回首页"
          >
            {/* Logo */}
            <div className="flex flex-col">
              <span className="font-display font-bold text-logo text-primary">
                JLPT N2
              </span>
              <span className="text-small text-neutral-dark">
                日本語学習プラットフォーム
              </span>
            </div>
          </Link>

          {/* Center: Navigation Tabs */}
          <nav className="hidden md:flex items-center" role="navigation" aria-label="主导航">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`nav-tab ${active ? 'active' : ''}`}
                  aria-current={active ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right: Search Bar + Heart Icon */}
          <div className="flex items-center gap-2" ref={settingsRef}>
            {/* Search Bar - Desktop */}
            <div className="hidden sm:flex items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-dark" />
                <input
                  type="text"
                  placeholder="搜索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input pl-10 pr-4 py-2 w-48 lg:w-64"
                />
              </div>
            </div>

            {/* Heart Icon */}
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className={`heart-btn ${isFavorite ? 'active' : ''}`}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              aria-pressed={isFavorite}
            >
              <Heart
                className={isFavorite ? 'fill-accent text-accent' : ''}
              />
            </button>

            {/* Settings Dropdown */}
            <div className="relative">
              <button
                onClick={toggleSettings}
                className="btn-icon"
                aria-label="设置菜单"
                aria-expanded={isSettingsOpen}
                aria-haspopup="true"
              >
                <Settings className="w-5 h-5" />
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${isSettingsOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Dropdown Menu */}
              {isSettingsOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white border border-border rounded-md shadow-card-hover animate-scale-in z-50"
                  role="menu"
                  aria-label="设置菜单"
                >
                  {/* Menu Items */}
                  {settingsMenuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={handleSettingsClick}
                        className="flex items-center gap-3 px-4 py-3 text-body text-neutral-dark hover:bg-neutral hover:text-primary transition-colors"
                        role="menuitem"
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}

                  {/* Divider */}
                  <div className="h-px bg-border" role="separator" />

                  {/* Reset Data Button */}
                  <button
                    onClick={handleResetData}
                    className="w-full flex items-center gap-3 px-4 py-3 text-body text-error hover:bg-error/10 transition-colors text-left"
                    role="menuitem"
                  >
                    <Settings className="w-4 h-4" />
                    <span>重置数据</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden btn-icon"
              aria-label="菜单"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden border-t border-border bg-white"
          role="navigation"
          aria-label="移动端菜单"
        >
          <nav className="px-4 py-4 max-h-[70vh] overflow-y-auto">
            {/* Mobile Search */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-dark" />
                <input
                  type="text"
                  placeholder="搜索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input pl-10 pr-4 py-2 w-full"
                />
              </div>
            </div>

            {/* Nav Links */}
            {navLinks.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={closeMobileMenu}
                  className={`flex items-center gap-3 px-4 py-3 rounded-md font-medium ${
                    active
                      ? 'bg-neutral text-primary'
                      : 'text-neutral-dark hover:bg-neutral hover:text-primary'
                  } transition-colors`}
                  aria-current={active ? 'page' : undefined}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {/* Settings Menu Items */}
            {settingsMenuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 px-4 py-3 rounded-md text-neutral-dark hover:bg-neutral hover:text-primary transition-colors"
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {/* Mobile Reset Data */}
            <button
              onClick={handleResetData}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-md text-error hover:bg-error/10 transition-colors text-left"
            >
              <Settings className="w-5 h-5" />
              <span>重置数据</span>
            </button>
          </nav>
        </div>
      )}
    </header>
  );
});

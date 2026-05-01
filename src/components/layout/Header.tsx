import { Link, NavLink, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef, useCallback, memo } from 'react';
import { Settings, Trophy, HelpCircle, AlertTriangle, ChevronDown } from 'lucide-react';
import { ROUTES } from '@/utils/constants';

const NAV_LINKS = [
  { to: ROUTES.HOME,     label: '今日' },
  { to: ROUTES.LESSONS,  label: 'レッスン' },
  { to: ROUTES.PRACTICE, label: '練習' },
  { to: ROUTES.REVIEW,   label: '復習' },
  { to: ROUTES.PROGRESS, label: '進度' },
];

const MENU_ITEMS = [
  { to: ROUTES.SETTINGS,     label: '系统设置', icon: Settings },
  { to: ROUTES.ACHIEVEMENTS, label: '我的成就', icon: Trophy },
  { to: ROUTES.ONBOARDING,   label: '新手引导', icon: HelpCircle },
];

export const Header = memo(function Header() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  // Close menu on route change
  useEffect(() => { setOpen(false); }, [location.pathname]);

  const onResetData = useCallback(() => {
    if (confirm('确定要重置所有学习数据吗？此操作不可撤销。')) {
      localStorage.clear();
      indexedDB.deleteDatabase('JLPTN2DB');
      window.location.reload();
    }
    setOpen(false);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-washi/80 backdrop-blur-xl pad-safe-top pad-safe-x">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Brand */}
          <Link
            to={ROUTES.HOME}
            className="flex items-baseline gap-3 group"
            aria-label="JLPT N2 — 返回首页"
          >
            <span className="font-mincho text-[20px] sm:text-[22px] font-medium tracking-[-0.01em] text-sumi">
              JLPT N2
            </span>
            <span className="hidden sm:inline-block font-mono text-[10px] tracking-[0.2em] text-sumi-mute uppercase">
              日本語学習
            </span>
          </Link>

          {/* Desktop nav (hidden on mobile — bottom tab bar handles it) */}
          <nav className="hidden lg:flex items-center gap-9" role="navigation" aria-label="主导航">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === ROUTES.HOME}
                className={({ isActive }) =>
                  `font-mincho text-[15px] pb-1 transition-colors ${
                    isActive
                      ? 'text-sumi border-b border-bengara'
                      : 'text-sumi-soft hover:text-sumi'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Settings menu */}
          <div className="relative" ref={ref}>
            <button
              onClick={() => setOpen((v) => !v)}
              className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-sumi-soft hover:text-sumi hover:bg-sumi/[0.04] transition-colors"
              aria-label="设置菜单"
              aria-expanded={open}
              aria-haspopup="true"
            >
              <Settings size={18} strokeWidth={1.6} />
              <ChevronDown
                size={14}
                className={`transition-transform ${open ? 'rotate-180' : ''}`}
              />
            </button>

            {open && (
              <div
                className="absolute right-0 mt-2 w-56 hairline-card bg-washi shadow-md py-2 animate-fade-in z-50"
                role="menu"
              >
                {MENU_ITEMS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-sumi-soft hover:text-sumi hover:bg-washi-dim transition-colors"
                      role="menuitem"
                    >
                      <Icon size={16} strokeWidth={1.6} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
                <div className="h-px bg-hairline my-1.5" role="separator" />
                <button
                  onClick={onResetData}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-bengara hover:bg-bengara/10 transition-colors"
                  role="menuitem"
                >
                  <AlertTriangle size={16} strokeWidth={1.6} />
                  <span>重置数据</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
});

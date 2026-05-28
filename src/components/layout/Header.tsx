import { Link, NavLink, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef, memo } from 'react';
import { Settings, Trophy, ChevronDown } from 'lucide-react';
import { ROUTES } from '@/utils/constants';

const NAV_LINKS = [
  { to: ROUTES.HOME,     label: '今日' },
  { to: ROUTES.LEARN,    label: '学习' },
  { to: ROUTES.PRACTICE, label: '练习' },
];

const MENU_ITEMS = [
  { to: ROUTES.ACHIEVEMENTS, label: '成就', icon: Trophy },
  { to: ROUTES.SETTINGS,     label: '设置', icon: Settings },
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

  useEffect(() => { setOpen(false); }, [location.pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/80 backdrop-blur-xl pad-safe-top pad-safe-x">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <Link to={ROUTES.HOME} className="flex items-baseline gap-3 group" aria-label="JLPT N2 — 返回首页">
            <span className="font-serif text-[20px] sm:text-[22px] font-medium tracking-[-0.01em] text-ink">
              JLPT N2
            </span>
            <span className="hidden sm:inline-block font-mono text-[10px] tracking-[0.2em] text-ink-mute uppercase">
              日本語学習
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-9" role="navigation" aria-label="主导航">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === ROUTES.HOME}
                className={({ isActive }) =>
                  `font-mincho text-[15px] pb-1 transition-colors ${
                    isActive ? 'text-ink border-b border-accent' : 'text-ink-soft hover:text-ink'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="relative" ref={ref}>
            <button
              onClick={() => setOpen((v) => !v)}
              className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-ink-soft hover:text-ink hover:bg-surface-hover transition-colors"
              aria-label="菜单"
              aria-expanded={open}
              aria-haspopup="true"
            >
              <Settings size={18} strokeWidth={1.6} />
              <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-48 noren-card py-2 shadow-elevated animate-fade-in z-50" role="menu">
                {MENU_ITEMS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-ink-soft hover:text-ink hover:bg-surface-dim transition-colors"
                      role="menuitem"
                    >
                      <Icon size={16} strokeWidth={1.6} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
});

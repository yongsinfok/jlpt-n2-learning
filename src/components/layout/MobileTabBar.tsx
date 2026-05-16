import { NavLink } from 'react-router-dom';
import { Home, BookOpen, Brain, TrendingUp } from 'lucide-react';
import { ROUTES } from '@/utils/constants';

const TABS = [
  { to: ROUTES.HOME,     label: '今日',       Icon: Home },
  { to: ROUTES.LESSONS,  label: 'レッスン',   Icon: BookOpen },
  { to: ROUTES.PRACTICE, label: '練習',       Icon: Brain },
  { to: ROUTES.PROGRESS, label: '進度',       Icon: TrendingUp },
];

export function MobileTabBar() {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-border pad-safe-bottom" role="navigation" aria-label="主导航">
      <div className="flex items-center justify-around h-16">
        {TABS.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === ROUTES.HOME}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-2 text-2xs transition-colors ${
                isActive
                  ? 'text-accent'
                  : 'text-ink-mute hover:text-ink-soft'
              }`
            }
          >
            <Icon size={20} strokeWidth={1.6} aria-hidden="true" />
            <span className="font-sans">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

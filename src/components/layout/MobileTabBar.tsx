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
    <nav className="tab-bar show-mobile" role="navigation" aria-label="主导航">
      {TABS.map(({ to, label, Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === ROUTES.HOME}
          className={({ isActive }) => isActive ? 'active' : ''}
        >
          <Icon aria-hidden="true" />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

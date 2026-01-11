/**
 * 侧边栏导航组件
 * 用于移动端和桌面端的导航菜单
 */

import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '@/utils/constants';
import {
  Home,
  BookOpen,
  Brain,
  TrendingUp,
  Award,
  XCircle,
  Settings,
  X,
} from 'lucide-react';

/**
 * 导航链接配置
 */
const navLinks = [
  { path: ROUTES.HOME, label: '首页', icon: Home },
  { path: ROUTES.LESSONS, label: '课程学习', icon: BookOpen },
  { path: ROUTES.PRACTICE, label: '练习测试', icon: Brain },
  { path: ROUTES.PROGRESS, label: '学习进度', icon: TrendingUp },
  { path: ROUTES.ACHIEVEMENTS, label: '成就系统', icon: Award },
  { path: ROUTES.WRONG_ANSWERS, label: '错题本', icon: XCircle },
  { path: ROUTES.SETTINGS, label: '设置', icon: Settings },
];

/**
 * 侧边栏组件属性
 */
interface SidebarProps {
  /** 是否显示侧边栏 */
  isOpen: boolean;
  /** 关闭侧边栏的回调 */
  onClose: () => void;
}

/**
 * 侧边栏导航组件
 */
export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === ROUTES.HOME) {
      return location.pathname === ROUTES.HOME;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* 遮罩层 */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* 侧边栏 */}
      <aside
        className={`
          fixed md:sticky top-0 left-0 h-screen w-64 bg-white shadow-lg z-50
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* 头部 */}
          <div className="flex items-center justify-between p-4 border-b">
            <Link to={ROUTES.HOME} className="flex items-center gap-2" onClick={onClose}>
              <span className="text-2xl">🎌</span>
              <span className="font-bold text-xl text-gray-900">JLPT N2</span>
            </Link>
            <button
              onClick={onClose}
              className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              aria-label="关闭侧边栏"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 导航链接 */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      onClick={onClose}
                      className={`
                        flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                        ${
                          isActive(link.path)
                            ? 'bg-primary text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }
                      `}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{link.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* 底部信息 */}
          <div className="p-4 border-t text-sm text-gray-500">
            <p>JLPT N2 学习平台</p>
            <p className="text-xs mt-1">版本 1.0.0</p>
          </div>
        </div>
      </aside>
    </>
  );
}

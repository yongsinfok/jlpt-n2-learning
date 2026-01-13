/**
 * 底部版权信息组件 - MODERN ZEN DESIGN
 * Clean. Elegant. Japanese-inspired.
 */

export function Footer() {
  return (
    <footer className="mt-auto">
      <div className="glass-card-strong mx-4 my-6 !p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-6">
            {/* Decorative element - Modern */}
            <div className="flex items-center justify-center gap-4">
              <div className="h-px w-12 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-glow">
                <span
                  className="text-lg"
                  role="img"
                  aria-label="日本国旗"
                >
                  🎌
                </span>
              </div>
              <div className="h-px w-12 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            </div>

            {/* Main content */}
            <div className="space-y-3">
              <p className="text-text-primary font-medium">
                学习数据来自 <span className="gradient-text font-semibold">shin-kanzen N2 grammar</span> 项目
              </p>

              <p className="text-text-secondary text-sm">
                数据许可:{' '}
                <span className="font-mono font-medium px-2 py-0.5 rounded-lg bg-gray-100">
                  CC BY-NC 4.0
                </span>{' '}
                | 仅供个人学习使用
              </p>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

            {/* Copyright */}
            <p className="text-text-secondary text-sm font-medium">
              © {new Date().getFullYear()} JLPT N2 学习平台 — 日本語能力試験 N2
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

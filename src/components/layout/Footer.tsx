/**
 * 底部版权信息组件 - Japanese Style
 */

export function Footer() {
  return (
    <footer className="bg-white/60 backdrop-blur-sm border-t border-ai-100 mt-auto">
      {/* Decorative top border */}
      <div className="h-px bg-gradient-to-r from-transparent via-ai-DEFAULT to-transparent opacity-20" />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center space-y-3">
          {/* Japanese decorative element */}
          <div className="flex items-center justify-center gap-2 text-sumi-300">
            <span className="text-2xl">🌸</span>
            <span className="text-xs font-serif tracking-widest">—</span>
            <span className="text-2xl">🍃</span>
          </div>

          <p className="text-sumi-500 text-sm">
            本网站使用的学习数据来自 <span className="font-serif text-ai-DEFAULT">shin-kanzen N2 grammar</span> 项目
          </p>

          <p className="text-sumi-400 text-xs">
            数据许可: <span className="font-mono">CC BY-NC 4.0</span> | 仅供个人学习使用，严禁商业用途
          </p>

          <div className="pt-4 mt-4 border-t border-ai-100">
            <p className="text-sumi-400 text-xs font-maru">
              © {new Date().getFullYear()} JLPT N2 学习平台 —
              <span className="ml-2 font-serif text-ai-600">日本語能力試験 N2</span>
            </p>
          </div>
        </div>
      </div>

      {/* Decorative seigaiha pattern at bottom */}
      <div className="h-3 opacity-20 overflow-hidden">
        <div className="w-full h-full bg-seigaiha" />
      </div>
    </footer>
  );
}

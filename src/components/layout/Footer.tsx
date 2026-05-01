export function Footer() {
  return (
    <footer className="mt-auto border-t border-hairline pad-safe-x">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 py-12 text-center">
        <div className="font-mincho text-[11px] tracking-[0.3em] text-sumi-mute mb-6">
          — 和 紙 × 硝 子 —
        </div>
        <p className="font-mincho text-sm text-sumi-soft mb-2">
          学习数据来自 <span className="text-sumi">shin-kanzen N2 grammar</span> 项目
        </p>
        <p className="font-mono text-[11px] tracking-wider text-sumi-mute">
          DATA LICENSE · CC BY-NC 4.0 · 仅供个人学习使用
        </p>
        <p className="font-mono text-[11px] tracking-wider text-sumi-mute mt-4">
          © {new Date().getFullYear()} JLPT N2 学習 · 日本語能力試験 N2
        </p>
      </div>
    </footer>
  );
}

/**
 * 底部版权信息组件
 */

export function Footer() {
  return (
    <footer className="bg-white border-t mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="text-center text-sm text-gray-600 space-y-2">
          <p>本网站使用的学习数据来自 shin-kanzen N2 grammar 项目</p>
          <p>数据许可: CC BY-NC 4.0 | 仅供个人学习使用，严禁商业用途</p>
          <p className="text-xs text-gray-500 mt-4">
            © {new Date().getFullYear()} JLPT N2 学习平台
          </p>
        </div>
      </div>
    </footer>
  );
}

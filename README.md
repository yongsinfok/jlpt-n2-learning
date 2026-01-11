# JLPT N2 学习平台

一个用于系统学习日语 N2 语法的网站，采用艾宾浩斯遗忘曲线和间隔重复算法帮助用户高效学习。

## 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite
- **样式方案**: Tailwind CSS
- **数据存储**: IndexedDB (Dexie.js)
- **状态管理**: Zustand
- **路由管理**: React Router v6
- **图标库**: Lucide React

## 核心功能

### 📚 学习模块
- **课程系统**: 分章节学习 N2 语法点
- **语法详解**: 每个语法点的详细解释和例句
- **音频播放**: 例句日语朗读
- **学习进度**: 自动跟踪学习状态

### 🎯 练习模块
- **多种练习模式**: 填空、选择、翻译等
- **智能出题**: 根据学习进度和遗忘曲线生成题目
- **即时反馈**: 答案解析和错误提示

### 📊 复习系统
- **间隔重复算法**: 基于艾宾浩斯曲线安排复习
- **智能提醒**: 到期复习自动提醒
- **错题本**: 记录错题并提供针对性练习

### 📈 统计分析
- **学习统计**: 学习时长、完成率、正确率等数据
- **可视化图表**: 直观展示学习进度
- **每日目标**: 设定并追踪每日学习目标

### 🏆 成就系统
- **学习成就**: 解锁各种学习里程碑
- **激励机制**: 通过成就激励持续学习

## 项目结构

```
jlpt-n2-learning/
├── public/              # 静态资源
│   ├── audio/          # 音频文件
│   └── data/           # CSV 数据文件
├── src/
│   ├── components/     # 组件
│   │   ├── common/     # 通用组件
│   │   ├── layout/     # 布局组件
│   │   ├── study/      # 学习模块组件
│   │   ├── practice/   # 练习模块组件
│   │   └── progress/   # 进度模块组件
│   ├── pages/          # 页面组件
│   ├── stores/         # Zustand 状态管理
│   ├── hooks/          # 自定义 Hooks
│   ├── utils/          # 工具函数
│   ├── types/          # TypeScript 类型定义
│   └── db/             # IndexedDB 配置和操作
├── index.html
├── package.json
└── vite.config.ts
```

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:5173

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## 开发状态

🚧 **当前开发阶段**: Phase 1 - 项目骨架 (95%)

详细开发进度请查看 [claude.md](./claude.md)

## 数据说明

### CSV 数据格式

项目使用 CSV 文件作为数据源，包含以下字段：

- **例句数据**: 日语例句、中文翻译、语法点标注
- **课程数据**: 课程号、课程名称、语法点列表
- **音频数据**: 例句对应的音频文件

### 数据导入

首次运行时，应用会自动：
1. 从 `public/data/` 目录加载 CSV 数据
2. 解析并导入到 IndexedDB
3. 初始化用户进度和成就数据

## 浏览器支持

- Chrome/Edge (推荐)
- Firefox
- Safari

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！

## 联系方式

如有问题，请通过 GitHub Issues 联系。

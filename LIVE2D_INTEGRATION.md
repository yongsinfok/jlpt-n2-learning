# 🎀 Live2D 老师集成指南

## 当前实现：伪 Live2D 系统

### ✨ 已实现功能

| 功能 | 描述 |
|------|------|
| **多层视差效果** | 3层 SVG 视差动画，鼠标移动时有 3D 效果 |
| **呼吸动画** | 自然的上下呼吸运动 |
| **情绪动画** | 高兴时跳跃，惊讶时刘海飞扬 |
| **表情切换** | 6 种情绪，眼睛和嘴巴动态变化 |
| **腮红闪烁** | 情绪激动时腮红呼吸闪烁 |
| **蝴蝶结闪烁** | 装饰物闪烁动画 |
| **闪光效果** | 完成时出现闪光 ✨ |
| **鼠标追踪** | 跟随鼠标移动的 3D 视差效果 |

### 🎭 支持的情绪

```typescript
type TeacherEmotion =
  | 'happy'       // 开心 ^^
  | 'thinking'    // 思考 ··
  | 'worried'     // 担心 ><
  | 'proud'       // 骄傲 ▼ ▼
  | 'encouraging' // 鼓励 ◕ ◕
  | 'surprised';  // 惊讶 ○ ○
```

---

## 🚀 升级到真正的 Live2D

### 方案 1: 使用 @pixiv/live2d-widget-ts（推荐）

```bash
npm install @pixiv/live2d-widget-ts
```

**优点：**
- 官方库，稳定性高
- 支持完整的 Live2D 功能
- 文档齐全

**缺点：**
- 需要真实的 Live2D 模型文件（.moc3）
- 配置相对复杂

### 方案 2: 使用 pixi-live2d-display

```bash
npm install pixi-live2d-display
```

**优点：**
- 轻量级
- 易于集成
- 支持多种模型格式

**缺点：**
- 功能相对简单

### 方案 3: 使用 VRM 模型 + @pixiv/three-vrm

```bash
npm install @pixiv/three-vrm @pixiv/three-vrm
```

**优点：**
- 3D 全身模型
- 可以360度旋转
- 免费模型资源丰富

**缺点：**
- 性能开销较大
- 需要 Three.js 知识

---

## 📦 获取免费 Live2D 模型

### 官方免费模型

1. **Haru** - Live2D 官方免费模型
   - 网址: https://www.live2d.com/download/sample/
   - 需要: 注册账号下载

2. **Epsilon** - Live2D 官方免费模型
   - 网址: https://www.live2d.com/download/sample/
   - 需要: 注册账号下载

3. **Hiyori** - 免费学习用模型
   - 网址: https://live2d.github.io/

### VRM 免费模型

1. **Alicia** - VRoid Studio 制作
   - 网址: https://vroid.com/
   - 可以: 自己制作并导出 VRM

2. **VirtualCast** 提供的模型
   - 网址: https://3d.vroid.com/

---

## 🔧 真正 Live2D 集成步骤

### 步骤 1: 获取模型文件

下载 Live2D 模型后，你会得到：

```
model/
├── Haru.moc3        # Live2D 模型文件
├── Haru.model3.json # 模型配置
├── textures/        # 纹理图片
│   ├── texture_00.png
│   └── texture_01.png
└── physics/         # 物理配置（可选）
```

### 步骤 2: 放置到项目

```bash
# 在 public 目录创建模型文件夹
mkdir -p public/live2d/Haru

# 复制模型文件到该目录
# (手动复制下载的文件)
```

### 步骤 3: 创建 Live2D 组件

```typescript
// src/components/study/RealLive2DTeacher.tsx
import { useEffect, useRef } from 'react';
import { Live2DModel } from '@pixiv/live2d-widget-ts';

export function RealLive2DTeacher() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const modelRef = useRef<Live2DModel | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // 加载模型
    const model = new Live2DModel();
    model.load('/live2d/Haru/Haru.moc3').then(() => {
      modelRef.current = model;
    });

    return () => {
      modelRef.current?.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} width={400} height={400} />;
}
```

---

## 🎨 当前伪 Live2D 效果预览

### 视差效果演示

```
鼠标移动时的层级:

后层: 头发 (translateZ(-20px))
       ↓ 视差小
中层: 脸部 (translateZ(0px))
       ↓ 视差中
前层: 头饰 (translateZ(20px))
       ↓ 视差大
```

### 动画效果

```css
/* 呼吸动画 */
2秒周期: 轻微上下移动

/* 开心动画 */
跳跃 + 闪烁

/* 惊讶动画 */
刘海飞扬
```

---

## 💡 使用示例

```tsx
import { Live2DTeacher, TeacherTriggers } from '@/components/study';

function MyComponent() {
  const [emotion, setEmotion] = useState<TeacherEmotion>('encouraging');

  return (
    <>
      <button onClick={() => setEmotion(TeacherTriggers.correct())}>
        答对了！
      </button>

      <Live2DTeacher
        emotion={emotion}
        customMessage="すごい！"
        size="lg"
        position="bottom-right"
      />
    </>
  );
}
```

---

## 📚 参考资源

### 官方文档
- [Live2D Cubism SDK](https://www.live2d.com/)
- [Live2D WebGL Viewer](https://www.live2d.com/)
- [pixiv-live2d-display](https://github.com/guansss/pixi-live2d-display)

### 学习资源
- [Live2D 官方教程](https://www.live2d.com/learn/)
- [VRoid Studio 教程](https://vroid.com/tutorial)
- [ChatVRM 示例](https://github.com/pixiv/ChatVRM)

---

## 🎯 下一步

1. **下载 Live2D 模型**
   - 访问 https://www.live2d.com/download/sample/
   - 注册账号下载 Haru 或 Epsilon

2. **集成真正 Live2D**
   - 安装 @pixiv/live2d-widget-ts
   - 使用上面的代码示例

3. **自定义模型**
   - 使用 VRoid Studio 创建自己的角色
   - 导出为 VRM 格式

---

## 🌟 当前系统优势

虽然不是真正的 Live2D，但当前实现也有优势：

✅ **零配置** - 无需下载额外文件
✅ **轻量级** - 只有 SVG 代码
✅ **高性能** - 浏览器原生渲染
✅ **可定制** - 修改代码即可改变外观
✅ **响应式** - 完美适配移动端
✅ **可交互** - 鼠标视差效果

---

## 🎀 开始使用

当前版本已经可以直接使用！

```bash
npm run dev
```

访问 http://localhost:5175

进入学习页面即可看到 さくら先生！

---

**有问题？参考本指南或查看代码注释！**

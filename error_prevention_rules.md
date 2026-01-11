# 防错规范 - Claude Code 工作准则

## ⚠️ 重要说明

本文档定义了 Claude Code 在开发过程中必须遵守的工作规范。
这些规范的目的是：
- 防止代码丢失
- 随时可以回滚
- 清晰记录进度
- 避免重复工作

---

## 📋 核心原则

### 原则 1：小步提交，频繁备份
**永远不要一次性做太多事情而不提交。**

### 原则 2：先看清单，再动手
**在修改任何文件前，先检查 claude.md 了解当前状态。**

### 原则 3：记录一切
**每个操作都要在 claude.md 中留下记录。**

### 原则 4：出错立停
**发现问题立即停止，不要试图自己修复。**

---

## 1️⃣ GitHub 同步规范

### 何时提交？
**每完成一个小功能就立即提交**，包括但不限于：
- ✅ 创建了一个新文件
- ✅ 实现了一个组件
- ✅ 完成了一个函数
- ✅ 修改了配置文件
- ✅ 修复了一个bug

### 提交命令
```bash
git add .
git commit -m "[类型]: [简短描述]"
git push origin [当前分支名]
```

### Commit 类型规范
| 类型 | 说明 | 示例 |
|------|------|------|
| `feat` | 新功能 | `feat: 添加 StudyCard 组件` |
| `fix` | 修复bug | `fix: 修复音频播放卡顿问题` |
| `refactor` | 重构代码 | `refactor: 优化数据加载逻辑` |
| `docs` | 文档更新 | `docs: 更新 README` |
| `style` | 代码格式 | `style: 格式化代码` |
| `test` | 测试相关 | `test: 添加单元测试` |
| `chore` | 构建/工具 | `chore: 更新依赖` |

### Commit 消息示例
```bash
# ✅ 好的示例
git commit -m "feat: 实现 CSV 解析器"
git commit -m "feat(study): 添加 LessonCard 组件"
git commit -m "fix(audio): 修复播放速度调节失效"
git commit -m "refactor(db): 优化查询性能"

# ❌ 不好的示例
git commit -m "更新"
git commit -m "修改文件"
git commit -m "fix bug"
git commit -m "完成功能"
```

### 分支规范
| 分支名 | 用途 |
|--------|------|
| `main` | 主分支，Phase 1 开发 |
| `feature/study` | 学习功能模块（Phase 2） |
| `feature/practice` | 练习功能模块（Phase 3） |
| `feature/review-stats` | 复习统计模块（Phase 4） |

### 推送规范
```bash
# 正常推送
git push origin [分支名]

# 强制推送（仅在回滚时使用）
git push -f origin [分支名]
```

---

## 2️⃣ claude.md 同步规范

### claude.md 的作用
`claude.md` 是项目的**进度清单和日志**，记录：
- ✅ 哪些功能已完成
- ⏳ 哪些功能正在进行
- ⏸️ 哪些功能未开始
- 📝 每次提交的 commit hash
- 🐛 遇到的问题和解决方案

### 何时更新？
**每完成一个功能后立即更新**，步骤：
1. 打开 `claude.md` 文件
2. 找到对应的功能项
3. 将 `[ ]` 改为 `[x]`
4. 记录 commit hash
5. 更新"最后更新"时间

### 更新示例

**修改前：**
```markdown
## 已完成功能清单

### Phase 1: 项目骨架
- [ ] **1.1 项目初始化**
  - [ ] 创建 Vite + React + TypeScript 项目
  - [ ] 初始化 Git 仓库
  - [ ] 推送到 GitHub
  - 提交: 
```

**修改后：**
```markdown
## 已完成功能清单

### Phase 1: 项目骨架
- [x] **1.1 项目初始化** ✅
  - [x] 创建 Vite + React + TypeScript 项目
  - [x] 初始化 Git 仓库
  - [x] 推送到 GitHub
  - 提交: a1b2c3d4
```

### 状态标记说明
| 标记 | 含义 | 何时使用 |
|------|------|----------|
| `[ ]` | 未开始 | 功能还没做 |
| `[x]` | 已完成 | 功能做完了 |
| `⏳` | 进行中 | 正在做，但还没完成 |
| `✅` | 已验证 | 完成且测试通过 |
| `⚠️` | 有问题 | 完成但有已知问题 |

### 文件变更记录

在 claude.md 的"文件变更记录"部分记录：

```markdown
## 文件变更记录

### 新增文件
- src/types/sentence.ts (提交: abc123)
- src/types/lesson.ts (提交: abc123)
- src/db/schema.ts (提交: def456)

### 修改文件
- src/App.tsx (提交: ghi789)
- package.json (提交: jkl012)

### 删除文件
- src/old-component.tsx (提交: mno345)
```

### 问题记录

遇到问题时记录在 claude.md：

```markdown
## 遇到的问题

### 问题 1: CSV 解析失败
**时间**: 2024-01-12 14:30
**描述**: Papa Parse 无法正确解析中文字段
**原因**: 编码问题
**解决方案**: 
```javascript
Papa.parse(csvText, {
  header: true,
  encoding: 'UTF-8',
  skipEmptyLines: true
})
```
**提交**: abc123
**状态**: ✅ 已解决
```

---

## 3️⃣ 检查点规范

### 什么是检查点？
检查点是**重要的里程碑**，必须在这些时刻提交到 GitHub。

### 必须创建检查点的时刻

#### Phase 1 检查点
| 检查点 | 说明 |
|--------|------|
| ✅ 项目初始化 | Vite 项目创建完成 |
| ✅ 依赖安装完成 | 所有 npm 包安装完成 |
| ✅ Tailwind 配置完成 | CSS 框架配置完成 |
| ✅ 类型定义完成 | 所有 TypeScript 类型定义完成 |
| ✅ IndexedDB 配置完成 | 数据库配置和测试完成 |
| ✅ CSV 解析完成 | 数据加载和导入完成 |
| ✅ 路由配置完成 | 所有页面路由配置完成 |
| ✅ 基础组件完成 | 通用 UI 组件完成 |
| ✅ Phase 1 完成 | 整个骨架搭建完成 |

#### Phase 2-4 检查点
| 检查点 | 说明 |
|--------|------|
| ✅ 模块开始 | 切换到功能分支 |
| ✅ 核心功能完成 | 主要功能实现完成 |
| ✅ 测试通过 | 功能测试通过 |
| ✅ 模块完成 | 准备合并到主分支 |

### 检查点命令
```bash
# 创建检查点
git add .
git commit -m "checkpoint: [检查点名称]"
git push origin [分支名]

# 示例
git commit -m "checkpoint: Phase 1 完成，项目骨架搭建完毕"
git commit -m "checkpoint: IndexedDB 配置完成，数据加载测试通过"
```

---

## 4️⃣ 防错检查规范

### 在开始任何操作前，必须执行三步检查

#### 检查 1：查看 claude.md
```
问：这个功能的状态是什么？

[ ] 未开始 → 可以开始做
[x] 已完成 → 跳过，不要重复做
⏳ 进行中 → 继续完成
```

#### 检查 2：检查文件是否存在
```
问：这个文件是否已经存在？

存在 → 查看内容，确认是否需要修改
不存在 → 可以创建
```

#### 检查 3：确认功能是否重复
```
问：项目中是否已有类似功能？

有 → 复用现有功能，不要重复造轮子
没有 → 可以创建新功能
```

### 检查流程图
```
开始修改文件
    ↓
查看 claude.md
    ↓
功能状态？
    ↓
├─ 未开始 → 继续
├─ 已完成 → 停止，跳过
└─ 进行中 → 继续完成
    ↓
文件是否存在？
    ↓
├─ 存在 → 查看内容，确认是否需要修改
└─ 不存在 → 创建新文件
    ↓
是否有类似功能？
    ↓
├─ 有 → 复用
└─ 没有 → 创建
    ↓
开始实现
```

### 不确定时的处理方式
```
如果不确定应该：
1. 先告诉用户你的计划
2. 说明你想做什么
3. 等待用户确认
4. 收到确认后再执行
```

**示例对话：**
```
Claude Code: 
"我准备创建 src/types/sentence.ts 文件。
根据 claude.md，这个任务还没开始。
我会定义 Sentence 接口，包含以下字段：
- id, lessonNumber, grammarPoint, sentence...
请确认后我再继续。"

用户: "确认，继续"

Claude Code: "好的，开始创建..."
```

---

## 5️⃣ 出错恢复规范

### 出错时的处理流程

#### 步骤 1：立即停止
```
发现问题后：
❌ 不要继续操作
❌ 不要试图自己修复
❌ 不要删除文件
✅ 立即停止所有操作
```

#### 步骤 2：报告问题
```
告诉用户：
1. 发生了什么错误
2. 错误信息是什么
3. 你做了什么操作导致的
4. 当前项目状态
```

**示例：**
```
Claude Code:
"我遇到了问题！

错误: 我不小心删除了 src/types/ 文件夹

操作: 我在尝试重构代码时执行了 rm 命令

当前状态: 
- types 文件夹已被删除
- 但代码还没有提交
- 最后一次提交是 abc123 (完成 IndexedDB 配置)

需要帮助回滚。"
```

#### 步骤 3：等待指示
```
用户会告诉你：
- 是否需要回滚
- 回滚到哪个提交
- 如何修复问题
```

### 回滚操作

#### 回滚到上一次提交（未 push）
```bash
# 放弃所有未提交的修改
git checkout .

# 或者只恢复特定文件
git checkout -- src/path/to/file.ts
```

#### 回滚到指定提交（已 push）
```bash
# 1. 查看提交历史
git log --oneline

# 输出示例：
# abc123 feat: 完成 IndexedDB 配置
# def456 feat: 创建类型定义
# ghi789 feat: 初始化项目

# 2. 回滚到指定提交
git reset --hard abc123

# 3. 强制推送（覆盖远程错误版本）
git push -f origin main
```

#### 只撤销最后一次提交
```bash
# 撤销提交，但保留修改
git reset --soft HEAD~1

# 撤销提交，丢弃修改
git reset --hard HEAD~1
```

### 常见错误场景

#### 场景 1：删除了重要文件
```bash
# 如果还没提交
git checkout -- src/deleted-file.ts

# 如果已经提交
git log --oneline  # 找到删除前的 commit
git reset --hard [commit-hash]
```

#### 场景 2：修改错了文件
```bash
# 恢复单个文件到最后一次提交
git checkout -- src/wrong-file.ts

# 恢复所有文件
git checkout .
```

#### 场景 3：提交了错误代码
```bash
# 撤销最后一次提交
git reset --hard HEAD~1
git push -f origin [分支名]
```

#### 场景 4：合并冲突
```bash
# 放弃合并
git merge --abort

# 或者选择保留某一方的更改
git checkout --ours [文件名]   # 保留当前分支
git checkout --theirs [文件名] # 保留要合并的分支
```

---

## 6️⃣ 沟通规范

### 主动报告进度
```
完成每个功能后，主动告诉用户：
"✅ [功能名称] 已完成
- 已提交到 GitHub (commit: abc123)
- 已更新 claude.md
- 测试通过

下一步: [下一个功能]
要继续吗？"
```

### 遇到问题时
```
"⚠️ 遇到问题

问题: [描述问题]
错误信息: [如果有的话]
我的想法: [你认为的解决方案]

需要你的指示。"
```

### 不确定时
```
"🤔 需要确认

我准备: [你要做的操作]
原因: [为什么要这么做]
影响: [会影响哪些文件]

请确认是否继续。"
```

### 完成阶段性工作时
```
"🎉 [Phase/模块] 完成！

已完成:
- [功能列表]

验收结果:
- [x] 测试项1
- [x] 测试项2

GitHub: [最新 commit hash]
claude.md: 已更新

准备好进入下一阶段。"
```

---

## 7️⃣ 最佳实践

### ✅ 好的习惯

#### 1. 小步提交
```bash
# ✅ 好 - 每个功能一个提交
git commit -m "feat: 创建 Sentence 类型定义"
git commit -m "feat: 创建 Lesson 类型定义"
git commit -m "feat: 创建 Grammar 类型定义"

# ❌ 差 - 一次性提交所有
git commit -m "feat: 创建所有类型定义"
```

#### 2. 描述清晰
```bash
# ✅ 好 - 清楚说明做了什么
git commit -m "feat(study): 实现 StudyCard 组件，支持语法点高亮和音频播放"

# ❌ 差 - 含糊不清
git commit -m "update component"
```

#### 3. 及时更新日志
```markdown
# ✅ 好 - 每完成一个就更新
- [x] 创建 Sentence 类型 (提交: abc123)
- [x] 创建 Lesson 类型 (提交: def456)
- [ ] 创建 Grammar 类型

# ❌ 差 - 做完很多才更新
- [x] 创建所有类型定义 (提交: ???)
```

#### 4. 先检查再操作
```
✅ 好的流程：
1. 查看 claude.md
2. 确认功能状态
3. 检查文件是否存在
4. 开始实现
5. 提交代码
6. 更新 claude.md

❌ 差的流程：
1. 直接开始写代码
2. 忘记提交
3. 忘记更新日志
4. 不知道自己做到哪了
```

### ❌ 避免的错误

#### 1. 不要一次性做太多
```
❌ 一口气实现10个组件再提交
✅ 每实现一个组件就提交
```

#### 2. 不要忘记更新 claude.md
```
❌ 做完所有工作才更新日志
✅ 每完成一个功能就更新
```

#### 3. 不要在不确定时继续
```
❌ "好像应该这样做..."（然后就做了）
✅ "我不确定，先问一下用户"
```

#### 4. 不要试图自己修复错误
```
❌ "我删错文件了，我试试能不能恢复..."
✅ "我删错文件了，立即停止，请求帮助"
```

---

## 8️⃣ 检查清单

### 开始开发前
- [ ] 已创建 GitHub 仓库
- [ ] 已克隆到本地
- [ ] 已创建 claude.md 文件
- [ ] 已创建 .gitignore 文件
- [ ] 已阅读并理解防错规范

### 每个功能开发时
- [ ] 查看 claude.md 确认功能状态
- [ ] 检查文件是否已存在
- [ ] 确认没有类似功能
- [ ] 实现功能
- [ ] 测试功能
- [ ] 提交到 GitHub
- [ ] 更新 claude.md

### 每天结束时
- [ ] 所有代码已提交
- [ ] claude.md 已更新
- [ ] 没有未完成的修改
- [ ] 项目可以正常运行

### 每个 Phase 完成时
- [ ] 所有功能已完成
- [ ] 所有测试已通过
- [ ] claude.md 已完整更新
- [ ] 已创建检查点
- [ ] 已通知用户完成情况

---

## 9️⃣ 快速参考

### 常用命令速查

```bash
# 提交代码
git add .
git commit -m "feat: XXX"
git push origin main

# 查看状态
git status
git log --oneline

# 回滚操作
git checkout .                    # 放弃所有未提交修改
git checkout -- [文件名]          # 放弃单个文件修改
git reset --hard HEAD~1           # 撤销最后一次提交
git reset --hard [commit-hash]    # 回滚到指定提交

# 分支操作
git branch                        # 查看分支
git checkout -b feature/study     # 创建并切换分支
git checkout main                 # 切换到主分支
git merge feature/study           # 合并分支

# 查看历史
git log --oneline                 # 简洁历史
git log --oneline -10             # 最近10条
git show [commit-hash]            # 查看具体提交
```

### 状态标记速查

| 标记 | 含义 |
|------|------|
| `[ ]` | 未开始 |
| `[x]` | 已完成 |
| `⏳` | 进行中 |
| `✅` | 已验证 |
| `⚠️` | 有问题 |
| `⏸️` | 暂停 |

### Commit 类型速查

| 类型 | 用途 |
|------|------|
| `feat` | 新功能 |
| `fix` | 修复bug |
| `refactor` | 重构 |
| `docs` | 文档 |
| `style` | 格式 |
| `test` | 测试 |
| `chore` | 构建 |

---

## 🎯 记住这三点

### 1. 做完就存
```
完成功能 → 立即 git push
```

### 2. 记录进度
```
提交代码 → 立即更新 claude.md
```

### 3. 出错能救
```
发现问题 → 立即停止 → git reset
```

---

## 📞 需要帮助？

如果遇到任何问题：
1. 立即停止当前操作
2. 查看 claude.md 了解最后的正常状态
3. 告诉用户具体问题
4. 等待指示

**永远记住：因为每一步都有备份，所以永远不怕出错！**
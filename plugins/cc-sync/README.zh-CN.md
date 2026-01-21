# cc-sync

一个用于通过 Git 同步 Claude Code 配置文件的 Claude Code 插件，支持 Git LFS 和自定义同步模式。

中文 | [**English**](README.md)

## 功能特性

- **三种同步模式**：可选择基础模式（仅配置文件）、全面模式（配置文件 + 插件 + 缓存）或自定义模式（用户定义）
- **Git LFS 支持**：在全面模式下自动使用 Git LFS 处理大型缓存文件
- **自动同步**：通过 Hooks 在会话开始时自动拉取配置，会话结束时自动推送配置
- **手动命令**：提供初始化、推送、拉取、状态、模式管理和自定义项目管理的完整控制
- **MCP Server**：提供同步操作的底层工具
- **安全可靠**：检测冲突，不执行自动合并

## 安装

### 前置要求

1. **Git**：所有模式都需要
2. **Git LFS**（全面模式推荐使用）：用于处理大型缓存文件
   - Windows: 随 Git for Windows 一起安装
   - macOS: `brew install git-lfs && git lfs install`
   - Linux: 从 https://git-lfs.github.com/ 下载

### 安装插件

1. 克隆此仓库：
```bash
git clone https://github.com/your-username/cc-sync.git
cd cc-sync
```

2. 安装依赖：
```bash
cd mcp-server
npm install
npm run build
```

3. 将插件添加到 Claude Code：
```bash
claude plugin install /path/to/cc-sync
```

或者安装到用户级别（所有项目可用）：
```bash
claude plugin install /path/to/cc-sync --scope user
```

## 使用方法

### 初始化设置

1. 使用同步模式初始化同步仓库：
```
# 基础模式（仅配置文件）- 推荐日常使用
/cc-sync:init ~/claude-config-sync

# 全面模式（配置文件 + 插件 + 缓存，含 LFS）- 完整备份
/cc-sync:init ~/claude-config-sync full

# 自定义模式（用户定义同步列表）- 最大灵活性
/cc-sync:init ~/claude-config-sync custom

# 禁用 LFS 的全面模式
/cc-sync:init ~/claude-config-sync full useLFS=false
```

2. 添加远程 Git 仓库：
```bash
cd ~/claude-config-sync
git remote add origin https://github.com/your-username/claude-configs.git
git branch -M main
git push -u origin main
```

### 手动命令

**核心命令：**
- `/cc-sync:init [repoPath] [mode] [useLFS]` - 初始化同步仓库
- `/cc-sync:push [mode]` - 推送配置到同步仓库
- `/cc-sync:pull [mode]` - 从同步仓库拉取配置
- `/cc-sync:status` - 显示同步状态

**模式管理：**
- `/cc-sync:setMode mode=<basic|full|custom> [useLFS=true|false]` - 更改同步模式
- `/cc-sync:getMode` - 查看当前模式和同步列表

**自定义模式命令：**
- `/cc-sync:addCustomItem path=<path> type=<file|dir> [optional=true|false] [useLFS=true|false]`
- `/cc-sync:removeCustomItem path=<path>`
- `/cc-sync:listCustomItems`

### 自动同步

插件包含以下 Hooks：
- **Pull**：Claude Code 启动时拉取配置（SessionStart hook）
- **Push**：Claude Code 退出时推送配置（SessionEnd hook）

## 同步模式

### 基础模式 (Basic，默认)

仅同步核心配置文件：

| 文件/目录 | 描述 |
|----------------|-------------|
| `~/.claude/settings.json` | 全局设置 |
| `~/.claude/CLAUDE.md` | 项目记忆 |
| `~/.claude.json` | MCP 服务器配置 |
| `~/.claude/agents/` | 自定义子代理 |
| `~/.claude/skills/` | 自定义技能 |

**适用场景**：日常使用、快速同步、最小存储

### 全面模式 (Full)

同步基础模式的所有内容，以及：

| 文件/目录 | 描述 |
|----------------|-------------|
| `~/.claude/plugins/` | 已安装的插件 |
| `~/.claude/plugins-cache/` | 插件市场缓存 |
| `~/.claude/cache/` **[LFS]** | 应用缓存（使用 Git LFS） |
| `~/.claude/sessions/` **[LFS]** | 会话历史（使用 Git LFS） |
| `~/.claude/plans/` | 计划文件 |
| `~/.claude/state/` **[LFS]** | 应用状态（使用 Git LFS） |
| `~/.claude/hooks/` | Hook 配置 |
| `~/.claude/mcp-servers/` | MCP 服务器 |

**[LFS]** 标记表示该项目使用 Git LFS 进行跟踪，适合大文件和二进制文件。

**适用场景**：完整备份、多机器完全一致

### 自定义模式 (Custom)

允许你精确选择要同步的文件和目录。

**适用场景**：精确控制同步内容

#### 自定义模式工作流

```
# 1. 切换到自定义模式
/cc-sync:setMode mode=custom

# 2. 添加你想要同步的项目
/cc-sync:addCustomItem path=settings.json type=file
/cc-sync:addCustomItem path=.claude.json type=file
/cc-sync:addCustomItem path=plugins type=dir
/cc-sync:addCustomItem path=agents type=dir
/cc-sync:addCustomItem path=skills type=dir

# 3. 添加缓存（使用 LFS 处理大文件）
/cc-sync:addCustomItem path=cache type=dir useLFS=true
/cc-sync:addCustomItem path=sessions type=dir useLFS=true

# 4. 查看自定义列表
/cc-sync:listCustomItems

# 5. 移除不需要的项目
/cc-sync:removeCustomItem path=sessions

# 6. 推送同步
/cc-sync:push
```

## 模式对比

| 功能 | 基础模式 | 全面模式 | 自定义模式 |
|---------|-------|------|--------|
| 配置文件 | ✓ | ✓ | 用户选择 |
| 代理和技能 | ✓ | ✓ | 用户选择 |
| 插件 | ✗ | ✓ | 用户选择 |
| 缓存和会话 | ✗ | ✓ (LFS) | 用户选择 |
| LFS 支持 | ✗ | 自动（缓存） | 可选 |
| 存储大小 | 小 | 大 | 可变 |
| 同步速度 | 快 | 较慢 | 可变 |
| 使用场景 | 日常使用 | 完整备份 | 精确控制 |

## Git LFS

Git LFS (Large File Storage) 用于高效处理大文件，如缓存和会话数据。

**优势**：
- 减小 Git 仓库大小
- 更快的克隆和拉取速度
- 大文件单独存储

**全面模式中使用 LFS 的项目**：
- `~/.claude/cache/` - 应用缓存
- `~/.claude/sessions/` - 会话历史
- `~/.claude/state/` - 应用状态

**设置**：
- 使用全面模式时会自动配置 LFS（如果已安装 Git LFS）
- 可以在初始化时使用 `useLFS=false` 禁用 LFS
- 自定义模式下，添加项目时使用 `useLFS=true` 启用 LFS

## 配置说明

同步配置存储在 `~/.cc-sync-config.json` 中：

```json
{
  "syncRepoPath": "/path/to/sync/repo",
  "initialized": true,
  "syncMode": "basic",  // 或 "full" 或 "custom"
  "useLFS": true,       // 是否启用 LFS
  "customItems": [...]  // 仅自定义模式使用
}
```

## 项目结构

```
cc-sync/
├── .claude-plugin/
│   └── plugin.json          # 插件清单文件
├── commands/
│   ├── init.md              # 初始化同步仓库
│   ├── push.md              # 推送配置
│   ├── pull.md              # 拉取配置
│   ├── status.md            # 显示状态
│   ├── setMode.md           # 设置同步模式
│   ├── getMode.md           # 获取当前模式
│   ├── addCustomItem.md     # 添加自定义同步项
│   ├── removeCustomItem.md  # 移除自定义项
│   └── listCustomItems.md   # 列出自定义项
├── hooks/
│   └── hooks.json           # 自动同步钩子配置
├── mcp-server/
│   ├── src/
│   │   └── index.ts         # MCP Server 实现
│   ├── dist/                # 编译后的 JavaScript 文件
│   ├── package.json
│   └── tsconfig.json
├── .mcp.json                # MCP Server 配置
├── README.md                # 英文文档
└── README.zh-CN.md          # 中文文档
```

## 开发

1. 在 `mcp-server/src/` 中修改 TypeScript 源代码
2. 重新构建：`cd mcp-server && npm run build`
3. 重新加载 Claude Code 或重新安装插件

## 故障排除

### "Git LFS is not installed"（未安装 Git LFS）
从 https://git-lfs.github.com/ 安装 Git LFS
或在初始化/设置模式时使用 `useLFS=false`

### "Sync not initialized"（未初始化同步）
先运行 `/cc-sync:init` 来设置同步仓库

### Push 失败，提示 "no remote"（无远程仓库）
为同步仓库添加远程地址：
```bash
cd ~/claude-config-sync
git remote add origin <your-repo-url>
git push -u origin main
```

### 合并冲突
在同步仓库中手动解决冲突：
```bash
cd ~/claude-config-sync
# 解决冲突
git add .
git commit
```

### 自定义模式不工作？
确保已添加项目到自定义列表：
```
/cc-sync:listCustomItems
```

## 工作原理

1. **初始化**：`init` 命令在指定位置创建一个 Git 仓库
2. **Git LFS**：对于标记的项目，自动配置 `.gitattributes` 使用 LFS 跟踪
3. **推送**：`push` 命令根据同步模式复制文件，提交并推送到远程
4. **拉取**：`pull` 命令从远程拉取（包括 LFS 文件），然后复制到 `~/.claude/`
5. **自动同步**：Hooks 在会话开始和结束时自动调用 pull 和 push 操作

## 许可证

MIT

## 贡献

欢迎贡献！请随时提交 Pull Request。

## 相关资源

- [Claude Code 官方文档](https://code.claude.com/docs/en/settings)
- [Claude Code 插件开发指南](https://xiaolaiwo.com/archives/1473.html)
- [Git LFS 文档](https://git-lfs.github.com/)

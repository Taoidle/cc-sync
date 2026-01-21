---
description: 初始化配置同步仓库 - Initialize the sync repository for Claude Code configurations
---

# 初始化配置同步 (Initialize Sync)

请使用 MCP Server 的 `init` 工具来初始化配置同步仓库。

## 参数 (Parameters)

- `repoPath` (必需): 同步仓库的路径，例如 `~/claude-config-sync` 或绝对路径
- `mode` (可选): 同步模式
  - `basic` (默认): 仅同步配置文件
  - `full`: 全面同步，包括配置文件、插件、缓存和市场数据
  - `custom`: 自定义同步，允许用户选择要同步的文件和目录
- `useLFS` (可选): 是否启用 Git LFS（默认：full 模式为 true）

## 同步模式说明 (Sync Modes)

### Basic 模式 (默认)
仅同步核心配置文件：
- `~/.claude/settings.json` - 全局设置
- `~/.claude/CLAUDE.md` - 项目记忆
- `~/.claude.json` - MCP 服务器配置
- `~/.claude/agents/` - 自定义代理
- `~/.claude/skills/` - 自定义技能

### Full 模式
全面同步所有数据（包括 Basic 模式的所有内容）：
- `~/.claude/plugins/` - 已安装的插件
- `~/.claude/plugins-cache/` - 插件市场缓存
- `~/.claude/cache/` **[LFS]** - 应用缓存（使用 Git LFS）
- `~/.claude/sessions/` **[LFS]** - 会话历史（使用 Git LFS）
- `~/.claude/plans/` - 计划文件
- `~/.claude/state/` **[LFS]** - 应用状态（使用 Git LFS）
- `~/.claude/hooks/` - Hook 配置
- `~/.claude/mcp-servers/` - MCP 服务器

**[LFS]** 标记表示该项目使用 Git LFS 进行跟踪，适合大文件和二进制文件。

### Custom 模式
允许用户自定义要同步的文件和目录列表。使用 `addCustomItem`、`removeCustomItem` 和 `listCustomItems` 命令管理。

## Git LFS 说明

Git LFS (Large File Storage) 用于跟踪大文件，如缓存和会话数据。

**启用 LFS 的优势**：
- 减小 Git 仓库大小
- 更快的克隆和拉取速度
- 大文件单独存储

**安装 Git LFS**：
- Windows: `git lfs install`（通过 Git for Windows 安装）
- macOS: `brew install git-lfs && git lfs install`
- Linux: 从 https://git-lfs.github.com/ 下载

## 使用示例 (Examples)

```
# 使用默认 basic 模式初始化
/cc-sync:init ~/claude-config-sync

# 使用 full 模式初始化（全面同步，含 LFS）
/cc-sync:init ~/claude-config-sync full

# 使用 custom 模式初始化
/cc-sync:init ~/claude-config-sync custom

# 禁用 LFS 的 full 模式
/cc-sync:init ~/claude-config-sync full useLFS=false
```

## 初始化后步骤 (Next Steps)

1. 添加远程仓库：
```bash
cd ~/claude-config-sync
git remote add origin <your-repo-url>
```

2. 推送到远程：
```bash
git branch -M main
git push -u origin main
```

## 自定义模式工作流

如果是 custom 模式，初始化后：

```
# 添加你想要同步的项目
/cc-sync:addCustomItem path=settings.json type=file
/cc-sync:addCustomItem path=plugins type=dir
/cc-sync:addCustomItem path=cache type=dir useLFS=true

# 查看自定义列表
/cc-sync:listCustomItems

# 移除不需要的项目
/cc-sync:removeCustomItem path=sessions

# 然后推送配置
/cc-sync:push
```

## 注意事项

- 你可以随时使用 `/cc-sync:setMode` 切换同步模式
- Full 模式会同步更多数据，建议使用 Git LFS
- Custom 模式提供最大的灵活性
- 切换到 custom 模式后，需要使用 addCustomItem 添加同步项

---

Please use the `init` tool from the cc-sync MCP Server to initialize the sync repository.

## Parameters

- `repoPath` (required): Path for the sync repository, e.g., `~/claude-config-sync` or absolute path
- `mode` (optional): Sync mode
  - `basic` (default): Sync configuration files only
  - `full`: Full sync including configs, plugins, cache, and marketplace data
  - `custom`: Custom sync allowing user to choose files and directories
- `useLFS` (optional): Enable Git LFS (default: true for full mode)

## Sync Modes

### Basic Mode (default)
Only syncs core configuration files:
- `~/.claude/settings.json` - Global settings
- `~/.claude/CLAUDE.md` - Project memory
- `~/.claude.json` - MCP servers configuration
- `~/.claude/agents/` - Custom agents
- `~/.claude/skills/` - Custom skills

### Full Mode
Full sync of all data (including everything from Basic mode):
- `~/.claude/plugins/` - Installed plugins
- `~/.claude/plugins-cache/` - Plugin marketplace cache
- `~/.claude/cache/` **[LFS]** - Application cache (using Git LFS)
- `~/.claude/sessions/` **[LFS]** - Session history (using Git LFS)
- `~/.claude/plans/` - Plan files
- `~/.claude/state/` **[LFS]** - Application state (using Git LFS)
- `~/.claude/hooks/` - Hook configuration
- `~/.claude/mcp-servers/` - MCP servers

**[LFS]** marker indicates the item uses Git LFS for tracking, suitable for large and binary files.

### Custom Mode
Allows users to customize the list of files and directories to sync. Use `addCustomItem`, `removeCustomItem`, and `listCustomItems` commands to manage.

## Git LFS Information

Git LFS (Large File Storage) is used to track large files like cache and session data.

**Benefits of LFS**:
- Smaller Git repository size
- Faster clone and pull speeds
- Large files stored separately

**Install Git LFS**:
- Windows: `git lfs install` (via Git for Windows)
- macOS: `brew install git-lfs && git lfs install`
- Linux: Download from https://git-lfs.github.com/

## Examples

```
# Initialize with default basic mode
/cc-sync:init ~/claude-config-sync

# Initialize with full mode (complete sync with LFS)
/cc-sync:init ~/claude-config-sync full

# Initialize with custom mode
/cc-sync:init ~/claude-config-sync custom

# Full mode without LFS
/cc-sync:init ~/claude-config-sync full useLFS=false
```

## Next Steps After Initialization

1. Add a remote repository:
```bash
cd ~/claude-config-sync
git remote add origin <your-repo-url>
```

2. Push to remote:
```bash
git branch -M main
git push -u origin main
```

## Custom Mode Workflow

For custom mode, after initialization:

```
# Add items you want to sync
/cc-sync:addCustomItem path=settings.json type=file
/cc-sync:addCustomItem path=plugins type=dir
/cc-sync:addCustomItem path=cache type=dir useLFS=true

# List custom items
/cc-sync:listCustomItems

# Remove unwanted items
/cc-sync:removeCustomItem path=sessions

# Then push configs
/cc-sync:push
```

## Notes

- You can change sync mode anytime with `/cc-sync:setMode`
- Full mode syncs more data, Git LFS is recommended
- Custom mode provides maximum flexibility
- After switching to custom mode, use addCustomItem to add sync items

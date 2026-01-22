---
description: 查看配置同步状态 - Show current synchronization status
allowed-tools: [Bash, Read]
---

# 同步状态 (Sync Status)

查看当前配置同步状态。优先使用 cc-sync MCP 服务器，如果不可用则直接执行 Git 命令。

## 执行步骤

### 方法 1：使用 MCP 服务器（优先）

1. 调用 cc-sync MCP 服务器的 `status` 工具（不需要参数）
2. 显示返回的状态信息

### 方法 2：备用实现（MCP 服务器不可用时）

1. 读取配置文件 `~/.cc-sync-config.json`
2. 检查配置是否存在，如果不存在则提示用户先运行 `/cc-sync:init`
3. 获取 `syncRepoPath`（同步仓库路径）
4. 在同步仓库目录执行以下 Git 命令：
   - `git status --short` - 查看本地更改
   - `git branch --show-current` - 查看当前分支
   - `git remote get-url origin` - 查看远程仓库 URL
   - `git log @{u}.. 2>/dev/null` - 查看未推送的提交
   - `git log ..@{u} 2>/dev/null` - 查看未拉取的提交
5. 解析并显示状态信息

## 显示信息包括

- 同步仓库路径
- 当前同步模式 (basic/full/custom)
- Git LFS 状态
- 当前 Git 分支
- 远程仓库 URL
- 本地未提交的更改
- 未推送的提交数量
- 未拉取的提交数量

## 示例

```
/cc-sync:status
```

## 备用实现命令

如果 MCP 服务器不可用，执行：

```bash
# 读取配置
CONFIG_FILE="$HOME/.cc-sync-config.json"

# 检查配置是否存在
if [ ! -f "$CONFIG_FILE" ]; then
  echo "错误: 未初始化同步。请先运行 /cc-sync:init"
  exit 1
fi

# 获取同步仓库路径
SYNC_REPO=$(grep -o '"syncRepoPath":"[^"]*"' "$CONFIG_FILE" | cut -d'"' -f4)

# 获取同步模式
SYNC_MODE=$(grep -o '"syncMode":"[^"]*"' "$CONFIG_FILE" | cut -d'"' -f4)

# 检查仓库是否存在
if [ ! -d "$SYNC_REPO/.git" ]; then
  echo "错误: 同步仓库不存在: $SYNC_REPO"
  exit 1
fi

# 显示状态
cd "$SYNC_REPO"
echo "=== 同步状态 ==="
echo "仓库路径: $SYNC_REPO"
echo "同步模式: $SYNC_MODE"
echo "当前分支: $(git branch --show-current)"
echo "远程仓库: $(git remote get-url origin 2>/dev/null || echo '未配置')"
echo "本地更改: $(git status --short | wc -l) 个文件"
```

---

Use the `status` tool from the cc-sync MCP Server to show the current synchronization status. Falls back to direct Git commands if MCP server is unavailable.

## Instructions

### Method 1: Using MCP Server (preferred)

1. Call the `status` tool from the cc-sync MCP Server (no parameters needed)
2. Display the status information

### Method 2: Fallback Implementation (when MCP server is unavailable)

1. Read config file `~/.cc-sync-config.json`
2. Check if config exists, if not prompt user to run `/cc-sync:init` first
3. Get `syncRepoPath` (sync repository path)
4. In the sync repository directory, execute:
   - `git status --short` - local changes
   - `git branch --show-current` - current branch
   - `git remote get-url origin` - remote repository URL
   - `git log @{u}.. 2>/dev/null` - unpushed commits
   - `git log ..@{u} 2>/dev/null` - unpulled commits
5. Parse and display status information

## Displayed Information

- Sync repository path
- Current sync mode (basic/full/custom)
- Git LFS status
- Current Git branch
- Remote repository URL
- Local uncommitted changes
- Number of unpushed commits
- Number of unpulled commits

## Examples

```
/cc-sync:status
```

## Fallback Implementation Commands

If MCP server is unavailable, execute:

```bash
# Read config
CONFIG_FILE="$HOME/.cc-sync-config.json"

# Check if config exists
if [ ! -f "$CONFIG_FILE" ]; then
  echo "Error: Sync not initialized. Please run /cc-sync:init first"
  exit 1
fi

# Get sync repo path
SYNC_REPO=$(grep -o '"syncRepoPath":"[^"]*"' "$CONFIG_FILE" | cut -d'"' -f4)

# Get sync mode
SYNC_MODE=$(grep -o '"syncMode":"[^"]*"' "$CONFIG_FILE" | cut -d'"' -f4)

# Check if repo exists
if [ ! -d "$SYNC_REPO/.git" ]; then
  echo "Error: Sync repository does not exist: $SYNC_REPO"
  exit 1
fi

# Display status
cd "$SYNC_REPO"
echo "=== Sync Status ==="
echo "Repository: $SYNC_REPO"
echo "Sync mode: $SYNC_MODE"
echo "Current branch: $(git branch --show-current)"
echo "Remote: $(git remote get-url origin 2>/dev/null || echo 'not configured')"
echo "Local changes: $(git status --short | wc -l) files"
```

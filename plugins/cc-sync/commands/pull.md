---
description: 从同步仓库拉取 Claude Code 配置 - Pull Claude Code configurations from sync repository
argument-hint: [mode=<basic|full|custom>]
allowed-tools: [Bash, Read, Glob, Write]
---

# 拉取配置 (Pull Configs)

从同步仓库拉取 Claude Code 配置。优先使用 cc-sync MCP 服务器，如果不可用则直接执行 Git 和文件复制操作。

## 执行步骤

### 方法 1：使用 MCP 服务器（优先）

1. 解析可选参数：
   - `mode`：覆盖此次拉取的同步模式

2. 调用 cc-sync MCP 服务器的 `pull` 工具，传递解析的参数

3. 显示返回的拉取结果

### 方法 2：备用实现（MCP 服务器不可用时）

1. 读取配置文件 `~/.cc-sync-config.json`
2. 检查配置是否存在，如果不存在则提示用户先运行 `/cc-sync:init`
3. 获取同步仓库路径和模式
4. 在同步仓库目录执行 Git pull
5. 如果配置了 Git LFS，执行 `git lfs pull`
6. 根据模式将配置文件从同步仓库复制到 `~/.claude/` 目录：
   - **basic**: settings.json, CLAUDE.md, .claude.json, agents/, skills/
   - **full**: 包括 plugins/, plugins-cache/, cache/, sessions/, plans/, state/, hooks/, mcp-servers/
   - **custom**: 复制 customItems 中定义的项目

## 功能说明

这个命令会：
1. 从远程仓库拉取最新更改（如果配置了）
2. 根据 sync mode 将配置文件从同步仓库复制到 `~/.claude/` 目录

**注意**：这会覆盖你本地的配置文件！如有冲突，请先手动备份。

## 参数

- `mode`（可选）：`basic`、`full` 或 `custom`，默认使用当前配置的模式

## 示例

```
# 使用当前配置的模式拉取
/cc-sync:pull

# 使用 full 模式拉取
/cc-sync:pull mode=full
```

## 备用实现脚本

如果 MCP 服务器不可用，执行：

```bash
#!/bin/bash
CONFIG_FILE="$HOME/.cc-sync-config.json"
MODE=""  # 可选，从参数获取

# 检查配置
if [ ! -f "$CONFIG_FILE" ]; then
  echo "错误: 未初始化同步。请先运行 /cc-sync:init"
  exit 1
fi

# 获取配置
SYNC_REPO=$(grep -o '"syncRepoPath":"[^"]*"' "$CONFIG_FILE" | cut -d'"' -f4)
CONFIG_MODE=$(grep -o '"syncMode":"[^"]*"' "$CONFIG_FILE" | cut -d'"' -f4)
USE_LFS=$(grep -o '"useLFS":\w*' "$CONFIG_FILE" | cut -d':' -f2)

# 使用参数模式或配置模式
MODE="${MODE:-$CONFIG_MODE}"

# 检查仓库
if [ ! -d "$SYNC_REPO/.git" ]; then
  echo "错误: 同步仓库不存在: $SYNC_REPO"
  exit 1
fi

CLAUDE_DIR="$HOME/.claude"
mkdir -p "$CLAUDE_DIR"

cd "$SYNC_REPO"

# 拉取最新更改
git pull
if [ "$USE_LFS" = "true" ]; then
  git lfs pull 2>/dev/null || echo "提示: Git LFS 拉取失败（可能未配置 LFS）"
fi

# 根据模式复制文件
copy_from_repo() {
  local mode="$1"
  local claude_dir="$2"
  local sync_repo="$3"

  case "$mode" in
    basic)
      # 复制核心配置文件
      [ -f "$sync_repo/.claude/settings.json" ] && cp "$sync_repo/.claude/settings.json" "$claude_dir/"
      [ -f "$sync_repo/.claude/CLAUDE.md" ] && cp "$sync_repo/.claude/CLAUDE.md" "$claude_dir/"
      [ -f "$sync_repo/.claude.json" ] && cp "$sync_repo/.claude.json" "$HOME/"
      [ -d "$sync_repo/.claude/agents" ] && cp -r "$sync_repo/.claude/agents"/* "$claude_dir/agents/" 2>/dev/null
      [ -d "$sync_repo/.claude/skills" ] && cp -r "$sync_repo/.claude/skills"/* "$claude_dir/skills/" 2>/dev/null
      ;;
    full)
      # 复制所有文件
      for dir in agents skills plugins plugins-cache plans hooks mcp-servers; do
        [ -d "$sync_repo/.claude/$dir" ] && mkdir -p "$claude_dir/$dir" && cp -r "$sync_repo/.claude/$dir"/* "$claude_dir/$dir/" 2>/dev/null
      done
      # 复制缓存目录
      for dir in cache sessions state; do
        [ -d "$sync_repo/.claude/$dir" ] && mkdir -p "$claude_dir/$dir" && cp -r "$sync_repo/.claude/$dir"/* "$claude_dir/$dir/" 2>/dev/null
      done
      # 复制根目录的 JSON 文件
      find "$sync_repo/.claude" -maxdepth 1 -name "*.json" -exec cp {} "$claude_dir/" \;
      ;;
    custom)
      # 从 customItems 读取并复制
      if command -v jq &> /dev/null; then
        jq -r '.customItems[].path' "$CONFIG_FILE" | while read -r path; do
          type=$(jq -r --arg p "$path" '.customItems[] | select(.path==$p) | .type' "$CONFIG_FILE")
          if [ "$type" = "dir" ]; then
            [ -d "$sync_repo/.claude/$path" ] && mkdir -p "$claude_dir/$path" && cp -r "$sync_repo/.claude/$path"/* "$claude_dir/$path/" 2>/dev/null
          else
            [ -f "$sync_repo/.claude/$path" ] && mkdir -p "$(dirname "$claude_dir/$path")" && cp "$sync_repo/.claude/$path" "$claude_dir/$path"
          fi
        done
      fi
      ;;
  esac
}

# 执行复制
copy_from_repo "$MODE" "$CLAUDE_DIR" "$SYNC_REPO"

echo "✓ 配置已拉取"
echo "模式: $MODE"
```

---

Use the `pull` tool from the cc-sync MCP Server to pull Claude Code configurations from the sync repository. Falls back to direct Git and file copy operations if MCP server is unavailable.

## Instructions

### Method 1: Using MCP Server (preferred)

1. Parse optional parameters:
   - `mode`: override sync mode for this pull

2. Call the `pull` tool from the cc-sync MCP Server with the parsed parameters

3. Display the pull result

### Method 2: Fallback Implementation (when MCP server is unavailable)

1. Read config file `~/.cc-sync-config.json`
2. Check if config exists, if not prompt user to run `/cc-sync:init` first
3. Get sync repository path and mode
4. Pull latest changes from remote repository (if configured)
5. If Git LFS is configured, execute `git lfs pull`
6. Copy configuration files from sync repository to `~/.claude/` directory based on sync mode:
   - **basic**: settings.json, CLAUDE.md, .claude.json, agents/, skills/
   - **full**: including plugins/, plugins-cache/, cache/, sessions/, plans/, state/, hooks/, mcp-servers/
   - **custom**: copy items defined in customItems

## What It Does

1. Pull latest changes from remote repository (if configured)
2. Copy configuration files from sync repository to `~/.claude/` directory based on sync mode

**Warning**: This will overwrite your local configuration files! If you have conflicts, please backup manually first.

## Parameters

- `mode` (optional): `basic`, `full`, or `custom`. Default: use currently configured mode

## Examples

```
# Pull with current mode
/cc-sync:pull

# Pull with full mode
/cc-sync:pull mode=full
```

---
description: 推送 Claude Code 配置到同步仓库 - Push Claude Code configurations to sync repository
argument-hint: [mode=<basic|full|custom>] [message=<commit message>]
allowed-tools: [Bash, Read, Glob, Write]
---

# 推送配置 (Push Configs)

推送 Claude Code 配置到同步仓库。优先使用 cc-sync MCP 服务器，如果不可用则直接执行 Git 和文件复制操作。

## 执行步骤

### 方法 1：使用 MCP 服务器（优先）

1. 解析可选参数：
   - `mode`：覆盖此次推送的同步模式
   - `message`：自定义提交消息

2. 调用 cc-sync MCP 服务器的 `push` 工具，传递解析的参数

3. 显示返回的推送结果

### 方法 2：备用实现（MCP 服务器不可用时）

1. 读取配置文件 `~/.cc-sync-config.json`
2. 检查配置是否存在，如果不存在则提示用户先运行 `/cc-sync:init`
3. 获取同步仓库路径和模式
4. 检查仓库是否有未提交的更改
5. 拉取最新更改（git pull）
6. 根据模式复制相应的配置文件到同步仓库：
   - **basic**: settings.json, CLAUDE.md, .claude.json, agents/, skills/
   - **full**: 包括 plugins/, plugins-cache/, cache/, sessions/, plans/, state/, hooks/, mcp-servers/
   - **custom**: 复制 customItems 中定义的项目
7. 添加并提交更改
8. 推送到远程仓库

## 功能说明

这个命令会：
1. 从同步仓库拉取最新更改（如果有远程仓库）
2. 根据 sync mode 复制相应的 Claude Code 配置文件到同步仓库
3. 创建 Git 提交
4. 推送到远程仓库（如果配置了）

## 参数

- `mode`（可选）：`basic`、`full` 或 `custom`，默认使用当前配置的模式
- `message`（可选）：自定义提交消息

## 示例

```
# 使用当前配置的模式推送
/cc-sync:push

# 使用 full 模式推送
/cc-sync:push mode=full

# 使用自定义提交消息
/cc-sync:push message="更新配置"
```

## 备用实现脚本

如果 MCP 服务器不可用，执行：

```bash
#!/bin/bash
CONFIG_FILE="$HOME/.cc-sync-config.json"
MODE=""  # 可选，从参数获取
MESSAGE=""  # 可选，从参数获取

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
cd "$SYNC_REPO"

# 拉取最新更改
git pull || echo "警告: 拉取失败（可能没有远程仓库）"

# 根据模式复制文件
copy_files() {
  local mode="$1"
  local claude_dir="$2"
  local sync_repo="$3"

  case "$mode" in
    basic)
      # 复制核心配置文件
      [ -f "$claude_dir/settings.json" ] && cp "$claude_dir/settings.json" "$sync_repo/.claude/"
      [ -f "$claude_dir/CLAUDE.md" ] && cp "$claude_dir/CLAUDE.md" "$sync_repo/.claude/"
      [ -f "$HOME/.claude.json" ] && cp "$HOME/.claude.json" "$sync_repo/"
      [ -d "$claude_dir/agents" ] && cp -r "$claude_dir/agents" "$sync_repo/.claude/"
      [ -d "$claude_dir/skills" ] && cp -r "$claude_dir/skills" "$sync_repo/.claude/"
      ;;
    full)
      # 复制所有文件
      find "$claude_dir" -maxdepth 1 -name "*.json" -exec cp {} "$sync_repo/.claude/" \;
      for dir in agents skills plugins plugins-cache plans hooks mcp-servers; do
        [ -d "$claude_dir/$dir" ] && cp -r "$claude_dir/$dir" "$sync_repo/.claude/"
      done
      # 复制缓存目录（如果存在）
      for dir in cache sessions state; do
        [ -d "$claude_dir/$dir" ] && cp -r "$claude_dir/$dir" "$sync_repo/.claude/"
      done
      ;;
    custom)
      # 从 customItems 读取并复制
      # 需要解析 JSON 或使用 jq
      if command -v jq &> /dev/null; then
        jq -r '.customItems[].path' "$CONFIG_FILE" | while read -r path; do
          type=$(jq -r --arg p "$path" '.customItems[] | select(.path==$p) | .type' "$CONFIG_FILE")
          if [ "$type" = "dir" ]; then
            [ -d "$claude_dir/$path" ] && cp -r "$claude_dir/$path" "$sync_repo/.claude/"
          else
            [ -f "$claude_dir/$path" ] && cp "$claude_dir/$path" "$sync_repo/.claude/"
          fi
        done
      fi
      ;;
  esac
}

# 执行复制
mkdir -p "$SYNC_REPO/.claude"
copy_files "$MODE" "$CLAUDE_DIR" "$SYNC_REPO"

# 提交和推送
git add .
COMMIT_MSG="${MESSAGE:-chore: sync Claude Code configs ($MODE) - $(date -u +"%Y-%m-%dT%H:%M:%SZ")}"
git commit -m "$COMMIT_MSG"
git push

echo "✓ 配置已推送"
```

---

Use the `push` tool from the cc-sync MCP Server to push Claude Code configurations to the sync repository. Falls back to direct Git and file copy operations if MCP server is unavailable.

## Instructions

### Method 1: Using MCP Server (preferred)

1. Parse optional parameters:
   - `mode`: override sync mode for this push
   - `message`: custom commit message

2. Call the `push` tool from the cc-sync MCP Server with the parsed parameters

3. Display the push result

### Method 2: Fallback Implementation (when MCP server is unavailable)

1. Read config file `~/.cc-sync-config.json`
2. Check if config exists, if not prompt user to run `/cc-sync:init` first
3. Get sync repository path and mode
4. Check for uncommitted changes in repository
5. Pull latest changes (git pull)
6. Copy config files to sync repository based on mode:
   - **basic**: settings.json, CLAUDE.md, .claude.json, agents/, skills/
   - **full**: including plugins/, plugins-cache/, cache/, sessions/, plans/, state/, hooks/, mcp-servers/
   - **custom**: copy items defined in customItems
7. Add and commit changes
8. Push to remote repository

## What It Does

1. Pull latest changes from sync repository (if remote configured)
2. Copy Claude Code configuration files to sync repository based on sync mode
3. Create a Git commit
4. Push to remote repository (if configured)

## Parameters

- `mode` (optional): `basic`, `full`, or `custom`. Default: use currently configured mode
- `message` (optional): custom commit message

## Examples

```
# Push with current mode
/cc-sync:push

# Push with full mode
/cc-sync:push mode=full

# Push with custom message
/cc-sync:push message="Update configs"
```

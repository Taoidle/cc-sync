---
description: 初始化配置同步仓库 - Initialize sync repository for Claude Code configurations
argument-hint: <repoPath> [mode] [useLFS=true|false]
allowed-tools: [Bash, Write]
---

# 初始化配置同步 (Initialize Sync)

初始化配置同步仓库。优先使用 cc-sync MCP 服务器，如果不可用则直接执行 Git 和文件操作。

## 执行步骤

### 方法 1：使用 MCP 服务器（优先）

1. 解析用户提供的参数：
   - `repoPath`（必需）：同步仓库路径
   - `mode`（可选）：`basic`（默认）、`full` 或 `custom`
   - `useLFS`（可选）：是否启用 Git LFS

2. 调用 cc-sync MCP 服务器的 `init` 工具，传递解析的参数

3. 显示返回的初始化结果和后续步骤说明

### 方法 2：备用实现（MCP 服务器不可用时）

1. 验证 Git 是否可用
2. 创建同步仓库目录
3. 初始化 Git 仓库
4. 根据 mode 创建对应的 .gitignore
5. 如果是 full 模式且 useLFS=true，初始化 Git LFS 并创建 .gitattributes
6. 创建配置文件 `~/.cc-sync-config.json`
7. 显示初始化结果

## 参数说明

- **repoPath**（必需）：同步仓库路径，例如 `~/claude-config-sync`
- **mode**（可选）：
  - `basic`：仅同步配置文件（默认）
  - `full`：全面同步，包括插件和缓存
  - `custom`：自定义同步列表
- **useLFS**（可选）：是否启用 Git LFS（full 模式默认启用）

## 示例

```
# 基础模式
/cc-sync:init ~/claude-config-sync

# 全面模式（含 LFS）
/cc-sync:init ~/claude-config-sync full

# 禁用 LFS
/cc-sync:init ~/claude-config-sync full useLFS=false

# 自定义模式
/cc-sync:init ~/claude-config-sync custom
```

## 备用实现脚本

如果 MCP 服务器不可用，执行以下脚本：

```bash
#!/bin/bash
# 参数
REPO_PATH="$1"      # 必需：同步仓库路径
MODE="${2:-basic}"   # 可选：basic/full/custom，默认 basic
USE_LFS="${3:-true}" # 可选：是否使用 LFS，默认 true

# 配置文件路径
CONFIG_FILE="$HOME/.cc-sync-config.json"

# 检查 Git 是否可用
if ! command -v git &> /dev/null; then
  echo "错误: 未找到 Git。请先安装 Git。"
  exit 1
fi

# 展开 ~ 路径
REPO_PATH="${REPO_PATH/#\~/$HOME}"

# 创建目录
mkdir -p "$REPO_PATH"

# 初始化 Git 仓库
cd "$REPO_PATH"
git init

# 创建 .gitignore
cat > .gitignore << 'EOF'
# Claude Code 同步仓库
# 本地设置（机器特定）
.claude/settings.local.json
.claude/*.local.json
# 会话锁和临时文件
*.lock
*.tmp
# OS 文件
.DS_Store
Thumbs.db
EOF

# 如果是 full 模式且启用 LFS，初始化 Git LFS
if [ "$MODE" = "full" ] && [ "$USE_LFS" = "true" ]; then
  # 检查 Git LFS 是否可用
  if command -v git-lfs &> /dev/null || git lfs version &> /dev/null; then
    git lfs install

    # 创建 .gitattributes
    cat > .gitattributes << 'EOF'
.claude/cache/** filter=lfs diff=lfs merge=lfs -text
.claude/sessions/** filter=lfs diff=lfs merge=lfs -text
.claude/state/** filter=lfs diff=lfs merge=lfs -text
EOF
    echo "✓ Git LFS 已初始化"
  else
    echo "警告: Git LFS 未安装，跳过 LFS 配置"
    echo "安装 Git LFS: https://git-lfs.github.com/"
    USE_LFS="false"
  fi
fi

# 创建配置文件
cat > "$CONFIG_FILE" << EOF
{
  "syncRepoPath": "$REPO_PATH",
  "initialized": true,
  "syncMode": "$MODE",
  "useLFS": $USE_LFS
}
EOF

# 显示结果
echo "✓ 同步仓库初始化成功！"
echo ""
echo "仓库路径: $REPO_PATH"
echo "同步模式: $MODE"
if [ "$MODE" = "full" ]; then
  echo "Git LFS: $USE_LFS"
fi
echo ""
echo "后续步骤:"
echo "1. 添加远程仓库:"
echo "   cd \"$REPO_PATH\""
echo "   git remote add origin <your-repo-url>"
echo ""
echo "2. 推送到远程:"
echo "   git branch -M main"
echo "   git push -u origin main"
```

---

Use the `init` tool from the cc-sync MCP Server to initialize the sync repository. Falls back to direct Git and file operations if MCP server is unavailable.

## Instructions

### Method 1: Using MCP Server (preferred)

1. Parse user arguments:
   - `repoPath` (required): sync repository path
   - `mode` (optional): `basic` (default), `full`, or `custom`
   - `useLFS` (optional): enable Git LFS

2. Call the `init` tool from the cc-sync MCP Server with the parsed parameters

3. Display the initialization result and next steps

### Method 2: Fallback Implementation (when MCP server is unavailable)

1. Verify Git is available
2. Create sync repository directory
3. Initialize Git repository
4. Create .gitignore based on mode
5. If full mode with useLFS=true, initialize Git LFS and create .gitattributes
6. Create config file `~/.cc-sync-config.json`
7. Display initialization result

## Parameters

- **repoPath** (required): sync repository path, e.g., `~/claude-config-sync`
- **mode** (optional):
  - `basic`: configuration files only (default)
  - `full`: including plugins and cache
  - `custom`: custom sync list
- **useLFS** (optional): enable Git LFS (default true for full mode)

## Examples

```
# Basic mode
/cc-sync:init ~/claude-config-sync

# Full mode with LFS
/cc-sync:init ~/claude-config-sync full

# Disable LFS
/cc-sync:init ~/claude-config-sync full useLFS=false

# Custom mode
/cc-sync:init ~/claude-config-sync custom
```

## Fallback Implementation Script

If MCP server is unavailable, execute:

```bash
#!/bin/bash
# Parameters
REPO_PATH="$1"      # required: sync repository path
MODE="${2:-basic}"   # optional: basic/full/custom, default basic
USE_LFS="${3:-true}" # optional: use LFS, default true

# Config file path
CONFIG_FILE="$HOME/.cc-sync-config.json"

# Check if Git is available
if ! command -v git &> /dev/null; then
  echo "Error: Git not found. Please install Git first."
  exit 1
fi

# Expand ~ path
REPO_PATH="${REPO_PATH/#\~/$HOME}"

# Create directory
mkdir -p "$REPO_PATH"

# Initialize Git repository
cd "$REPO_PATH"
git init

# Create .gitignore
cat > .gitignore << 'EOF'
# Claude Code sync repository
# Local settings (machine-specific)
.claude/settings.local.json
.claude/*.local.json
# Session locks and temporary files
*.lock
*.tmp
# OS files
.DS_Store
Thumbs.db
EOF

# If full mode with LFS, initialize Git LFS
if [ "$MODE" = "full" ] && [ "$USE_LFS" = "true" ]; then
  # Check if Git LFS is available
  if command -v git-lfs &> /dev/null || git lfs version &> /dev/null; then
    git lfs install

    # Create .gitattributes
    cat > .gitattributes << 'EOF'
.claude/cache/** filter=lfs diff=lfs merge=lfs -text
.claude/sessions/** filter=lfs diff=lfs merge=lfs -text
.claude/state/** filter=lfs diff=lfs merge=lfs -text
EOF
    echo "✓ Git LFS initialized"
  else
    echo "Warning: Git LFS not installed, skipping LFS configuration"
    echo "Install Git LFS: https://git-lfs.github.com/"
    USE_LFS="false"
  fi
fi

# Create config file
cat > "$CONFIG_FILE" << EOF
{
  "syncRepoPath": "$REPO_PATH",
  "initialized": true,
  "syncMode": "$MODE",
  "useLFS": $USE_LFS
}
EOF

# Display result
echo "✓ Sync repository initialized successfully!"
echo ""
echo "Repository: $REPO_PATH"
echo "Sync mode: $MODE"
if [ "$MODE" = "full" ]; then
  echo "Git LFS: $USE_LFS"
fi
echo ""
echo "Next steps:"
echo "1. Add remote repository:"
echo "   cd \"$REPO_PATH\""
echo "   git remote add origin <your-repo-url>"
echo ""
echo "2. Push to remote:"
echo "   git branch -M main"
echo "   git push -u origin main"
```

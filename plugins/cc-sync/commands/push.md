---
description: 推送 Claude Code 配置到同步仓库 - Push Claude Code configurations to the sync repository
---

# 推送配置 (Push Configs)

使用 MCP Server 的 `push` 工具将 Claude Code 配置推送到同步仓库。

## 参数 (Parameters)

- `message` (可选): 自定义提交消息（默认自动生成带时间戳的消息）
- `mode` (可选): 覆盖此次推送的同步模式
  - `basic`: 仅同步配置文件
  - `full`: 全面同步
  - 默认: 使用当前配置的模式

## 功能说明

这个命令会：
1. 从同步仓库拉取最新更改（如果有远程仓库）
2. 根据 sync mode 复制相应的 Claude Code 配置文件到同步仓库
3. 创建 Git 提交
4. 推送到远程仓库（如果配置了）

## 使用示例

```
# 使用当前配置的模式推送
/cc-sync:push

# 使用 full 模式推送（全面同步，包括插件和缓存）
/cc-sync:push mode=full

# 使用自定义提交消息推送
/cc-sync:push message="更新配置"
```

---

Use the `push` tool from the cc-sync MCP Server to push Claude Code configurations to the sync repository.

## Parameters

- `message` (optional): Custom commit message (default: auto-generated with timestamp)
- `mode` (optional): Override sync mode for this push
  - `basic`: Sync configuration files only
  - `full`: Full sync
  - Default: Use currently configured mode

## What It Does

This command will:
1. Pull latest changes from the sync repository (if remote is configured)
2. Copy Claude Code configuration files to the sync repository based on sync mode
3. Create a Git commit
4. Push to remote repository (if configured)

## Examples

```
# Push with current configured mode
/cc-sync:push

# Push with full mode (complete sync including plugins and cache)
/cc-sync:push mode=full

# Push with custom commit message
/cc-sync:push message="Update configs"
```

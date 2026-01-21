---
description: 从同步仓库拉取 Claude Code 配置 - Pull Claude Code configurations from the sync repository
---

# 拉取配置 (Pull Configs)

使用 MCP Server 的 `pull` 工具从同步仓库拉取 Claude Code 配置。

## 参数 (Parameters)

- `mode` (可选): 覆盖此次拉取的同步模式
  - `basic`: 仅同步配置文件
  - `full`: 全面同步
  - 默认: 使用当前配置的模式

## 功能说明

这个命令会：
1. 从远程仓库拉取最新更改（如果配置了）
2. 根据 sync mode 将配置文件从同步仓库复制到 `~/.claude/` 目录

**注意**：这会覆盖你本地的配置文件！如有冲突，请先手动备份。

## 使用示例

```
# 使用当前配置的模式拉取
/cc-sync:pull

# 使用 full 模式拉取（全面同步）
/cc-sync:pull mode=full
```

---

Use the `pull` tool from the cc-sync MCP Server to pull Claude Code configurations from the sync repository.

## Parameters

- `mode` (optional): Override sync mode for this pull
  - `basic`: Sync configuration files only
  - `full`: Full sync
  - Default: Use currently configured mode

## What It Does

This command will:
1. Pull latest changes from remote repository (if configured)
2. Copy configuration files from sync repository to `~/.claude/` directory based on sync mode

**Warning**: This will overwrite your local configuration files! If you have conflicts, please backup manually first.

## Examples

```
# Pull with current configured mode
/cc-sync:pull

# Pull with full mode (complete sync)
/cc-sync:pull mode=full
```

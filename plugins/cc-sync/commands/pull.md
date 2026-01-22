---
description: 从同步仓库拉取 Claude Code 配置 - Pull Claude Code configurations from sync repository
argument-hint: [mode=<basic|full|custom>]
allowed-tools: [Bash]
---

# 拉取配置 (Pull Configs)

使用 cc-sync MCP 服务器的 `pull` 工具从同步仓库拉取 Claude Code 配置。

## 执行步骤

1. 解析可选参数：
   - `mode`：覆盖此次拉取的同步模式

2. 调用 cc-sync MCP 服务器的 `pull` 工具，传递解析的参数

3. 显示返回的拉取结果

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

---

Use the `pull` tool from the cc-sync MCP Server to pull Claude Code configurations from the sync repository.

## Instructions

1. Parse optional parameters:
   - `mode`: override sync mode for this pull

2. Call the `pull` tool from the cc-sync MCP Server with the parsed parameters

3. Display the pull result

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

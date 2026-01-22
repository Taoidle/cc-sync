---
description: 推送 Claude Code 配置到同步仓库 - Push Claude Code configurations to sync repository
argument-hint: [mode=<basic|full|custom>] [message=<commit message>]
allowed-tools: [Bash]
---

# 推送配置 (Push Configs)

使用 cc-sync MCP 服务器的 `push` 工具将 Claude Code 配置推送到同步仓库。

## 执行步骤

1. 解析可选参数：
   - `mode`：覆盖此次推送的同步模式
   - `message`：自定义提交消息

2. 调用 cc-sync MCP 服务器的 `push` 工具，传递解析的参数

3. 显示返回的推送结果

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

---

Use the `push` tool from the cc-sync MCP Server to push Claude Code configurations to the sync repository.

## Instructions

1. Parse optional parameters:
   - `mode`: override sync mode for this push
   - `message`: custom commit message

2. Call the `push` tool from the cc-sync MCP Server with the parsed parameters

3. Display the push result

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

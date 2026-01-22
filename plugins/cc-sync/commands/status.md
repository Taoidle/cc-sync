---
description: 查看配置同步状态 - Show current synchronization status
allowed-tools: [Bash]
---

# 同步状态 (Sync Status)

使用 cc-sync MCP 服务器的 `status` 工具查看当前配置同步状态。

## 执行步骤

1. 调用 cc-sync MCP 服务器的 `status` 工具（不需要参数）

2. 显示返回的状态信息

## 显示信息包括

- 同步仓库路径
- 当前同步模式
- 当前 Git 分支
- 远程仓库 URL
- 本地是否有未提交的更改
- 未推送的提交数量
- 未拉取的提交数量

## 示例

```
# 查看同步状态
/cc-sync:status
```

---

Use the `status` tool from the cc-sync MCP Server to show the current synchronization status.

## Instructions

1. Call the `status` tool from the cc-sync MCP Server (no parameters needed)

2. Display the status information

## Displayed Information

- Sync repository path
- Current sync mode
- Current Git branch
- Remote repository URL
- Whether there are local uncommitted changes
- Number of unpushed commits
- Number of unpulled commits

## Examples

```
# Show sync status
/cc-sync:status
```

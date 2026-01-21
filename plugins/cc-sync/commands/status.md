---
description: 查看配置同步状态 - Show the current synchronization status
---

# 同步状态 (Sync Status)

使用 MCP Server 的 `status` 工具查看当前配置同步状态。

## 显示信息包括

- 同步仓库路径
- 当前同步模式 (basic 或 full)
- 当前 Git 分支
- 远程仓库 URL
- 本地是否有未提交的更改
- 未推送的提交数量
- 未拉取的提交数量

## 使用示例

```
# 查看同步状态
/cc-sync:status
```

---

Use the `status` tool from the cc-sync MCP Server to show the current synchronization status.

## Displayed Information

- Sync repository path
- Current sync mode (basic or full)
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

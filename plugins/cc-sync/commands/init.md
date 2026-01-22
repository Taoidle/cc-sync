---
description: 初始化配置同步仓库 - Initialize sync repository for Claude Code configurations
argument-hint: <repoPath> [mode] [useLFS=true|false]
allowed-tools: [Bash]
---

# 初始化配置同步 (Initialize Sync)

使用 cc-sync MCP 服务器的 `init` 工具初始化配置同步仓库。

## 执行步骤

1. 解析用户提供的参数：
   - `repoPath`（必需）：同步仓库路径
   - `mode`（可选）：`basic`（默认）、`full` 或 `custom`
   - `useLFS`（可选）：是否启用 Git LFS

2. 调用 cc-sync MCP 服务器的 `init` 工具，传递解析的参数

3. 显示返回的初始化结果和后续步骤说明

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

---

Use the `init` tool from the cc-sync MCP Server to initialize the sync repository.

## Instructions

1. Parse user arguments:
   - `repoPath` (required): sync repository path
   - `mode` (optional): `basic` (default), `full`, or `custom`
   - `useLFS` (optional): enable Git LFS

2. Call the `init` tool from the cc-sync MCP Server with the parsed parameters

3. Display the initialization result and next steps

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

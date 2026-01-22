---
description: 查看当前同步模式和同步项目列表 - View current sync mode and items to sync
allowed-tools: [Bash, Read]
---

# 查看同步模式 (Get Sync Mode)

查看当前同步模式和将要同步的项目列表。优先使用 cc-sync MCP 服务器，如果不可用则直接读取配置文件。

## 执行步骤

### 方法 1：使用 MCP 服务器（优先）

1. 调用 cc-sync MCP 服务器的 `getMode` 工具（不需要参数）
2. 显示返回的模式和同步项目列表

### 方法 2：备用实现（MCP 服务器不可用时）

1. 使用 Read 工具读取配置文件 `~/.cc-sync-config.json`
2. 解析 JSON 获取 `syncMode`、`useLFS` 和 `customItems`
3. 根据模式显示相应的同步项目列表

## 同步模式说明

- **basic**：仅同步配置文件
  - `.claude/settings.json`
  - `.claude/CLAUDE.md`
  - `.claude.json`
  - `.claude/agents/`
  - `.claude/skills/`

- **full**：全面同步（包括插件、缓存）
  - 包含 basic 模式的所有内容
  - `.claude/plugins/`
  - `.claude/plugins-cache/`
  - `.claude/cache/` [LFS]
  - `.claude/sessions/` [LFS]
  - `.claude/plans/`
  - `.claude/state/` [LFS]
  - `.claude/hooks/`
  - `.claude/mcp-servers/`

- **custom**：自定义同步列表
  - 显示 `customItems` 中定义的项目

## 示例

```
/cc-sync:getMode
```

## 备用实现示例输出

如果 MCP 服务器不可用，直接读取配置文件并显示：

```
当前同步模式: basic

同步模式: Basic 模式 - 仅同步配置文件

同步项目列表:
  - .claude/settings.json (file)
  - .claude/CLAUDE.md (file) [可选]
  - .claude.json (file)
  - .claude/agents/ (dir) [可选]
  - .claude/skills/ (dir) [可选]
```

---

Use the `getMode` tool from the cc-sync MCP Server to view the current sync mode and list of items to sync. Falls back to reading the config file directly if MCP server is unavailable.

## Instructions

### Method 1: Using MCP Server (preferred)

1. Call the `getMode` tool from the cc-sync MCP Server (no parameters needed)
2. Display the returned mode and sync items list

### Method 2: Fallback Implementation (when MCP server is unavailable)

1. Use Read tool to read config file `~/.cc-sync-config.json`
2. Parse JSON to get `syncMode`, `useLFS`, and `customItems`
3. Display sync items based on the mode

## Sync Mode Description

- **basic**: Configuration files only
  - `.claude/settings.json`
  - `.claude/CLAUDE.md`
  - `.claude.json`
  - `.claude/agents/`
  - `.claude/skills/`

- **full**: Full sync including plugins and cache
  - All basic mode items
  - `.claude/plugins/`
  - `.claude/plugins-cache/`
  - `.claude/cache/` [LFS]
  - `.claude/sessions/` [LFS]
  - `.claude/plans/`
  - `.claude/state/` [LFS]
  - `.claude/hooks/`
  - `.claude/mcp-servers/`

- **custom**: Custom sync list
  - Shows items defined in `customItems`

## Examples

```
/cc-sync:getMode
```

## Fallback Output Example

```
Current sync mode: basic

Mode: Basic mode - configuration files only

Sync items:
  - .claude/settings.json (file)
  - .claude/CLAUDE.md (file) [optional]
  - .claude.json (file)
  - .claude/agents/ (dir) [optional]
  - .claude/skills/ (dir) [optional]
```

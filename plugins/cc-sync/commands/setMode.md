---
description: 设置同步模式 - Set sync mode (basic, full, or custom)
argument-hint: mode=<basic|full|custom> [useLFS=true|false]
allowed-tools: []
---

# 设置同步模式 (Set Sync Mode)

使用 cc-sync MCP 服务器的 `setMode` 工具来更改同步模式。

## 执行步骤

1. 解析参数：
   - `mode`（必需）：要设置的模式
   - `useLFS`（可选）：启用/禁用 Git LFS

2. 调用 cc-sync MCP 服务器的 `setMode` 工具，传递解析的参数

3. 显示返回的结果

## 参数

- `mode`（必需）：`basic`、`full` 或 `custom`
- `useLFS`（可选）：是否启用 Git LFS

## 模式说明

- **basic**：仅同步配置文件
- **full**：全面同步（包括插件、缓存）
- **custom**：自定义同步列表

## 示例

```
# 切换到 basic 模式
/cc-sync:setMode mode=basic

# 切换到 full 模式（含 LFS）
/cc-sync:setMode mode=full

# 切换到 full 模式但禁用 LFS
/cc-sync:setMode mode=full useLFS=false

# 切换到 custom 模式
/cc-sync:setMode mode=custom
```

## Custom 模式使用

切换到 custom 模式后：

```
# 1. 切换模式
/cc-sync:setMode mode=custom

# 2. 添加同步项
/cc-sync:addCustomItem path=settings.json type=file
/cc-sync:addCustomItem path=plugins type=dir

# 3. 查看列表
/cc-sync:listCustomItems
```

---

Use the `setMode` tool from the cc-sync MCP Server to change the sync mode.

## Instructions

1. Parse parameters:
   - `mode` (required): mode to set
   - `useLFS` (optional): enable/disable Git LFS

2. Call the `setMode` tool from the cc-sync MCP Server with the parsed parameters

3. Display the result

## Parameters

- `mode` (required): `basic`, `full`, or `custom`
- `useLFS` (optional): enable Git LFS

## Mode Description

- **basic**: Sync configuration files only
- **full**: Full sync including plugins and cache
- **custom**: Custom sync list

## Examples

```
# Switch to basic mode
/cc-sync:setMode mode=basic

# Switch to full mode with LFS
/cc-sync:setMode mode=full

# Switch to full mode without LFS
/cc-sync:setMode mode=full useLFS=false

# Switch to custom mode
/cc-sync:setMode mode=custom
```

## Custom Mode Usage

After switching to custom mode:

```
# 1. Switch mode
/cc-sync:setMode mode=custom

# 2. Add sync items
/cc-sync:addCustomItem path=settings.json type=file
/cc-sync:addCustomItem path=plugins type=dir

# 3. List items
/cc-sync:listCustomItems
```

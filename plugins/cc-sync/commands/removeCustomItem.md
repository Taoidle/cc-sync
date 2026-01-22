---
description: 从自定义同步列表移除文件或目录 - Remove file or directory from custom sync list
argument-hint: path=<path>
allowed-tools: []
---

# 移除自定义同步项 (Remove Custom Item)

使用 cc-sync MCP 服务器的 `removeCustomItem` 工具从自定义同步列表中移除文件或目录。

## 执行步骤

1. 解析参数：
   - `path`（必需）：要移除的项目路径

2. 调用 cc-sync MCP 服务器的 `removeCustomItem` 工具，传递解析的参数

3. 显示返回的结果

## 参数

- `path`（必需）：要移除的项目路径

## 示例

```
# 移除插件目录
/cc-sync:removeCustomItem path=plugins

# 移除缓存目录
/cc-sync:removeCustomItem path=cache
```

---

Use the `removeCustomItem` tool from the cc-sync MCP Server to remove files or directories from the custom sync list.

## Instructions

1. Parse parameters:
   - `path` (required): path of the item to remove

2. Call the `removeCustomItem` tool from the cc-sync MCP Server with the parsed parameters

3. Display the result

## Parameters

- `path` (required): path of the item to remove

## Examples

```
# Remove plugins directory
/cc-sync:removeCustomItem path=plugins

# Remove cache directory
/cc-sync:removeCustomItem path=cache
```

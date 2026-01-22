---
description: 列出所有自定义同步项 - List all custom sync items
allowed-tools: []
---

# 列出自定义同步项 (List Custom Items)

使用 cc-sync MCP 服务器的 `listCustomItems` 工具查看当前自定义同步列表中的所有项目。

## 执行步骤

1. 调用 cc-sync MCP 服务器的 `listCustomItems` 工具（不需要参数）

2. 显示返回的自定义同步项列表

## 显示信息

- 项目数量
- 每个项目的路径、类型
- 是否使用 Git LFS

## 示例

```
# 查看自定义同步列表
/cc-sync:listCustomItems
```

---

Use the `listCustomItems` tool from the cc-sync MCP Server to view all items in the custom sync list.

## Instructions

1. Call the `listCustomItems` tool from the cc-sync MCP Server (no parameters needed)

2. Display the custom sync items list

## Displayed Information

- Number of items
- Path and type of each item
- Whether Git LFS is enabled

## Examples

```
# List custom sync items
/cc-sync:listCustomItems
```

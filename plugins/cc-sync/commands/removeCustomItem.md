---
description: 从自定义同步列表移除文件或目录 - Remove file or directory from custom sync list
---

# 移除自定义同步项 (Remove Custom Item)

使用 MCP Server 的 `removeCustomItem` 工具从自定义同步列表中移除文件或目录。

## 参数 (Parameters)

- `path` (必需): 要移除的项目路径

## 使用示例 (Examples)

```
# 移除插件目录
/cc-sync:removeCustomItem path=plugins

# 移除缓存目录
/cc-sync:removeCustomItem path=cache
```

---

Use the `removeCustomItem` tool from the cc-sync MCP Server to remove files or directories from the custom sync list.

## Parameters

- `path` (required): Path of the item to remove

## Examples

```
# Remove plugins directory
/cc-sync:removeCustomItem path=plugins

# Remove cache directory
/cc-sync:removeCustomItem path=cache
```

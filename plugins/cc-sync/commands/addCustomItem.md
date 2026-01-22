---
description: 添加文件或目录到自定义同步列表 - Add file or directory to custom sync list
argument-hint: path=<path> type=<file|dir> [optional=true|false] [useLFS=true|false]
allowed-tools: []
---

# 添加自定义同步项 (Add Custom Item)

使用 cc-sync MCP 服务器的 `addCustomItem` 工具向自定义同步列表添加文件或目录。

**注意**：只有在自定义模式下才能管理自定义同步项。

## 执行步骤

1. 解析参数：
   - `path`（必需）：相对于 `~/.claude/` 的路径
   - `type`（必需）：`file` 或 `dir`
   - `optional`（可选）：是否为可选项目
   - `useLFS`（可选）：是否使用 Git LFS

2. 调用 cc-sync MCP 服务器的 `addCustomItem` 工具，传递解析的参数

3. 显示返回的结果

## 参数

- `path`（必需）：路径，如 `plugins`、`cache/sessions`
- `type`（必需）：`file` 或 `dir`
- `optional`（可选）：是否为可选项目（默认：false）
- `useLFS`（可选）：是否使用 Git LFS（默认：false）

## 示例

```
# 添加插件目录
/cc-sync:addCustomItem path=plugins type=dir

# 添加缓存目录并使用 LFS
/cc-sync:addCustomItem path=cache type=dir useLFS=true

# 添加单个文件
/cc-sync:addCustomItem path=settings.json type=file

# 添加可选的会话目录
/cc-sync:addCustomItem path=sessions type=dir optional=true useLFS=true
```

---

Use the `addCustomItem` tool from the cc-sync MCP Server to add files or directories to the custom sync list.

**Note**: Custom items can only be managed in custom mode.

## Instructions

1. Parse parameters:
   - `path` (required): path relative to `~/.claude/`
   - `type` (required): `file` or `dir`
   - `optional` (optional): whether this item is optional
   - `useLFS` (optional): whether to use Git LFS

2. Call the `addCustomItem` tool from the cc-sync MCP Server with the parsed parameters

3. Display the result

## Parameters

- `path` (required): path like `plugins`, `cache/sessions`
- `type` (required): `file` or `dir`
- `optional` (optional): whether this item is optional (default: false)
- `useLFS` (optional): whether to use Git LFS (default: false)

## Examples

```
# Add plugins directory
/cc-sync:addCustomItem path=plugins type=dir

# Add cache directory with LFS
/cc-sync:addCustomItem path=cache type=dir useLFS=true

# Add single file
/cc-sync:addCustomItem path=settings.json type=file

# Add optional sessions directory
/cc-sync:addCustomItem path=sessions type=dir optional=true useLFS=true
```

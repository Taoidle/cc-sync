---
description: 添加文件或目录到自定义同步列表 - Add file or directory to custom sync list
---

# 添加自定义同步项 (Add Custom Item)

使用 MCP Server 的 `addCustomItem` 工具向自定义同步列表添加文件或目录。

**注意**: 只有在自定义模式 (custom mode) 下才能管理自定义同步项。

## 参数 (Parameters)

- `path` (必需): 相对于 `~/.claude/` 的路径，例如 `plugins`、`cache/sessions`
- `type` (必需): 项目类型
  - `file`: 文件
  - `dir`: 目录
- `optional` (可选): 是否为可选项目（默认：false）
- `useLFS` (可选): 是否为此项目使用 Git LFS（推荐用于大文件，默认：false）

## 使用示例 (Examples)

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

## 自定义模式说明

首先切换到自定义模式：
```
/cc-sync:setMode mode=custom
```

然后添加你想要同步的项目：
```
# 添加基本配置
/cc-sync:addCustomItem path=settings.json type=file
/cc-sync:addCustomItem path=.claude.json type=file

# 添加插件
/cc-sync:addCustomItem path=plugins type=dir
/cc-sync:addCustomItem path=agents type=dir

# 添加缓存（使用 LFS）
/cc-sync:addCustomItem path=cache type=dir useLFS=true
/cc-sync:addCustomItem path=sessions type=dir useLFS=true
```

---

Use the `addCustomItem` tool from the cc-sync MCP Server to add files or directories to the custom sync list.

**Note**: Custom items can only be managed in custom mode.

## Parameters

- `path` (required): Path relative to `~/.claude/`, e.g., `plugins`, `cache/sessions`
- `type` (required): Item type
  - `file`: File
  - `dir`: Directory
- `optional` (optional): Whether this item is optional (default: false)
- `useLFS` (optional): Use Git LFS for this item (recommended for large files, default: false)

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

## Custom Mode Setup

First switch to custom mode:
```
/cc-sync:setMode mode=custom
```

Then add items you want to sync:
```
# Add basic configs
/cc-sync:addCustomItem path=settings.json type=file
/cc-sync:addCustomItem path=.claude.json type=file

# Add plugins
/cc-sync:addCustomItem path=plugins type=dir
/cc-sync:addCustomItem path=agents type=dir

# Add cache (using LFS)
/cc-sync:addCustomItem path=cache type=dir useLFS=true
/cc-sync:addCustomItem path=sessions type=dir useLFS=true
```

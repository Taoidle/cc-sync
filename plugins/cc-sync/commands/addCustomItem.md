---
description: 添加文件或目录到自定义同步列表 - Add file or directory to custom sync list
argument-hint: path=<path> type=<file|dir> [optional=true|false] [useLFS=true|false]
allowed-tools: [Bash, Read, Write]
---

# 添加自定义同步项 (Add Custom Item)

向自定义同步列表添加文件或目录。优先使用 cc-sync MCP 服务器，如果不可用则直接修改配置文件。

**注意**：只有在自定义模式下才能管理自定义同步项。

## 执行步骤

### 方法 1：使用 MCP 服务器（优先）

1. 解析参数：
   - `path`（必需）：相对于 `~/.claude/` 的路径
   - `type`（必需）：`file` 或 `dir`
   - `optional`（可选）：是否为可选项目
   - `useLFS`（可选）：是否使用 Git LFS

2. 调用 cc-sync MCP 服务器的 `addCustomItem` 工具，传递解析的参数

3. 显示返回的结果

### 方法 2：备用实现（MCP 服务器不可用时）

1. 读取配置文件 `~/.cc-sync-config.json`
2. 检查配置是否存在，如果不存在则提示用户先运行 `/cc-sync:init`
3. 检查 `syncMode` 是否为 `custom`，如果不是则提示用户切换到 custom 模式
4. 检查项目是否已存在于 `customItems` 中
5. 添加新项目到 `customItems` 数组
6. 将更新后的配置写回文件

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

## 备用实现命令

如果 MCP 服务器不可用，执行：

```bash
CONFIG_FILE="$HOME/.cc-sync-config.json"
PATH="plugins"
TYPE="dir"
OPTIONAL="false"
USE_LFS="false"

# 检查配置
if [ ! -f "$CONFIG_FILE" ]; then
  echo "错误: 未初始化同步"
  exit 1
fi

# 检查模式
MODE=$(grep -o '"syncMode":"[^"]*"' "$CONFIG_FILE" | cut -d'"' -f4)
if [ "$MODE" != "custom" ]; then
  echo "错误: 需要先切换到 custom 模式"
  exit 1
fi

# 添加新项到 customItems
if command -v jq &> /dev/null; then
  jq --arg path "$PATH" --arg type "$TYPE" \
     --argjson optional "$OPTIONAL" --argjson useLFS "$USE_LFS" \
     '.customItems += {"path": $path, "type": $type, "optional": $optional, "useLFS": $useLFS}' \
     "$CONFIG_FILE" > "${CONFIG_FILE}.tmp" && mv "${CONFIG_FILE}.tmp" "$CONFIG_FILE"
  echo "✓ 已添加: $PATH"
fi
```

---

Use the `addCustomItem` tool from the cc-sync MCP Server to add files or directories to the custom sync list. Falls back to directly modifying the config file if MCP server is unavailable.

**Note**: Custom items can only be managed in custom mode.

## Instructions

### Method 1: Using MCP Server (preferred)

1. Parse parameters:
   - `path` (required): path relative to `~/.claude/`
   - `type` (required): `file` or `dir`
   - `optional` (optional): whether this item is optional
   - `useLFS` (optional): whether to use Git LFS

2. Call the `addCustomItem` tool from the cc-sync MCP Server with the parsed parameters

3. Display the result

### Method 2: Fallback Implementation (when MCP server is unavailable)

1. Read config file `~/.cc-sync-config.json`
2. Check if config exists, if not prompt user to run `/cc-sync:init` first
3. Check if `syncMode` is `custom`, if not prompt user to switch to custom mode
4. Check if item already exists in `customItems`
5. Add new item to `customItems` array
6. Write the updated config back to the file

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

## Fallback Implementation Commands

If MCP server is unavailable, execute:

```bash
CONFIG_FILE="$HOME/.cc-sync-config.json"
PATH="plugins"
TYPE="dir"
OPTIONAL="false"
USE_LFS="false"

# Check config
if [ ! -f "$CONFIG_FILE" ]; then
  echo "Error: Sync not initialized"
  exit 1
fi

# Check mode
MODE=$(grep -o '"syncMode":"[^"]*"' "$CONFIG_FILE" | cut -d'"' -f4)
if [ "$MODE" != "custom" ]; then
  echo "Error: Must switch to custom mode first"
  exit 1
fi

# Add new item to customItems
if command -v jq &> /dev/null; then
  jq --arg path "$PATH" --arg type "$TYPE" \
     --argjson optional "$OPTIONAL" --argjson useLFS "$USE_LFS" \
     '.customItems += {"path": $path, "type": $type, "optional": $optional, "useLFS": $useLFS}' \
     "$CONFIG_FILE" > "${CONFIG_FILE}.tmp" && mv "${CONFIG_FILE}.tmp" "$CONFIG_FILE"
  echo "✓ Added: $PATH"
fi
```

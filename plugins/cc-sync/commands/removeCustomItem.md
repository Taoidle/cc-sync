---
description: 从自定义同步列表移除文件或目录 - Remove file or directory from custom sync list
argument-hint: path=<path>
allowed-tools: [Bash, Read, Write]
---

# 移除自定义同步项 (Remove Custom Item)

从自定义同步列表中移除文件或目录。优先使用 cc-sync MCP 服务器，如果不可用则直接修改配置文件。

## 执行步骤

### 方法 1：使用 MCP 服务器（优先）

1. 解析参数：
   - `path`（必需）：要移除的项目路径

2. 调用 cc-sync MCP 服务器的 `removeCustomItem` 工具，传递解析的参数

3. 显示返回的结果

### 方法 2：备用实现（MCP 服务器不可用时）

1. 读取配置文件 `~/.cc-sync-config.json`
2. 检查配置是否存在，如果不存在则提示用户先运行 `/cc-sync:init`
3. 检查 `syncMode` 是否为 `custom`，如果不是则提示用户切换到 custom 模式
4. 从 `customItems` 数组中删除指定路径的项目
5. 将更新后的配置写回文件

## 参数

- `path`（必需）：要移除的项目路径

## 示例

```
# 移除插件目录
/cc-sync:removeCustomItem path=plugins

# 移除缓存目录
/cc-sync:removeCustomItem path=cache
```

## 备用实现命令

如果 MCP 服务器不可用，执行：

```bash
CONFIG_FILE="$HOME/.cc-sync-config.json"
PATH="plugins"

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

# 从 customItems 删除指定项
if command -v jq &> /dev/null; then
  jq --arg path "$PATH" \
     '.customItems |= map(select(.path != $path))' \
     "$CONFIG_FILE" > "${CONFIG_FILE}.tmp" && mv "${CONFIG_FILE}.tmp" "$CONFIG_FILE"
  echo "✓ 已移除: $PATH"
fi
```

---

Use the `removeCustomItem` tool from the cc-sync MCP Server to remove files or directories from the custom sync list. Falls back to directly modifying the config file if MCP server is unavailable.

## Instructions

### Method 1: Using MCP Server (preferred)

1. Parse parameters:
   - `path` (required): path of the item to remove

2. Call the `removeCustomItem` tool from the cc-sync MCP Server with the parsed parameters

3. Display the result

### Method 2: Fallback Implementation (when MCP server is unavailable)

1. Read config file `~/.cc-sync-config.json`
2. Check if config exists, if not prompt user to run `/cc-sync:init` first
3. Check if `syncMode` is `custom`, if not prompt user to switch to custom mode
4. Remove the item with the specified path from `customItems` array
5. Write the updated config back to the file

## Parameters

- `path` (required): path of the item to remove

## Examples

```
# Remove plugins directory
/cc-sync:removeCustomItem path=plugins

# Remove cache directory
/cc-sync:removeCustomItem path=cache
```

## Fallback Implementation Commands

If MCP server is unavailable, execute:

```bash
CONFIG_FILE="$HOME/.cc-sync-config.json"
PATH="plugins"

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

# Remove item from customItems
if command -v jq &> /dev/null; then
  jq --arg path "$PATH" \
     '.customItems |= map(select(.path != $path))' \
     "$CONFIG_FILE" > "${CONFIG_FILE}.tmp" && mv "${CONFIG_FILE}.tmp" "$CONFIG_FILE"
  echo "✓ Removed: $PATH"
fi
```

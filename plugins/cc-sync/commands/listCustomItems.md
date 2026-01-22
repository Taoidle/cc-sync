---
description: 列出所有自定义同步项 - List all custom sync items
allowed-tools: [Bash, Read]
---

# 列出自定义同步项 (List Custom Items)

查看当前自定义同步列表中的所有项目。优先使用 cc-sync MCP 服务器，如果不可用则直接读取配置文件。

## 执行步骤

### 方法 1：使用 MCP 服务器（优先）

1. 调用 cc-sync MCP 服务器的 `listCustomItems` 工具（不需要参数）
2. 显示返回的自定义同步项列表

### 方法 2：备用实现（MCP 服务器不可用时）

1. 读取配置文件 `~/.cc-sync-config.json`
2. 检查配置是否存在，如果不存在则提示用户先运行 `/cc-sync:init`
3. 检查 `syncMode` 是否为 `custom`，如果不是则提示用户切换到 custom 模式
4. 读取 `customItems` 数组
5. 显示每个自定义项的详细信息（路径、类型、是否可选、是否使用 LFS）

## 显示信息

- 项目数量
- 每个项目的路径、类型
- 是否使用 Git LFS

## 示例

```
/cc-sync:listCustomItems
```

## 备用实现命令

如果 MCP 服务器不可用，执行：

```bash
CONFIG_FILE="$HOME/.cc-sync-config.json"

# 检查配置是否存在
if [ ! -f "$CONFIG_FILE" ]; then
  echo "错误: 未初始化同步。请先运行 /cc-sync:init"
  exit 1
fi

# 检查模式
MODE=$(grep -o '"syncMode":"[^"]*"' "$CONFIG_FILE" | cut -d'"' -f4)
if [ "$MODE" != "custom" ]; then
  echo "当前不是自定义模式。请先运行: /cc-sync:setMode mode=custom"
  exit 1
fi

# 读取自定义项
if command -v jq &> /dev/null; then
  jq '.customItems' "$CONFIG_FILE"
else
  grep -o '"customItems":\[[^]]*\]' "$CONFIG_FILE"
fi
```

---

Use the `listCustomItems` tool from the cc-sync MCP Server to view all items in the custom sync list. Falls back to reading the config file directly if MCP server is unavailable.

## Instructions

### Method 1: Using MCP Server (preferred)

1. Call the `listCustomItems` tool from the cc-sync MCP Server (no parameters needed)

2. Display the custom sync items list

### Method 2: Fallback Implementation (when MCP server is unavailable)

1. Read config file `~/.cc-sync-config.json`
2. Check if config exists, if not prompt user to run `/cc-sync:init` first
3. Check if `syncMode` is `custom`, if not prompt user to switch to custom mode
4. Read `customItems` array
5. Display details of each custom item (path, type, optional, LFS enabled)

## Displayed Information

- Number of items
- Path and type of each item
- Whether Git LFS is enabled

## Examples

```
/cc-sync:listCustomItems
```

## Fallback Implementation Commands

If MCP server is unavailable, execute:

```bash
CONFIG_FILE="$HOME/.cc-sync-config.json"

# Check if config exists
if [ ! -f "$CONFIG_FILE" ]; then
  echo "Error: Sync not initialized. Please run /cc-sync:init first"
  exit 1
fi

# Check mode
MODE=$(grep -o '"syncMode":"[^"]*"' "$CONFIG_FILE" | cut -d'"' -f4)
if [ "$MODE" != "custom" ]; then
  echo "Not in custom mode. Please run: /cc-sync:setMode mode=custom"
  exit 1
fi

# Read custom items
if command -v jq &> /dev/null; then
  jq '.customItems' "$CONFIG_FILE"
else
  grep -o '"customItems":\[[^]]*\]' "$CONFIG_FILE"
fi
```

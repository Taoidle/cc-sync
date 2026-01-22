---
description: 设置同步模式 - Set sync mode (basic, full, or custom)
argument-hint: mode=<basic|full|custom> [useLFS=true|false]
allowed-tools: [Bash, Read, Write]
---

# 设置同步模式 (Set Sync Mode)

更改同步模式。优先使用 cc-sync MCP 服务器，如果不可用则直接修改配置文件。

## 执行步骤

### 方法 1：使用 MCP 服务器（优先）

1. 解析参数：
   - `mode`（必需）：要设置的模式
   - `useLFS`（可选）：启用/禁用 Git LFS

2. 调用 cc-sync MCP 服务器的 `setMode` 工具，传递解析的参数

3. 显示返回的结果

### 方法 2：备用实现（MCP 服务器不可用时）

1. 读取配置文件 `~/.cc-sync-config.json`
2. 检查配置是否存在，如果不存在则提示用户先运行 `/cc-sync:init`
3. 更新配置中的 `syncMode` 字段
4. 如果提供了 `useLFS` 参数，同时更新 `useLFS` 字段
5. 如果切换到 `custom` 模式且 `customItems` 不存在，初始化默认的自定义项列表
6. 将更新后的配置写回文件

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

## 备用实现命令

如果 MCP 服务器不可用，执行：

```bash
CONFIG_FILE="$HOME/.cc-sync-config.json"
MODE="basic"  # 从参数获取
USE_LFS=""    # 可选参数

# 检查配置是否存在
if [ ! -f "$CONFIG_FILE" ]; then
  echo "错误: 未初始化同步。请先运行 /cc-sync:init"
  exit 1
fi

# 使用 jq 或 sed 更新配置
if command -v jq &> /dev/null; then
  jq --arg mode "$MODE" '.syncMode = $mode' "$CONFIG_FILE" > "${CONFIG_FILE}.tmp"
  if [ -n "$USE_LFS" ]; then
    jq --arg useLFS "$USE_LFS" '.useLFS = ($useLFS == "true")' "${CONFIG_FILE}.tmp" > "${CONFIG_FILE}.tmp2"
    mv "${CONFIG_FILE}.tmp2" "$CONFIG_FILE"
  else
    mv "${CONFIG_FILE}.tmp" "$CONFIG_FILE"
  fi
else
  # 使用 sed 作为备用
  sed -i "s/\"syncMode\":\"[^\"]*\"/\"syncMode\":\"$MODE\"/" "$CONFIG_FILE"
fi

echo "✓ 同步模式已设置为: $MODE"
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

Use the `setMode` tool from the cc-sync MCP Server to change the sync mode. Falls back to directly modifying the config file if MCP server is unavailable.

## Instructions

### Method 1: Using MCP Server (preferred)

1. Parse parameters:
   - `mode` (required): mode to set
   - `useLFS` (optional): enable/disable Git LFS

2. Call the `setMode` tool from the cc-sync MCP Server with the parsed parameters

3. Display the result

### Method 2: Fallback Implementation (when MCP server is unavailable)

1. Read config file `~/.cc-sync-config.json`
2. Check if config exists, if not prompt user to run `/cc-sync:init` first
3. Update the `syncMode` field in the config
4. If `useLFS` parameter is provided, also update the `useLFS` field
5. If switching to `custom` mode and `customItems` doesn't exist, initialize default custom items
6. Write the updated config back to the file

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

## Fallback Implementation Commands

If MCP server is unavailable, execute:

```bash
CONFIG_FILE="$HOME/.cc-sync-config.json"
MODE="basic"  # from parameter
USE_LFS=""    # optional parameter

# Check if config exists
if [ ! -f "$CONFIG_FILE" ]; then
  echo "Error: Sync not initialized. Please run /cc-sync:init first"
  exit 1
fi

# Update config using jq or sed
if command -v jq &> /dev/null; then
  jq --arg mode "$MODE" '.syncMode = $mode' "$CONFIG_FILE" > "${CONFIG_FILE}.tmp"
  if [ -n "$USE_LFS" ]; then
    jq --arg useLFS "$USE_LFS" '.useLFS = ($useLFS == "true")' "${CONFIG_FILE}.tmp" > "${CONFIG_FILE}.tmp2"
    mv "${CONFIG_FILE}.tmp2" "$CONFIG_FILE"
  else
    mv "${CONFIG_FILE}.tmp" "$CONFIG_FILE"
  fi
else
  # Use sed as fallback
  sed -i "s/\"syncMode\":\"[^\"]*\"/\"syncMode\":\"$MODE\"/" "$CONFIG_FILE"
fi

echo "✓ Sync mode set to: $MODE"
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

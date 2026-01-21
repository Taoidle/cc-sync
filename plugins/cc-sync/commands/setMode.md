---
description: 设置同步模式 - Set the sync mode (basic, full, or custom)
---

# 设置同步模式 (Set Sync Mode)

使用 MCP Server 的 `setMode` 工具来更改同步模式。

## 参数 (Parameters)

- `mode` (必需): 要设置的同步模式
  - `basic`: 仅同步配置文件
  - `full`: 全面同步（包括插件、缓存、市场数据）
  - `custom`: 自定义同步（用户定义文件/目录列表）
- `useLFS` (可选): 启用/禁用 Git LFS

## 使用示例 (Examples)

```
# 切换到 basic 模式（仅配置）
/cc-sync:setMode mode=basic

# 切换到 full 模式（全面同步，含 LFS）
/cc-sync:setMode mode=full

# 切换到 full 模式但禁用 LFS
/cc-sync:setMode mode=full useLFS=false

# 切换到 custom 模式
/cc-sync:setMode mode=custom
```

## 模式对比 (Mode Comparison)

| 模式 | 同步内容 | 存储需求 | 适用场景 |
|------|---------|---------|---------|
| **basic** | 配置文件、代理、技能 | 较小 | 日常使用，快速同步 |
| **full** | 所有数据 + 插件 + 缓存 + 会话 | 较大 | 完整备份，多机器完全一致 |
| **custom** | 用户自定义 | 可变 | 精确控制同步内容 |

## Custom 模式使用

切换到 custom 模式后：

```
# 1. 切换到 custom 模式
/cc-sync:setMode mode=custom

# 2. 添加你想要同步的项目
/cc-sync:addCustomItem path=settings.json type=file
/cc-sync:addCustomItem path=plugins type=dir
/cc-sync:addCustomItem path=cache type=dir useLFS=true

# 3. 查看当前列表
/cc-sync:listCustomItems

# 4. 推送配置
/cc-sync:push
```

---

Use the `setMode` tool from the cc-sync MCP Server to change the sync mode.

## Parameters

- `mode` (required): Sync mode to set
  - `basic`: Sync configuration files only
  - `full`: Full sync including plugins, cache, marketplace data
  - `custom`: Custom sync with user-defined file/directory list
- `useLFS` (optional): Enable/disable Git LFS

## Examples

```
# Switch to basic mode (configs only)
/cc-sync:setMode mode=basic

# Switch to full mode (complete sync with LFS)
/cc-sync:setMode mode=full

# Switch to full mode without LFS
/cc-sync:setMode mode=full useLFS=false

# Switch to custom mode
/cc-sync:setMode mode=custom
```

## Mode Comparison

| Mode | Content | Storage | Use Case |
|------|---------|---------|----------|
| **basic** | Configs, agents, skills | Smaller | Daily use, quick sync |
| **full** | All data + plugins + cache + sessions | Larger | Complete backup, full consistency |
| **custom** | User-defined | Variable | Precise control over sync content |

## Custom Mode Usage

After switching to custom mode:

```
# 1. Switch to custom mode
/cc-sync:setMode mode=custom

# 2. Add items you want to sync
/cc-sync:addCustomItem path=settings.json type=file
/cc-sync:addCustomItem path=plugins type=dir
/cc-sync:addCustomItem path=cache type=dir useLFS=true

# 3. List current items
/cc-sync:listCustomItems

# 4. Push configs
/cc-sync:push
```

# cc-sync

Claude Code 插件市场，用于使用 Git 同步 Claude Code 配置文件，支持 Git LFS 和自定义模式。

中文 | [**English**](README.md)

## 安装方式

### 方式 1: 添加 Marketplace 后安装

```bash
# 添加 marketplace
/plugin marketplace add <your-username>/cc-sync

# 安装插件
/plugin install cc-sync@<your-username>/cc-sync

# 或者安装到用户级别（所有项目可用）
/plugin install cc-sync@<your-username>/cc-sync --scope user
```

### 方式 2: 直接从本地安装

```bash
# 从本地目录安装
claude plugin install /path/to/cc-sync

# 或者安装到用户级别
claude plugin install /path/to/cc-sync --scope user
```

### 方式 3: 使用 --plugin-dir 测试（仅本地开发）

**重要**: 这仅用于测试，不会永久安装插件。

```bash
# 临时测试插件
claude --plugin-dir /path/to/cc-sync/plugins/cc-sync
```

### 方式 4: 复制到项目（项目级安装）

无需 marketplace 的项目级安装：

```bash
# 运行安装脚本
node /path/to/cc-sync/install.mjs

# 或手动复制
cp -r /path/to/cc-sync/plugins/cc-sync ./.claude-plugins/

# 或手动创建目录结构
mkdir -p ./.claude-plugins/cc-sync
# 将所有插件内容复制到 ./.claude-plugins/cc-sync/
```

### 方式 5: 从 Git 仓库安装

```bash
# 直接从 GitHub 仓库安装
claude plugin install <your-username>/cc-sync

# 或指定分支
claude plugin install <your-username>/cc-sync#main
```

## 插件功能

**cc-sync** 使用 Git 同步 Claude Code 配置，具有以下特性：

- **三种同步模式**
  - **Basic**（基础）: 仅配置文件（推荐日常使用）
  - **Full**（全面）: 配置 + 插件 + 缓存，使用 Git LFS
  - **Custom**（自定义）: 用户自定义同步列表

- **Git LFS 支持**
  - 自动为大型缓存文件配置 LFS
  - 更小的仓库体积
  - 更快的克隆和拉取速度

- **自动同步**
  - 会话开始时自动拉取
  - 会话结束时自动推送

## 安装后使用

### 初始化同步仓库

```bash
# 基础模式（推荐）
/cc-sync:init ~/claude-config-sync

# 全面模式（含 LFS）
/cc-sync:init ~/claude-config-sync full

# 自定义模式
/cc-sync:init ~/claude-config-sync custom

# 全面模式但不使用 LFS
/cc-sync:init ~/claude-config-sync full useLFS=false
```

### 添加远程仓库

```bash
cd ~/claude-config-sync
git remote add origin https://github.com/<your-username>/claude-configs.git
git push -u origin main
```

### 手动命令

**核心命令：**
- `/cc-sync:push [mode]` - 推送配置到同步仓库
- `/cc-sync:pull [mode]` - 从同步仓库拉取配置
- `/cc-sync:status` - 显示同步状态

**模式管理：**
- `/cc-sync:setMode mode=<basic|full|custom> [useLFS=true|false]` - 更改同步模式
- `/cc-sync:getMode` - 查看当前模式和同步列表

**自定义模式命令：**
- `/cc-sync:addCustomItem path=<path> type=<file|dir> [optional=true|false] [useLFS=true|false]`
- `/cc-sync:removeCustomItem path=<path>`
- `/cc-sync:listCustomItems`

## 开发

如需修改或测试插件：

```bash
# 进入插件目录
cd cc-sync/plugins/cc-sync/mcp-server

# 安装依赖
npm install

# 构建 TypeScript
npm run build

# 使用 --plugin-dir 本地测试
claude --plugin-dir ../..
```

## 项目结构

```
cc-sync/
├── .claude-plugin/
│   └── marketplace.json          # Marketplace 清单
├── plugins/
│   └── cc-sync/                    # cc-sync 插件
│       ├── .claude-plugin/
│       │   └── plugin.json
│       ├── commands/               # 命令文件（共 9 个）
│       │   ├── init.md
│       │   ├── push.md
│       │   ├── pull.md
│       │   ├── status.md
│       │   ├── setMode.md
│       │   ├── getMode.md
│       │   ├── addCustomItem.md
│       │   ├── removeCustomItem.md
│       │   └── listCustomItems.md
│       ├── hooks/
│       │   └── hooks.json          # 自动同步钩子
│       ├── mcp-server/
│       │   ├── src/
│       │   │   └── index.ts          # MCP 服务器（LFS + 自定义支持）
│       │   ├── dist/                 # 编译后的 JavaScript
│       │   ├── package.json
│       │   └── tsconfig.json
│       ├── .mcp.json                 # MCP 服务器配置
│       ├── README.md                 # 插件文档（英文）
│       ├── README.zh-CN.md           # 插件文档（中文）
│       └── install.mjs               # 项目级安装脚本
├── README.md                         # Marketplace 文档（英文）
└── README.zh-CN.md                   # Marketplace 文档（中文）
```

## 发布到 GitHub

要发布此 marketplace：

1. 将 `cc-sync` 推送到 GitHub
2. 用户安装方式：
   ```bash
   /plugin marketplace add <your-username>/cc-sync
   /plugin install cc-sync@<your-username>/cc-sync
   ```

## 许可证

MIT

## 贡献

欢迎提交 Pull Request！

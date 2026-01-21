# cc-sync

Claude Code plugin marketplace for syncing Claude Code configuration files using Git with LFS and custom mode support.

[**中文文档**](README.zh-CN.md) | English

## Installation

### Method 1: Add Marketplace then Install

```bash
# Add marketplace
/plugin marketplace add <your-username>/cc-sync

# Install plugin
/plugin install cc-sync@<your-username>/cc-sync

# Or install at user scope (available for all projects)
/plugin install cc-sync@<your-username>/cc-sync --scope user
```

### Method 2: Install from Local Directory (Development)

```bash
# Install from local marketplace directory
claude plugin install /path/to/cc-sync

# Or at user scope
claude plugin install /path/to/cc-sync --scope user
```

### Method 3: Test with --plugin-dir (Local Development Only)

**Important**: This is for testing only and does NOT install the plugin permanently.

```bash
# Test the plugin temporarily
claude --plugin-dir /path/to/cc-sync/plugins/cc-sync
```

### Method 4: Copy to Project (Project-Specific Installation)

For project-specific installation without using marketplace:

```bash
# Copy plugin to your project
cp -r /path/to/cc-sync/plugins/cc-sync ./.claude-plugins/

# Or manually create the directory structure
mkdir -p ./.claude-plugins/cc-sync
# Copy all plugin content to ./.claude-plugins/cc-sync/
```

### Method 5: Install via Git Repository

```bash
# Install directly from GitHub repository
claude plugin install <your-username>/cc-sync

# Or specify a branch
claude plugin install <your-username>/cc-sync#main
```

## Plugin Features

**cc-sync** syncs Claude Code configurations using Git with:

- **Three Sync Modes**
  - **Basic**: Config files only (recommended for daily use)
  - **Full**: Configs + plugins + cache with Git LFS
  - **Custom**: User-defined sync list

- **Git LFS Support**
  - Auto-configures LFS for large cache files
  - Smaller repository size
  - Faster clone and pull operations

- **Automatic Sync**
  - Auto-pull on session start
  - Auto-push on session end

## Usage After Installation

### Initialize Sync Repository

```bash
# Basic mode (recommended)
/cc-sync:init ~/claude-config-sync

# Full mode (with LFS)
/cc-sync:init ~/claude-config-sync full

# Custom mode (user-defined)
/cc-sync:init ~/claude-config-sync custom

# Full mode without LFS
/cc-sync:init ~/claude-config-sync full useLFS=false
```

### Add Remote Repository

```bash
cd ~/claude-config-sync
git remote add origin https://github.com/<your-username>/claude-configs.git
git push -u origin main
```

### Manual Commands

**Core Commands:**
- `/cc-sync:push [mode]` - Push configs to sync repository
- `/cc-sync:pull [mode]` - Pull configs from sync repository
- `/cc-sync:status` - Show sync status

**Mode Management:**
- `/cc-sync:setMode mode=<basic|full|custom> [useLFS=true|false]` - Change sync mode
- `/cc-sync:getMode` - View current mode and sync list

**Custom Mode Commands:**
- `/cc-sync:addCustomItem path=<path> type=<file|dir> [optional=true|false] [useLFS=true|false]`
- `/cc-sync:removeCustomItem path=<path>`
- `/cc-sync:listCustomItems`

## Development

To modify or test the plugin:

```bash
# Navigate to plugin directory
cd cc-sync/plugins/cc-sync/mcp-server

# Install dependencies
npm install

# Build TypeScript
npm run build

# Test locally with --plugin-dir
claude --plugin-dir ../..
```

## Project Structure

```
cc-sync/
├── .claude-plugin/
│   └── marketplace.json          # Marketplace manifest
├── plugins/
│   └── cc-sync/                    # cc-sync plugin
│       ├── .claude-plugin/
│       │   └── plugin.json
│       ├── commands/               # Command files (9 total)
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
│       │   └── hooks.json          # Auto-sync hooks
│       ├── mcp-server/
│       │   ├── src/
│       │   │   └── index.ts          # MCP Server (LFS + Custom support)
│       │   ├── dist/                 # Compiled JavaScript
│       │   ├── package.json
│       │   └── tsconfig.json
│       ├── .mcp.json                 # MCP Server configuration
│       ├── README.md                 # Plugin documentation (English)
│       └── README.zh-CN.md             # Plugin documentation (Chinese)
└── README.md                         # Marketplace documentation
```

## Publish to GitHub

To publish this marketplace:

1. Push `cc-sync` to GitHub
2. Users install with:
   ```bash
   /plugin marketplace add <your-username>/cc-sync
   /plugin install cc-sync@<your->/cc-sync
   ```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

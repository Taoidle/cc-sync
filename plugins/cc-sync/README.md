# cc-sync

A Claude Code plugin that synchronizes your Claude Code configuration files using Git, with support for Git LFS and custom sync modes.

[**中文文档**](README.zh-CN.md) | English

## Features

- **Three Sync Modes**: Choose between basic (configs only), full (configs + plugins + cache), or custom (user-defined)
- **Git LFS Support**: Automatically uses Git LFS for large cache files in full mode
- **Automatic Sync**: Automatically pulls configs on session start and pushes on session end via Hooks
- **Manual Commands**: Full control with commands for init, push, pull, status, mode management, and custom item management
- **MCP Server**: Provides tools for sync operations
- **Safe**: Detects conflicts and doesn't auto-merge

## Installation

### Prerequisites

1. **Git**: Required for all modes
2. **Git LFS** (Optional but recommended for full mode): For handling large cache files
   - Windows: Included with Git for Windows
   - macOS: `brew install git-lfs && git lfs install`
   - Linux: Download from https://git-lfs.github.com/

### Install Plugin

1. Clone this repository:
```bash
git clone https://github.com/your-username/cc-sync.git
cd cc-sync
```

2. Install dependencies:
```bash
cd mcp-server
npm install
npm run build
```

3. Add the plugin to Claude Code:
```bash
claude plugin install /path/to/cc-sync
```

Or for user-level installation (all projects):
```bash
claude plugin install /path/to/cc-sync --scope user
```

## Usage

### Initial Setup

1. Initialize the sync repository with a sync mode:
```
# Basic mode (configs only) - recommended for daily use
/cc-sync:init ~/claude-config-sync

# Full mode (configs + plugins + cache with LFS) - for complete backup
/cc-sync:init ~/claude-config-sync full

# Custom mode (user-defined sync list) - for maximum flexibility
/cc-sync:init ~/claude-config-sync custom

# Full mode without LFS
/cc-sync:init ~/claude-config-sync full useLFS=false
```

2. Add a remote Git repository:
```bash
cd ~/claude-config-sync
git remote add origin https://github.com/your-username/claude-configs.git
git branch -M main
git push -u origin main
```

### Manual Commands

**Core Commands:**
- `/cc-sync:init [repoPath] [mode] [useLFS]` - Initialize sync repository
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

### Automatic Sync

The plugin includes hooks that:
- **Pull** configs when Claude Code starts (SessionStart hook)
- **Push** configs when Claude Code exits (SessionEnd hook)

## Sync Modes

### Basic Mode (Default)

Syncs only core configuration files:

| File/Directory | Description |
|----------------|-------------|
| `~/.claude/settings.json` | Global settings |
| `~/.claude/CLAUDE.md` | Project memory |
| `~/.claude.json` | MCP servers configuration |
| `~/.claude/agents/` | Custom subagents |
| `~/.claude/skills/` | Custom skills |

**Best for**: Daily use, quick sync, minimal storage

### Full Mode

Syncs everything in Basic mode plus:

| File/Directory | Description |
|----------------|-------------|
| `~/.claude/plugins/` | Installed plugins |
| `~/.claude/plugins-cache/` | Plugin marketplace cache |
| `~/.claude/cache/` **[LFS]** | Application cache (using Git LFS) |
| `~/.claude/sessions/` **[LFS]** | Session history (using Git LFS) |
| `~/.claude/plans/` | Plan files |
| `~/.claude/state/` **[LFS]** | Application state (using Git LFS) |
| `~/.claude/hooks/` | Hook configuration |
| `~/.claude/mcp-servers/` | MCP servers |

**[LFS]** indicates items tracked with Git LFS for efficient large file handling.

**Best for**: Complete backup, full consistency across machines

### Custom Mode

Allows you to define exactly which files and directories to sync.

**Best for**: Precise control over sync content

#### Custom Mode Workflow

```
# 1. Switch to custom mode
/cc-sync:setMode mode=custom

# 2. Add items you want to sync
/cc-sync:addCustomItem path=settings.json type=file
/cc-sync:addCustomItem path=.claude.json type=file
/cc-sync:addCustomItem path=plugins type=dir
/cc-sync:addCustomItem path=agents type=dir
/cc-sync:addCustomItem path=skills type=dir

# 3. Add cache with LFS for large files
/cc-sync:addCustomItem path=cache type=dir useLFS=true
/cc-sync:addCustomItem path=sessions type=dir useLFS=true

# 4. View your custom list
/cc-sync:listCustomItems

# 5. Remove unwanted items
/cc-sync:removeCustomItem path=sessions

# 6. Push to sync
/cc-sync:push
```

## Mode Comparison

| Feature | Basic | Full | Custom |
|---------|-------|------|--------|
| Config files | ✓ | ✓ | User choice |
| Agents & Skills | ✓ | ✓ | User choice |
| Plugins | ✗ | ✓ | User choice |
| Cache & Sessions | ✗ | ✓ (LFS) | User choice |
| LFS Support | ✗ | Auto (cache) | Optional |
| Storage Size | Small | Large | Variable |
| Sync Speed | Fast | Slower | Variable |
| Use Case | Daily use | Complete backup | Precise control |

## Git LFS

Git LFS (Large File Storage) is used to efficiently handle large files like cache and session data.

**Benefits:**
- Smaller Git repository size
- Faster clone and pull operations
- Large files stored separately

**Items using LFS in Full Mode:**
- `~/.claude/cache/` - Application cache
- `~/.claude/sessions/` - Session history
- `~/.claude/state/` - Application state

**Setup:**
- LFS is automatically configured when using full mode (if Git LFS is installed)
- You can disable LFS with `useLFS=false` when initializing
- For custom mode, enable LFS per-item with `useLFS=true` when adding items

## Configuration

The sync configuration is stored in `~/.cc-sync-config.json`:

```json
{
  "syncRepoPath": "/path/to/sync/repo",
  "initialized": true,
  "syncMode": "basic",  // or "full" or "custom"
  "useLFS": true,       // whether LFS is enabled
  "customItems": [...]  // for custom mode only
}
```

## Project Structure

```
cc-sync/
├── .claude-plugin/
│   └── plugin.json          # Plugin manifest
├── commands/
│   ├── init.md              # Initialize sync repo
│   ├── push.md              # Push configs
│   ├── pull.md              # Pull configs
│   ├── status.md            # Show status
│   ├── setMode.md           # Set sync mode
│   ├── getMode.md           # Get current mode
│   ├── addCustomItem.md     # Add custom sync item
│   ├── removeCustomItem.md  # Remove custom item
│   └── listCustomItems.md   # List custom items
├── hooks/
│   └── hooks.json           # Auto-sync hooks
├── mcp-server/
│   ├── src/
│   │   └── index.ts         # MCP Server implementation
│   ├── dist/                # Compiled JavaScript
│   ├── package.json
│   └── tsconfig.json
├── .mcp.json                # MCP Server configuration
├── README.md                # English documentation
└── README.zh-CN.md          # Chinese documentation
```

## Development

1. Make changes to the TypeScript source in `mcp-server/src/`
2. Rebuild: `cd mcp-server && npm run build`
3. Reload Claude Code or reinstall the plugin

## Troubleshooting

### "Git LFS is not installed"
Install Git LFS from https://git-lfs.github.com/
Or use `useLFS=false` when initializing or setting mode.

### "Sync not initialized"
Run `/cc-sync:init` first to set up the sync repository.

### Push fails with "no remote"
Add a remote to your sync repository:
```bash
cd ~/claude-config-sync
git remote add origin <your-repo-url>
git push -u origin main
```

### Merge conflicts
Resolve conflicts manually in the sync repository:
```bash
cd ~/claude-config-sync
# Resolve conflicts
git add .
git commit
```

### Custom mode not working?
Make sure you've added items to the custom list:
```
/cc-sync:listCustomItems
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

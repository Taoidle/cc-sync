#!/usr/bin/env node
/**
 * cc-sync MCP Server
 * Syncs Claude Code configuration files using Git
 * Supports basic sync (configs only), full sync (configs + plugins + cache),
 * and custom sync (user-defined file/directory list)
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { execSync } from "child_process";
import { existsSync, readFileSync, writeFileSync, mkdirSync, copyFileSync, readdirSync } from "fs";
import { homedir } from "os";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Basic configuration files/directories to sync (configs only)
const BASIC_CONFIG_ITEMS = [
    { path: ".claude/settings.json", type: "file" },
    { path: ".claude/CLAUDE.md", type: "file", optional: true },
    { path: ".claude.json", type: "file" },
    { path: ".claude/agents", type: "dir", optional: true },
    { path: ".claude/skills", type: "dir", optional: true },
];
// Full sync includes plugins, cache, and marketplace data
// Cache directories use LFS
const FULL_CONFIG_ITEMS = [
    ...BASIC_CONFIG_ITEMS,
    // Plugins and marketplace
    { path: ".claude/plugins", type: "dir", optional: true },
    { path: ".claude/plugins-cache", type: "dir", optional: true },
    // Cache directories - use LFS
    { path: ".claude/cache", type: "dir", optional: true, useLFS: true },
    { path: ".claude/sessions", type: "dir", optional: true, useLFS: true },
    { path: ".claude/plans", type: "dir", optional: true },
    { path: ".claude/state", type: "dir", optional: true, useLFS: true },
    // Additional configuration
    { path: ".claude/hooks", type: "dir", optional: true },
    { path: ".claude/mcp-servers", type: "dir", optional: true },
];
// Default custom sync items (user can modify)
const DEFAULT_CUSTOM_ITEMS = [
    ...BASIC_CONFIG_ITEMS,
    { path: ".claude/plugins", type: "dir", optional: true },
    { path: ".claude/agents", type: "dir", optional: true },
    { path: ".claude/skills", type: "dir", optional: true },
];
// Config file for sync repository location
const SYNC_CONFIG_FILE = join(homedir(), ".cc-sync-config.json");
/**
 * Get the sync configuration
 */
function getSyncConfig() {
    try {
        if (!existsSync(SYNC_CONFIG_FILE)) {
            return null;
        }
        const content = readFileSync(SYNC_CONFIG_FILE, "utf-8");
        const config = JSON.parse(content);
        // Default to basic mode for backward compatibility
        if (!config.syncMode) {
            config.syncMode = "basic";
        }
        return config;
    }
    catch {
        return null;
    }
}
/**
 * Save the sync configuration
 */
function saveSyncConfig(config) {
    writeFileSync(SYNC_CONFIG_FILE, JSON.stringify(config, null, 2));
}
/**
 * Get Claude config directory path
 */
function getClaudeConfigDir() {
    return join(homedir(), ".claude");
}
/**
 * Get config items based on sync mode
 */
function getConfigItems(mode, customItems) {
    switch (mode) {
        case "basic":
            return BASIC_CONFIG_ITEMS;
        case "full":
            return FULL_CONFIG_ITEMS;
        case "custom":
            return customItems || DEFAULT_CUSTOM_ITEMS;
        default:
            return BASIC_CONFIG_ITEMS;
    }
}
/**
 * Check if git is available
 */
function checkGitAvailable() {
    try {
        execSync("git --version", { stdio: "ignore" });
        return true;
    }
    catch {
        return false;
    }
}
/**
 * Check if git LFS is available
 */
function checkLFSAvailable() {
    try {
        execSync("git lfs version", { stdio: "ignore" });
        return true;
    }
    catch {
        return false;
    }
}
/**
 * Execute git command in a directory
 */
function execGit(cmd, cwd) {
    try {
        return execSync(cmd, { cwd, encoding: "utf-8" });
    }
    catch (error) {
        throw new Error(`Git command failed: ${error.message}`);
    }
}
/**
 * Copy directory recursively
 */
function copyDirRecursive(src, dest) {
    if (!existsSync(dest)) {
        mkdirSync(dest, { recursive: true });
    }
    const entries = readdirSync(src, { withFileTypes: true });
    for (const entry of entries) {
        const srcPath = join(src, entry.name);
        const destPath = join(dest, entry.name);
        if (entry.isDirectory()) {
            copyDirRecursive(srcPath, destPath);
        }
        else {
            mkdirSync(dirname(destPath), { recursive: true });
            copyFileSync(srcPath, destPath);
        }
    }
}
/**
 * Setup Git LFS for specific patterns
 */
function setupLFS(repoPath, items) {
    const lfsItems = items.filter(item => item.useLFS);
    if (lfsItems.length === 0) {
        return;
    }
    // Initialize LFS
    try {
        execGit("git lfs install", repoPath);
    }
    catch (error) {
        // LFS might already be initialized, continue
    }
    // Configure LFS patterns for cache directories
    const lfsPatterns = lfsItems.map(item => {
        if (item.type === "dir") {
            return `${item.path.replace(/^\.claude/, ".claude")}/**`;
        }
        return item.path;
    });
    // Create or update .gitattributes
    const gitattributesPath = join(repoPath, ".gitattributes");
    let attributes = "";
    if (existsSync(gitattributesPath)) {
        attributes = readFileSync(gitattributesPath, "utf-8");
    }
    // Add LFS patterns
    for (const pattern of lfsPatterns) {
        const attrLine = `${pattern} filter=lfs diff=lfs merge=lfs -text\n`;
        if (!attributes.includes(attrLine.trim())) {
            attributes += attrLine;
        }
    }
    writeFileSync(gitattributesPath, attributes);
}
/**
 * Initialize sync repository
 */
function initSyncRepo(repoPath, syncMode = "basic", useLFS = true) {
    // Check if git is available
    if (!checkGitAvailable()) {
        return {
            success: false,
            message: "Git is not installed or not available in PATH. Please install Git first.",
        };
    }
    // Check LFS availability if needed
    if (useLFS && syncMode === "full" && !checkLFSAvailable()) {
        return {
            success: false,
            message: "Git LFS is not installed. Git LFS is recommended for full mode to handle large cache files.\n\nInstall Git LFS from: https://git-lfs.github.com/\n\nOr initialize with LFS disabled:\n/cc-sync:init ~/claude-config-sync full useLFS=false",
        };
    }
    // Expand ~ in path
    const expandedPath = repoPath.replace(/^~/, homedir());
    // Create directory if it doesn't exist
    if (!existsSync(expandedPath)) {
        mkdirSync(expandedPath, { recursive: true });
    }
    // Initialize git repo
    try {
        execGit("git init", expandedPath);
        // Get config items for this mode
        const configItems = getConfigItems(syncMode);
        // Setup LFS if requested and items need it
        if (useLFS) {
            setupLFS(expandedPath, configItems);
        }
        // Create a .gitignore for Claude-specific patterns
        const gitignorePath = join(expandedPath, ".gitignore");
        if (!existsSync(gitignorePath)) {
            const gitignoreContent = syncMode === "full"
                ? `# Claude Code full sync
# Local settings (machine-specific)
.claude/settings.local.json
.claude/*.local.json
# Session locks and temporary files
*.lock
*.tmp
# OS files
.DS_Store
Thumbs.db
# Large binary files (handled by LFS if enabled)
# .claude/cache/**/*.db
# .claude/cache/**/*.log
`
                : `# Claude Code basic sync
# Local settings (machine-specific)
.claude/settings.local.json
.claude/*.local.json
# OS files
.DS_Store
Thumbs.db
`;
            writeFileSync(gitignorePath, gitignoreContent);
        }
        // Save config
        saveSyncConfig({
            syncRepoPath: expandedPath,
            initialized: true,
            syncMode,
            useLFS,
            customItems: syncMode === "custom" ? DEFAULT_CUSTOM_ITEMS : undefined,
        });
        const modeDescription = syncMode === "full"
            ? "Full sync mode: configs, plugins, cache, and marketplace data"
            : syncMode === "custom"
                ? "Custom sync mode: user-defined file/directory list"
                : "Basic sync mode: configuration files only";
        const lfsInfo = useLFS && (syncMode === "full" || syncMode === "custom")
            ? "\nGit LFS: Enabled for large cache directories"
            : "";
        return {
            success: true,
            message: `Sync repository initialized at: ${expandedPath}\n\nMode: ${modeDescription}${lfsInfo}\n\nNext steps:\n1. Add a remote: cd "${expandedPath}" && git remote add origin <your-repo-url>\n2. Push: git push -u origin main\n\nNote: You can change sync mode later with the 'setMode' tool.`,
        };
    }
    catch (error) {
        return {
            success: false,
            message: `Failed to initialize repository: ${error.message}`,
        };
    }
}
/**
 * Set sync mode
 */
function setSyncMode(mode, useLFS) {
    const config = getSyncConfig();
    if (!config || !config.initialized) {
        return {
            success: false,
            message: "Sync not initialized. Run the 'init' tool first.",
        };
    }
    // Check LFS if switching to full mode
    if (mode === "full" && useLFS !== false && !checkLFSAvailable()) {
        return {
            success: false,
            message: "Git LFS is not installed. Please install Git LFS or use useLFS=false.\n\nInstall Git LFS from: https://git-lfs.github.com/",
        };
    }
    config.syncMode = mode;
    if (useLFS !== undefined) {
        config.useLFS = useLFS;
    }
    // If switching to custom mode, initialize custom items
    if (mode === "custom" && !config.customItems) {
        config.customItems = DEFAULT_CUSTOM_ITEMS;
    }
    saveSyncConfig(config);
    const modeDescription = mode === "full"
        ? "Full sync: configs, plugins, cache, marketplace data"
        : mode === "custom"
            ? "Custom sync: user-defined file/directory list"
            : "Basic sync: configuration files only";
    const lfsInfo = config.useLFS && (mode === "full" || mode === "custom")
        ? "\nGit LFS: Enabled"
        : "";
    return {
        success: true,
        message: `Sync mode set to: ${mode}\n\n${modeDescription}${lfsInfo}\n\nRun 'push' to sync with the new mode.`,
    };
}
/**
 * Get current sync mode
 */
function getSyncModeInfo() {
    const config = getSyncConfig();
    if (!config || !config.initialized) {
        return {
            success: false,
            message: "Sync not initialized. Run the 'init' tool first.",
        };
    }
    const mode = config.syncMode || "basic";
    const modeDescription = mode === "full"
        ? "Full sync: configs, plugins, cache, marketplace data"
        : mode === "custom"
            ? "Custom sync: user-defined file/directory list"
            : "Basic sync: configuration files only";
    const items = getConfigItems(mode, config.customItems);
    const itemsList = items.map(i => {
        const lfsMarker = i.useLFS ? " [LFS]" : "";
        return `  - ${i.path} (${i.type})${lfsMarker}`;
    }).join("\n");
    const lfsInfo = config.useLFS ? "\nGit LFS: Enabled" : "";
    return {
        success: true,
        message: `Current sync mode: ${mode}\n\n${modeDescription}${lfsInfo}\n\nItems to sync:\n${itemsList}`,
        mode,
    };
}
/**
 * Add item to custom sync list
 */
function addCustomItem(item) {
    const config = getSyncConfig();
    if (!config || !config.initialized) {
        return {
            success: false,
            message: "Sync not initialized. Run the 'init' tool first.",
        };
    }
    if (config.syncMode !== "custom") {
        return {
            success: false,
            message: "Custom items can only be managed in custom mode. Use 'setMode' to switch to custom mode first.",
        };
    }
    if (!config.customItems) {
        config.customItems = [];
    }
    // Check if item already exists
    const exists = config.customItems.some(i => i.path === item.path);
    if (exists) {
        return {
            success: false,
            message: `Item '${item.path}' already exists in custom sync list.`,
        };
    }
    config.customItems.push(item);
    saveSyncConfig(config);
    return {
        success: true,
        message: `Added '${item.path}' to custom sync list.\n\nType: ${item.type}${item.useLFS ? " (using LFS)" : ""}`,
    };
}
/**
 * Remove item from custom sync list
 */
function removeCustomItem(path) {
    const config = getSyncConfig();
    if (!config || !config.initialized) {
        return {
            success: false,
            message: "Sync not initialized. Run the 'init' tool first.",
        };
    }
    if (config.syncMode !== "custom" || !config.customItems) {
        return {
            success: false,
            message: "No custom items configured.",
        };
    }
    const index = config.customItems.findIndex(i => i.path === path);
    if (index === -1) {
        return {
            success: false,
            message: `Item '${path}' not found in custom sync list.`,
        };
    }
    const removed = config.customItems.splice(index, 1)[0];
    saveSyncConfig(config);
    return {
        success: true,
        message: `Removed '${removed.path}' from custom sync list.`,
    };
}
/**
 * List custom sync items
 */
function listCustomItems() {
    const config = getSyncConfig();
    if (!config || !config.initialized) {
        return {
            success: false,
            message: "Sync not initialized. Run the 'init' tool first.",
        };
    }
    if (!config.customItems || config.customItems.length === 0) {
        return {
            success: true,
            message: "No custom items configured.\n\nUse 'addCustomItem' to add files or directories.",
        };
    }
    const itemsList = config.customItems.map((i, idx) => {
        const lfsMarker = i.useLFS ? " [LFS]" : "";
        return `${idx + 1}. ${i.path} (${i.type})${lfsMarker}`;
    }).join("\n");
    return {
        success: true,
        message: `Custom sync items (${config.customItems.length}):\n\n${itemsList}`,
    };
}
/**
 * Push configs to sync repository
 */
function pushConfigs(options) {
    const config = getSyncConfig();
    if (!config || !config.initialized) {
        return {
            success: false,
            message: "Sync not initialized. Run the 'init' tool first.",
        };
    }
    // Use provided mode or config mode
    const syncMode = options?.mode || config.syncMode || "basic";
    const claudeDir = getClaudeConfigDir();
    const syncDir = config.syncRepoPath;
    const configItems = getConfigItems(syncMode, config.customItems);
    try {
        // Check for uncommitted changes in sync repo
        const status = execGit("git status --porcelain", syncDir);
        if (status.trim()) {
            return {
                success: false,
                message: `Sync repository has uncommitted changes. Please resolve them first:\n${status}`,
            };
        }
        // Pull latest changes first
        try {
            execGit("git pull", syncDir);
        }
        catch {
            // Pull might fail if no remote or diverged, continue
        }
        // Copy config files to sync repo
        let hasChanges = false;
        const syncDetails = [];
        for (const item of configItems) {
            const sourcePath = join(claudeDir, item.path);
            const destPath = join(syncDir, item.path);
            if (existsSync(sourcePath)) {
                // Create destination directory
                mkdirSync(dirname(destPath), { recursive: true });
                if (item.type === "file") {
                    copyFileSync(sourcePath, destPath);
                    syncDetails.push(`  ✓ ${item.path}${item.useLFS ? " [LFS]" : ""}`);
                    hasChanges = true;
                }
                else if (item.type === "dir") {
                    try {
                        copyDirRecursive(sourcePath, destPath);
                        const fileCount = countFiles(sourcePath);
                        const lfsMarker = item.useLFS ? " [LFS]" : "";
                        syncDetails.push(`  ✓ ${item.path} (${fileCount} files)${lfsMarker}`);
                        hasChanges = true;
                    }
                    catch (e) {
                        if (!item.optional) {
                            return {
                                success: false,
                                message: `Failed to copy ${item.path}: ${e.message}`,
                            };
                        }
                    }
                }
            }
            else if (!item.optional) {
                return {
                    success: false,
                    message: `Required config item not found: ${item.path}`,
                };
            }
        }
        if (!hasChanges) {
            return {
                success: true,
                message: `No configuration files to sync (${syncMode} mode).`,
            };
        }
        // Check for changes
        const diffStatus = execGit("git status --porcelain", syncDir);
        if (!diffStatus.trim()) {
            return {
                success: true,
                message: "No changes to commit.",
            };
        }
        // Add all files
        execGit("git add .", syncDir);
        // Commit
        const commitMessage = options?.message || `chore: sync Claude Code configs (${syncMode}) - ${new Date().toISOString()}`;
        execGit(`git commit -m "${commitMessage}"`, syncDir);
        // Push if remote exists
        try {
            execGit("git push", syncDir);
            return {
                success: true,
                message: `Configs pushed successfully! (${syncMode} mode)\n\nSynced items:\n${syncDetails.join("\n")}\n\nCommit: ${commitMessage}`,
            };
        }
        catch {
            return {
                success: true,
                message: `Configs committed locally (${syncMode} mode) (push failed - no remote or network issue)\n\nSynced items:\n${syncDetails.join("\n")}\n\nCommit: ${commitMessage}\n\nPush manually with: cd "${syncDir}" && git push`,
            };
        }
    }
    catch (error) {
        return {
            success: false,
            message: `Failed to push configs: ${error.message}`,
        };
    }
}
/**
 * Count files in a directory recursively
 */
function countFiles(dir) {
    let count = 0;
    try {
        const entries = readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = join(dir, entry.name);
            if (entry.isDirectory()) {
                count += countFiles(fullPath);
            }
            else if (entry.isFile()) {
                count++;
            }
        }
    }
    catch {
        // Directory might not exist or be inaccessible
    }
    return count;
}
/**
 * Pull configs from sync repository
 */
function pullConfigs(options) {
    const config = getSyncConfig();
    if (!config || !config.initialized) {
        return {
            success: false,
            message: "Sync not initialized. Run the 'init' tool first.",
        };
    }
    // Use provided mode or config mode
    const syncMode = options?.mode || config.syncMode || "basic";
    const claudeDir = getClaudeConfigDir();
    const syncDir = config.syncRepoPath;
    const configItems = getConfigItems(syncMode, config.customItems);
    try {
        // Pull latest changes (including LFS files)
        try {
            execGit("git pull", syncDir);
            if (config.useLFS) {
                execGit("git lfs pull", syncDir);
            }
        }
        catch (error) {
            return {
                success: false,
                message: `Failed to pull from remote: ${error.message}\n\nCheck your network connection and remote configuration.`,
            };
        }
        // Copy files from sync repo to Claude config dir
        let copiedCount = 0;
        const syncDetails = [];
        for (const item of configItems) {
            const sourcePath = join(syncDir, item.path);
            const destPath = join(claudeDir, item.path);
            if (existsSync(sourcePath)) {
                // Create destination directory
                mkdirSync(dirname(destPath), { recursive: true });
                if (item.type === "file") {
                    copyFileSync(sourcePath, destPath);
                    syncDetails.push(`  ✓ ${item.path}`);
                    copiedCount++;
                }
                else if (item.type === "dir") {
                    try {
                        copyDirRecursive(sourcePath, destPath);
                        const fileCount = countFiles(destPath);
                        const lfsMarker = item.useLFS ? " [LFS]" : "";
                        syncDetails.push(`  ✓ ${item.path} (${fileCount} files)${lfsMarker}`);
                        copiedCount++;
                    }
                    catch (e) {
                        // Directory might be empty, ignore
                    }
                }
            }
        }
        return {
            success: true,
            message: `Configs pulled successfully! (${syncMode} mode)\n\nCopied ${copiedCount} items from sync repository.\n\nSynced items:\n${syncDetails.join("\n")}`,
        };
    }
    catch (error) {
        return {
            success: false,
            message: `Failed to pull configs: ${error.message}`,
        };
    }
}
/**
 * Get sync status
 */
function getSyncStatus() {
    const config = getSyncConfig();
    if (!config || !config.initialized) {
        return {
            success: false,
            message: "Sync not initialized. Run the 'init' tool first.",
        };
    }
    const syncDir = config.syncRepoPath;
    const syncMode = config.syncMode || "basic";
    try {
        // Get git status
        const status = execGit("git status --short", syncDir);
        const branch = execGit("git branch --show-current", syncDir).trim();
        const remote = execGit("git remote get-url origin 2>/dev/null || echo 'none'", syncDir).trim();
        // Check LFS status
        let lfsInfo = "";
        if (config.useLFS) {
            try {
                const lfsStatus = execGit("git lfs status", syncDir);
                lfsInfo = "\n  - LFS: Enabled";
            }
            catch {
                lfsInfo = "\n  - LFS: Configured but no LFS files tracked";
            }
        }
        // Check for unpushed commits
        let unpushedInfo = "";
        try {
            const unpushed = execGit("git log @{u}.. 2>/dev/null || echo ''", syncDir).trim();
            if (unpushed) {
                const lines = unpushed.split("\n").filter((l) => l.trim()).length;
                unpushedInfo = `\n  - Unpushed commits: ${lines}`;
            }
        }
        catch {
            // No upstream or error, ignore
        }
        // Check for unpulled changes
        let unpulledInfo = "";
        try {
            const unpulled = execGit("git log ..@{u} 2>/dev/null || echo ''", syncDir).trim();
            if (unpulled) {
                const lines = unpulled.split("\n").filter((l) => l.trim()).length;
                unpulledInfo = `\n  - Unpulled commits: ${lines}`;
            }
        }
        catch {
            // No upstream or error, ignore
        }
        const modeDescription = syncMode === "full"
            ? "Full sync: configs, plugins, cache, marketplace"
            : syncMode === "custom"
                ? "Custom sync: user-defined items"
                : "Basic sync: configs only";
        return {
            success: true,
            message: `Sync Status:\n  - Repository: ${syncDir}\n  - Mode: ${modeDescription}${lfsInfo}\n  - Branch: ${branch}\n  - Remote: ${remote}\n  - Local changes: ${status.trim() ? "Yes" : "No"}${unpushedInfo}${unpulledInfo}\n\n${status || "  (no local changes)"}`,
        };
    }
    catch (error) {
        return {
            success: false,
            message: `Failed to get status: ${error.message}`,
        };
    }
}
// Create MCP Server
const server = new Server({
    name: "cc-sync",
    version: "1.0.0",
}, {
    capabilities: {
        tools: {},
    },
});
// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: "init",
                description: "Initialize the sync repository. Creates a git repository to store Claude Code configurations.",
                inputSchema: {
                    type: "object",
                    properties: {
                        repoPath: {
                            type: "string",
                            description: "Path where the sync repository should be created (e.g., ~/claude-config-sync)",
                        },
                        mode: {
                            type: "string",
                            enum: ["basic", "full", "custom"],
                            description: "Sync mode: 'basic' for configs only, 'full' for configs + plugins + cache, 'custom' for user-defined list (default: 'basic')",
                        },
                        useLFS: {
                            type: "boolean",
                            description: "Enable Git LFS for large cache files (default: true for full mode)",
                        },
                    },
                    required: ["repoPath"],
                },
            },
            {
                name: "push",
                description: "Push Claude Code configurations to the sync repository. Copies configs, commits, and pushes to remote.",
                inputSchema: {
                    type: "object",
                    properties: {
                        message: {
                            type: "string",
                            description: "Optional commit message (default: auto-generated with timestamp)",
                        },
                        mode: {
                            type: "string",
                            enum: ["basic", "full", "custom"],
                            description: "Override sync mode for this push (default: use configured mode)",
                        },
                    },
                },
            },
            {
                name: "pull",
                description: "Pull Claude Code configurations from the sync repository. Fetches from remote and copies to config directory.",
                inputSchema: {
                    type: "object",
                    properties: {
                        mode: {
                            type: "string",
                            enum: ["basic", "full", "custom"],
                            description: "Override sync mode for this pull (default: use configured mode)",
                        },
                    },
                },
            },
            {
                name: "status",
                description: "Show the current synchronization status, including local changes and remote sync state.",
                inputSchema: {
                    type: "object",
                    properties: {},
                },
            },
            {
                name: "setMode",
                description: "Set the sync mode. 'basic' syncs only configs, 'full' syncs configs + plugins + cache + marketplace data, 'custom' allows user-defined sync list.",
                inputSchema: {
                    type: "object",
                    properties: {
                        mode: {
                            type: "string",
                            enum: ["basic", "full", "custom"],
                            description: "Sync mode to set",
                        },
                        useLFS: {
                            type: "boolean",
                            description: "Enable/disable Git LFS (optional)",
                        },
                    },
                    required: ["mode"],
                },
            },
            {
                name: "getMode",
                description: "Get the current sync mode and list of items that will be synced.",
                inputSchema: {
                    type: "object",
                    properties: {},
                },
            },
            {
                name: "addCustomItem",
                description: "Add a file or directory to the custom sync list (only works in custom mode)",
                inputSchema: {
                    type: "object",
                    properties: {
                        path: {
                            type: "string",
                            description: "Path relative to ~/.claude/ (e.g., 'plugins', 'cache/sessions')",
                        },
                        type: {
                            type: "string",
                            enum: ["file", "dir"],
                            description: "Type of item (file or directory)",
                        },
                        optional: {
                            type: "boolean",
                            description: "Whether this item is optional (default: false)",
                        },
                        useLFS: {
                            type: "boolean",
                            description: "Use Git LFS for this item (recommended for large files, default: false)",
                        },
                    },
                    required: ["path", "type"],
                },
            },
            {
                name: "removeCustomItem",
                description: "Remove a file or directory from the custom sync list",
                inputSchema: {
                    type: "object",
                    properties: {
                        path: {
                            type: "string",
                            description: "Path of the item to remove",
                        },
                    },
                    required: ["path"],
                },
            },
            {
                name: "listCustomItems",
                description: "List all items in the custom sync list",
                inputSchema: {
                    type: "object",
                    properties: {},
                },
            },
        ],
    };
});
// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    switch (name) {
        case "init":
            const repoPath = args.repoPath;
            const initMode = args.mode;
            const initUseLFS = args.useLFS;
            if (!repoPath) {
                return {
                    content: [
                        {
                            type: "text",
                            text: "Error: repoPath is required",
                        },
                    ],
                    isError: true,
                };
            }
            return initSyncRepo(repoPath, initMode, initUseLFS);
        case "push":
            return pushConfigs(args);
        case "pull":
            return pullConfigs(args);
        case "status":
            return getSyncStatus();
        case "setMode":
            const mode = args.mode;
            const setModeUseLFS = args.useLFS;
            if (!mode || (mode !== "basic" && mode !== "full" && mode !== "custom")) {
                return {
                    content: [
                        {
                            type: "text",
                            text: "Error: mode must be 'basic', 'full', or 'custom'",
                        },
                    ],
                    isError: true,
                };
            }
            return setSyncMode(mode, setModeUseLFS);
        case "getMode":
            return getSyncModeInfo();
        case "addCustomItem":
            return addCustomItem(args);
        case "removeCustomItem":
            const removePath = args.path;
            if (!removePath) {
                return {
                    content: [
                        {
                            type: "text",
                            text: "Error: path is required",
                        },
                    ],
                    isError: true,
                };
            }
            return removeCustomItem(removePath);
        case "listCustomItems":
            return listCustomItems();
        default:
            return {
                content: [
                    {
                        type: "text",
                        text: `Unknown tool: ${name}`,
                    },
                ],
                isError: true,
            };
    }
});
// Start server
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    // Server is now listening on stdin/stdout
}
main().catch((error) => {
    console.error("Server error:", error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map
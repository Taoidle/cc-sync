#!/usr/bin/env node
/**
 * cc-sync Installation Script
 * Installs the cc-sync plugin to the current project
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync, copyFileSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Source plugin path (relative to this script)
const PLUGIN_SOURCE = join(__dirname, "plugins", "cc-sync");
// Target directory in current project
const PLUGIN_TARGET = join(process.cwd(), ".claude-plugins", "cc-sync");

/**
 * Copy directory recursively
 */
function copyDirRecursive(src: string, dest: string): void {
  if (!existsSync(dest)) {
    mkdirSync(dest, { recursive: true });
  }

  const entries = readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = join(src, entry.name);
    const destPath = join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      mkdirSync(dirname(destPath), { recursive: true });
      copyFileSync(srcPath, destPath);
    }
  }
}

/**
 * Main installation function
 */
function install() {
  console.log("Installing cc-sync plugin to current project...\n");

  // Check if plugin source exists
  if (!existsSync(PLUGIN_SOURCE)) {
    console.error(`Error: Plugin source not found at: ${PLUGIN_SOURCE}`);
    console.log("\nPlease run this script from the cc-sync-marketplace root directory.");
    process.exit(1);
  }

  // Create target directory
  mkdirSync(PLUGIN_TARGET, { recursive: true });

  // Copy plugin files
  console.log(`Copying plugin from: ${PLUGIN_SOURCE}`);
  console.log(`To: ${PLUGIN_TARGET}\n`);

  try {
    // Copy all directories except node_modules
    const items = readdirSync(PLUGIN_SOURCE, { withFileTypes: true });

    for (const item of items) {
      if (item.name === "node_modules") continue;

      const srcPath = join(PLUGIN_SOURCE, item.name);
      const destPath = join(PLUGIN_TARGET, item.name);

      if (item.isDirectory()) {
        copyDirRecursive(srcPath, destPath);
        console.log(`✓ Copied directory: ${item.name}`);
      } else {
        mkdirSync(dirname(destPath), { recursive: true });
        copyFileSync(srcPath, destPath);
        console.log(`✓ Copied file: ${item.name}`);
      }
    }

    console.log("\n✓ Plugin installed successfully!");
    console.log("\nTo activate the plugin, restart Claude Code.");
    console.log("\nUsage:");
    console.log("  /cc-sync:init ~/claude-config-sync");
    console.log("  /cc-sync:push");
    console.log("  /cc-sync:pull");
    console.log("  /cc-sync:status");

  } catch (error) {
    console.error("\n✗ Installation failed:", error.message);
    process.exit(1);
  }
}

// Run installation
install();

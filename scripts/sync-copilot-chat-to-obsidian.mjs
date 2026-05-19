#!/usr/bin/env node

import { cp, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

function getArg(flag) {
  const index = process.argv.indexOf(flag);
  if (index === -1) return null;
  return process.argv[index + 1] || null;
}

async function listFilesRecursive(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const results = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const nested = await listFilesRecursive(fullPath);
      results.push(...nested);
      continue;
    }

    if (/\.(json|jsonl|log|txt|md)$/i.test(entry.name)) {
      results.push(fullPath);
    }
  }

  return results;
}

async function ensureIndexNote(indexPath) {
  try {
    await readFile(indexPath, "utf8");
  } catch {
    const base = [
      "---",
      "title: Copilot Chat History",
      "source: ts-residence-next",
      "---",
      "",
      "# Copilot Chat History",
      "",
      "This note is updated by scripts/sync-copilot-chat-to-obsidian.mjs",
      "",
    ].join("\n");
    await writeFile(indexPath, base, "utf8");
  }
}

async function appendSessionEntry(indexPath, sessionFolder, importedCount) {
  const now = new Date().toISOString();
  const line = `- ${now}: imported ${importedCount} files from ${sessionFolder}`;
  const existing = await readFile(indexPath, "utf8");
  await writeFile(indexPath, `${existing}\n${line}\n`, "utf8");
}

async function main() {
  const source = getArg("--source") || process.env.COPILOT_LOG_SOURCE;
  const vaultRoot = getArg("--vault") || process.env.OBSIDIAN_VAULT_PATH;

  if (!source) {
    console.error("Missing source path. Use --source or COPILOT_LOG_SOURCE.");
    process.exit(1);
  }

  if (!vaultRoot) {
    console.error("Missing vault path. Use --vault or OBSIDIAN_VAULT_PATH.");
    process.exit(1);
  }

  const sessionFolder = path.basename(source);
  const targetRoot = path.join(vaultRoot, "TS Residence", "Chat Logs", sessionFolder);
  await mkdir(targetRoot, { recursive: true });

  const files = await listFilesRecursive(source);
  for (const file of files) {
    const relative = path.relative(source, file);
    const destination = path.join(targetRoot, relative);
    await mkdir(path.dirname(destination), { recursive: true });
    await cp(file, destination);
  }

  const indexPath = path.join(vaultRoot, "TS Residence", "Chat Logs", "copilot-chat-history.md");
  await ensureIndexNote(indexPath);
  await appendSessionEntry(indexPath, sessionFolder, files.length);

  console.log(`Synced ${files.length} files to ${targetRoot}`);
}

main().catch((error) => {
  console.error("Failed to sync chat logs:", error);
  process.exit(1);
});

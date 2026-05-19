import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";

function getVaultRoot() {
  const value = process.env.OBSIDIAN_VAULT_PATH?.trim();
  return value ? value : null;
}

function buildFrontmatter(title: string) {
  const now = new Date().toISOString();
  return [
    "---",
    `title: ${title}`,
    "source: ts-residence-next",
    `updatedAt: ${now}`,
    "---",
    "",
  ].join("\n");
}

export interface UtmLogEntry {
  createdAt: string;
  createdBy: string;
  noteTitle: string;
  generatedUrl: string;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  utmContent?: string | null;
  utmTerm?: string | null;
  brand?: string;
}

export async function appendUtmLogToObsidian(entry: UtmLogEntry): Promise<boolean> {
  const vaultRoot = getVaultRoot();
  if (!vaultRoot) {
    return false;
  }

  const logsDir = path.join(vaultRoot, "TS Residence", "UTM Logs");
  const filePath = path.join(logsDir, "utm-link-history.md");
  const safeCreatedBy = (entry.createdBy || "team").trim();
  const line = [
    "",
    `## ${entry.noteTitle}`,
    `- Created At: ${entry.createdAt}`,
    `- Team Member: ${safeCreatedBy}`,
    `- Brand: ${entry.brand || "ts-residence"}`,
    `- Source: ${entry.utmSource || ""}`,
    `- Medium: ${entry.utmMedium || ""}`,
    `- Campaign: ${entry.utmCampaign || ""}`,
    `- Content: ${entry.utmContent || ""}`,
    `- Term: ${entry.utmTerm || ""}`,
    `- URL: ${entry.generatedUrl}`,
  ].join("\n");

  await mkdir(logsDir, { recursive: true });

  try {
    await appendFile(filePath, line + "\n", { encoding: "utf8", flag: "a" });
    return true;
  } catch {
    const header = buildFrontmatter("TS Residence UTM Link History") + "# UTM Link History\n";
    await appendFile(filePath, header + line + "\n", { encoding: "utf8", flag: "a" });
    return true;
  }
}

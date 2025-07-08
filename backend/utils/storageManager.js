import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import fsp from "fs/promises";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BasefolderPath = path.resolve(__dirname, "..", process.env.FOLDER_PATH);
const storageFilePath = path.join(BasefolderPath, "..", "storage.json");
const MAX_STORAGE = process.env.MAX_STORAGE || 10 ** 9; // 1 GB fallback

export async function getUsedStorage() {
  const data = await fsp.readFile(storageFilePath, "utf-8");
  return JSON.parse(data).used;
}

export async function updateUsedStorage(delta) {
  const data = await fsp.readFile(storageFilePath, "utf-8");
  const json = JSON.parse(data);
  json.used += delta;
  if (json.used < 0) json.used = 0;
  await fsp.writeFile(storageFilePath, JSON.stringify(json, null, 2));
}

export async function canUpload(sizeToAdd) {
  const used = await getUsedStorage();
  return used + sizeToAdd <= MAX_STORAGE;
}

export async function rebuildStorageUsed() {
  let totalSize = 0;

  async function walk(dir) {
    const entries = await fsp.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath);
      } else {
        const stats = await fsp.stat(fullPath);
        totalSize += stats.size;
      }
    }
  }

  await walk(BasefolderPath);
  await fsp.writeFile(storageFilePath, JSON.stringify({ used: totalSize }, null, 2));
}

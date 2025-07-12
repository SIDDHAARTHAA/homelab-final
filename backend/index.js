import archiver from 'archiver';
import express from 'express'
import path from 'path'
import fsp from 'fs/promises'
import fs from 'fs'
import cors from 'cors'
import dotenv from 'dotenv'
import upload from './utils/multer.js'
import { fileURLToPath } from 'url';
import { getUsedStorage, canUpload, updateUsedStorage, rebuildStorageUsed } from './utils/storageManager.js';
import getUniqueFilename from './utils/getUniqueFileName.js';
import getFolderSize from './utils/getFolderSize.js';
dotenv.config();


const app = express();
const port = process.env.PORT;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const BasefolderPath = path.resolve(__dirname, process.env.FOLDER_PATH);

//ensure  folder exists

//basic middle wares
app.use(cors());
app.use(express.json());
app.use(express.static(BasefolderPath));
const MAX_STORAGE = Number(process.env.MAX_STORAGE)
console.log(MAX_STORAGE);

(async () => {
    await fsp.mkdir(BasefolderPath, { recursive: true });
    await rebuildStorageUsed();
    app.listen(port, () => {
        console.log(`server running on port ${port}`);
    });
})();

//list files end point
app.get('/list', async (req, res) => {
    const relPath = req.query.path || "";
    const sortBy = req.query.sortBy;
    const absPath = path.join(BasefolderPath, relPath);

    if (!absPath.startsWith(BasefolderPath)) {
        return res.status(400).json({ error: "Invalid path" });
    }


    try {
        const entries = await fs.promises.readdir(absPath, { withFileTypes: true })

        const detailedEntries = await Promise.all(entries.map(async (entry) => {
            const entryPath = path.join(absPath, entry.name);
            const stats = await fs.promises.stat(entryPath);

            return {
                name: entry.name,
                type: entry.isDirectory() ? "folder" : "file",
                modifiedAt: stats.mtimeMs,
                size: entry.isDirectory() ? null : stats.size,
            }
        }));

        let sorted;
        if (sortBy === "name") {
            sorted = detailedEntries.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortBy === "modified") {
            sorted = detailedEntries.sort((a, b) => b.modifiedAt - a.modifiedAt);
        } else if (sortBy === "size") {
            // 🚧 TODO: expensive op, skip for now
            sorted = detailedEntries; // No sorting
        } else {
            sorted = detailedEntries; // Unknown sort = raw list
        }
        try {
            console.log(relPath,absPath);
        } catch (error) {
            console.log(error.message)
        }
        res.json(sorted);

    } catch (error) {
        res.status(500).json({ error: "Failed to list directory", })
    }
});

//upload file end point
app.post('/upload', upload.array('files', 100), async (req, res) => {
    const totalSize = req.files.reduce((acc, file) => acc + file.size, 0);

    if (!await canUpload(totalSize)) {
        return res.status(400).json({ error: "Not enough storage left" });
    }

    await updateUsedStorage(totalSize);
    res.json({ message: "Files uploaded", used: await getUsedStorage() });
});

app.get('/ping', (req, res) => {
    res.send("pong 🏓");
});


//download files
app.get('/download/:filename', (req, res) => {
    const relPath = req.query.path || "";
    const filename = req.params.filename;
    const absPath = path.join(BasefolderPath, relPath, filename);
    console.log("Trying to download:", absPath);
    if (!fs.existsSync(absPath)) return res.status(404).send("File not found");
    if (fs.lstatSync(absPath).isDirectory()) {
        res.attachment(filename + ".zip");
        const archive = archiver('zip');
        archive.directory(absPath, false);
        archive.pipe(res);
        archive.finalize();
    }
    else {
        res.download(absPath);
    }
})


app.get('/storage', async (req, res) => {
    const used = await getUsedStorage();
    res.json({
        used,
        max: MAX_STORAGE
    });
});


app.delete('/delete/:filename', async (req, res) => {
    try {
        const filename = req.params.filename;
        const directory = req.query.path || "";
        if (filename.includes("..")) return res.status(400).json({ error: "Invalid filename" });

        const absPath = path.join(BasefolderPath, directory, filename);
        if (!fs.existsSync(absPath)) return res.status(404).json({ error: "File not found!" });

        const stat = await fsp.lstat(absPath);

        let totalSize = 0;
        if (stat.isDirectory()) {
            // Recursively calculate folder size
            const calcFolderSize = async (dir) => {
                const entries = await fsp.readdir(dir, { withFileTypes: true });
                for (const entry of entries) {
                    const entryPath = path.join(dir, entry.name);
                    const entryStat = await fsp.lstat(entryPath);
                    if (entryStat.isDirectory()) {
                        await calcFolderSize(entryPath);
                    } else {
                        totalSize += entryStat.size;
                    }
                }
            };
            await calcFolderSize(absPath);
            await fsp.rm(absPath, { recursive: true, force: true });
        } else {
            totalSize = stat.size;
            await fsp.unlink(absPath);
        }

        await updateUsedStorage(-totalSize);

        res.json({ message: "Deleted successfully", freed: totalSize });
    } catch (error) {
        console.log("Delete error", error);
        res.status(500).json({ error: "Failed to delete file/folder" });
    }
});


//make directory
app.post('/mkdir', (req, res) => {
    const { relPath, name } = req.body;
    if (!name || name.includes('..') || name.includes('/')) {
        return res.status(400).json({ error: "Nice try lil bro" });
    }
    const absPath = path.join(BasefolderPath, relPath);
    const uniqueName = getUniqueFilename(absPath, name);
    const fullPath = path.join(absPath, uniqueName);
    // try {
    //     console.log(relPath,fullPath, absPath, uniqueName);
    // } catch (error) {
    //     console.log(error.message)
    // }
    fs.mkdir(fullPath, { recursive: false }, (err) => {
        if (err) return res.status(500).json({
            error: "Failed to create folder"
        })
        res.json({ message: "Folder created" })
    })
})

app.post('/rename', (req, res) => {
    const { relPath, oldName, newName } = req.body;
    if (!oldName || !newName || oldName.includes("..") || newName.includes("..")) {
        return res.status(400).json({ error: "Invalid name" });
    }
    const absPath = path.join(BasefolderPath, relPath);
    const uniqueName = getUniqueFilename(absPath, newName);
    const absOld = path.join(BasefolderPath, relPath || "", oldName);
    const absNew = path.join(BasefolderPath, relPath || "", uniqueName);
    fs.rename(absOld, absNew, (err) => {
        if (err) return res.status(500).json({ error: "Failed to rename" });
        res.json({ message: "Renamed" });
    });
})

app.get('/can-upload', async (req, res) => {
    const size = parseInt(req.query.size);
    if (!size) return res.status(400).json({ error: "Missing size" });

    const can = await canUpload(size);
    res.json({ ok: can });
});

app.get('/info/:filename', async (req, res) => {
    try {
        const filename = req.params.filename;
        const relPath = req.query.path || "";
        const absPath = path.join(BasefolderPath, relPath, filename);
        
        if (!fs.existsSync(absPath)) {
            return res.status(404).json({ error: "File not found" });
        }
        
        const stats = await fsp.stat(absPath);
        let size = stats.size;
        
        if (stats.isDirectory()) {
            size = await getFolderSize(absPath);
        }
        
        res.json({
            name: filename,
            type: stats.isDirectory() ? "folder" : "file",
            size: size,
            modifiedAt: stats.mtimeMs,
            created: stats.birthtimeMs
        });
    } catch (error) {
        console.error('Info error:', error);
        res.status(500).json({ error: "Failed to get file info" });
    }
});

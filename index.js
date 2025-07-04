import archiver from 'archiver';
import express from 'express'
import path from 'path'
import fsp from 'fs/promises'
import fs from 'fs'
import cors from 'cors'
import dotenv from 'dotenv'
import upload from './utils/multer.js'
import { fileURLToPath } from 'url';
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
const MAX_STORAGE = process.env.MAX_STORAGE;
console.log(MAX_STORAGE);

(async () => {
    await fsp.mkdir(BasefolderPath, { recursive: true });
    app.listen(port, () => {
        console.log(`server running on port ${port}`);
    });
})();

//list files end point
app.get('/list', async (req, res) => {
    const relPath = req.query.path || "";
    if (!relPath) return res.status(400).json({
        error: "Invalid path"
    })
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

        res.json(sorted);

    } catch (error) {
        res.status(500).json({ error: "Failed to list directory", details: error.message })
    }
});

//upload file end point
app.post('/upload', upload.array('files', 100), (req, res) => {
    res.json({ message: 'Files uploaded successfully' })
});

//download files
app.get('/download/:filename', (req, res) => {
    const relPath = req.query.path;
    const filename = req.params.filename;
    const absPath = path.join(BasefolderPath, relPath, filename);
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

//have to find a better solution for calculating storage
app.get('/storage', async (req, res) => {
    res.json({

    })
})

//delete from root or any given directory
app.delete('/delete/:filename', async (req, res) => {
    try {
        const filename = req.params.filename;
        const directory = req.query.path;
        if (filename.includes("..")) return res.status(400).json({
            error: "Invalid filename"
        })
        const absPath = path.join(BasefolderPath, directory, filename);
        if (!fs.existsSync(absPath)) return res.status(404).send({ error: "File not found!" });

        const stat = await fsp.lstat(absPath);
        if (stat.isDirectory()) {
            await fsp.rm(absPath, { recursive: true, force: true });
        } else {
            await fsp.unlink(absPath);
        }

        res.json({ message: "File deleted successfully" });
    } catch (error) {
        console.log("Delete error", error);
        res.status(500).json({ error: "Failed to delete file" })
    }
})

//make directory
app.post('/mkdir', (req, res) => {
    const { relPath, name } = req.body;
    if (!name || name.includes('..') || name.includes('/')) {
        return res.status(400).json({ error: "Nice try lil bro" });
    }
    const absPath = path.join(BasefolderPath, relPath, name);
    //why false
    fs.mkdir(absPath, { recursive: false }, (err) => {
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
    const absOld = path.join(BasefolderPath, relPath || "", oldName);
    const absNew = path.join(BasefolderPath, relPath || "", newName);
    fs.rename(absOld, absNew, (err) => {
        if (err) return res.status(500).json({ error: "Failed to rename" });
        res.json({ message: "Renamed" });
    });
})

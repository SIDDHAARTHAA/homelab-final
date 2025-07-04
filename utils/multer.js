import multer from "multer";
import { BasefolderPath } from "../index.js";
import getUniqueFilename from "./getUniqueFileName.js";
import path from "path";
import fs from 'fs'

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const relPath = req.body.currentPath  || "";
        const absPath = path.join(BasefolderPath,relPath);

        //basic security check ( please don't hack me )
        if(!absPath.startsWith(BasefolderPath)) return cb(new Error("Nice try fed"));

        fs.mkdirSync(absPath, {recursive:true});
        cb(null,absPath);
    },

    filename: (req,file, cb) => {
        const relPath = req.body.currentPath || "";
        const absPath = path.join(BasefolderPath,relPath);
        const uniqueName = getUniqueFilename(absPath, file.originalname);
        cb(null, uniqueName);
    }
})

const upload = multer({ storage:storage });
export default upload;
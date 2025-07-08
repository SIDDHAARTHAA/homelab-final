import path from 'path';
import fs from 'fs'
export default function getUniqueFilename(folder,originalName){
    const ext = path.extname(originalName);
    const base = path.basename(originalName,ext);
    let filename = originalName;
    let counter = 1;
    while(fs.existsSync(path.join(folder,filename))){
        filename = `${base}(${counter})${ext}`;
        counter++;
    }
    return filename;
}
import fs from 'fs/promises';
import path from 'path';

const getFolderSize = async (folderPath) => {
    let totalSize = 0;
    
    try {
        const entries = await fs.readdir(folderPath, { withFileTypes: true });
        
        for (const entry of entries) {
            const entryPath = path.join(folderPath, entry.name);
            
            if (entry.isDirectory()) {
                totalSize += await getFolderSize(entryPath);
            } else {
                const stats = await fs.stat(entryPath);
                totalSize += stats.size;
            }
        }
    } catch (error) {
        console.error('Error calculating folder size:', error);
    }
    
    return totalSize;
}

export default getFolderSize;
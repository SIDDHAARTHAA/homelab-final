import fs from 'fs/promises';
import path from 'path';

const getFolderSize = async (folderPath) => {
    try {
        const entries = await fs.readdir(folderPath, { withFileTypes: true });

        if (entries.length === 0) {
            return -1;
        }

        let totalSize = 0;
        let hasContent = false;

        for (const entry of entries) {
            const entryPath = path.join(folderPath, entry.name);

            if (entry.isDirectory()) {
                const size = await getFolderSize(entryPath);
                if (size > 0) {
                    hasContent = true;
                    totalSize += size;
                }
            } else {
                const stats = await fs.stat(entryPath);
                totalSize += stats.size;
                hasContent = true;
            }
        }

        return hasContent ? totalSize : -1;
    } catch (error) {
        console.error('Error calculating folder size:', error);
        return -1;
    }
};

export default getFolderSize;

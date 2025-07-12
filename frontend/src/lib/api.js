import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export async function listFiles(relPath) {
    const res = await axios.get(`${API_URL}/list?path=${encodeURIComponent(relPath)}`);
    console.log(relPath);
    return res.data;
}

export async function createFolder(relPath, name) {
    const res = await axios.post(`${API_URL}/mkdir`, { relPath, name });
    return res.data;
}

export async function uploadFiles(relPath, files) {
    const formData = new FormData();
    formData.append("currentPath", relPath); // append first!
    for (let file of files) {
        formData.append("files", file);
    }
    const res = await axios.post(`${API_URL}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
}

export async function downloadFiles(relPath, filename) {
    const url = `${API_URL}/download/${encodeURIComponent(filename)}?path=${encodeURIComponent(relPath)}`;

    try {
        const response = await axios.get(url, {
            responseType: 'blob',
        });

        const blob = new Blob([response.data]);
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error("Download failed:", error);
        throw error;
    }
}

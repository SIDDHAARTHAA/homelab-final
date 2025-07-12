import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export async function listFiles(relPath, sort = "") {
    const res = await axios.get(`${API_URL}/list?path=${encodeURIComponent(relPath)}&sortBy=${sort}`);
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

export async function downloadFiles(relPath, file) {
    const url = `${API_URL}/download/${encodeURIComponent(file.name)}?path=${encodeURIComponent(relPath)}`;

    try {
        const response = await axios.get(url, {
            responseType: 'blob',
        });

        const blob = new Blob([response.data]);
        const downloadUrl = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = file.type === "folder" ? `${file.name}.zip` : file.name;
        link.click();

        // Clean up
        URL.revokeObjectURL(downloadUrl);
    } catch (error) {
        console.error("Download failed:", error);
        throw error;
    }
}

export async function deleteFile(relPath, file) {
    const url = `${API_URL}/delete/${encodeURIComponent(file.name)}?path=${encodeURIComponent(relPath)}`;

    try {
        const response = await axios.delete(url);
    } catch (error) {
        console.error("Delete Error", error);
        throw error;
    }
}

export async function renameFile(relPath, oldName, newName) {
    const res = await axios.post(`${API_URL}/rename`, { relPath, oldName, newName });
    return res.data;
}

export async function getFileInfo(relPath, filename) {
    const url = `${API_URL}/info/${encodeURIComponent(filename)}?path=${encodeURIComponent(relPath)}`;
    const res = await axios.get(url);
    return res.data;
}

export async function getStorageInfo() {
    const res = await axios.get(`${API_URL}/storage`);
    return res.data;
}


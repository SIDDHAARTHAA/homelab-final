import { Menu, MenuItem, Divider } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import InfoIcon from '@mui/icons-material/Info';
import DeleteIcon from '@mui/icons-material/Delete';
import { getFileInfo } from '../lib/api.js';
import usePathStore from '../store/usePathStore.js';

function formatBytes(bytes) {
    if (!bytes) return "0 B";
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let i = 0;
    while (bytes >= 1024 && i < units.length - 1) {
        bytes /= 1024;
        i++;
    }
    return `${bytes.toFixed(2)} ${units[i]}`;
}

export default function FileOptionsMenu({ anchorEl, open, onClose, onDownload, file, onDelete, onRename }) {
  // console.log(file);
  // console.log(anchorEl)
  const handleRename = () => {
    const newName = window.prompt('Enter new name:', file.name);
    if (newName && newName !== file.name) {
      onRename(newName);
    }
    onClose();
  }

  const handleInfo = async () => {
    try {
      const info = await getFileInfo(usePathStore.getState().relPath, file.name);
      const message = `Name: ${info.name}\nType: ${info.type}\nSize: ${formatBytes(info.size)}\nModified: ${new Date(info.modifiedAt).toLocaleString()}`;
      alert(message);
    } catch (error) {
      console.log("Info error", error);
      alert("Failed to get file information");
    }
    onClose();
  }

  return (
    <>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={onClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={() => {
          onDownload();
          onClose();
        }}>
          <DownloadIcon fontSize="small" sx={{ mr: 1 }} />
          Download
        </MenuItem>
        <MenuItem onClick={handleRename}>
          <DriveFileRenameOutlineIcon fontSize="small" sx={{ mr: 1 }} />
          Rename
        </MenuItem>
        <MenuItem onClick={handleInfo}>
          <InfoIcon fontSize="small" sx={{ mr: 1 }} />
          {file?.type == "file" ? "File information" : "Folder information"}
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => {
          if (window.confirm('Are you sure you want to delete this file?')) {
            onDelete();
          }
          onClose();
        }} sx={{ color: 'red' }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>
    </>
  );
}
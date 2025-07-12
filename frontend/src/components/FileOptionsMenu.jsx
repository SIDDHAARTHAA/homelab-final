import { Menu, MenuItem, Divider } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import InfoIcon from '@mui/icons-material/Info';
import DeleteIcon from '@mui/icons-material/Delete';

export default function FileOptionsMenu({ anchorEl, open, onClose, onDownload, file, onDelete }) {
  // console.log(file);
  // console.log(anchorEl)
  return (
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
      <MenuItem onClick={onClose}>
        <DriveFileRenameOutlineIcon fontSize="small" sx={{ mr: 1 }} />
        Rename
      </MenuItem>
      <MenuItem onClick={onClose}>
        <InfoIcon fontSize="small" sx={{ mr: 1 }} />
        {file?.type == "file" ? "File information" : "Folder information"}
      </MenuItem>
      <Divider />
      <MenuItem onClick={() => {
        onDelete();
        onClose();
      }} sx={{ color: 'red' }}>
        <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
        Delete
      </MenuItem>
    </Menu>
  );
}
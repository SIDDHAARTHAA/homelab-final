import { Menu, MenuItem, Divider } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import InfoIcon from '@mui/icons-material/Info';
import DeleteIcon from '@mui/icons-material/Delete';

export default function FileOptionsMenu({ anchorEl, open, onClose }) {
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <MenuItem onClick={onClose}>
        <DownloadIcon fontSize="small" sx={{ mr: 1 }} />
        Download
      </MenuItem>
      <MenuItem onClick={onClose}>
        <DriveFileRenameOutlineIcon fontSize="small" sx={{ mr: 1 }} />
        Rename
      </MenuItem>
      <MenuItem onClick={onClose}>
        <InfoIcon fontSize="small" sx={{ mr: 1 }} />
        Folder Information
      </MenuItem>
      <Divider />
      <MenuItem onClick={onClose} sx={{ color: 'red' }}>
        <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
        Delete
      </MenuItem>
    </Menu>
  );
}

import * as React from 'react';
import usePathStore from '../store/usePathStore.js';
import { listFiles } from '@/lib/api';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  IconButton, Menu, MenuItem, Divider, useMediaQuery
} from '@mui/material';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import SortIcon from '@mui/icons-material/Sort';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArticleRoundedIcon from '@mui/icons-material/ArticleRounded';
import FolderRoundedIcon from '@mui/icons-material/FolderRounded';
import FolderZipRoundedIcon from '@mui/icons-material/FolderZipRounded';
import ImageRoundedIcon from '@mui/icons-material/ImageRounded';

import { useTheme } from '@mui/material/styles';
import FileOptionsMenu from './FileOptionsMenu';
import axios from 'axios';
import { downloadFiles } from '../lib/api.js';

// Helper to get file extension
function getExtension(name) {
  return name.split('.').pop().toLowerCase();
}

// Helper to determine file type for icon/thumbnail
function getFileType(file) {
  if (file.type === "folder") return "folder";
  const ext = getExtension(file.name);
  if (["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(ext)) return "image";
  if (["mp4", "webm", "ogg", "mov", "avi", "mkv"].includes(ext)) return "video";
  if (["zip", "rar", "7z", "tar", "gz"].includes(ext)) return "archive";
  if (["pdf", "txt", "md", "doc", "docx", "rtf"].includes(ext)) return "text";
  return "other";
}

export default function FileTable({ refreshKey }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [menuIndex, setMenuIndex] = React.useState(null);
  const [sortAnchor, setSortAnchor] = React.useState(null);
  const [files, setFiles] = React.useState([]);
  const relPath = usePathStore(state => state.relPath);
  const setRelPath = usePathStore(state => state.setRelPath);

  const openMenu = Boolean(anchorEl);
  const openSort = Boolean(sortAnchor);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  React.useEffect(() => {
    listFiles(relPath)
      .then(setFiles)
      .catch(err => console.error("Failed to fetch list:", err));
  }, [refreshKey, relPath]);

  const handleMenuClick = (e, index) => {
    setAnchorEl(e.currentTarget);
    setMenuIndex(index);
  };

  const handleSortClick = (e) => setSortAnchor(e.currentTarget);
  const handleClose = () => {
    setAnchorEl(null);
    setMenuIndex(null);
    setSortAnchor(null);
  };

  async function handleDownload(file) {
    try {
      await downloadFiles(relPath, file);
    } catch (error) {
      console.log("Download error", error)
    }
  }

  // Icon logic
  function getIcon(file) {
    const type = getFileType(file);
    if (type === "folder") return <FolderRoundedIcon sx={{ fontSize: 20, color: "#1E88E5" }} />;
    if (type === "image") return <ImageRoundedIcon sx={{ fontSize: 20, color: "#1E88E5" }} />;
    if (type === "archive") return <FolderZipRoundedIcon sx={{ fontSize: 20, color: "#1E88E5" }} />;
    if (type === "text") return <ArticleRoundedIcon sx={{ fontSize: 20, color: "#1E88E5" }} />;
    return <ArticleRoundedIcon sx={{ fontSize: 20, color: "#1E88E5" }} />;
  }

  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell><b>Name</b></TableCell>
            {!isMobile && <TableCell><b>Date Modified</b></TableCell>}
            <TableCell><b>File Size</b></TableCell>
            <TableCell align="right">
              <IconButton onClick={handleSortClick}>
                <SortIcon fontSize="small" />
                <ArrowDropDownIcon />
              </IconButton>
              <Menu
                anchorEl={sortAnchor}
                open={openSort}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                <MenuItem disabled>Sort by</MenuItem>
                <MenuItem onClick={handleClose}>Name</MenuItem>
                <MenuItem onClick={handleClose}>Date modified</MenuItem>
                <MenuItem onClick={handleClose}>Size</MenuItem>
                <Divider />
                <MenuItem disabled>Sort direction</MenuItem>
                <MenuItem onClick={handleClose}>A to Z</MenuItem>
                <MenuItem onClick={handleClose}>Z to A</MenuItem>
              </Menu>
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {files.map((file, index) => {
            const isFolder = file.type === "folder";

            return (
              <TableRow
                key={index}
                hover
                style={{ cursor: isFolder ? "pointer" : "default" }}
              >
                <TableCell
                  onClick={() => {
                    if (isFolder) {
                      setRelPath(relPath ? `${relPath}/${file.name}` : file.name);
                    }
                  }}
                >
                  <div className="flex items-center gap-2">
                    {getIcon(file)}
                    <span>{file.name}</span>
                  </div>
                </TableCell>

                {!isMobile && (
                  <TableCell>
                    {new Date(file.modifiedAt).toLocaleDateString()}
                  </TableCell>
                )}

                <TableCell>
                  {isFolder ? "-" : formatSize(file.size)}
                </TableCell>

                <TableCell align="right">
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation(); // 👈 prevent row click
                      handleMenuClick(e, index);
                    }}
                  >
                    <MoreVertIcon />
                  </IconButton>

                  {menuIndex === index && anchorEl && (
                    <FileOptionsMenu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleClose}
                      onDownload={() => handleDownload(file)}
                      file={file}
                    />
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function formatSize(bytes) {
  if (!bytes) return "-";
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
}

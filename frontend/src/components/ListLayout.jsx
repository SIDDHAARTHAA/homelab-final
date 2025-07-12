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
import { deleteFile, downloadFiles, renameFile, getFileInfo } from '../lib/api.js';
import useSortStore from '../store/sortStore.js'
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

export default function FileTable({ refreshKey, triggerRefresh }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [menuIndex, setMenuIndex] = React.useState(null);
  const [sortAnchor, setSortAnchor] = React.useState(null);
  const [files, setFiles] = React.useState([]);
  const [fileSizes, setFileSizes] = React.useState({});
  const relPath = usePathStore(state => state.relPath);
  const setRelPath = usePathStore(state => state.setRelPath);

  const openMenu = Boolean(anchorEl);
  const openSort = Boolean(sortAnchor);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const sort = useSortStore(state => state.sort);
  React.useEffect(() => {
    listFiles(relPath, sort)
      .then(setFiles)
      .catch(err => console.error("Failed to fetch list:", err));
  }, [refreshKey, relPath, sort]);

  // Load folder sizes
  React.useEffect(() => {
    const loadFolderSizes = async () => {
      const sizes = {};
      for (const file of files) {
        if (file.type === "folder") {
          try {
            const info = await getFileInfo(relPath, file.name);
            sizes[file.name] = info.size;
          } catch (error) {
            console.log("Error loading folder size:", error);
          }
        }
      }
      setFileSizes(sizes);
    };
    
    if (files.length > 0) {
      loadFolderSizes();
    }
  }, [files, relPath]);

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
  const setSort = useSortStore(state => state.setSort);
  const handleSort = (e) => {
    const selected = e.target.textContent?.toLowerCase();
    if (selected.includes("name")) setSort("name");
    else if (selected.includes("date")) setSort("modified");
    else if (selected.includes("size")) setSort("size");
    handleClose();
  };

  async function handleDownload(file) {
    try {
      await downloadFiles(relPath, file);
    } catch (error) {
      console.log("Download error", error)
    }
  }
  const handleDelete = async (file) => {
    try {
      await deleteFile(relPath, file);
      triggerRefresh && triggerRefresh();
    } catch (error) {
      console.log("Error while deleting", error);
    }
  };

  const handleRename = async (file, newName) => {
    try {
      await renameFile(relPath, file.name, newName);
      triggerRefresh && triggerRefresh();
    } catch (error) {
      console.log("Rename error", error);
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
            <TableCell className="font-bold font-sans text-gray-900 text-base">Name</TableCell>
            {!isMobile && <TableCell className="font-bold font-sans text-gray-900 text-base">Date Modified</TableCell>}
            <TableCell className="font-bold font-sans text-gray-900 text-base">Size</TableCell>
            <TableCell align="right" className="font-bold font-sans text-gray-900 text-base">
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
                <MenuItem onClick={handleSort}>Name</MenuItem>
                <MenuItem onClick={handleSort}>Date modified</MenuItem>
                <MenuItem onClick={handleSort}>Size</MenuItem>
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
                className="font-sans text-gray-900 font-medium text-sm"
              >
                <TableCell
                  onClick={() => {
                    if (isFolder) {
                      setRelPath(relPath ? `${relPath}/${file.name}` : file.name);
                    }
                  }}
                  className="font-sans text-gray-900 font-medium text-sm"
                >
                  <div className="flex items-center gap-2">
                    {getIcon(file)}
                    <span>{file.name}</span>
                  </div>
                </TableCell>

                {!isMobile && (
                  <TableCell className="font-sans text-gray-900 font-medium text-sm">
                    {new Date(file.modifiedAt).toLocaleDateString()}
                  </TableCell>
                )}

                <TableCell className="font-sans text-gray-900 font-medium text-sm">
                  {isFolder ? (fileSizes[file.name] ? formatSize(fileSizes[file.name]) : "Loading...") : formatSize(file.size)}
                </TableCell>

                <TableCell align="right" className="font-sans text-gray-900 font-medium text-sm">
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
                      onDelete={() => handleDelete(file)}
                      onRename={(newName) => handleRename(file, newName)}
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

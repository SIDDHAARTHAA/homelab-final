import React, { useState } from 'react';
import ArticleRoundedIcon from '@mui/icons-material/ArticleRounded';
import FolderRoundedIcon from '@mui/icons-material/FolderRounded';
import FolderZipRoundedIcon from '@mui/icons-material/FolderZipRounded';
import ImageRoundedIcon from '@mui/icons-material/ImageRounded';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';
import FileOptionsMenu from './FileOptionsMenu';
import Tooltip from '@mui/material/Tooltip';
import usePathStore from '../store/usePathStore.js';
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

export default function Grid({ file }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const setRelPath = usePathStore(state => state.setRelPath);
  const relPath = usePathStore(state => state.relPath);

  const handleMenuClick = (e) => {
    e.stopPropagation(); // prevent bubbling to card click
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  async function handleDownload(file) {
    try {
      await downloadFiles(relPath, file);
    } catch (error) {
      console.log("Download error", error);
    }
  }

  const handleCardClick = () => {
    if (file.type === "folder") {
      setRelPath(relPath ? `${relPath}/${file.name}` : file.name);
    }
  };

  const fileType = getFileType(file);

  let preview = null;
  if (fileType === "image") {
    preview = (
      <img
        src={`http://localhost:3000/${encodeURIComponent(file.name)}`}
        alt={file.name}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          background: "black",
          borderRadius: 8,
          display: "block"
        }}
      />
    );
  } else if (fileType === "video") {
    preview = (
      <video
        src={`http://localhost:3000/${encodeURIComponent(file.name)}`}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          background: "black",
          borderRadius: 8,
          display: "block"
        }}
        controls={false}
        muted
      />
    );
  } else if (fileType === "folder") {
    preview = <FolderRoundedIcon sx={{ fontSize: 84, color: "#454747" }} />;
  } else if (fileType === "archive") {
    preview = <FolderZipRoundedIcon sx={{ fontSize: 84, color: "#454747" }} />;
  } else {
    preview = <ArticleRoundedIcon sx={{ fontSize: 84, color: "#454747" }} />;
  }

  let smallIcon = null;
  if (fileType === "folder") {
    smallIcon = <FolderRoundedIcon sx={{ fontSize: 20, color: "#1E88E5" }} />;
  } else if (fileType === "image") {
    smallIcon = <ImageRoundedIcon sx={{ fontSize: 20, color: "#1E88E5" }} />;
  } else if (fileType === "archive") {
    smallIcon = <FolderZipRoundedIcon sx={{ fontSize: 20, color: "#1E88E5" }} />;
  } else {
    smallIcon = <ArticleRoundedIcon sx={{ fontSize: 20, color: "#1E88E5" }} />;
  }

  return (
    <div
      className="bg-[#f1f4f8] w-52 rounded-xl p-2 shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col"
      style={{ height: 220, padding: 8 }}
    >
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2 overflow-hidden w-40">
          {smallIcon}
          <Tooltip title={file.name} arrow>
            <span className="text-sm font-medium text-[#1e1e1f] truncate max-w-[8.5rem]">{file.name}</span>
          </Tooltip>
        </div>
        <IconButton onClick={handleMenuClick} size="small" className="p-1">
          <MoreVertIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </div>

      <div
        className="bg-white rounded-lg flex justify-center items-center w-full overflow-hidden mt-2 grow"
        style={{ minHeight: 0 }}
        onClick={handleCardClick} // 👈 move click handler here ONLY
      >
        {preview}
      </div>

      <FileOptionsMenu
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleClose}
        onDownload={() => handleDownload(file)}
        file={file}
      />
    </div>
  );
}

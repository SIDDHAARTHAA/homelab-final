import * as React from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  IconButton, Menu, MenuItem, Divider, useMediaQuery
} from '@mui/material';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import SortIcon from '@mui/icons-material/Sort';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import DownloadIcon from '@mui/icons-material/Download';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import InfoIcon from '@mui/icons-material/Info';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTheme } from '@mui/material/styles';

function createData(name, dateModified, size) {
  return { name, dateModified, size };
}

const rows = [
  createData('File A', '2025-07-01', '2.3 MB'),
  createData('File B', '2025-06-20', '1.1 MB'),
  createData('File C', '2025-05-10', '4.5 MB'),
];

export default function FileTable() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [menuIndex, setMenuIndex] = React.useState(null);
  const [sortAnchor, setSortAnchor] = React.useState(null);
  const openMenu = Boolean(anchorEl);
  const openSort = Boolean(sortAnchor);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
                <Divider />
                <MenuItem disabled>Folders</MenuItem>
                <MenuItem onClick={handleClose}>On top</MenuItem>
                <MenuItem onClick={handleClose}>Mixed with files</MenuItem>
              </Menu>
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.name}</TableCell>
              {!isMobile && <TableCell>{row.dateModified}</TableCell>}
              <TableCell>{row.size}</TableCell>
              <TableCell align="right">
                <IconButton onClick={(e) => handleMenuClick(e, index)}>
                  <MoreVertIcon />
                </IconButton>

                {menuIndex === index && (
                  <Menu
                    anchorEl={anchorEl}
                    open={openMenu}
                    onClose={handleClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  >
                    <MenuItem onClick={handleClose}>
                      <DownloadIcon fontSize="small" sx={{ mr: 1 }} />
                      Download
                    </MenuItem>
                    <MenuItem onClick={handleClose}>
                      <DriveFileRenameOutlineIcon fontSize="small" sx={{ mr: 1 }} />
                      Rename
                    </MenuItem>
                    <MenuItem onClick={handleClose}>
                      <InfoIcon fontSize="small" sx={{ mr: 1 }} />
                      Folder Information
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleClose} sx={{ color: 'red' }}>
                      <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                      Delete
                    </MenuItem>
                  </Menu>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

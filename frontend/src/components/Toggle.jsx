import * as React from 'react';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

export default function VerticalToggleButtons({ viewMode, setViewMode }) {

  const handleChange = (event, nextView) => {
    if (nextView != null) setViewMode(nextView);
  };

  return (
    <ToggleButtonGroup
      orientation="horizontal"
      value={viewMode}
      exclusive
      onChange={handleChange}
    >
      <ToggleButton value="list" aria-label="list">
        <ViewListIcon />
      </ToggleButton>
      <ToggleButton value="module" aria-label="module">
        <ViewModuleIcon />
      </ToggleButton>
    </ToggleButtonGroup>
  );
}

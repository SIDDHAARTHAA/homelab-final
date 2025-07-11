import * as React from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import usePathStore from '../store/usePathStore.js';

export default function CondensedWithMenu() {
  const relPath = usePathStore(state => state.relPath);
  const setRelPath = usePathStore(state => state.setRelPath);

  const segments = relPath ? relPath.split('/') : [];
  const crumbs = [{ name: "root", path: "" }, ...segments.map((name, idx) => ({
    name,
    path: segments.slice(0, idx + 1).join('/'),
  }))];

  return (
    <Breadcrumbs
      aria-label="breadcrumb"
      sx={{
        mb: 2,
        fontSize: '1.1rem',
        '& .MuiBreadcrumbs-separator': { mx: 1 },
      }}
      separator="›"
    >
      {crumbs.map((crumb, idx) =>
        idx === crumbs.length - 1 ? (
          <Typography key={idx} color="text.primary" fontWeight={600}>
            {crumb.name || "root"}
          </Typography>
        ) : (
          <Link
            key={idx}
            component="button"
            color="inherit"
            underline="hover"
            onClick={() => setRelPath(crumb.path)}
            sx={{ cursor: "pointer", fontWeight: 500 }}
          >
            {crumb.name || "root"}
          </Link>
        )
      )}
    </Breadcrumbs>
  );
}
import Grid from "./Grid";
import { useEffect, useState } from "react";
import usePathStore from '../store/usePathStore.js'
import { listFiles } from '@/lib/api';

export default function GridLayout({ refreshKey }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const relPath = usePathStore(state => state.relPath);

  useEffect(() => {
    setLoading(true);
    listFiles(relPath)
      .then(setFiles)
      .finally(() => setLoading(false));
  }, [refreshKey, relPath]);

  if (loading) {
    return (
      <div className="w-full grid grid-cols-2 lg:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="bg-gray-200 animate-pulse h-56 w-52 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="w-full grid grid-cols-2 lg:grid-cols-5 gap-4">
      {files.map((file, idx) => (
        <Grid key={idx} file={file} />
      ))}
    </div>
  );
}

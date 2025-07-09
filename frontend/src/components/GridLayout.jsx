import Grid from "./Grid";
import { useEffect, useState } from "react";
import axios from "axios";

export default function GridLayout({ refreshKey }) {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3000/list?path=")
      .then(res => setFiles(res.data))
      .catch(err => console.error("Failed to load:", err));
  }, [refreshKey]);

  return (
    <div className="w-full grid grid-cols-2 lg:grid-cols-5 gap-4">
      {files.map((file, idx) => (
        <Grid key={idx} file={file} />
      ))}
    </div>
  );
}

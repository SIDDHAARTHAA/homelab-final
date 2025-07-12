import { useRef, useEffect, useState } from 'react';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import usePathStore from '../store/usePathStore.js'
import { uploadFiles, getStorageInfo } from '@/lib/api';

function formatBytes(bytes) {
  if (!bytes) return "0 B";
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let i = 0;
  while (bytes >= 1024 && i < units.length - 1) {
    bytes /= 1024;
    i++;
  }
  return `${bytes.toFixed(2)} ${units[i]}`;
}

function StorageBar({ refreshKey }) {
  const [storage, setStorage] = useState({ used: 0, max: 1 });
  const [hover, setHover] = useState(false);
  const [animValue, setAnimValue] = useState(0);

  useEffect(() => {
    let mounted = true;
    getStorageInfo().then(data => {
      if (mounted) {
        setStorage(data);
        // Animate bar
        setAnimValue(0);
        setTimeout(() => setAnimValue(data.used / data.max), 50);
      }
    });
    return () => { mounted = false; };
  }, [refreshKey]);

  const percent = (storage.used / storage.max) * 100;
  let barColor = 'bg-green-500';
  if (percent > 90) barColor = 'bg-red-500';
  else if (percent > 25) barColor = 'bg-blue-500';

  return (
    <div className="bg-white relative rounded-3xl w-full sm:w-3/4 h-16 flex items-center border-2 border-black border-opacity-50 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(#aaa_1px,transparent_1px),linear-gradient(90deg,#aaa_1px,transparent_1px)] bg-[size:16px_16px] z-0" />
      <div
        className={`h-full rounded-2xl transition-all duration-700 ease-in-out ${barColor} z-10 relative`}
        style={{ width: `${Math.min(animValue * 100, 100)}%` }}
      />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-sm font-bold text-gray-800 select-none pointer-events-none z-20">
        {`${Math.round(percent)}%`}
      </div>
    </div>
  );
}

export default function TopBar({ onUpload, refreshKey }) {
  const fileInputRef = useRef();

  const handleUploadClick = () => {
    fileInputRef.current.click(); // open file dialog
  };

  const handleFileChange = async (e) => {
    const files = e.target.files;

    if (files.length > 100) {
      alert("Max 100 files allowed!");
      return;
    }
    const relPath = usePathStore.getState().relPath;
    try {
      const res = await uploadFiles(relPath, files);
      alert(res.message + "\nUsed: " + res.used + " bytes");
      if (onUpload) onUpload(); // trigger refresh
    } catch (err) {
      alert(err.response?.data?.error || "Upload failed!");
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full">
      <div
        onClick={handleUploadClick}
        className="flex justify-center items-center border-2 p-4 bg-blue-600 rounded-3xl shadow-sm hover:cursor-pointer hover:bg-green-600 transition-colors duration-300 ease-out gap-4 w-full sm:w-1/4"
      >
        <CloudUploadIcon sx={{ color: 'white' }} />
        <span className="font-bold text-white text-lg font-sans tracking-wide">Upload</span>
      </div>
      <input
        type="file"
        multiple
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
      <StorageBar refreshKey={refreshKey} />
    </div>
  );
}

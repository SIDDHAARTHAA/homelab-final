import { useRef } from 'react';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import usePathStore from '../store/usePathStore.js'
import { uploadFiles } from '@/lib/api';

function TopBar({ onUpload }) {
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
            console.log(relPath)
            alert(res.message + "\nUsed: " + res.used + " bytes");
            if (onUpload) onUpload(); // trigger refresh
        } catch (err) {
            alert(err.response?.data?.error || "Upload failed!");
        }
    };

    return (
        <>
            <div className="flex flex-col sm:flex-row gap-4 w-full">
                {/* Upload button */}
                <div
                    onClick={handleUploadClick}
                    className="flex justify-center items-center border-2 p-4 bg-blue-600 rounded-3xl shadow-sm hover:cursor-pointer hover:bg-green-600 transition-colors duration-300 ease-out gap-4 w-full sm:w-1/4"
                >
                    <CloudUploadIcon sx={{ color: 'white' }} />
                    <span className="font-bold text-white text-lg">Upload</span>
                </div>

                {/* Hidden file input */}
                <input
                    type="file"
                    multiple
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                />

                {/* Storage progress bar */}
                <div className="bg-white relative rounded-3xl w-full sm:w-3/4 h-16 flex items-center border-2 border-black border-opacity-50 overflow-hidden">
                    <div className="absolute inset-0 bg-[linear-gradient(#aaa_1px,transparent_1px),linear-gradient(90deg,#aaa_1px,transparent_1px)] bg-[size:16px_16px] z-0" />
                    <div className="bg-green-500 h-full w-1/4 rounded-2xl z-10"></div>
                </div>
            </div>
        </>
    );
}

export default TopBar;

import { FolderUp } from "lucide-react";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
function TopBar() {
    return <>
        <div className="flex flex-col sm:flex-row gap-4 w-full">
            {/* Upload button */}
            <div className="flex justify-center items-center border-2 p-4 bg-blue-600 rounded-3xl shadow-sm hover:cursor-pointer hover:bg-green-600 transition-colors duration-300 ease-out gap-4 w-full sm:w-1/4">
                {/* <FolderUp className="text-white scale-95" strokeWidth={2.2} /> */}
                <CloudUploadIcon sx={{ color: 'white' }} />
                <button className="font-bold text-white text-lg">Upload</button>
            </div>
            <div className="bg-white relative rounded-3xl w-full sm:w-3/4 h-16 flex items-center border-2 border-black border-opacity-50 overflow-hidden">
                {/* Fake grid using background pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(#aaa_1px,transparent_1px),linear-gradient(90deg,#aaa_1px,transparent_1px)] bg-[size:16px_16px] z-0" />
                {/* Progress bar on top */}
                <div className="bg-green-500 h-full w-1/4 rounded-2xl z-10"></div>
            </div>
        </div>
    </>
}
export default TopBar;

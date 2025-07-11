import CreateNewFolderRoundedIcon from '@mui/icons-material/CreateNewFolderRounded';
import VerticalToggleButtons from './Toggle';
import { useEffect, useRef, useState } from 'react';
import Popup from './PopUp';
import usePathStore from '../store/usePathStore.js'
import { createFolder } from '@/lib/api';

export default function CreateNewFolder({ viewMode, setViewMode, onFolderCreated }) {
    const [createFolderPopup, setCreateFolderPopup] = useState(false);
    const [input, setInput] = useState("Untitled folder");
    const [firstType, setFirstType] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const inputRef = useRef(null);
    const relPath = usePathStore(state => state.relPath);

    useEffect(() => {
        if (createFolderPopup && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
        if (!createFolderPopup) {
            setInput("Untitled folder");
            setFirstType(true);
            setError("");
        }
    }, [createFolderPopup]);

    function handleCreateFolderPopup() {
        setCreateFolderPopup(true);
    }

    function handleInputChange(e) {
        const value = e.target.value;
        if (firstType) {
            setInput(value[value.length - 1] || "");
            setFirstType(false);
        } else {
            setInput(value);
        }
    }

    async function handleCreateFolder() {
        const name = input.trim() || "Untitled folder";
        setLoading(true);
        setError("");
        try {
            await createFolder(relPath, name);
            setCreateFolderPopup(false);
            if (onFolderCreated) onFolderCreated(); // This triggers the refresh in parent
            // console.log(relPath)
        } catch (error) {
            setError(error.response?.data?.error || "Failed to create folder");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='flex justify-between items-center w-full mb-4'>
            <div
                onClick={handleCreateFolderPopup}
                className="flex justify-center items-center border-2 p-4 bg-[#454747] rounded-3xl shadow-sm hover:cursor-pointer hover:bg-green-600 transition-colors duration-300 ease-out gap-4 w-3/4 sm:w-[200px] h-12"
            >
                <CreateNewFolderRoundedIcon sx={{ color: 'white' }} />
                <span className="font-bold text-white text-lg">Create Folder</span>
            </div>
            <Popup show={createFolderPopup} onClose={() => setCreateFolderPopup(false)}>
                <div className='py-3 px-6 w-80'>
                    <div className='text-2xl py-2 font-semibold'>New Folder</div>
                    <div>
                        <input
                            ref={inputRef}
                            className='border h-14 w-full border-black border-opacity-45 rounded px-3 text-lg'
                            onChange={handleInputChange}
                            value={input}
                            disabled={loading}
                            onKeyDown={e => {
                                if (e.key === "Enter") handleCreateFolder();
                            }}
                        />
                        {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
                    </div>
                    <div className='flex justify-end gap-2 mt-4'>
                        <button
                            onClick={() => setCreateFolderPopup(false)}
                            className='px-4 py-2 rounded bg-gray-300 hover:bg-gray-400'
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleCreateFolder}
                            className='px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700'
                            disabled={loading}
                        >
                            {loading ? "Creating..." : "Create"}
                        </button>
                    </div>
                </div>
            </Popup>
            <div className='flex justify-center items-center'>
                <VerticalToggleButtons viewMode={viewMode} setViewMode={setViewMode} />
            </div>
        </div>
    );
}
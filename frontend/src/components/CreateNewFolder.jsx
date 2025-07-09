import CreateNewFolderRoundedIcon from '@mui/icons-material/CreateNewFolderRounded';
import VerticalToggleButtons from './Toggle';
export default function CreateNewFolder({ viewMode, setViewMode }) {
    return <>
        <div className='flex justify-between'>
            <div className="flex justify-center items-center border-2 p-4 bg-[#454747] rounded-3xl shadow-sm hover:cursor-pointer hover:bg-green-600 transition-colors duration-300 ease-out gap-4 w-3/4 sm:w-[200px] h-12">
                {/* <FolderUp className="text-white scale-95" strokeWidth={2.2} /> */}
                <CreateNewFolderRoundedIcon sx={{ color: 'white' }} />
                <button className="font-bold text-white text-lg">Create Folder</button>
            </div>
            <div className='flex justify-center items-center'>
                <VerticalToggleButtons viewMode={viewMode} setViewMode={setViewMode} />
            </div>
        </div>
    </>
}
import ArticleRoundedIcon from '@mui/icons-material/ArticleRounded';
import FolderRoundedIcon from '@mui/icons-material/FolderRounded';
import MoreVertIcon from '@mui/icons-material/MoreVert';

export default function Grid() {
    return (
        <div className="bg-[#f1f4f8] h-56 w-52 rounded-xl p-2 shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer">
            <div className='flex justify-between items-start mb-2'>
                <div className="flex gap-2 items-center">
                    <ArticleRoundedIcon sx={{ fontSize: 22, color: "#1E88E5" }} />
                    <span className="text-[16px] font-medium text-[#1e1e1f] tracking-wide leading-none">Invoice</span>
                </div>
                <MoreVertIcon sx={{ fontSize: 20 }} />
            </div>

            <div className="bg-white h-[88%] rounded-lg overflow-hidden flex justify-center items-center">
                <FolderRoundedIcon sx={{ fontSize: 84, color: "#454747" }} />
            </div>
        </div>
    );
}

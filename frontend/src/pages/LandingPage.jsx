import CondensedWithMenu from '../components/BreadCrumb';
import CreateNewFolder from '../components/CreateNewFolder';
import GridLayout from '../components/GridLayout';
import TopBar from '../components/TopBar';
import ListLayout from '../components/ListLayout'
import { useState } from 'react';

function LandingPage() {
    const [viewMode, setViewMode] = useState("list");
    const [refreshKey, setRefreshKey] = useState(0);

    // This function will be passed to children to trigger a refresh
    const triggerRefresh = () => setRefreshKey(k => k + 1);  

    return (
        <div className="flex justify-center w-full sm:w-3/4 mx-auto p-4 flex-col gap-y-5">
            <TopBar onUpload={triggerRefresh} refreshKey={refreshKey} />
            <CondensedWithMenu />
            <CreateNewFolder viewMode={viewMode} setViewMode={setViewMode} onFolderCreated={triggerRefresh} />
            {viewMode == "list"
                ? <ListLayout refreshKey={refreshKey} triggerRefresh={triggerRefresh} />
                : <GridLayout refreshKey={refreshKey} triggerRefresh={triggerRefresh} />}
        </div>
    );
}

export default LandingPage;

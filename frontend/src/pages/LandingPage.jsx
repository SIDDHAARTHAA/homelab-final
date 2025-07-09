import CondensedWithMenu from '../components/BreadCrumb';
import CreateNewFolder from '../components/CreateNewFolder';
import GridLayout from '../components/GridLayout';
import TopBar from '../components/TopBar';
import ListLayout from '../components/ListLayout'
import { useState } from 'react';

function LandingPage() {
    const [viewMode, setViewMode] = useState("list");
    const [refreshKey, setRefreshKey] = useState(0);

    return (
        <div className="flex justify-center  w-full sm:w-3/4 mx-auto border p-4 flex-col gap-y-5">
            <TopBar onUpload={() => setRefreshKey(k => k + 1)} />
            <CondensedWithMenu />
            <CreateNewFolder viewMode={viewMode} setViewMode={setViewMode} />
            {viewMode == "list"
                ? <ListLayout refreshKey={refreshKey} />
                : <GridLayout refreshKey={refreshKey} />}
        </div>
    );
}

export default LandingPage;

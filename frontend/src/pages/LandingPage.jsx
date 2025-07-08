import CondensedWithMenu from '../components/BreadCrumb';
import CreateNewFolder from '../components/CreateNewFolder';
import GridLayout from '../components/GridLayout';
import TopBar from '../components/TopBar';
import ListLayout from '../components/ListLayout'

function LandingPage() {
    return (
        <div className="flex justify-center  w-full sm:w-3/4 mx-auto border p-4 flex-col gap-y-5">
            <TopBar />
            <CondensedWithMenu />
            <CreateNewFolder />
            {/* <GridLayout /> */}
            <ListLayout />
        </div>
    );
}

export default LandingPage;

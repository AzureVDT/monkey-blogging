import { Button } from "../../components/button";
import DashboardHeading from "../dashboard/DashboardHeading";
import UserTable from "./UserTable";

const UserManage = () => {
    return (
        <div>
            <DashboardHeading title="Users" desc="Manage your user">
                <Button
                    kind="ghost"
                    className="h-[60px]"
                    to={"/manage/add-user"}
                >
                    Create User
                </Button>
            </DashboardHeading>
            <div className="mb-10 flex justify-end">
                <input
                    type="text"
                    placeholder="Search user..."
                    className="py-4 px-5 border border-gray-300 rounded-lg"
                />
            </div>
            <UserTable></UserTable>
            <div className="mt-10">
                <Button className="mx-auto" kind="primary">
                    Load more
                </Button>
            </div>
        </div>
    );
};

export default UserManage;

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
            <UserTable></UserTable>
        </div>
    );
};

export default UserManage;

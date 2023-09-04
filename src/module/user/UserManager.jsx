import { Button } from "../../components/button";
import DashboardHeading from "../dashboard/DashboardHeading";
import UserTable from "./UserTable";
import { useAuth } from "../../context/auth-context";
import { userRole } from "../../utils/constants";
const UserManage = () => {
    const { userInfo } = useAuth();
    if (userInfo?.role !== userRole.ADMIN) return null;
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

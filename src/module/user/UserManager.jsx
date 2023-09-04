import { useEffect, useState } from "react";
import { Button } from "../../components/button";
import DashboardHeading from "../dashboard/DashboardHeading";
import UserTable from "./UserTable";
import { useAuth } from "../../context/auth-context";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase-app/firebase-config";
import { userRole } from "../../utils/constants";
const UserManage = () => {
    const { userInfo } = useAuth();
    const [user, setUser] = useState({});
    useEffect(() => {
        async function fetchUserData() {
            if (!userInfo.email) return;
            const q = query(
                collection(db, "users"),
                where("email", "==", userInfo.email)
            );
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                setUser(doc.data());
            });
        }
        fetchUserData();
    }, [userInfo.email]);
    if (user.role !== userRole.ADMIN) return null;
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

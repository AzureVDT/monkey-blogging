import { LabelStatus } from "../../components/label";
import { userRole, userStatus } from "../../utils/constants";
import { ActionDelete, ActionEdit } from "../../components/action";
import { Table } from "../../components/table";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import {
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    query,
    where,
} from "firebase/firestore";
import { db } from "../../firebase-app/firebase-config";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import { deleteUser } from "firebase/auth";
import { debounce } from "lodash";
const UserTable = () => {
    const [userList, setUserList] = useState([]);
    const navigate = useNavigate();
    const [filter, setFilter] = useState("");
    const handleDeleteUser = async (user) => {
        const colRef = doc(db, "users", user.id);
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                await deleteDoc(colRef);
                await deleteUser(user);
                Swal.fire("Deleted!", "Your file has been deleted.", "success");
            }
        });
    };
    useEffect(() => {
        async function fetchData() {
            const colRef = collection(db, "users");
            const newRef = filter
                ? query(
                      colRef,
                      where("fullName", ">=", filter),
                      where("fullName", "<=", filter + "utf8")
                  )
                : colRef;
            onSnapshot(newRef, (snapshot) => {
                let results = [];
                snapshot.forEach((user) => {
                    results.push({
                        id: user.id,
                        ...user.data(),
                    });
                });
                setUserList(results);
            });
        }
        fetchData();
    }, [filter]);
    const handleInputFilter = debounce((e) => {
        setFilter(e.target.value);
    }, 500);
    const renderLabelStatus = (status) => {
        switch (status) {
            case userStatus.ACTIVE:
                return <LabelStatus type="success">ACTIVE</LabelStatus>;
            case userStatus.PENDING:
                return <LabelStatus type="warning">PENDING</LabelStatus>;
            case userStatus.BANNED:
                return <LabelStatus type="success">BANNED</LabelStatus>;

            default:
                break;
        }
    };
    const renderLabelRole = (role) => {
        switch (role) {
            case userRole.ADMIN:
                return <LabelStatus type="success">ADMIN</LabelStatus>;
            case userRole.MODERATOR:
                return <LabelStatus type="success">MODERATOR</LabelStatus>;
            case userRole.EDITOR:
                return <LabelStatus type="success">EDITOR</LabelStatus>;
            case userRole.USER:
                return <LabelStatus type="success">USER</LabelStatus>;

            default:
                break;
        }
    };
    return (
        <div>
            <div className="mb-10 flex justify-end">
                <input
                    type="text"
                    placeholder="Search user..."
                    className="py-4 px-5 border border-gray-300 rounded-lg"
                    onChange={handleInputFilter}
                />
            </div>
            <Table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Info</th>
                        <th>Username</th>
                        <th>Email address</th>
                        <th>Status</th>
                        <th>Role</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {userList.map((user) => (
                        <tr key={user.id}>
                            <td title={user.id}>
                                {user.id.slice(0, 5) + "..."}
                            </td>
                            <td className="whitespace-nowrap">
                                <div className="flex items-center gap-x-3">
                                    <img
                                        src={user?.avatar}
                                        alt="avatar"
                                        className="flex-shrink-0 object-cover w-10 h-10 rounded-md"
                                    />
                                    <div className="flex-1">
                                        <h3>{user?.fullName}</h3>
                                        <time className="text-sm text-gray-400">
                                            {new Date(
                                                user?.createdAt?.seconds * 1000
                                            ).toLocaleDateString("vi-VI")}
                                        </time>
                                    </div>
                                </div>
                            </td>
                            <td>{user?.username}</td>
                            <td title={user.email}>
                                {user?.email.slice(0, 5) + "..."}
                            </td>
                            <td>{renderLabelStatus(Number(user?.status))}</td>
                            <td>{renderLabelRole(Number(user?.role))}</td>
                            <td>
                                <div className="flex items-center gap-x-3">
                                    <ActionEdit
                                        onClick={() =>
                                            navigate(
                                                `/manage/update-user?id=${user.id}`
                                            )
                                        }
                                    ></ActionEdit>
                                    <ActionDelete
                                        onClick={() => handleDeleteUser(user)}
                                    ></ActionDelete>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};
UserTable.propTypes = {
    userList: PropTypes.array,
};

export default UserTable;

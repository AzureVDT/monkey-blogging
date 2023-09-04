import { useEffect, useState } from "react";
import { ActionDelete, ActionEdit, ActionView } from "../../components/action";
import { Button } from "../../components/button";
import { LabelStatus } from "../../components/label";
import { Table } from "../../components/table";
import { debounce } from "lodash";
import DashboardHeading from "../dashboard/DashboardHeading";
import {
    collection,
    deleteDoc,
    doc,
    getDocs,
    limit,
    onSnapshot,
    query,
    startAfter,
    where,
} from "firebase/firestore";
import { db } from "../../firebase-app/firebase-config";
import { categoryStatus, userRole } from "../../utils/constants";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth-context";

const CATEGORY_PER_PAGE = 3;

const CategoryManage = () => {
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
    const [categoryList, setCategoryList] = useState([]);
    const navigate = useNavigate();
    const [filter, setFilter] = useState("");
    const [lastDoc, setLastDoc] = useState(null);
    const [total, setTotal] = useState(0);
    useEffect(() => {
        async function fetchData() {
            const colRef = collection(db, "categories");
            const newRef = filter
                ? query(
                      colRef,
                      where("name", ">=", filter),
                      where("name", "<=", filter + "utf8")
                  )
                : query(colRef, limit(CATEGORY_PER_PAGE));
            const documentSnapshots = await getDocs(newRef);
            const lastVisible =
                documentSnapshots.docs[documentSnapshots.docs.length - 1];
            onSnapshot(colRef, (snapshot) => {
                setTotal(snapshot.size);
            });
            onSnapshot(newRef, (snapshot) => {
                let results = [];
                snapshot.forEach((doc) => {
                    results.push({ id: doc.id, ...doc.data() });
                });
                setCategoryList(results);
            });
            setLastDoc(lastVisible);
        }
        fetchData();
    }, [filter]);
    if (user.role !== userRole.ADMIN) return null;
    const handleDeleteCategory = async (docId) => {
        const colRef = doc(db, "categories", docId);
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
                Swal.fire("Deleted!", "Your file has been deleted.", "success");
            }
        });
    };
    const handleInputFilter = debounce((e) => {
        setFilter(e.target.value);
    }, 500);
    const handleLoadMoreCategory = async () => {
        const nextRef = query(
            collection(db, "categories"),
            startAfter(lastDoc),
            limit(CATEGORY_PER_PAGE)
        );
        onSnapshot(nextRef, (snapshot) => {
            let results = [];
            snapshot.forEach((doc) => {
                results.push({ id: doc.id, ...doc.data() });
            });
            setCategoryList([...categoryList, ...results]);
        });
        const documentSnapshots = await getDocs(nextRef);
        const lastVisible =
            documentSnapshots.docs[documentSnapshots.docs.length - 1];
        setLastDoc(lastVisible);
    };
    return (
        <div>
            <DashboardHeading title="Categories" desc="Manage your category">
                <Button
                    kind="ghost"
                    className="h-[60px]"
                    to={"/manage/add-category"}
                >
                    Create Category
                </Button>
            </DashboardHeading>
            <div className="mb-10 flex justify-end">
                <input
                    type="text"
                    placeholder="Search category..."
                    className="py-4 px-5 border border-gray-300 rounded-lg"
                    onChange={handleInputFilter}
                />
            </div>
            <Table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Slug</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {categoryList.length > 0 &&
                        categoryList.map((category) => (
                            <tr key={category.id}>
                                <td>{category.id}</td>
                                <td>{category.name}</td>
                                <td>
                                    <span className="italic text-gray-400">
                                        {category.slug}
                                    </span>
                                </td>
                                <td>
                                    {category.status ===
                                        categoryStatus.APPROVED && (
                                        <LabelStatus type="success">
                                            APPROVED
                                        </LabelStatus>
                                    )}
                                    {category.status ===
                                        categoryStatus.UNAPPROVED && (
                                        <LabelStatus type="warning">
                                            UNAPPROVED
                                        </LabelStatus>
                                    )}
                                </td>
                                <td>
                                    <div className="flex items-center gap-x-3">
                                        <ActionView></ActionView>
                                        <ActionEdit
                                            onClick={() =>
                                                navigate(
                                                    `/manage/update-category?id=${category.id}`
                                                )
                                            }
                                        ></ActionEdit>
                                        <ActionDelete
                                            onClick={() =>
                                                handleDeleteCategory(
                                                    category.id
                                                )
                                            }
                                        ></ActionDelete>
                                    </div>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </Table>
            {total > categoryList.length && (
                <div className="mt-10">
                    <Button
                        className="mx-auto"
                        kind="primary"
                        onClick={handleLoadMoreCategory}
                    >
                        Load more
                    </Button>
                </div>
            )}
        </div>
    );
};

export default CategoryManage;

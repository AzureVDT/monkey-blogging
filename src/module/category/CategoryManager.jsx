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
    onSnapshot,
    query,
    where,
} from "firebase/firestore";
import { db } from "../../firebase-app/firebase-config";
import { categoryStatus } from "../../utils/constants";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const CategoryManage = () => {
    const [categoryList, setCategoryList] = useState([]);
    const navigate = useNavigate();
    const [filter, setFilter] = useState("");
    // const [categoryCount, setCategoryCount] = useState(0);
    useEffect(() => {
        const colRef = collection(db, "categories");
        const newRef = filter
            ? query(
                  colRef,
                  where("name", ">=", filter),
                  where("name", "<=", filter + "utf8")
              )
            : colRef;
        onSnapshot(newRef, (snapshot) => {
            let results = [];
            // setCategoryCount(Number(snapshot.size));
            snapshot.forEach((doc) => {
                results.push({ id: doc.id, ...doc.data() });
            });
            setCategoryList(results);
        });
    }, [filter]);
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
                                    categoryStatus.APPROVED ? (
                                        <LabelStatus type="success">
                                            APPROVED
                                        </LabelStatus>
                                    ) : (
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
        </div>
    );
};

export default CategoryManage;

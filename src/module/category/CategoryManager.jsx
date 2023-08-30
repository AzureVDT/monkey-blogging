import { useEffect, useState } from "react";
import { ActionDelete, ActionEdit, ActionView } from "../../components/action";
import { Button } from "../../components/button";
import { LabelStatus } from "../../components/label";
import { Table } from "../../components/table";
import DashboardHeading from "../dashboard/DashboardHeading";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase-app/firebase-config";
import { categoryStatus } from "../../utils/constants";

const CategoryManage = () => {
    const [categoryList, setCategoryList] = useState([]);
    useEffect(() => {
        const colRef = collection(db, "categories");
        onSnapshot(colRef, (snapshot) => {
            let results = [];
            snapshot.forEach((doc) => {
                results.push({ id: doc.id, ...doc.data() });
            });
            setCategoryList(results);
        });
    }, []);
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
                                        <ActionEdit></ActionEdit>
                                        <ActionDelete></ActionDelete>
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

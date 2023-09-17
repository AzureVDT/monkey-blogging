import { useEffect, useState } from "react";
import { Table } from "../../components/table";
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
import Swal from "sweetalert2";
import { debounce } from "lodash";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/button";
import { ActionDelete, ActionEdit, ActionView } from "../../components/action";
import { LabelStatus } from "../../components/label";
import { postStatus, userRole } from "../../utils/constants";
import { useAuth } from "../../context/auth-context";
const POST_PER_PAGE = 3;
const PostManage = () => {
    const { userInfo } = useAuth();
    console.log("PostManage ~ userInfo:", userInfo);
    const [userPosts, setUserPosts] = useState([]);
    useEffect(() => {
        async function fetchData() {
            const docRef = query(
                collection(db, "posts"),
                where("user.username", "==", userInfo.username)
            );
            onSnapshot(docRef, (snapshot) => {
                const results = [];
                snapshot.forEach((doc) => {
                    results.push({
                        id: doc.id,
                        ...doc.data(),
                    });
                });
                setUserPosts(results);
            });
        }
        fetchData();
    }, [userInfo.username]);
    const [postList, setPostList] = useState([]);
    const navigate = useNavigate();
    const [filter, setFilter] = useState("");
    const [lastDoc, setLastDoc] = useState(null);
    const [total, setTotal] = useState(0);
    useEffect(() => {
        async function fetchData() {
            const colRef = collection(db, "posts");
            const newRef = filter
                ? query(
                      colRef,
                      where("title", ">=", filter),
                      where("title", "<=", filter + "utf8")
                  )
                : query(colRef, limit(POST_PER_PAGE));
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
                setPostList(results);
            });
            setLastDoc(lastVisible);
        }
        fetchData();
    }, [filter]);
    const handleDeletePost = async (postId) => {
        const colRef = doc(db, "posts", postId);
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
    const handleLoadMorePost = async () => {
        const nextRef = query(
            collection(db, "posts"),
            startAfter(lastDoc),
            limit(POST_PER_PAGE)
        );
        onSnapshot(nextRef, (snapshot) => {
            let results = [];
            snapshot.forEach((doc) => {
                results.push({ id: doc.id, ...doc.data() });
            });
            setPostList([...postList, ...results]);
        });
        const documentSnapshots = await getDocs(nextRef);
        const lastVisible =
            documentSnapshots.docs[documentSnapshots.docs.length - 1];
        setLastDoc(lastVisible);
    };
    const renderPostStatus = (status) => {
        switch (status) {
            case postStatus.APPROVED:
                return <LabelStatus type="success">APPROVED</LabelStatus>;
            case postStatus.PENDING:
                return <LabelStatus type="warning">PENDING</LabelStatus>;
            case postStatus.REJECTED:
                return <LabelStatus type="danger">REJECTED</LabelStatus>;

            default:
                break;
        }
    };
    return (
        <div>
            <h1 className="dashboard-heading">Manage post</h1>
            <div className="flex justify-end mb-10">
                <div className="w-full max-w-[300px]">
                    <input
                        type="text"
                        className="w-full p-4 border border-gray-300 border-solid rounded-lg"
                        placeholder="Search post..."
                        onChange={handleInputFilter}
                    />
                </div>
            </div>
            <Table>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Post</th>
                        <th>Category</th>
                        <th>Author</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {userInfo.role === userRole.ADMIN &&
                        postList.length > 0 &&
                        postList.map((post) => (
                            <tr key={post.id}>
                                <td title={post.id}>
                                    {post.id.slice(0, 5) + "..."}
                                </td>
                                <td>
                                    <div className="flex items-center gap-x-3">
                                        <img
                                            src={post?.image}
                                            alt=""
                                            className="w-[66px] h-[55px] rounded object-cover"
                                        />
                                        <div className="flex-1 whitespace-pre-wrap">
                                            <h3 className="font-semibold max-w-[300px]">
                                                {post?.title}
                                            </h3>
                                            <time className="text-sm text-gray-500">
                                                {new Date(
                                                    post?.user?.createdAt
                                                        ?.seconds * 1000
                                                ).toLocaleDateString("vi-VI")}
                                            </time>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <span className="text-gray-500">
                                        {post?.category?.name}
                                    </span>
                                </td>
                                <td>
                                    <span className="text-gray-500">
                                        {post?.user?.fullName}
                                    </span>
                                </td>
                                <td>{renderPostStatus(post.status)}</td>
                                <td>
                                    <div className="flex items-center gap-x-3">
                                        <ActionView
                                            onClick={() =>
                                                navigate(`/${post.slug}`)
                                            }
                                        ></ActionView>
                                        <ActionEdit
                                            onClick={() =>
                                                navigate(
                                                    `/manage/update-post?id=${post.id}`
                                                )
                                            }
                                        ></ActionEdit>
                                        <ActionDelete
                                            onClick={() =>
                                                handleDeletePost(post.id)
                                            }
                                        ></ActionDelete>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    {userInfo.role !== userRole.ADMIN &&
                        userPosts.length > 0 &&
                        userPosts.map((post) => (
                            <tr key={post.id}>
                                <td title={post.id}>
                                    {post.id.slice(0, 5) + "..."}
                                </td>
                                <td>
                                    <div className="flex items-center gap-x-3">
                                        <img
                                            src={post?.image}
                                            alt=""
                                            className="w-[66px] h-[55px] rounded object-cover"
                                        />
                                        <div className="flex-1 whitespace-pre-wrap">
                                            <h3 className="font-semibold max-w-[300px]">
                                                {post?.title}
                                            </h3>
                                            <time className="text-sm text-gray-500">
                                                {new Date(
                                                    post?.user?.createdAt
                                                        ?.seconds * 1000
                                                ).toLocaleDateString("vi-VI")}
                                            </time>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <span className="text-gray-500">
                                        {post?.category?.name}
                                    </span>
                                </td>
                                <td>
                                    <span className="text-gray-500">
                                        {post?.user?.fullName}
                                    </span>
                                </td>
                                <td>{renderPostStatus(post.status)}</td>
                                <td>
                                    <div className="flex items-center gap-x-3">
                                        <ActionView
                                            onClick={() =>
                                                navigate(`/${post.slug}`)
                                            }
                                        ></ActionView>
                                        <ActionEdit
                                            onClick={() =>
                                                navigate(
                                                    `/manage/update-post?id=${post.id}`
                                                )
                                            }
                                        ></ActionEdit>
                                        <ActionDelete
                                            onClick={() =>
                                                handleDeletePost(post.id)
                                            }
                                        ></ActionDelete>
                                    </div>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </Table>

            {total > postList.length && (
                <div className="mt-10">
                    <Button
                        className="mx-auto"
                        kind="ghost"
                        onClick={handleLoadMorePost}
                    >
                        See more+
                    </Button>
                </div>
            )}
        </div>
    );
};

export default PostManage;

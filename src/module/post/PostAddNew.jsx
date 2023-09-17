import { useForm } from "react-hook-form";
import styled from "styled-components";
import { Dropdown } from "../../components/dropdown";
import { Field } from "../../components/field";
import { Label } from "../../components/label";
import { Input } from "../../components/input";
import { Radio } from "../../components/checkbox";
import { Button } from "../../components/button";
import slugify from "slugify";
import { postStatus } from "../../utils/constants";
import { ImageUpload } from "../../components/image";
import useFirebaseImage from "../../hooks/useFirebaseImage";
import Toggle from "../../components/toggle/Toggle";
import { useEffect, useMemo, useState } from "react";
import {
    addDoc,
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    serverTimestamp,
    where,
} from "firebase/firestore";
import { db } from "../../firebase-app/firebase-config";
import { useAuth } from "../../context/auth-context";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
const PostAddNewStyles = styled.div``;
const PostAddNew = () => {
    const { userInfo } = useAuth();
    const { control, watch, setValue, handleSubmit, getValues, reset } =
        useForm({
            mode: "onChange",
            defaultValues: {
                title: "",
                slug: "",
                status: 2,
                hot: false,
                image: "",
                category: {},
                user: {},
            },
        });
    const {
        image,
        progress,
        handleSelectImage,
        handleDeleteImage,
        handleResetUpload,
    } = useFirebaseImage(setValue, getValues);
    const addPostHandler = async (values) => {
        setLoading(true);
        try {
            const cloneValue = { ...values };
            cloneValue.slug = slugify(values.slug || values.title, {
                replacement: "-",
                remove: /[*+~.()'"!:@]/g,
                lower: true,
                strict: false,
                locale: "en",
                trim: true,
            });
            cloneValue.status = Number(values.status);
            const colRef = collection(db, "posts");
            await addDoc(colRef, {
                ...cloneValue,
                image,
                userId: userInfo.uid,
                createdAt: serverTimestamp(),
                content,
            });
            toast.success("Create new post successfully");
            reset({
                title: "",
                slug: "",
                status: 2,
                category: {},
                user: {},
                hot: false,
                image: "",
            });
            handleResetUpload();
            setSelectCategory({});
            setContent("");
        } catch (error) {
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    const watchHot = watch("hot");
    const watchStatus = watch("status");
    const [categories, setCategories] = useState([]);
    const [selectCategory, setSelectCategory] = useState({});
    const [loading, setLoading] = useState(false);
    const [content, setContent] = useState("");
    useEffect(() => {
        async function fetchUserData() {
            if (!userInfo.email) return;
            const q = query(
                collection(db, "users"),
                where("email", "==", userInfo.email)
            );
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) =>
                setValue("user", {
                    id: doc.id,
                    ...doc.data(),
                })
            );
        }
        fetchUserData();
    }, [setValue, userInfo.email]);
    useEffect(() => {
        async function getData() {
            const colRef = collection(db, "categories");
            const q = query(colRef, where("status", "==", 1));
            const querySnapshot = await getDocs(q);
            let result = [];
            querySnapshot.forEach((doc) => {
                result.push({
                    id: doc.id,
                    ...doc.data(),
                });
            });
            setCategories(result);
        }
        getData();
    }, []);

    const handleClickOption = async (item) => {
        const colRef = doc(db, "categories", item.id);
        const docData = await getDoc(colRef);
        setValue("category", {
            id: docData.id,
            ...docData.data(),
        });
        setSelectCategory(item);
    };
    useEffect(() => {
        document.title = "Monkey blogging - Add new post";
    }, []);
    const modules = useMemo(
        () => ({
            toolbar: [
                ["bold", "italic", "underline", "strike"],
                ["blockquote"],
                [{ header: 1 }, { header: 2 }], // custom button values
                [{ list: "ordered" }, { list: "bullet" }],
                [{ header: [1, 2, 3, 4, 5, 6, false] }],
                ["link", "image"],
            ],
        }),
        []
    );
    return (
        <PostAddNewStyles>
            <h1 className="dashboard-heading">Add new post</h1>
            <form onSubmit={handleSubmit(addPostHandler)}>
                <div className="grid grid-cols-2 gap-x-10 mb-10">
                    <Field>
                        <Label htmlFor="title">Title</Label>
                        <Input
                            control={control}
                            placeholder="Enter your title"
                            name="title"
                            required
                        ></Input>
                    </Field>
                    <Field>
                        <Label htmlFor="slug">Slug</Label>
                        <Input
                            control={control}
                            placeholder="Enter your slug"
                            name="slug"
                        ></Input>
                    </Field>
                </div>
                <div className="grid grid-cols-2 gap-x-10 mb-10">
                    <Field>
                        <Label htmlFor="image">Image</Label>
                        <ImageUpload
                            name="image"
                            onChange={handleSelectImage}
                            progress={progress}
                            image={image}
                            className="h-[250px]"
                            handleDeleteImage={handleDeleteImage}
                            required
                        ></ImageUpload>
                    </Field>
                    <Field>
                        <Label>Category</Label>
                        <Dropdown>
                            <Dropdown.Select></Dropdown.Select>
                            <Dropdown.List>
                                {categories.length > 0 &&
                                    categories.map((item) => (
                                        <Dropdown.Option
                                            key={item.id}
                                            onClick={() =>
                                                handleClickOption(item)
                                            }
                                        >
                                            {item.name}
                                        </Dropdown.Option>
                                    ))}
                            </Dropdown.List>
                        </Dropdown>
                        {selectCategory?.name && (
                            <span className="inline-block p-3 rounded-lg bg-green-50 text-sm font-medium text-green-500">
                                {selectCategory?.name}
                            </span>
                        )}
                    </Field>
                </div>
                <div className="mb-10">
                    <Field>
                        <Label>Content</Label>
                        <div className="w-full entry-content">
                            <ReactQuill
                                theme="snow"
                                value={content}
                                onChange={setContent}
                                modules={modules}
                            />
                        </div>
                    </Field>
                </div>
                <div className="grid grid-cols-2 gap-x-10 mb-10">
                    <Field>
                        <Label>Feature post</Label>
                        <Toggle
                            on={watchHot === true}
                            onClick={() => setValue("hot", !watchHot)}
                        ></Toggle>
                    </Field>
                    <Field>
                        <Label>Status</Label>
                        <div className="flex items-center gap-x-5">
                            <Radio
                                name="status"
                                control={control}
                                checked={
                                    Number(watchStatus) === postStatus.APPROVED
                                }
                                value={postStatus.APPROVED}
                            >
                                Approved
                            </Radio>
                            <Radio
                                name="status"
                                control={control}
                                checked={
                                    Number(watchStatus) === postStatus.PENDING
                                }
                                value={postStatus.PENDING}
                            >
                                Pending
                            </Radio>
                            <Radio
                                name="status"
                                control={control}
                                checked={
                                    Number(watchStatus) === postStatus.REJECTED
                                }
                                value={postStatus.REJECTED}
                            >
                                Reject
                            </Radio>
                        </div>
                    </Field>
                </div>

                <Button
                    type="submit"
                    kind="primary"
                    className="mx-auto w-[250px]"
                    isLoading={loading}
                    disabled={loading}
                >
                    Add new post
                </Button>
            </form>
        </PostAddNewStyles>
    );
};

export default PostAddNew;

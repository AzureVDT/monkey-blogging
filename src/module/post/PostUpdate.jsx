import { useForm } from "react-hook-form";
import { Button } from "../../components/button";
import { Radio } from "../../components/checkbox";
import { Dropdown } from "../../components/dropdown";
import { Field } from "../../components/field";
import { ImageUpload } from "../../components/image";
import { Input } from "../../components/input";
import { Label } from "../../components/label";
import Toggle from "../../components/toggle/Toggle";
import DashboardHeading from "../dashboard/DashboardHeading";
import useFirebaseImage from "../../hooks/useFirebaseImage";
import ReactQuill from "react-quill";
import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    updateDoc,
    where,
} from "firebase/firestore";
import { db } from "../../firebase-app/firebase-config";
import { toast } from "react-toastify";
import { useEffect, useMemo, useState } from "react";
import { postStatus } from "../../utils/constants";
import { useSearchParams } from "react-router-dom";
import "react-quill/dist/quill.snow.css";

const PostUpdate = () => {
    const [params] = useSearchParams();
    const postId = params.get("id");
    const {
        control,
        watch,
        setValue,
        handleSubmit,
        getValues,
        reset,
        formState: { isSubmitting, isValid },
    } = useForm({
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
    useEffect(() => {
        async function fetchData() {
            if (!postId) return;
            const docRef = doc(db, "posts", postId);
            const docSnapshot = await getDoc(docRef);
            if (docSnapshot.data()) {
                reset(docSnapshot.data());
                setSelectCategory(docSnapshot.data()?.category || "");
                setContent(docSnapshot.data()?.content || "");
            }
        }
        fetchData();
    }, [postId, reset]);
    const imageURL = getValues("image");
    const imageName = getValues("image_name");
    const deletePostImage = async () => {
        const colRef = doc(db, "posts", postId);
        await updateDoc(colRef, {
            avatar: "",
        });
    };
    const [categories, setCategories] = useState([]);
    const [content, setContent] = useState("");
    useEffect(() => {
        async function getCategoriesData() {
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
        getCategoriesData();
    }, []);
    const { image, setImage, progress, handleSelectImage, handleDeleteImage } =
        useFirebaseImage(setValue, getValues, imageName, deletePostImage);
    const updatePostHandler = async (values) => {
        if (!isValid) return;
        const docRef = doc(db, "posts", postId);
        await updateDoc(docRef, {
            ...values,
            content,
        });
        toast.success("Update post successfully");
    };
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

    const watchHot = watch("hot");
    const watchStatus = watch("status");
    const [selectCategory, setSelectCategory] = useState({});

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
        document.title = "Monkey blogging - Update post";
        setImage(imageURL);
    }, [imageURL, setImage]);
    if (!postId) return null;
    return (
        <>
            <DashboardHeading
                title="Update post"
                desc="Update post content"
            ></DashboardHeading>
            <form onSubmit={handleSubmit(updatePostHandler)}>
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
                    isLoading={isSubmitting}
                    disabled={isSubmitting}
                >
                    Update post
                </Button>
            </form>
        </>
    );
};

export default PostUpdate;
